---
order: 1
title: Token Launch
---

# Token Launches

The Liquidity Bootstrapping Pool (LBP) is the standard primitive for initial token distribution. Unlike fixed-price sales or standard AMMs, which require large capital outlays to prevent volatility, the LBP utilizes time-dependent weights to facilitate fair price discovery and capital efficiency.

This guide outlines the optimal configuration for a token launch, derived from a historical analysis of over 900 pools.

## Logic and Mental Model

The LBP functions as a **continuous Dutch Auction**.

*   **Price Ceiling:** The pool is initialized with the price significantly *above* the expected market value.
*   **Decay:** The weights shift over time, creating continuous downward pressure on the price.
*   **Discovery:** Buyers step in when the price decays to a level they deem fair. Buying pressure counteracts the weight decay, effectively stabilizing the price at market equilibrium.

This architecture solves the "Sniping" problem. Because the price starts high, bots are disincentivized from buying in the same block as the pool creation, preventing the extraction of value from legitimate users.

## Optimal Configuration

While extrinsic factors (marketing, sentiment) drive upside, the structural safety of a launch is engineered via three key parameters: **Duration**, **Starting Weights**, and **Slope**.

Based on forensic analysis of historical launches, we recommend the following configuration to maximize capital efficiency and minimize bot extraction.

### 1. Duration: The "Sweet Spot"
*   **Recommendation:** 48 to 72 Hours (2 to 3 Days).
*   **Logic:** Empirical data reveals a "U-Curve" of bot activity.
    *   **< 24 Hours:** High bot participation due to the compressed timeframe.
    *   **> 72 Hours:** High bot participation due to arbitrage opportunities on slow price decay.
    *   **48-72 Hours:** The "sweet spot" where organic volume is highest relative to algorithmic extraction.

### 2. Weight Schedule
To create the necessary "Price Ceiling," the **Project Token** must start with a dominant weight.

| Parameter | Value | Logic |
| :--- | :--- | :--- |
| **Start Weights** | 99% Project / 1% Collateral | Sets a high initial price to crush early bot incentives. Historical data shows "Healthy" pools average ~94% starting weight, while failed pools average ~86%. |
| **End Weights** | Variable (e.g., 20% / 80%) | Determines the final floor price. A "soft landing" (50/50) is often used if the pool will transition to a standard Weighted Pool. |

### 3. The Safety Slope
The relationship between Duration and Weight Change creates a metric known as the **Weight Slope**.

$$ Slope = \frac{|Weight_{start} - Weight_{end}|}{Duration_{hours}} $$

*   **Recommendation:** Keep the slope **below 0.6**.
*   **Logic:** The slope acts as a mechanical forcing function. Data indicates a "Safety Cliff" at 0.6; slopes steeper than this value generate selling pressure that organic demand cannot statistically overcome, leading to price collapses regardless of project quality.

::: warning Placebo Parameters
Analysis suggests that **Swap Fees** and specific **Start/End Ratios** (e.g., 90/10 vs 95/5) have a negligible impact on structural risk compared to Slope and Duration. These should be treated as user preferences rather than safety levers.
:::

## Migration and Transition

A successful LBP concludes with the **Project Token** widely distributed and the **Collateral Token** accumulated in the pool. To transition to a permanent trading venue, use the `createWithMigration` function on the factory.

This allows the atomic migration of liquidity from the LBP to a standard **Weighted Pool** (e.g., 80/20 or 50/50) immediately upon the conclusion of the sale.

### JSON Schema: Migration Parameters
When configuring the migration, specific parameters control the lock-up and initial state of the new pool:

```json
{
  "bptLockDuration": 2592000, // Time (seconds) BPT is locked (e.g., 30 days)
  "bptPercentageToMigrate": 100, // Percentage of liquidity to move (0-100)
  "migrationWeightProjectToken": 0.5, // New pool weight (e.g., 50%)
  "migrationWeightReserveToken": 0.5 // New pool weight (e.g., 50%)
}
```

## Capital Efficiency

The LBP allows teams to bootstrap liquidity with minimal capital. In a standard 50/50 pool, a team must match the value of their tokens with an equal value of collateral (e.g., DAI).

In an LBP starting at **99/1**, the team provides only ~1% of the total liquidity value in collateral. As the weights shift towards the collateral (e.g., to 20/80), the pool mathematically forces the accumulation of the collateral asset, leaving the treasury with significantly more funding than it started with.