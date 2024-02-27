---
title: Yield Fee
order: 10
---
# Yield fee. 

## Introduction
Specific token configurations in a pool incur a yield fee during each interaction. This fee, paid by liquidity providers, varies based on the token's exemption status in the [`TokenConfig`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L73). The `yieldFeePercentage` parameter, governed by the protocol, determines percentage cut and is the same for all pools.

## Recycling of yield fees
Currently the yield fee is set to 50% which is partially passed back to liquidity providers who stake their pool tokens as part of the [core-pools](https://forum.balancer.fi/t/bip-19-incentivize-core-pools-l2-usage/3329) framework

## Calculation
The key determining factor that determines the amount of yield fees to be payed is the change in a pool tokens rate relative to the previous interactions a user had with that particular pool. 

:::info
to check if a token in a liquidity pool is subject to yield fees, you need to listen to the `PoolCreated` event of the pool creation transaction. The percentage of yield fees charged by the vault can be read via `vault.getYieldFeePercentage()`. 
:::

