---
order: 2
title: Router Interaction
---

// TODO - Terminology: multi-path vs batchSwap vs something else?

# Router Interaction

This guide demonstrates how to execute single and multi-path Swaps on the Balancer Router. The examples are for the exactIn swap type, see the [Router API](../../router/overview.md) for exactOut details.

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

### Javascript

The following Viem and Ethers snippets demonstrate how to execute a single token swap specifying an exact input token amount. To achieve this, we use two Router functions:

TODO - These need to be added to router once SC interface finalised, waiting for batchSwap to finish
* [`swapSingleTokenExactIn`](../../router/overview.md#swapexactin) - Execute a swap specifying an exact input token amount.
* [`querySwapSingleTokenExactIn`](../../router/overview.md#queryswapexactin) - The [router query](../router/technical.md#router-queries) used to simulate a swap. It returns the exact amount of token out that would be received.

The Router interface for `swapSingleTokenExactIn` is:
```
TODO - Add once updated on SCs
```

// TODO - Explanation of interface params

**Resources**:
* [Router ABI](../../router/abi.md#ABI)
* [Router deployment addresses](../../router/abi.md#Deployments)

// TODO - Need finalised SC Router interfaces
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

// TODO - Finish this once SC interface finalised
```typescript
// Query operation

// Sending transaction

```
:::

### Solidity

The following code snippet shows how to make a single swap, specifying an exact input token amount, from a smart contract.

::: warning Queries cannot be used within the same block to set minAmountOut due to possible manipulation
:::

// TODO - Update this once SC interface is finalised
```solidity

```

## Multi Path Swap

### Javascript

The following Viem and Ethers snippets demonstrate how to execute a multi path swap specifying exact input token amounts. To achieve this, we use two Router functions:

TODO - These need to updated once SC finalised and be added to router page
* [``](../../router/overview.md#swapexactin) - Execute a swap involving multiple paths, specifying exact input token amounts.
* [``](../../router/overview.md#queryswapexactin) - The [router query](../router/technical.md#router-queries) used to simulate a swap. It returns the exact amount of token out for each swap path.

The Router interface for `swapExactIn` is:

```
TODO - Add once updated on SCs
```

// TODO - Explanation of interface params
// Explain paths:
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

**Resources**:
* [Router ABI](../../router/abi.md#ABI)
* [Router deployment addresses](../../router/abi.md#Deployments)

// TODO - Need finalised SC Router interfaces

// TODO - Code samples can be finished once SC batchSwaps are released/finalised
::: code-tabs#shell
@tab Viem
```typescript
// Query operation

// Sending transaction
```

@tab Ethers

```typescript
// Query operation

// Sending transaction
```
:::

### Solidity

The following code snippet shows how to make a multi path swap, specifying exact input token amounts, from a smart contract.

::: warning Queries cannot be used within the same block to set minBptAmountOut due to possible manipulation
:::

```solidity
TODO once SC finalised
```
