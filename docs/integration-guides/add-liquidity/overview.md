---
order: 1
title: Overview
---

# Add Liquidity Overview

The guides in this section demonstrate how to add liquidity to standard, boosted, and nested pools. We will use the `addLiquidityUnbalanced` method, since it allows exact amounts of any pool token to be added to a pool, avoiding unnecessary dust in the user's wallet. See the [Router API](/developer-reference/contracts/router-api.html) for other supported add methods.

_These guides are for adding liquidity to Balancer v3 with the latest version of our [sdk](https://github.com/balancer/b-sdk)_

## Lifecycle
The core concepts of the add liquidity lifecycle are the same for any programming language or framework:

1. The sender must `token.approve` the cannonical permit2 contract for each token they wish to add to the pool
2. The sender must `permit2.approve` the correct Balancer router, which depends on if the pool tokens are normal, nested, or boosted
3. The transaction must be sent to the appropriate Balancer [Router](../../concepts/router/overview.md) with token amount inputs/outputs that use raw token scale, e.g. `1 USDC` should be sent as `1000000` because it has 6 decimals
1. In exchange for providing liquidity the sender will receive [Balancer Pool Tokens](../../concepts/core-concepts/balancer-pool-tokens.md) (BPTs) which represents their share of the pool and can be used to remove liquidity at any time




## Interfaces

The Router interface for unbalanced adds to a pool with standard tokens is:
```solidity
/**
 * @notice Adds liquidity to a pool with arbitrary token amounts.
 * @param pool Address of the liquidity pool
 * @param exactAmountsIn Exact amounts of tokens to be added, sorted in token registration order
 * @param minBptAmountOut Minimum amount of pool tokens to be received
 * @param wethIsEth If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH
 * @param userData Additional (optional) data sent with the request to add liquidity
 * @return bptAmountOut Actual amount of pool tokens received
 */
function addLiquidityUnbalanced(
    address pool,
    uint256[] memory exactAmountsIn,
    uint256 minBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256 bptAmountOut);
```
* `exactAmountsIn` defines the exact amounts of each token to add to the pool. _Note: these must be sent sorted in alphanumeric order_
* `minBptAmountOut` defines the minimum amount of BPT to receive. If the amount is less than this (e.g. because of slippage) the transaction will revert
* If `wethIsEth` is set to `true`, the Router will deposit the `exactAmountIn` of `ETH` into the `WETH` contract. So, the transaction must be sent with the appropriate `value` amount
* `userData` allows additional parameters to be provided for custom pool types. In most cases it is not required and a value of `0x` can be provided.


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

The four main helper classes we use from the SDK are:
* `BalancerApi` - to simplify retrieving pool data from the Pools API
* `AddLiquidity` - to build addLiquidity queries and transactions
* `Slippage` - to simplify creating limits with user defined slippage
* `Permit2Helper` - to simplify creating permit2 signatures for token approvals 

