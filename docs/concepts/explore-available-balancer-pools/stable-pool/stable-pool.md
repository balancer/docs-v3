---
order: 0
title: Stable Pool
references:
  - details: Stable Math
    link: /reference/math/stable-math
---

# Stable Pools

## Overview

Stable Pools are designed for assets that are either expected to consistently swap at near parity, or at a known exchange rate. Stable Pools use [Stable Math](./stable-math.md) (based on StableSwap, popularized by Curve) which allows for swaps of significant size before encountering substantial price impact, vastly increasing capital efficiency for like-kind and correlated-kind swaps.

::: info
Balancer v3 pools are limited at the Vault level to 8 tokens. Stable Pools have a safe maximum of 5 tokens, due to the constraints of Stable Math (same as in v2).
Standard Stable Pools support 5 tokens.
:::

### Ideal For

- **Pegged Tokens** - tokens that swap near 1:1, such as two stablecoins of the same currency (eg: DAI, USDC, USDT), or synthetic assets (eg: renBTC, sBTC, WBTC)
- **Correlated Tokens** - tokens that swap near 1:$R$ with some slowly changing exchange rate $R$, like derivatives (eg: wstETH, wETH)

### Stable Swaps Under the Balancer Umbrella

One of the key advantages to having Stable Pools on Balancer specifically is that they are plugged into the same protocol as all other pools. Swapping between stablecoins is frequently used for arbitrage when one token is paired with two different stablecoins in different pools. By leveraging Batch Swaps on Balancer, these swaps can be combined into a single, gas-efficient transaction.


#### Example

With `StablePool[DAI, USDC, USDT]`, we can directly pair the LP token, or BPT, against WETH in a `WeightedPool[WETH, SP-BPT]`. This nesting allows us to consolidate liquidity into some of the most common groupings, which results in deeper liquidity and better prices throughout Balancer. In this example, it also saves you the trouble of making 3 WeightedPools `[WETH, DAI]`, `[WETH, USDC]`, `[WETH, USDT]`.


## Use Cases

### **The Lido wstETH/WETH Liquidity Pool**

[Lido](https://lido.fi/) is a liquid staking solution for ETH 2.0 backed by industry-leading staking providers. Lido lets users stake their ETH - without locking assets or maintaining their own infrastructure. The goal is to solve problems associated with initial ETH 2.0 staking: illiquidity, immovability and accessibility by making staked ETH liquid and allowing for participation with any amount of ETH to improve the security of the Ethereum network.

stETH is a token that represents **Staked Ether**, combining the value of deposited ETH with staking returns. As an ERC20, stETH tokens can be swapped as one would swap WETH, allowing the benefits of ETH 2.0 staking while allowing users to continue using their staked Ether on decentralized finance products.

Balancer Stable Pools are ideal for the wstETH-WETH pair as the stETH asset is highly correlated but not pegged 1:1 to ETH as it accrues staking returns.