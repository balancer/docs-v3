---
order: 0
title: Liquidity Bootstrapping Pool
---

# Liquidity Bootstrapping Pools (LBPs)

## Overview

Balancer offers two LBP variants:

- **Weight Shifting LBPs**: Pools that change token weighting over time (e.g. 90/10 → 10/80 project/reserve token). They use Weighted Math with time-dependent weights for price discovery.
- **[Fixed Price LBP](./fixed-price-lbp.md)**: Pools that keep a constant exchange rate for the whole sale (no weight schedule). Used for constant-rate token sales; buy-only and seedless by default.

The pool owner is the only address that can add liquidity to the pool, which must be done prior to the start of the sale. Furthermore, the proceeds can only be removed after the end time.

## Use Cases (weight-shifting LBPs)

The following use cases rely on **weight-shifting** LBPs (scheduled weights changes). For constant-rate sales, see [Fixed Price LBP](./fixed-price-lbp.md).

### 1. [Token Launches](./token-launches.md)

**Objective:** Fair initial token distribution.

The standard LBP configuration supports price discovery for new tokens via a continuous Dutch-auction-style mechanism. The pool starts with a high project-token weight (e.g., 90% project token / 10% reserve) and gradually shifts over time to a lower project-token weight (e.g., 20% / 80%).

This scheduled reweighting creates controlled downward price pressure, helping distribute tokens more broadly while reducing incentives for bot sniping and whale concentration. Buyers can enter when the price reaches a level they consider fair, rather than rushing into a priority-fee bidding race at launch.

### 2. [Treasury Diversification](./treasury-diversification.md)

**Objective:** Position entry and exit with minimal market impact.

For DAOs and treasuries managing significant capital, LBPs can be used to enter or exit positions over time via a scheduled weight shift. This allows treasuries to:

- **Divest:** Sell large positions with reduced market impact.
- **Invest:** Accumulate positions in target tokens with reduced market impact.

### 3. [Token Buybacks](./token-buybacks.md)

**Objective:** Efficient protocol token accumulation.

An LBP configured for accumulation inverts the weight logic to create upward price pressure. By starting with high reserve token weight (90% WETH / 10% project token) and shifting toward the project token (10% / 90%), the pool functions as an automated, rising limit order.

## Pool Settings

LBPs are highly configurable. Here are the key parameters and settings, as defined in the pool implementation:

- **Tokens**: LBPs are always two-token pools: the project token (being launched) and the reserve token (e.g., a stablecoin or WETH).
- **Weights**: The pool owner specifies the starting and ending weights for both tokens. These weights change linearly over time.
- **Period**: The pool owner sets the `startTime` and `endTime` (timestamps) for the LBP. Swaps are only enabled between these times.
- **Swaps**: Optionally, the pool can block selling the project token back into the pool (`blockProjectTokenSwapsIn`). This is typically enabled for token launches to prevent manipulation, but disabled for token buybacks where sellers must deposit the project token into the pool.
- **Trusted Router**: All pool interactions must go through a trusted router to ensure correct sender reporting and security.

## Pool Migration

It is possible to either create a standalone LBP or create one that can easily be migrated to a weighted pool after the operation has concluded. To use this feature the pool factory offers a `createWithMigration` function. For this additional parameters are required:

- `bptLockDuration`: The time in seconds the BPT of the created weighted pool is locked before the liquidity can be removed from the created weighted pool.
- `bptPercentageToMigrate`: The percentage of the liquidity to be migrated from the LBP to the created weighted pool.
- `migrationWeightProjectToken`: Defines the weight of the project token in the created weighted pool.
- `migrationWeightReserveToken`: Defines the weight of the reserve token in the created weighted pool.

The migration happens via the [`LBPMigrationRouter`](https://github.com/balancer/balancer-deployments/tree/master/v3/tasks/20251219-v3-liquidity-bootstrapping-pool-v3).

**Technical Parameters (from the implementation):**

- `projectToken` / `reserveToken`: ERC20 addresses for the tokens.
- `projectTokenStartWeight` / `reserveTokenStartWeight`: Initial weights (scaled).
- `projectTokenEndWeight` / `reserveTokenEndWeight`: Final weights (scaled).
- `startTime` / `endTime`: UNIX timestamps for the sale window.
- `blockProjectTokenSwapsIn`: Boolean to restrict project token sales.
- `poolCreator`: The account accruing [pool creator fees](../core-concepts/pool-creator-fee.md)
- Only two tokens are allowed per pool.

::: tip

**Primary Use Case:** This feature is most commonly used for **Token Launches**, where the LBP concludes with a successful distribution and the project wishes to establish permanent liquidity. By migrating to an AutoRange or Weighted pool, the project token becomes immediately tradable on Balancer.

:::

---
