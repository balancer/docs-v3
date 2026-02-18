---
order: 3
title: Treasury Diversification
---

# Treasury Diversification

LBPs can help treasuries and DAOs enter or exit large positions with reduced market impact.

::: tip Balancer V3: Boosted Pools
In Balancer V3, one side of an LBP can be a boosted token (e.g., a yield-bearing stablecoin), so idle balances don’t have to sit unproductive during a long-running operation.
:::

### Mental Model

LBPs can be used by treasuries to enter (invest) or exit (divest) positions over time, using a scheduled weight shift rather than a single large swap. Arbitrage keeps the LBP internal price aligned with external markets as the sale progresses.

## Strategic Divestment (Selling)

Divestment involves selling a large quantity of an asset (e.g., a grant received in an illiquid token, or diversifying treasury holdings) into a more liquid asset like USDC or ETH. Unlike a **Token Launch** (which typically runs over days), a **Strategic Divestment** prioritizes stability and value retention over longer horizons.

## Strategic Investment (Buying)

While token buybacks focus on retiring supply, a **Strategic Investment** allows treasuries to acquire large stakes in _other_ protocols (e.g., a DAO rotating stablecoins into another governance token or ETH) without triggering a parabolic price response. These operations are often run over weeks or months, rather than days.

## Case Study: The Gitcoin Akita Divestment

The viability of using LBPs for institutional-scale divestment was demonstrated by the **Gitcoin DAO**.

**Challenge:**

In 2021, Vitalik Buterin donated approximately 49 trillion AKITA tokens (valued at ~$5 million) to Gitcoin. The on-chain market depth was insufficient to absorb this liquidity; a direct sale would have resulted in roughly 99% slippage and a collapse of the token's community value.

**Solution:**

Instead of an atomic sell-off, the DAO deployed a LBP with the following parameters:

- **Duration:** 1 Year (slow decay).
- **Weight Shift:** 90% AKITA / 10% WETH $\to$ 10% AKITA / 90% WETH.

**Results:**

Over the 12-month period, the mechanism successfully converted the illiquid asset into WETH.

| Metric                 | Result        |
| :--------------------- | :------------ |
| **Total Funds Raised** | $4.48 Million |
| **Trading Volume**     | $22.6 Million |
