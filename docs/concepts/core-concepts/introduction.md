---
title: Introduction
order: 0
---

# Introduction

Welcome to the Balancer Explained section, where we delve deep into the design and operation of Balancer v3. This section is perfect for anyone who wants a comprehensive understanding of the protocol's architecture, mechanics, and underlying principles. Whether you're curious about the inner workings or looking to grasp the finer details, you've come to the right place.

If you're eager to jump into development and start building with Balancer, we've got you covered as well! Check out our [Integration Guides](../../integration-guides/README.md) for step-by-step instructions, explore the [Building An AMM](../../build/README.md) section for creating your own automated market maker, or consult the [Developer Reference](../../developer-reference/README.md) docs for comprehensive technical details.

::: info
Please note these docs cover V3. For anything V2 related please visit [here](https://docs-v2.balancer.fi).
:::

## What is Balancer?

Balancer is a decentralized automated market maker (AMM) protocol built on Ethereum with a clear focus on fungible and yield-bearing liquidity. Balancer's success is intrinsically linked to the success of protocols and products built on the platform. Balancer v3’s architecture focuses on simplicity, flexibility, and extensibility at its core. The v3 vault more formally defines the requirements of a custom pool, shifting core design patterns out of the pool and into the vault.

Balancer Pools are smart contracts that define how traders can swap between tokens on Balancer Protocol, and the [architecture](./architecture.md) of Balancer Protocol empowers anyone to create custom pool types. What makes Balancer Pools unique from those of other protocols is their unparalleled flexibility. With the introduction of [Hooks](./hooks.md) and [Dynamic Swap Fees](/concepts/vault/swap-fee.html#dynamic-swap-fee), the degree of customization is boundless. Several custom pools have already been developed by external protocols like [Gyroscope](https://www.gyro.finance/) and [Xave](https://www.xave.co/). You can follow [this guide](../../build/build-an-amm/create-custom-amm-with-novel-invariant.md) to create your own custom pools.

Balancer has already developed, audited and deployed a variety of pool types showcasing diverse functionalities. These pools are readily accessible for existing use cases without requiring permission, and the accompanying code serves as a valuable resource for custom pool development. For more details see the [Exploring Available Balancer Pools](../explore-available-balancer-pools/) section.


## Helpful Articles to Learn More

- [What are automated market makers?](https://chain.link/education-hub/what-is-an-automated-market-maker-amm)
- [What is Balancer v3?](https://medium.com/balancer-protocol/balancer-v3-the-future-of-amm-innovation-f8f856040122)
- [Vision for Balancer v3](https://forum.balancer.fi/t/balancer-v3-my-thoughts-for-the-future-of-balancer/5801)
