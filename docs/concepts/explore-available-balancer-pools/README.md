---
order: 0
title: Available Balancer Pools
---

## Pool Types

Let's explore some of the diverse pool types within the Balancer Protocol, each tailored to specific use cases.

- [Weighted Pools](./weighted-pool/weighted-pool.md): Weighted Pools are highly versatile and configurable pools. They are ideal for general cases and enable users to build pools with different token counts and weightings.
- [80/20 Pool](./weighted-pool/80-20-pool.md): An optimized version of the Weighted Pool with set weights of 80%/20%. The perfect fit for achieving liquidity of governance tokens.
- [Stable Pools](./stable-pool/stable-pool.md): Stable Pools are optimal for assets expected to consistently trade at near parity or with a known exchange rate.
- [Boosted Pool](./boosted-pool.md): Boosted Pools are designed to allow for greater capital efficiency, deeper liquidity, and increased yield for Liquidity Providers.
- [Liquidity Bootstrapping Pools](./liquidity-bootstrapping-pool.md): Liquidity Bootstrapping Pools (LBPs) are pools that can dynamically change token weighting. LBPs create sell pressure and fair market advantages. Used very successfully for fair token launches.
- [Gyroscope Pools](./gyroscope-pool/README.md): Fungible concentrated liquidity pools. Providing liquidity over a fixed price range gives liquidity providers better capital efficiency, and traders  better execution prices.
- [reCLAMM Pools](./reclamm-pool/reclamm-pool.md): Concentrated liquidity pools with self-adjusting parameters. A "fire-and-forget" solution to maintenance-free concentrated liquidity provision.

Every pool type is associated with its own Factory contract, facilitating the creation of new pools. Experienced developers can find the factory deployment addresses through [this resource](../../developer-reference/contracts/deployment-addresses/mainnet.md). For further assistance, individuals are encouraged to contact our developers via [Discord](https://discord.balancer.fi/).



