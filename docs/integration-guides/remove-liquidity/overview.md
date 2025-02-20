---
order: 0
title: Overview
---

# Remove Liquidity Guide

This guide demonstrates how to remove liquidity from a pool. We will use the preferred function for removing liquidity, `removeLiquidityProportional`. Tokens are removed from the pool in proportional amounts, causing zero price impact and avoiding the swap fee charged when exiting non-proportional. Specifying an exactBptAmountIn ensures that the user will not be left with any dust. See the [Router API](../router/overview.html) for other supported remove methods.

_This guide is for removing liquidity from Balancer v3 with the [b-sdk](https://github.com/balancer/b-sdk). This sdk supports removing liquidity from Balancer v3, Balancer v2 as well as Cow-AMMs._

## Core Concepts

The core concepts of removing liquidity are the same for any programming language or framework:
* When removing liquidity the user sends [Balancer Pool Tokens](../../concepts/core-concepts/balancer-pool-tokens.md) (BPTs), and will receive pool tokens
* Unlike standard ERC20s, the vault has control over the supply of BPT, so there is no need for the sender to make approvals when sending BPTs. For more info see: [Balancer Pool Token](../../concepts/core-concepts/balancer-pool-tokens.md)
* Token amount inputs/outputs are always in the raw token scale, e.g. `1 USDC` should be sent as `1000000` because it has 6 decimals
* Transactions are always sent to the [Router](../../concepts/router/overview.md)

The Router interface for `removeLiquidityProportional` is:
```solidity
 /**
* @notice Removes liquidity with proportional token amounts from a pool, burning an exact pool token amount.
* @param pool Address of the liquidity pool
* @param exactBptAmountIn Exact amount of pool tokens provided
* @param minAmountsOut Minimum amounts of tokens to be received
* @param wethIsEth If true, outgoing WETH will be unwrapped to ETH; otherwise the Vault will send WETH tokens
* @param userData Additional (optional) data required for removing liquidity
* @return amountsOut Actual amounts of tokens received
*/
function removeLiquidityProportional(
    address pool,
    uint256 exactBptAmountIn,
    uint256[] memory minAmountsOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256[] memory amountsOut);
```

* `exactBptAmountIn` defines the exact amount of the pool token that will be sent.
* `minAmountsOut` defines the minimum amount of each token to receive. If the amount is less than this (e.g. because of slippage) the transaction will revert. _Note: these values correspond to the same index value of pool tokens which are sorted alphanumerically_
* If `wethIsEth` is set to `true`, and a pool token is `WETH`, the Router will unwrap to `ETH` and forward to the sender.
* `userData` allows additional parameters to be provided for custom pool types. In most cases it is not required and a value of `0x` can be provided.

The following sections provide specific implementation details for Javascript (with and without the SDK) and Solidity.