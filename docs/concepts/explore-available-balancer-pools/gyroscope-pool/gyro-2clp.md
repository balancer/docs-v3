---
order: 0
title: Gyro 2-CLP Pool
references:
  - details: Gyro 2-CLP Docs
    link: https://docs.gyro.finance/gyroscope-protocol/concentrated-liquidity-pools/2-clps
---

# Gyroscope 2-CLP Pools

## Overview

These pools use the following invariant: (x + a)(y + b) = $L^2$.

Given quantities of real reserves (x,y) in the pool and the pool’s price range [α,β], these "offsets" a and b can be calculated as $a = \frac{L}{\sqrt{\beta}}$, $b = \frac{L}{\sqrt{\alpha}}$. They describe the amount of "virtual reserves" the pool adds to real reserves to generate the curve defining the price range. In the code, the sum of the real balance and offset is known as the "virtual balance" of each token.

Note that native Gyro pools also have a 3-CLP, 3-token version of the pool, which uses a cubic invariant - (x + a)(y + a)(z + a) = $L^3$ - that essentially amplifies the capital efficiency benefits, vs. a corresponding pair of 2-CLPs.

::: info
Gyro 2-CLPs are always two-token pools.

- The minimum swap fee percentage is 0.0001%
- The maximum swap fee is not constrained (i.e., 100%)
- The invariant growth ratios are unconstrained
- The key parameters are Alpha (α), the lower bound of the 2-CLP price curve, and Beta (β), the upper limit of the price interval.
  :::

Note that the swap fee and invariant limits are defined in `Gyro2CLPPool` through implementing the `ISwapFeePercentageBounds` and `IUnbalancedLiquidityInvariantRatioBounds` interfaces, which are included in `IBasePool`.

See [here](../../../../integration-guides/aggregators/pool-maths-and-details.html) for a more detailed reference.

![2-CLP price curve illustration](/images/2-clp-v2.gif)
Source: [Gyroscope Docs](https://docs.gyro.finance/gyroscope-protocol/concentrated-liquidity-pools/2-clps)

## Advantages

### Higher Fees for LPs

Concentrated liquidity allows the LPs' entire contributions to be used within a relatively narrow expected price range, as opposed to distributing it along the entire price curve, where most of it would be idle. Since the price range is fixed and common to all LPs, there is no individual variation (as there would be in NFT-based CL AMMs like Uniswap, where each LP's position is tracked individually), but these pools are more capital efficient than, for instance, regular Weighted Pools.

### Better execution for traders

Another effect of concentration is effectively "deeper" liquidity for traders, which allows larger trades with lower slippage and better overall execution prices.

## Impermanent Loss

[Impermanent Loss](../weighted-pool/impermanent-loss.md) is the difference in value between holding a set of assets and providing liquidity for those same assets.

This can occur with these pools, and the liquidity concentration somewhat increases this risk, especially with narrow price range settings.
