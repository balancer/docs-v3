---
order: 0
title:  Overivew
---

# Add Liquidity Guide

This guide demonstrates how to add liquidity to a pool. We will use the `addLiquidityUnbalanced` method, since it allows exact amounts of any pool token to be added to a pool, avoiding unnecessary dust in the user's wallet. See the [Router API](/developer-reference/contracts/router-api.html) for other supported add methods.

_This guide is for adding liquidity to Balancer v3 with the [b-sdk](https://github.com/balancer/b-sdk). This sdk supports adding liquidity to Balancer v3, Balancer v2 as well as Cow-AMMs._

## Core Concepts

The core concepts of adding liquidity are the same for any programming language or framework:
* The sender must approve the Vault (not the Router) for each token they wish to add to the pool
* Token amount inputs/outputs are always in the raw token scale, e.g. `1 USDC` should be sent as `1000000` because it has 6 decimals
* Transactions are always sent to the [Router](../../concepts/router/overview.md)
* In exchange for providing liquidity the sender will receive [Balancer Pool Tokens](../../concepts/core-concepts/balancer-pool-tokens.md) (BPTs) which represents their share of the pool and can be used to remove liquidity at any time



## Interfaces

The Router interface for `addLiquidityUnbalanced` is:
```solidity
/**
  * @notice Adds with arbitrary token amounts in to a pool.
  * @param pool Address of the liquidity pool
  * @param exactAmountsIn Exact amounts of tokens to be added, sorted in token registration order
  * @param minBptAmountOut Minimum amount of pool tokens to be received
  * @param wethIsEth If true, incoming ETH will be wrapped to WETH; otherwise the Vault will pull WETH tokens
  * @param userData Additional (optional) data required for adding liquidity
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
