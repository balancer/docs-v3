---
order: 3
title: Stablecoin Liquidity

---

## Overview
The simplistic beauty of the Vault’s architecture is that it supercharges the ability to build a fully functioning and integrated AMM. Stable coin pools can fully leverage deep liquidity on Balancer by tapping into deep liquidity upon pool creation. Innovative products like customized concentrated liquidity pools allow for highly efficient trading pairs.
Generally speaking, stable pools are designed to host assets that are either expected to consistently swap at near parity, or at a known exchange rate. Therefore, stable pools are ideal for hosting pegged tokens such as DAI USDC and USDT or synthetic assets like renBTC, sBTC and WBTC.

::: tip
Want to deep dive into stable math? Check out our [stable math docs](../../../concepts/explore-available-balancer-pools/stable-pool/stable-math.md)!
:::

Balancer offers different pool configurations for hosting stable coin liquidity:
1. Stable Pools
2. Composable Stable Pools
3. Composable Stable Pools with rate providers
4. Customized stable pools implementing their own trading curves

## Customized liquidity Curves: Elliptical concentrated liquidity with Gyroscope Pools

Composable stable pools aren’t the only pools that harness rate provider technology to accurately account for YB liquidity, this tech also serves as a powerful mechanism for external developers who are developing their own invariants. One prominent example is [Gyroscopes E-CLP invariant.](https://twitter.com/GyroStable/status/1727366719097000060)  In addition to asymmetric concentrated liquidity, E-CLPs leverage rate provider technology.

[Rate providers](../../../concepts/core-concepts/rate-providers.md) make yield-bearing asset pools more efficient by:

- Automating liquidity management
- Mitigating LVR

