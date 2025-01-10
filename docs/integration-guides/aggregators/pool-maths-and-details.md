---
order: 5
title: Pool Types - Maths And Details
---

# Pool Maths Reference

Explore our [GitHub repository](https://github.com/balancer/balancer-maths) containing reference mathematical implementations, in Javascript and Python, for supported Balancer pool types. Designed to assist developers and integrators in understanding the underlying swap calculations, these implementations can be imported as a packages into your project or serve as a reference for your own implementation.

# Supported Pool Types

## Weighted Pool

Pools that swap tokens by enforcing a Constant Weighted Product invariant.

See SC code implementation [here](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/pool-weighted).

[Typescript maths reference](https://github.com/balancer/balancer-maths/tree/main/typescript/src/weighted)

[Python maths reference](https://github.com/balancer/balancer-maths/blob/main/python/src/pools/weighted.py)

[Factory Deployment Addresses](https://docs.balancer.fi/developer-reference/contracts/deployment-addresses/mainnet.html#pool-factories) - See `WeightedPoolFactory`

## Stable Pool

Pools that swap tokens by enforcing a Stable Math invariant, based on Curve.

See SC code implementation [here](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/pool-stable).

[Typescript maths reference](https://github.com/balancer/balancer-maths/tree/main/typescript/src/stable)

[Python maths reference](https://github.com/balancer/balancer-maths/blob/main/python/src/pools/stable.py)

[Factory Deployment Addresses](https://docs.balancer.fi/developer-reference/contracts/deployment-addresses/mainnet.html#pool-factories) - See `StablePoolFactory`

Notes:
* Amplification factor can be dynamic see:
  * getAmplificationParameter() view function
  * AmpUpdateStarted & AmpUpdateStopped events

