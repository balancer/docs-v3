---
order: 2
title: StableSurge Pool
references:
  - details: Stable Surge Hook
    link: /reference/math/stablesurge-math
  - details: Boosted Pools
    link: /reference/math/stablesurge-math
---

# StableSurge Pools

## Overview

StableSurge Pools are a type of Stable Pool designed for assets that usually trade at nearly the same value or have a predictable exchange rate. What makes StableSurge Pools different is that they use a special feature—called a hook—to automatically adjust the swap fee based on how balanced the pool is during a trade.

Here’s how it works:

Normally, swaps pay a base fee known as the "static swap fee," such as 1%.

But if the pool becomes unbalanced—meaning one asset makes up more than a configurable "threshold" percentage of the pool value—the fee starts increasing, or "surging."

This increase happens gradually (linearly) up to a maximum fee (like 0.50%) as the imbalance grows.

For example, if the pool gets to 55% one token and 45% the other, the fee starts increasing. The more unbalanced it becomes, the higher the fee—until it hits the max.

One important note: if a trade helps rebalance the pool (brings the asset split closer to 50/50), it only gets charged the lower base fee, encouraging balanced trading.

StableSurge Pools use [Stable Math](./stable-math.md) (based on StableSwap, popularized by Curve) as well as the [StableSurge Math](./stablesurge-math.md) which 

::: info info
Balancer v3 pools are limited at the Vault level to 8 tokens. Stable Pools have a safe maximum of 5 tokens, due to the constraints of Stable Math (same as in v2).
Standard Stable Pools support 5 tokens.
:::

### Ideal For

- **Pegged Tokens** - tokens that swap near 1:1, such as two stablecoins of the same currency (eg: DAI, USDC, USDT), or synthetic assets (eg: renBTC, sBTC, WBTC)
- **Correlated Tokens** - tokens that swap near 1:$R$ with some slowly changing exchange rate $R$, like derivatives (eg: wstETH, wETH)
- **Correlated Tokens with Redemption Delays** - tokens that swap near 1:$R$ with some slowly changing exchange rate $R$, like derivatives (eg: sUSDe, USDe)

### Stable Swaps Under the Balancer Umbrella

One of the key advantages to having StableSurge Pools on Balancer specifically is that they are plugged into the same protocol as all other pools. Swapping between stablecoins is frequently used for arbitrage when one token is paired with two different stablecoins in different pools. By leveraging Batch Swaps on Balancer, these swaps can be combined into a single, gas-efficient transaction. Furthermore, utilizing StableSurge in combination with [Boosted Pool](../boosted-pool.md) technology makes Balancer pools the best option for correlated assets when compared to any other DEX.


#### Example

Alternative decentralized exchanges only permit `[GHO, USDC, USDT]` with a only a static or non-directional fee algorithm. Many exchanges do not even permit more than 2 tokens in a pool. On Balancer the pool can be `StableSurge [Aave-GHO, Aave-USDC, Aave-USDT]` meaning liquidity providers earn the yield from Aave's Core stablecoin lending markets, and only traders who oversell one of the tokens will pay an increased trading fee. Any market makers or traders reinforcing the parity of the assets will only pay the set base fee.


## Use Cases

### **The Lido Fluid wstETH/WETH Liquidity Pool**

[Lido](https://lido.fi/) is a liquid staking solution for ETH 2.0 backed by industry-leading staking providers. Lido lets users stake their ETH - without locking assets or maintaining their own infrastructure. The goal is to solve problems associated with initial ETH 2.0 staking: illiquidity, immovability and accessibility by making staked ETH liquid and allowing for participation with any amount of ETH to improve the security of the Ethereum network.

stETH is a token that represents **Staked Ether**, combining the value of deposited ETH with staking returns. As an ERC20, stETH tokens can be swapped as one would swap WETH, allowing the benefits of ETH 2.0 staking while allowing users to continue using their staked Ether on decentralized finance products.

Balancer StableSurge Pools are ideal for the wstETH-WETH pair as the stETH asset is highly correlated but not pegged 1:1 to ETH as it accrues staking returns. By rehypothecating these assets into Fluid, a higher capital efficiency is achieved by earning Balancer liquidity providers higher returns on their position, and offers Fluid borrowers more idle assets to utilize in their strategies. 