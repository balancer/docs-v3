---
order: 0
title: Gyroscope Pools
---

## Gyroscope Pool Types

There are two kinds of Gyroscope Pools on Balancer v3: 2-CLP and E-CLP, both of which are 2-token pools.

- [Gyro 2-CLP](./gyro-2clp.md): Quadratic concentrated liquidity pools concentrate liquidity within a price range. A given 2-CLP is parameterized by the price range [α,β], and the two assets in the pool.

- [Gyro E-CLP](./gyro-eclp.md): Elliptic CLPs are likewise efficient liquidity concentrators, so named because their price curve is an ellipse, technically formed by transforming a “constant circle” with stretch (lambda), rotation (phi), and displacement (alpha, beta) parameters. Like 2-CLPS, these parameters are fixed on deployment.

Every pool type is associated with its own Factory contract, facilitating the creation of new pools. Experienced developers can find the factory deployment addresses through [this resource](../../../developer-reference/contracts/deployment-addresses/mainnet.html). For further assistance, individuals are encouraged to contact our developers via [Discord](https://discord.balancer.fi/).



