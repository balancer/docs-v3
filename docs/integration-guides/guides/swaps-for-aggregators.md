---
order: 8
title: Integrating Balancer Liquidity For Swap Aggregators
---

# Integrating Balancer Liquidity For Swap Aggregators

This page serves as a central hub for aggregators seeking vital information and resources to seamlessly integrate with Balancer V3 liquidity. Should you require additional assistance or find any gaps in the provided information, our team is readily available to support you.

## Making Swaps

The core concepts of executing Swaps are the same for any programming language or framework:

* The sender must approve the Vault (not the Router) for each swap input token
* Token amount inputs/outputs are always in the raw token scale, e.g. 1 USDC should be sent as 1000000 because it has 6 decimals
* Transactions are always sent to the Router
* There are two different swap kinds:
  * ExactIn: Where the user provides an exact input token amount.
  * ExactOut: Where the user provides an exact output token amount.
* There are two subsets of a swap:
  * Single Swap: A swap, tokenIn > tokenOut, using a single pool. This is the most gas efficient option for a swap of this kind.
  * Multi-path Swaps: Swaps involving multiple paths but all executed in the same transaction. Each path can have its own (or the same) tokenIn/tokenOut.
* Balancer V2 used the concept of poolIds, this is no longer used in V3 which always uses pool address 

### Balancer Routers

In the Balancer V3 architecture, [Routers](../../concepts/router/overview.md) serve as the pivotal interface for users, facilitating efficient interaction with the underlying Vault primitives. Rather than directly engaging with the Vault, users are encouraged to utilize Routers as their primary entry point.

::: warning Note - the sender must approve the Vault (not the Router) for each swap input token
:::

### Swap Fees

:::info Work in progress
Dynamic Swap Fees and Hooks are still WIP and not finalised
:::

[Swap fees](../../concepts/vault/swap-fee.md) come in two different forms for V3 pools:

* [Static Swap Fee](../../concepts/vault/swap-fee.md#setting-a-static-swap-fee): 
  * Initially set as part of the pool registration. 
  * Authorized addresses can then change the value by invoking the vault.setStaticSwapFeePercentage(address pool, uint256 swapFeePercentage) function.
  * If the staticSwapFeePercentage is changed, it will emit an event: `SwapFeePercentageChanged(pool, swapFeePercentage);`
  * `setStaticSwapFeePercentage` can also be called as part of a regular [hook](../../concepts/core-concepts/hooks.md)
* [Dynamic Swap Fee](../../concepts/vault/swap-fee.md#dynamic-swap-fee):
  * At registration pools can be set up to use dynamic swap fees.
  * The Vault uses the `_getSwapFeePercentage(PoolConfig memory config)` to fetch the swap fee from the pool. This function can implement arbitrary logic.
  * Even when a pool is set to use dynamic swap fees, it still maintains a static swap fee. However, this static fee is not utilized.

The pseudo logic to determine how swap fee is calculated looks like:
```
swapFeePercentage =
     Pool has DynamicSwapFee => call DynamicSwapFeeHook in the pool
     else => load static Swap fee percentage from Vault
```

### Simulating Swaps Using Query Functions

[Queries](../../concepts/router/queries.md) provide the ability to simulate an operation and find its result without executing a transaction. Balancer Routers provide a query for all state changing liquidity operations including single and multi-path swap functions, e.g. `querySwapSingleTokenExactIn`. The following sections link to examples showing how queries can be used.

::: warning Note - for onchain integrations queries cannot be used to set limits within the same block due to possible manipulation
:::

### Single Swaps

For token to token swap through a single pool [swapSingleTokenExactIn](../../developer-reference/contracts/router-api.md#swapsingletokenexactin) and [swapSingleTokenExactOut](../../developer-reference/contracts/router-api.md#swapsingletokenexactout) are the most gas efficient functions to use.

Checkout Javascript and Solidity examples [here](./swapping-custom-paths-with-router.md#single-swap).

### Multi-path Swaps

Swaps paths constructed of steps through multiple pools/tokens can be made using [swapExactIn](../../developer-reference/contracts/batch-router-api.md#swapexactin) and [swapExactOut](../../developer-reference/contracts/batch-router-api.md#swapexactout) functions.

A `SwapPathStep` is defined as:
```
struct SwapPathStep {
    address pool;
    IERC20 tokenOut;
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
            tokenOut: '0xBAL'
        },
        {
            pool: '0xB-80BAL-20WETH_POOL',
            tokenOut: '0xB-80BAL-20WETH_POOL'
        }
    ]
    exactAmountIn: 1000000,
    minAmountOut: 100000
}
```

Checkout Javascript and Solidity examples [here](./swapping-custom-paths-with-router.md#multi-path-swap).

## Fetching Pool Data


### Balancer API

:::info Work in progress
The API is currently a WIP and some info in this section is still a WIP
:::

The [Balancer API](../../data-and-analytics/data-and-analytics/balancer-api.md) can be used to retrieve a list of V3 pools and immutable data for calculating swaps. The API is running as a graphql server and is deployed at https://api-v3.balancer.fi.

The following query can be used to fetch V3 pools with relevant static data used for swap calculations:

```
query MyQuery {
  poolGetPools(where: {vaultVersionIn: 3}) {
    id
    type
    dynamicData {
      swapEnabled
    }
    displayTokens {
      address
      weight
    }
  }
}
```

### Onchain Data

The following view functions are available on the [Vault](../../developer-reference/contracts/vault-api.md) contract and can be used to find onchain pool state.

Get pool tokens, balances and [scaling factors](../../concepts/vault/token-scaling.md):

```solidity
/**
* @notice Gets the raw data for a pool: tokens, raw balances, scaling factors.
* @return tokenConfig Pool's token configuration
* @return balancesRaw Corresponding raw balances of the tokens
* @return scalingFactors Corresponding scalingFactors of the tokens
*/
function getPoolTokenInfo(
    address pool
)
    external
    view
    returns (TokenConfig[] memory tokenConfig, uint256[] memory balancesRaw, uint256[] memory scalingFactors);
```

where `TokenConfig`:
```solidity
/**
 * @dev Encapsulate the data required for the Vault to support a token of the given type.
 * For STANDARD tokens, the rate provider address must be 0, and paysYieldFees must be false.
 * All WITH_RATE tokens need a rate provider, and may or may not be yield-bearing.
 *
 * @param token The token address
 * @param tokenType The token type (see the enum for supported types)
 * @param rateProvider The rate provider for a token (see further documentation above)
 * @param paysYieldFees Flag indicating whether yield fees should be charged on this token
 */
struct TokenConfig {
    IERC20 token;
    TokenType tokenType;
    IRateProvider rateProvider;
    bool paysYieldFees;
}
```

Check if a pool is paused:

```solidity
/**
* @notice Indicates whether a pool is paused.
* @param pool The pool to be checked
* @return True if the pool is paused
*/
function isPoolPaused(address pool) external view returns (bool);
```

Find a pools [static swap fee](../../concepts/vault/swap-fee.md#setting-a-static-swap-fee):

```solidity
/**
* @notice Fetches the static swap fee percentage for a given pool.
* @param pool The address of the pool whose static swap fee percentage is being queried
* @return The current static swap fee percentage for the specified pool
*/
function getStaticSwapFeePercentage(address pool) external view returns (uint256);
```

Find a pools [dynamic swap fee](../../concepts/vault/swap-fee.md#dynamic-swap-fee):

```solidity
/**
* @notice Query the current dynamic swap fee of a pool, given a set of swap parameters.
* @param pool The pool
* @param swapParams The swap parameters used to compute the fee
* @return success True if the pool has a dynamic swap fee and it can be successfully computed
* @return dynamicSwapFee The dynamic swap fee percentage
*/
function computeDynamicSwapFee(
    address pool,
    IBasePool.PoolSwapParams memory swapParams
) external view returns (bool, uint256);
```

## Pool Maths Reference

Explore our [GitHub repository]() containing reference mathematical implementations, in Javascript and Python, for supported Balancer pool types. Designed to assist developers and integrators in understanding the underlying swap calculations, these implementations can be imported as a packages into your project or serve as a reference for your own implementation.

:::info Work in progress
The reference repo is still a WIP. For now please see the [SOR repo](https://github.com/balancer/balancer-sor/blob/master/src/pools/weightedPool/weightedMath.ts) for implementation examples.
:::

## Boosted Pools

:::info Work in progress
This section will contain more details once code is finalised
:::

## Hooks 

:::info Work in progress
This section will contain more details once code is finalised
:::


## Useful Resources

* [Deployment Addresses](http://localhost:8080/developer-reference/contracts/deployment-addresses/mainnet.html)
* [Router ABI](../../developer-reference/contracts/abi/router.md)
* [BatchRouter ABI](../../developer-reference/contracts/abi/batch-router.md)
* [Router API](../../developer-reference/contracts/router-api.md)
* [BatchRouter API](../../developer-reference/contracts/batch-router-api.md)
* [Pool Maths Reference](https://github.com/balancer/balancer-sor/blob/master/src/pools/weightedPool/weightedMath.ts)
* [Vault API](../../developer-reference/contracts/vault-api.md)
* [Balancer API docs](../../data-and-analytics/data-and-analytics/balancer-api.md)