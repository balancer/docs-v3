---
order: 4
title: Swapping with Custom Paths and the Router
---

# Swapping with Custom Paths with the Router

This guide illustrates the process of executing swaps through the router once swap paths have been established. The examples provided encompass both single and multi-path swap types, focusing on exactIn swaps. For additional information on exactOut swaps, please refer to the [Router API](../../developer-reference/contracts/router-api.md) documentation.

_To use the Balancer Smart Order Router to find efficient swap paths for a pair see [this guide](./swaps-with-sor-sdk.md)._

_This guide is for Swapping on Balancer v3. If you're looking to Swap using Balancer v2, start [here](https://docs.balancer.fi/reference/swaps/batch-swaps.html)._

## Core Concepts

The core concepts of executing Swaps are the same for any programming language or framework:
* The sender must approve the Vault (not the Router) for each swap input token
* Token amount inputs/outputs are always in the raw token scale, e.g. `1 USDC` should be sent as `1000000` because it has 6 decimals
* Transactions are always sent to the [Router](../../developer-reference/contracts/router-api.md)
* There are two different swap kinds:
  * ExactIn: Where the user provides an exact input token amount.
  * ExactOut: Where the user provides an exact output token amount.
* There are two subsets of a swap:
  * Single Swap: A swap, tokenIn > tokenOut, using a single pool. This is the most gas efficient option for a swap of this kind.
  * Multi-path Swaps: Swaps involving multiple paths but all executed in the same transaction. Each path can have its own (or the same) tokenIn/tokenOut.

The following sections provide specific implementation details for Javascript (with and without the SDK) and Solidity.

## Custom Paths With The SDK

The SDK `Swap` object provides functionality to easily fetch updated swap quotes and create swap transactions with user defined slippage protection.

```typescript
import {
  ChainId,
  Slippage,
  SwapKind,
  Swap,
  SwapBuildOutputExactIn,
  ExactInQueryOutput
} from "@balancer/sdk";
import { Address } from "viem";

// User defined
const swapInput = {
  chainId: ChainId.SEPOLIA,
  swapKind: SwapKind.GivenIn,
  paths: [
    {
      pools: ["0x1e5b830439fce7aa6b430ca31a9d4dd775294378" as Address],
      tokens: [
        {
          address: "0xb19382073c7a0addbb56ac6af1808fa49e377b75" as Address,
          decimals: 18,
        }, // tokenIn
        {
          address: "0xf04378a3ff97b3f979a46f91f9b2d5a1d2394773" as Address,
          decimals: 18,
        }, // tokenOut
      ],
      vaultVersion: 3 as const,
      inputAmountRaw: 1000000000000000000n,
      outputAmountRaw: 990000000000000000n,
    },
  ],
};

// Swap object provides useful helpers for re-querying, building call, etc
const swap = new Swap(swapInput);

console.log(
  `Input token: ${swap.inputAmount.token.address}, Amount: ${swap.inputAmount.amount}`
);
console.log(
  `Output token: ${swap.outputAmount.token.address}, Amount: ${swap.outputAmount.amount}`
);

// Get up to date swap result by querying onchain
const updatedOutputAmount = await swap.query(RPC_URL) as ExactInQueryOutput;
console.log(`Updated amount: ${updatedOutputAmount.expectedAmountOut}`);

// Build call data using user defined slippage
const callData = swap.buildCall({
    slippage: Slippage.fromPercentage("0.1"), // 0.1%,
    deadline: 999999999999999999n, // Deadline for the swap, in this case infinite
    queryOutput: updatedOutputAmount,
    wethIsEth: false
  }) as SwapBuildOutputExactIn;

console.log(
  `Min Amount Out: ${callData.minAmountOut.amount}\n\nTx Data:\nTo: ${callData.to}\nCallData: ${callData.callData}\nValue: ${callData.value}`
);
```

### Install the Balancer SDK

The [Balancer SDK](https://github.com/balancer/b-sdk) is a Typescript/Javascript library for interfacing with the Balancer protocol and can be installed with:

::: code-tabs#shell
@tab pnpm

```bash
pnpm add @balancer/sdk
```

@tab yarn

```bash
yarn add @balancer/sdk
```

@tab npm
```bash
npm install @balancer/sdk
```
:::

The two main helper classes we use from the SDK are:
* `Swap` - to build swap queries and transactions
* `Slippage` - to simplify creating limits with user defined slippage 

### Providing Custom Paths To The Balancer SDK

`swapInput` must be of the following type:

```typescript
type SwapInput = {
    chainId: number;
    paths: Path[];
    swapKind: SwapKind;
};
```
* `chainId` - the chain the swap is valid for
* `swapKind` - either a `GivenIn` or `GivenOut`
* `paths` - An array of paths that define a swap from a tokenIn>tokenOut where a path looks like:
```typescript
type Path = {
    pools: Address[] | Hex[];
    tokens: TokenApi[];
    outputAmountRaw: bigint;
    inputAmountRaw: bigint;
    vaultVersion: 2 | 3;
};
```
* `pools` - an array of pools that will be swapped against, ordered sequentially for the path.
* `tokens` - an array of tokens that will be swapped to/from, ordered sequentially for the path. `tokens[0]` is the initial `tokenIn` and `tokens[length-1]` is the final `tokenOut` for the path.
* `inputAmountRaw`/`outputAmountRaw` - the final input/output amounts for the path.
* `vaultVersion` - the version of the Balancer protocol. Note each path must use the same vaultVersion.

Using the input given above as an illustrative example:
```typescript
const swapInput = {
  chainId: ChainId.SEPOLIA,
  swapKind: SwapKind.GivenIn,
  paths: [
    {
      pools: ["0x1e5b830439fce7aa6b430ca31a9d4dd775294378" as Address],
      tokens: [
        {
          address: "0xb19382073c7a0addbb56ac6af1808fa49e377b75" as Address,
          decimals: 18,
        }, // tokenIn
        {
          address: "0xf04378a3ff97b3f979a46f91f9b2d5a1d2394773" as Address,
          decimals: 18,
        }, // tokenOut
      ],
      vaultVersion: 3 as const,
      inputAmountRaw: 1000000000000000000n,
      outputAmountRaw: 990000000000000000n,
    },
  ],
};
```
We can infer:
* The swap is of the GivenIn type and is valid for Balancer v3 on Sepolia
* There is one path swapping:
  * token: `0xb19382073c7a0addbb56ac6af1808fa49e377b75` to `0xf04378a3ff97b3f979a46f91f9b2d5a1d2394773`
  * using pool: `0x1e5b830439fce7aa6b430ca31a9d4dd775294378`
  * with an input amount of `1000000000000000000` (or 1 scaled to human format)
  * with an output amount of `990000000000000000` (or 9.9 scaled to human format)

### Queries and safely setting slippage limits

[Router queries](../../concepts/router/queries.md) allow for simulation of operations without execution. In this example, when the `query` function is called:
```
const updatedOutputAmount = await swap.query(RPC_URL) as ExactInQueryOutput;
```
An onchain call is used to find an updated result for the swap paths, in this case the amount of token out that would be received,  `updatedOutputAmount`, given the original `inputAmountRaw` as the input.

In the next step `buildCall` uses the `updatedOutputAmount` and the user defined `slippage` to calculate the `minAmountOut`:
```typescript
const callData = swap.buildCall({
    slippage: Slippage.fromPercentage("1"), // 1%,
    deadline: 999999999999999999n, // Deadline for the swap, in this case infinite
    queryOutput: updatedOutputAmount,
    wethIsEth: false
  }) as SwapBuildOutputExactIn;
```

In the full example above, we defined our slippage as `Slippage.fromPercentage('1')`, meaning that we if we do not receive at least 99% of our expected `updatedOutputAmount`, the transaction should revert.
Internally, the SDK subtracts 1% from the query output, as shown in `Slippage.applyTo` below:

```typescript
/**
 * Applies slippage to an amount in a given direction
 *
 * @param amount amount to apply slippage to
 * @param direction +1 adds the slippage to the amount, and -1 will remove the slippage from the amount
 * @returns
 */
public applyTo(amount: bigint, direction: 1 | -1 = 1): bigint {
    return MathSol.mulDownFixed(
        amount,
        BigInt(direction) * this.amount + WAD,
    );
}
```

### Constructing the call

The output of the `buildCall` function provides all that is needed to submit the Swap transaction:
* `to` - the address of the Router
* `callData` - the encoded call data
* `value` - the native asset value to be sent

It also returns the `minAmountOut` amount which can be useful to display/validation purposes before the transaction is sent.

## Custom Paths Without The SDK

The following section illustrates swap operations on the Router through examples implemented in Javascript and Solidity.

### Single Swap

The following code examples demonstrate how to execute a single token swap specifying an exact input token amount. To achieve this, we use two Router functions:

* [`swapSingleTokenExactIn`](../../developer-reference/contracts/router-api.md#swapsingletokenexactin) - Execute a swap specifying an exact input token amount.
* [`querySwapSingleTokenExactIn`](../../developer-reference/contracts/router-api.md#queryswapsingletokenexactin) - The [router query](../../concepts/router/queries.md) used to simulate a swap. It returns the exact amount of token out that would be received.

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

#### Javascript Without SDK

**Resources**:
* [Router ABI](../../developer-reference/contracts/abi/router.md)
* [Router deployment addresses](../../reference/contracts)

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

#### Solidity

::: warning Queries should not be used onchain to set minAmountOut due to possible manipulation via frontrunning.
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
    ) external {
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

### Multi Path Swap

:::warning
Multi-path Swaps use the Balancer [BatchRouter-TODO we need a link to more info here?]()
:::

The following code examples demonstrate how to execute a multi path swap specifying exact input token amounts. To achieve this, we use two Router functions:

* [`swapExactIn`](../../developer-reference/contracts/router-api.md#swapexactin) - Execute a swap involving multiple paths, specifying exact input token amounts.
* [`querySwapExactIn`](../../developer-reference/contracts/router-api.md#queryswapexactin) - The [router query](../../concepts/router/queries.md) used to simulate a swap. It returns the exact amount of token out for each swap path.

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
    // If true, the "pool" is an ERC4626 Buffer. Used to wrap/unwrap tokens if pool doesn't have enough liquidity.
    bool isBuffer;
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
  * tokenOut == pool: router will add liquidity using `tokenIn`
  * isBuffer: if true, this means the "pool" address is actually an ERC4626 wrapped token, and we want to use the associated buffer


#### Javascript

**Resources**:
* [Batch Router ABI](../../developer-reference/contracts/abi/batch-router.md)
* [Batch Router deployment addresses](../../reference/contracts)

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
        isBuffer: false,
    },
    {
        pool: "0x6ad4e679c5bd9a14c50a81bd5f928a2a5ba7ec80" as Address,
        tokenOut: "0xb19382073c7a0addbb56ac6af1808fa49e377b75" as Address,
        isBuffer: false,
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
        isBuffer: false,
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
        isBuffer: false,
      },
      {
        pool: "0x6ad4e679c5bd9a14c50a81bd5f928a2a5ba7ec80",
        tokenOut: "0xb19382073c7a0addbb56ac6af1808fa49e377b75",
        isBuffer: false,
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
        isBuffer: false,
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

#### Solidity

::: warning Queries should not be used onchain to set minAmountOut due to possible manipulation via frontrunning.
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
    ) external {
        router.swapExactIn(
          paths,
          deadline,
          wethIsEth,
          userData
        );
    }
}
```
