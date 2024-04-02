---
order: 1
title: Overview
---

# Pools

A liquidity Pool on Balancer represents available liquidity that can be swapped with. The implemented swap math within the pool governs the swap mechanics, customized to fit specific swap scenarios. Users can enter or exit these pools, and also engage in swap transactions. The pool's behavior can be fine-tuned using Hooks and dynamic swap fees, which the pool creator determine.Hooks and dynamic swap fees are a mechanism for more nuanced control over the pool's behavior.

## Pool Types
Balancer has various liquidity pools available each designed for a particular usecase with the option to deploy custom pools.
- [Weighted Pools](/concepts/pools/known-pool-types/weighted-pool.html): Well suited for general usecases
- [Stable Pools](concepts/pools/known-pool-types/stable-pool.html): Great for correlated assets to allow for significant trades
- [Boosted Pool](concepts/pools/known-pool-types/boosted-pool.html): Allowing LPs to earn enhanced yield while earning swap fees
- [80/20 Pool](concepts/pools/known-pool-types/80-20-pool.html): The perfect fit for achieving liquidity of governance tokens
- [Liquidity Bootstrapping pools](/concepts/pools/known-pool-types/liquidity-bootstrapping-pool.md): Token Launches as a major usecase.
- [Custom Pools]((/concepts/overview/build-a-custom-amm.html)): Used by protocols building on Balancer like Gyroscope, Xave.

## Pool Composability

The above classes of pools already highlights the flexibility of Balancer, but taking this a step further _composition_ of those pools is where Balancer starts to shine. A great example of this is tokens paired with the boosted stable pool. Most tokens will want to pair with either stables or native assets like ETH and historically every token creates an AMM pool which leads to something like `ABC/USDC`, `XYZ/USDC`, etc. That ends up being a lot of duplicated & isolated stable liquidity that also needs further hops to connect to other stablecoins. On Balancer, `ABC` and `XYZ` can both be paired with a boosted stable-pool(DAI,USDC,USDT) which has amazing shared capital efficiency and creates direct routes between `ABC->USDC`, `ABC->USDT`, and `ABC->DAI`.

These types of nested pools and unique combinations are only possible on Balancer due to the vault architecture, and other concepts like the Router to allow for joinswaps, and more.
