---
order: 0
title: Gyro E-CLP Pool
references:
  - details: Gyro E-CLP Docs
    link: https://docs.gyro.finance/gyroscope-protocol/concentrated-liquidity-pools/e-clps
---

# Gyroscope E-CLP Pools

## Overview

Elliptic CLPs, or E-CLPs, allow trading along the curve of an ellipse. Similar to other CLPs, E-CLPs are designed to concentrate liquidity within price bounds. However, E-CLP liquidity is much more flexible. Just as 2-CLP pools concentrate liquidity over a range, vs. spreading it uniformly over the entire (infinite) price range, E-CLP pools can focus liquidity asymmetrically over the already restricted range defined by the alpha and beta parameters.

::: info
Gyro E-CLPs are always two-token pools.

- The minimum swap fee percentage is 0.000001% (note - lower than the Stable Pool minimum by an order of magnitude)
- The maximum swap fee is not constrained (i.e., 100%)
- The invariant cannot decrease below 60% or increase beyond 500% on liquidity operations (same limits as the standard Stable Pool)
- The key parameters are Alpha (α), the lower bound of the E-CLP price curve, and Beta (β), the upper limit of the price interval.
- The lambda parameter (>= 1) determines the "stretch" of the curve. It behaves like the reciprocal of the eccentricity. 1 would be a perfect circle = price-bounded StableSwap. Higher values increasingly concentrate the liquidity around the center (e.g., $1), with less and less in other regions of the bounded price curve.
- The phi parameter measures the "rotation" of the curve. Other parameters (documented in the code), are combinations or functions of these fundamentals. For instance, c = cos(-phi).
  :::

Note that the swap fee and invariant limits are defined in `GyroECLPPool` through implementing the `ISwapFeePercentageBounds` and `IUnbalancedLiquidityInvariantRatioBounds` interfaces, which are included in `IBasePool`.

See [here](../../../../integration-guides/aggregators/pool-maths-and-details.html) for a more detailed reference.

![E-CLP price curve illustration](/images/E-CLP-v1.gif)

Using rate providers, which (depending on their sensitivity and tracking speed) can track the price much more closely, preserving capital by reducing or eliminating arbitrage opportunities caused by lagging prices.

![Rate providers](/images/Rate-providers-v8.gif)

Source: [Gyroscope Docs](https://docs.gyro.finance/gyroscope-protocol/concentrated-liquidity-pools/e-clps)

## Advantages

### Higher Fees for LPs

Concentrated liquidity allows the LPs' entire contributions to be used within a relatively narrow expected price range, as opposed to distributing it along the entire price curve, where most of it would be idle. Since the price range is fixed and common to all LPs, there is no individual variation (as there would be in NFT-based CL AMMs like Uniswap, where each LP's position is tracked individually), but these pools are more capital efficient than, for instance, regular Weighted Pools.

### Better execution for traders

Another effect of concentration is effectively "deeper" liquidity for traders, which allows larger trades with lower slippage and better overall execution prices.

## Impermanent Loss

[Impermanent Loss](../weighted-pool/impermanent-loss.md) is the difference in value between holding a set of assets and providing liquidity for those same assets.

This can occur with these pools, and the liquidity concentration somewhat increases this risk, especially with narrow price range settings.
