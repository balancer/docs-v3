---
order: 4
title: Making And Querying Swaps
---

## Single Swaps

For a token to token swap through a single pool the following [Balancer Router](/developer-reference/contracts/router-api.md) functions should be used: [swapSingleTokenExactIn](/developer-reference/contracts/router-api.md#swapsingletokenexactin) and [swapSingleTokenExactOut](/developer-reference/contracts/router-api.md#swapsingletokenexactout) are the most gas efficient functions to use.

Contract integrators can call the same `swapSingleTokenExactIn` and `swapSingleTokenExactOut` functions on the prepaid [Aggregator Router](/developer-reference/contracts/aggregator-router-api.md), which takes payment up front instead of via Permit2.

Checkout Javascript and Solidity examples [here](/integration-guides/swapping/swapping-custom-paths-with-router.md#single-swap).

## Multi-path Swaps

Swaps paths constructed of steps through multiple pools/tokens the following [Batch Router](/developer-reference/contracts/batch-router-api.md) functions should be used: [swapExactIn](/developer-reference/contracts/batch-router-api.md#swapexactin) and [swapExactOut](/developer-reference/contracts/batch-router-api.md#swapexactout) functions.

As with single swaps, contract integrators can use the prepaid [Aggregator Batch Router](/developer-reference/contracts/aggregator-batch-router-api.md), which exposes the same `swapExactIn` and `swapExactOut` functions with prepaid settlement.

A `SwapPathStep` is defined as:
```
struct SwapPathStep {
    address pool;
    IERC20 tokenOut;
    // If true, the "pool" is an ERC4626 Buffer. Used to wrap/unwrap tokens if pool doesn't have enough liquidity.
    bool isBuffer;
}
```
and paths can include add/remove liquidity steps by using the address of the respective pool. For example, the following `SwapPathExactAmountIn` would execute a swap of USDC to BAL then add liquidity to the 80/20 BAL/WETH pool.

```solidity
// Note - pseudo code
SwapPathExactAmountIn {
    tokenIn: USDC
    // for each step:
    // if tokenIn == pool use removeLiquidity SINGLE_TOKEN_EXACT_IN
    // if tokenOut == pool use addLiquidity UNBALANCED
    steps: [
        { 
            pool: '0xBAL_USDC_POOL',
            tokenOut: '0xBAL',
            isBuffer: false
        },
        {
            pool: '0xB-80BAL-20WETH_POOL',
            tokenOut: '0xB-80BAL-20WETH_POOL',
            isBuffer: false
        }
    ]
    exactAmountIn: 1000000,
    minAmountOut: 100000
}
```

Checkout Javascript and Solidity examples [here](/integration-guides/swapping/swapping-custom-paths-with-router.md#multi-path-swap).

## Simulating Swaps Using Query Functions

[Queries](/concepts/router/queries.md) provide the ability to simulate an operation and find its result without executing a transaction. Balancer Routers provide a query for all state changing liquidity operations including single and multi-path swap functions, e.g. `querySwapSingleTokenExactIn`. 

::: warning Note - for onchain integrations queries should not be used to set limits due to possible manipulation via frontrunning.
:::
