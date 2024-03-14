---
order: 2
title: Custom Paths with the Router
---

# Custom Paths with the Router

This guide illustrates the process of executing swaps through the router once swap paths have been established. The examples provided encompass both single and multi-path swap types, focusing on exactIn swaps. For additional information on exactOut swaps, please refer to the [Router API](../../router/overview.md) documentation.

_This guide is for Swapping on Balancer V3. If you're looking to Swap using Balancer V2, start [here](https://docs.balancer.fi/reference/swaps/batch-swaps.html)._

## Core Concepts

The core concepts of executing Swaps are the same for any programming language or framework:
* The sender must approve the Vault (not the Router) for each swap input token
* Token amount inputs/outputs are always in the raw token scale, e.g. `1 USDC` should be sent as `1000000` because it has 6 decimals
* Transactions are always sent to the [Router](../router/overview.md)
* There are two different swap kinds:
  * ExactIn: Where the user provides an exact input token amount.
  * ExactOut: Where the user provides an exact output token amount.
* There are two subsets of a swap:
  * Single Swap: A swap, tokenIn > tokenOut, using a single pool. This is the most gas efficient option for a swap of this kind.
  * Multi-path Swaps: Swaps involving multiple paths but all executed in the same transaction. Each path can have its own (or the same) tokenIn/tokenOut.

The following sections provide specific implementation details for single and batch swaps for Javascript and Solidity. 

## Single Swap

The following code examples demonstrate how to execute a single token swap specifying an exact input token amount. To achieve this, we use two Router functions:

* [`swapSingleTokenExactIn`](../../router/overview.md#swapsingletokenexactin) - Execute a swap specifying an exact input token amount.
* [`querySwapSingleTokenExactIn`](../../router/overview.md#queryswapsingletokenexactin) - The [router query](../router/technical.md#router-queries) used to simulate a swap. It returns the exact amount of token out that would be received.

The Router interface for `swapSingleTokenExactIn` is:
```solidity
/**
* @notice Executes a swap operation specifying an exact input token amount.
* @param pool Address of the liquidity pool
* @param tokenIn Token to be swapped from
* @param tokenOut Token to be swapped to
* @param exactAmountIn Exact amounts of input tokens to send
* @param minAmountOut Minimum amount of tokens to be received
* @param deadline Deadline for the swap
* @param userData Additional (optional) data required for the swap
* @param wethIsEth If true, incoming ETH will be wrapped to WETH; otherwise the Vault will pull WETH tokens
* @return amountOut Calculated amount of output tokens to be received in exchange for the given input tokens
*/
function swapSingleTokenExactIn(
    address pool,
    IERC20 tokenIn,
    IERC20 tokenOut,
    uint256 exactAmountIn,
    uint256 minAmountOut,
    uint256 deadline,
    bool wethIsEth,
    bytes calldata userData
) external payable returns (uint256 amountOut);
```

* `exactAmountIn` defines the exact amount of tokenIn to send.
* `minAmountOut` defines the minimum amount of tokenOut to receive. If the amount is less than this (e.g. because of slippage) the transaction will revert
* If `wethIsEth` is set to `true`, the Router will deposit the `exactAmountIn` of `ETH` into the `WETH` contract. So, the transaction must be sent with the appropriate `value` amount
* `deadline` the UNIX timestamp at which the swap must be completed by - if the transaction is confirmed after this time then the transaction will fail.
* `userData` allows additional parameters to be provided for custom pool types. In most cases it is not required and a value of `0x` can be provided.

### Javascript

**Resources**:
* [Router ABI](../../router/abi-deployments.md#abi)
* [Router deployment addresses](../../router/abi-deployments.md#deployments)

::: code-tabs#shell
@tab Viem
```typescript
import { createPublicClient, createWalletClient, http } from "viem";
import { sepolia } from "viem/chains";

// Query operation
const client = createPublicClient({
    transport: http(RPC_URL),
    chain: sepolia,
});

const { result: amountOut } = await client.simulateContract({
    address: routerAddress,
    abi: routerAbi,
    functionName: "querySwapSingleTokenExactIn",
    args: [
        "0x1e5b830439fce7aa6b430ca31a9d4dd775294378", // pool address
        "0xb19382073c7a0addbb56ac6af1808fa49e377b75", // tokenIn
        "0xf04378a3ff97b3f979a46f91f9b2d5a1d2394773", // tokenOut
        1000000000000000000n, // exactAmountIn
        "0x", // userData
    ],
});

// Sending transaction
const walletClient = createWalletClient({
    chain: sepolia,
    transport: http(RPC_URL),
});

const hash = await walletClient.writeContract({
    address: routerAddress,
    abi: routerAbi,
    functionName: "swapSingleTokenExactIn",
    args: [
        "0x1e5b830439fce7aa6b430ca31a9d4dd775294378", // pool address
        "0xb19382073c7a0addbb56ac6af1808fa49e377b75", // tokenIn
        "0xf04378a3ff97b3f979a46f91f9b2d5a1d2394773", // tokenOut
        1000000000000000000n, // exactAmountIn
        900000000000000000n, // minAmountOut
        999999999999999999n, // Deadline, in this case infinite
        false, // wethIsEth for Eth wrapping
        "0x", // userData
    ],
    account: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
});
```

@tab Ethers

```typescript
// Query operation
const provider = new JsonRpcProvider(RPC_URL);

const router = new Contract(routerAddress, routerAbi, provider);

const amountsOut = await router.querySwapSingleTokenExactIn.staticCall(
    "0x1e5b830439fce7aa6b430ca31a9d4dd775294378", // pool address
    100000000000000000n, // token amounts in raw form
    "0x" // userData, set to 0x in most scenarios
);

// Sending transaction
const tx = await router.swapSingleTokenExactIn(
    "0x1e5b830439fce7aa6b430ca31a9d4dd775294378", // pool address
    "0xb19382073c7a0addbb56ac6af1808fa49e377b75", // tokenIn
    "0xf04378a3ff97b3f979a46f91f9b2d5a1d2394773", // tokenOut
    1000000000000000000n, // exactAmountIn
    900000000000000000n, // minAmountOut
    999999999999999999n, // Deadline, in this case infinite
    false, // wethIsEth for Eth wrapping
    "0x" // userData
);
```
:::

### Solidity

::: warning Queries cannot be used within the same block to set minAmountOut due to possible manipulation
:::

```solidity
pragma solidity ^0.8.4;

// TODO - Assume there will be interface type package? Needs updated when released.
import "@balancer-labs/...../IRouter.sol";

contract SingleSwap {
    IRouter public router;

    constructor(IRouter _router) {
      router = _router;
    }

    function singleSwap(
        address pool,
        IERC20 tokenIn,
        IERC20 tokenOut,
        uint256 exactAmountIn,
        uint256 minAmountOut,
        uint256 deadline,
        bool wethIsEth,
        bytes calldata userData
    ) external override {
        router.swapSingleTokenExactIn(
          pool,
          tokenIn,
          tokenOut,
          exactAmountIn,
          minAmountOut,
          deadline,
          wethIsEth,
          userData
        );
    }
}
```

## Multi Path Swap

:::warning
Multi-path Swaps use the Balancer [BatchRouter-TODO we need a link to more info here?]()
:::

The following code examples demonstrate how to execute a multi path swap specifying exact input token amounts. To achieve this, we use two Router functions:

* [`swapExactIn`](../../router/overview.md#swapexactin) - Execute a swap involving multiple paths, specifying exact input token amounts.
* [`querySwapExactIn`](../../router/overview.md#queryswapexactin) - The [router query](../router/technical.md#router-queries) used to simulate a swap. It returns the exact amount of token out for each swap path.

The Router interface for `swapExactIn` is:

```solidity
/**
* @notice Executes a swap operation involving multiple paths (steps), specifying exact input token amounts.
* @param paths Swap paths from token in to token out, specifying exact amounts in.
* @param deadline Deadline for the swap
* @param wethIsEth If true, incoming ETH will be wrapped to WETH; otherwise the Vault will pull WETH tokens
* @param userData Additional (optional) data required for the swap
* @return pathAmountsOut Calculated amounts of output tokens corresponding to the last step of each given path
* @return tokensOut Calculated output token addresses
* @return amountsOut Calculated amounts of output tokens, ordered by output token address
*/
function swapExactIn(
    SwapPathExactAmountIn[] memory paths,
    uint256 deadline,
    bool wethIsEth,
    bytes calldata userData
) external payable returns (uint256[] memory pathAmountsOut, address[] memory tokensOut, uint256[] memory amountsOut);
```
* `deadline` the UNIX timestamp at which the swap must be completed by - if the transaction is confirmed after this time then the transaction will fail.
* If `wethIsEth` is set to `true`, the Router will deposit the `exactAmountIn` of `ETH` into the `WETH` contract. So, the transaction must be sent with the appropriate `value` amount
* `userData` allows additional parameters to be provided for custom pool types. In most cases it is not required and a value of `0x` can be provided.
* `paths` an array of swap paths, in this case `SwapPathExactAmountIn`, that have a number of steps, `SwapPathStep`, to swap a given tokenIn to tokenOut:
```solidity
struct SwapPathStep {
    address pool;
    IERC20 tokenOut;
}

struct SwapPathExactAmountIn {
    IERC20 tokenIn;
    // for each step:
    // if tokenIn == pool use removeLiquidity SINGLE_TOKEN_EXACT_IN
    // if tokenOut == pool use addLiquidity UNBALANCED
    SwapPathStep[] steps;
    uint256 exactAmountIn;
    uint256 minAmountOut;
}
```
* each `path` defines a `minAmountOut`. If the amount of `tokenOut` is less than this (e.g. because of slippage) the transaction will revert 
* pool add/remove operations can be included in the path by using a pool address as tokenIn/Out
  * tokenIn == pool: router will remove liquidity from pool to a single token, `tokenOut`
  * tokenOut == pool: router will add liqudity using `tokenIn`


### Javascript

**Resources**:
* [Batch Router ABI](../../router/abi-deployments-batchRouter.md#abi)
* [Batch Router deployment addresses](../../router/abi-deployments-batchRouter.md#deployments)

::: code-tabs#shell
@tab Viem
```typescript
// query operation
const client = createPublicClient({
    transport: http(RPC_URL),
    chain: sepolia,
});

/*
Two paths to swap 0xf043 > 0xb193:
* 0xf043[0xb816]0x7b79[0x6ad4]0xb193
* 0xf043[0x1e5b]0xb193
*/
const paths = [
{
    tokenIn: "0xf04378a3ff97b3f979a46f91f9b2d5a1d2394773" as Address,
    exactAmountIn: 1000000000000000000n,
    minAmountOut: 0n,
    steps: [
    {
        pool: "0xb816c48b18925881ce8b64717725c7c9842429e4" as Address,
        tokenOut: "0x7b79995e5f793a07bc00c21412e50ecae098e7f9" as Address,
    },
    {
        pool: "0x6ad4e679c5bd9a14c50a81bd5f928a2a5ba7ec80" as Address,
        tokenOut: "0xb19382073c7a0addbb56ac6af1808fa49e377b75" as Address,
    },
    ],
},
{
    tokenIn: "0xf04378a3ff97b3f979a46f91f9b2d5a1d2394773" as Address,
    exactAmountIn: 1000000000000000000n,
    minAmountOut: 0n,
    steps: [
    {
        pool: "0x1e5b830439fce7aa6b430ca31a9d4dd775294378" as Address,
        tokenOut: "0xb19382073c7a0addbb56ac6af1808fa49e377b75" as Address,
    },
    ],
},
];

const { result: tokensOut, result: amountsOut, result: pathAmountsOut } = await client.simulateContract({
    address: batchRouterAddress,
    abi: batchRouterAbi,
    functionName: "querySwapExactIn",
    args: [
        paths,
        "0x", // userData
    ],
});

// Sending transaction
const hash = await walletClient.writeContract({
    address: batchRouterAddress,
    abi: batchRouterAbi,
    functionName: "swapExactIn",
    args: [
        paths,
        999999999999999999n, // Deadline, in this case infinite
        false, // wethIsEth for Eth wrapping
        "0x", // userData
    ],
    account: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
});
```

@tab Ethers

```typescript
// Query operation
/*
  Two paths to swap 0xf043 > 0xb193:
  * 0xf043[0xb816]0x7b79[0x6ad4]0xb193
  * 0xf043[0x1e5b]0xb193
  */
const paths = [
  {
    tokenIn: "0xf04378a3ff97b3f979a46f91f9b2d5a1d2394773",
    exactAmountIn: 1000000000000000000n,
    minAmountOut: 0n,
    steps: [
      {
        pool: "0xb816c48b18925881ce8b64717725c7c9842429e4",
        tokenOut: "0x7b79995e5f793a07bc00c21412e50ecae098e7f9",
      },
      {
        pool: "0x6ad4e679c5bd9a14c50a81bd5f928a2a5ba7ec80",
        tokenOut: "0xb19382073c7a0addbb56ac6af1808fa49e377b75",
      },
    ],
  },
  {
    tokenIn: "0xf04378a3ff97b3f979a46f91f9b2d5a1d2394773",
    exactAmountIn: 1000000000000000000n,
    minAmountOut: 0n,
    steps: [
      {
        pool: "0x1e5b830439fce7aa6b430ca31a9d4dd775294378",
        tokenOut: "0xb19382073c7a0addbb56ac6af1808fa49e377b75",
      },
    ],
  },
];

const provider = new JsonRpcProvider(RPC_URL);

const router = new Contract(batchRouterAddress, routerAbi, provider);

const result = await router.querySwapExactIn.staticCall(paths, "0x");
console.log(result.tokensOut);
console.log(result.amountsOut);
console.log(result.pathAmountsOut);

// Sending transaction
const tx = await router.swapExactIn(
    paths,
    999999999999999999n, // Deadline, in this case infinite
    false, // wethIsEth for Eth wrapping
    "0x" // userData
);
```
:::

### Solidity

::: warning Queries cannot be used within the same block to set minAmountOut due to possible manipulation
:::

```solidity
pragma solidity ^0.8.4;

// TODO - Assume there will be interface type package? Needs updated when released.
import "@balancer-labs/...../IRouter.sol";

contract MultiPathSwap {
    IRouter public router;

    constructor(IRouter _router) {
      router = _router;
    }

    function multiPathSwap(
        SwapPathExactAmountIn[] memory paths,
        uint256 deadline,
        bool wethIsEth,
        bytes calldata userData
    ) external override {
        router.swapExactIn(
          paths,
          deadline,
          wethIsEth,
          userData
        );
    }
}
```
