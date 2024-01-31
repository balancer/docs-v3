---
title: Rate scaling
order: 3
---

# Rate scaling

With the successful rollout of [The Merge](https://ethereum.org/roadmap/merge) and the adoption of [ERC-4626](https://docs.openzeppelin.com/contracts/4.x/erc4626), the ecosystem has seen a proliferation of yield bearing tokens. Recognizing the pivotal role that LSTs will play in the liquidity landscape moving forward, Balancer seeks to position itself as the definitive yield-bearing hub in DeFi.

To facilitate the adoption of yield bearing liquidity, Balancer abstracts the complexity of managing LSTs by centralizing all rate scaling in the vault, providing all pools with uniform rate scaled balances and input values by default, drastically reducing LVR and ensuring that YB yield is not captured by arbitrage traders.

## Rate definition
Besides [decimal scaling](decimalscaling.md) a tokens rate is taken into account in Balancer under in the following scenarios:
- price computation as part of Stable & boosted pools
- Yield fee computation when tokens with a rate are part of pools

A token's rate is defined as a 18 decimal fixed point number. It represents a factor of value difference relative to it's underlying. For example a rate of 11e17 of rETH means that 1reth has the value of 1.1 eth. 

## Rate instantiation
Whenever a pool is registered a `TokenConfig` that includes the source address of the tokens rate is set. 

## Rate scaling usage
Rate scaling technically is used on every `swap`, `addLiqudity` & `removeLiquidity` operations. If the token has been registered as a `TokenType.WITH_RATE` an external call to the Rate Provider is made via `getRate` if the `TokenType.STANDARD` is selected the rate is set as `1e18`. These rates are used to upscale the balances as part of the Vault's primitives.  

