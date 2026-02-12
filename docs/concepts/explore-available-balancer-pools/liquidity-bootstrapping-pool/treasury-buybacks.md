---
order: 2
title: Treasury Buybacks (rLBP)
---

# Treasury Buybacks (rLBP)

While the standard Liquidity Bootstrapping Pool (LBP) is designed for **distribution** (selling tokens), the mechanism can be inverted to facilitate efficient **accumulation** (buying tokens)**.

This guide outlines the architecture and configuration for using an rLBP to conduct treasury buybacks or collateral accumulation.

## Logic and Philosophy

For DAOs and treasuries, acquiring large amounts of a specific asset (e.g., buying back governance tokens) presents significant execution challenges.

*   **Market Buys** create immediate "green candles," resulting in high slippage and poor execution prices.
*   **TWAP** (Time-Weighted Average Price) orders reduce impact but lack bottom-up price discovery, simply accepting the market rate over time.

The **rLBP** solves this by functioning as an automated, accumulating limit order. By inverting the weight logic, the pool creates gradually increasing buy pressure. This forces the market to sell into the pool only when the pool's "bid" becomes attractive relative to external venues, minimizing the premium paid by the treasury.

## Architectural Mechanics

In a standard LBP, the token weight starts high and decreases to lower the price. In an rLBP, the **Collateral Token** (the asset used to buy) starts with a high weight and decreases over time.

### The Weight Flip
To create upward price pressure (a rising bid), the pool is initialized with a high weight for the Collateral and a low weight for the Project Token.

$$ P_{token} = \frac{Balance_{collateral} \cdot Weight_{token}}{Balance_{token} \cdot Weight_{collateral}} $$

1.  **Initialization:** The pool holds mostly Collateral (e.g., DAI) and very little Project Token.
    *   *Configuration:* Collateral Weight ~90% / Project Token Weight ~10%.
    *   *Result:* The theoretical spot price of the Project Token is significantly **below** market price.
2.  **Accumulation Phase:** As time progresses, the **Controller** shifts the weights.
    *   *Shift:* Collateral Weight decreases ($90\% \rightarrow 30\%$), Project Token Weight increases ($10\% \rightarrow 70\%$).
    *   *Result:* The price denominator decreases while the numerator increases, mechanically raising the price of the Project Token.
3.  **Arbitrage Execution:** When the pool's internal price rises slightly above the external market price (e.g., Uniswap), arbitrageurs buy the Project Token on the open market and sell it to the rLBP.

::: tip

The rLBP does not "buy" the token itself. It incentivizes **arbitrageurs** to deposit the Project Token into the pool in exchange for Collateral.

:::

## Configuration Guide

To deploy an rLBP, you must utilize the `LiquidityBootstrappingPoolFactory`. The following parameters are prescriptive for a standard buyback operation.

### 1. Token Setup
*   **Collateral Token:** The asset the Treasury wishes to spend (e.g., USDC, WETH).
*   **Project Token:** The asset the Treasury wishes to acquire.
*   **Initial Liquidity:** The pool should be funded primarily with the **Collateral Token**.
    *   *Note:* A small amount of "dust" Project Token is required to initialize the math.

### 2. Weight Schedule
To ensure the "Limit Order" behavior, the weight curve must start with the Collateral dominant.

| Parameter | Recommended Value | Reason |
| :--- | :--- | :--- |
| **Start Weights** | 90% Collateral / 10% Project Token | Sets the initial bid price low to prevent front-running. |
| **End Weights** | 30% Collateral / 70% Project Token | Ensures the bid price eventually crosses the market price to fill the order. |

### 3. Swap Permissions
Ensure that `blockProjectTokenSwapsIn` is set to `false`. The mechanism relies on external actors swapping the **Project Token** *in* to the pool to extract the **Collateral**.

## Performance Expectations

When configured correctly with sufficient liquidity (>$500k), rLBPs have demonstrated high execution efficiency.

*   **Slippage/Premium:** Historical data from protocols like TempleDAO indicates execution premiums as low as **+0.13%** relative to spot price, significantly outperforming large market buys.

::: warning Liquidity Requirement
rLBPs are most effective for institutional-scale execution. Shallow pools (e.g., <$100k liquidity) may suffer from wider arbitrage spreads, resulting in higher premiums.
:::

### 4. Use Cases & Strategic Learnings

The rLBP mechanism is not merely a theoretical construct but a battle-tested financial primitive. Empirical analysis of over $43M in volume identifies two distinct applications for this architecture:

1.  **Governance Token Repurchases:**
    Protocols like **IDLE Finance** have utilized rLBPs to buy back governance tokens directly from the market. This allows DAOs to restock their treasury for future incentives or voting power consolidation without manually managing orders on exchanges.
2.  **Institutional Block Execution:**
    For large-scale capital deployment, the rLBP functions as an algorithmic execution engine. **TempleDAO** demonstrated this by successfully moving over $43M into their token (TEMPLE) with an average execution premium of only +0.13%. In this context, the pool serves as a "moving limit order" that allows a treasury to enter massive positions without triggering the massive slippage ("green candles") associated with standard market buys.

**Key Empirical Learnings:**
*   **Liquidity Depth is Critical:** rLBPs are most efficient for medium-to-large cap operations. Data indicates that shallow pools (<$100k volume) suffer from wider spreads and higher premiums (>1.5%), whereas deep pools achieve near-market execution.
*   **Arbitrage as Delivery:** 100% of the flow in successful rLBPs originated from direct arbitrage bots rather than trade aggregators. The mechanism successfully incentivizes these actors to act as "delivery agents," transporting liquidity from external markets to the treasury.