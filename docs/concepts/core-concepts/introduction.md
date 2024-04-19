---
title: Introduction
heroImage: /images/backgrounds/red.png
order: 0
---

# Introduction

Welcome to the Balancer Explained section, where we delve deep into the intricate design and operation of Balancer V3. This section is tailored for those who crave a comprehensive understanding of the protocol's architecture, mechanics, and underlying principles. Whether you're curious about the inner workings or looking to grasp the finer details, you're in the right place.

If you're eager to jump into development and start building with Balancer, we've got you covered as well! Check out our [Integration Guides](../../integration-guides/README.md) for step-by-step instructions, explore the [Building An AMM](../../build-a-custom-amm/README.md) section for creating your own automated market maker, or consult the [Developer Reference](../../developer-reference/README.md) docs for comprehensive technical details.

## What is Balancer?

Balancer is a decentralized automated market maker (AMM) protocol built on Ethereum that represents a flexible building block for programmable liquidity.

Balancer Pools are smart contracts that define how traders can swap between tokens on Balancer Protocol and the [architecture](./architecture.md) of Balancer Protocol empowers anyone to create their own custom pool types. What makes Balancer Pools unique from those of other protocols is their unparalleled flexibility. With the introduction of [Hooks](./hooks.md) and [Dynamic Swap Fees](./dynamic-swap-fees.md) in V3, the realm of customization is boundless. Several custom pools have already been developed by external protocols like [Gyroscope](https://www.gyro.finance/) and [Xave](https://www.xave.co/). You can follow [this guide](../../build-a-custom-amm/build-an-amm/create-custom-amm-with-novel-invariant.md) to embark on creating your own custom pools.

Balancer has already developed, audited and deployed a variety of pool types showcasing diverse functionalities. These pools are readily accessible for existing use cases without requiring permission, and the accompanying code serves as a valuable resource for custom pool development. For more details see the [Exploring Available Balancer Pools](../explore-available-balancer-pools/) section.


## Who uses Balancer?

Balancer is an incredibly useful tool for a diverse set of actors in the Defi space.

Swappers can swap between any two ERC20 tokens. This can be done through the [Balancer Dapp](https://app.balancer.fi/#/ethereum/swap) or aggregators like [1inch](https://app.1inch.io), [Matcha](https://www.matcha.xyz), or [Paraswap](https://app.paraswap.io).

Liquidity Providers (LPs) can add liquidity to pools to earn swap fees, liquidity incentives, and other forms of yield

- Passive LPs can utilize boosted pools to earn on top of their already compounding Aave tokens

Arbitrageurs can swap against pools using things like batch swaps and flash loans

BAL Token holders can lock their token into veBAL and participate in the governance of evolving the Balancer protocol

## Helpful Articles to Learn More

- [What are automated market makers?](https://chain.link/education-hub/what-is-an-automated-market-maker-amm)
- [What is Balancer? The Complete Guide](https://medium.com/balancer-protocol/what-is-balancer-the-complete-guide-762ee230a9d4)
