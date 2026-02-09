---
order: 0
title: Liquidity Bootstrapping Pool
---

# Liquidity Bootstrapping Pools (LBPs)

## Overview

Liquidity Bootstrapping Pools (LBPs) are programmable execution engines that leverage time-dependent weight shifts to create directional price pressure. Unlike standard AMMs with fixed weights, LBPs dynamically change token weighting (e.g 1/99 to 99/1 for TokenA/TokenB) over a specified time period. LBPs use [Weighted Math](./weighted-pool/weighted-math.md) with time-dependent weights controlled by the pool owner.

The pool owner is the only address that can add liquidity to the pool, which must be done prior to the start of the weight shift. Furthermore, the proceeds can only be removed after the end time. This architecture transforms LBPs from simple liquidity pools into strategic financial primitives for controlled asset distribution, accumulation, or large-scale portfolio rebalancing.

::: info Create an LBP

- [Create an LBP with the balancer SDK](https://github.com/balancer/b-sdk/blob/main/examples/createAndInitPool/createAndInitLBPoolV3.ts)
- [Create an LBP with a foundry script](https://github.com/balancer/balancer-v3-foundry-starter/pull/5/files)
- Once the LBP has concluded, the token can be easily migrated to a standard pool on Balancer with this [tool](https://balancer.fi/create/).

  :::

## Use Cases

LBPs serve three primary institutional and protocol applications. Each use case leverages the same weight-shifting mechanism but with different configurations and strategic objectives:

### 1. [Token Launches](./token-launch.md)
**Objective:** Fair initial token distribution with minimal starting capital.

The standard LBP configuration facilitates price discovery for new tokens through a continuous Dutch auction mechanism. By starting with a high price ceiling (99% project token / 1% collateral) and shifting to lower weights over 2-3 days, projects can distribute tokens broadly while discouraging bot sniping and whale concentration. The weight shift creates downward price pressure, allowing organic buyers to enter at levels they deem fair rather than competing in a gas war at launch.

### 2. [Strategic Investment & Divestment](./investments-divestments.md)
**Objective:** Institutional-scale position entry and exit with minimal market impact.

For DAOs and treasuries managing significant capital, LBPs function as "Liquidity Maker" execution engines. Unlike TWAP strategies that consume liquidity and pay fees, LBPs create their own depth through weight shifting. This allows treasuries to:
- **Divest:** Sell large illiquid positions (e.g., grant tokens) over weeks or months, earning swap fees rather than paying slippage.
- **Invest:** Accumulate large stakes in target protocols without triggering parabolic price responses or front-running.

Extended durations (1 month to 1 year) convert execution from market-taking into a programmatic "streaming" operation.

### 3. [Treasury Buybacks (rLBP)](./treasury-buybacks.md)
**Objective:** Efficient protocol token accumulation via inverted weight logic.

The Reverse LBP (rLBP) inverts the standard configuration to create upward price pressure. By starting with high collateral weight (90% DAI / 10% project token) and shifting toward the project token (30% / 70%), the pool functions as an automated, rising limit order. Arbitrageurs are incentivized to sell the project token into the pool when its internal price exceeds external markets, allowing treasuries to accumulate tokens at near-market prices without triggering "green candles" or excessive slippage.

::: tip Choosing the Right Configuration
The direction and speed of weight shift determines the LBP's behavior. **Decreasing** project token weight creates sell pressure (Token Launch, Divestment). **Increasing** project token weight creates buy pressure (rLBP). Duration controls the intensity: fast shifts (2-3 days) for concentrated events, slow shifts (weeks to months) for capital-efficient institutional execution.
:::

### Mental Model

The core mechanism of an LBP is the manipulation of price through controlled weight shifts. The weighted pool pricing formula is:

$$ P_{tokenA} = \frac{Balance_{tokenB} \cdot Weight_{tokenA}}{Balance_{tokenA} \cdot Weight_{tokenB}} $$

By shifting the weights over time, the pool creates **directional price pressure** independent of trading volume:

- **Decreasing Token A Weight** → Creates downward price pressure (selling/distribution scenarios).
- **Increasing Token A Weight** → Creates upward price pressure (buying/accumulation scenarios).

**For Distribution (Token Launch, Divestment):** The starting price should be set significantly above the expected market value (e.g., 99/1 project/collateral). This creates a "price ceiling" that decays over time. Buyers are disincentivized from purchasing immediately, as the weight shift ensures the price will decrease unless organic demand counteracts it. Market equilibrium is reached when buying pressure balances the mechanical decay.

**For Accumulation (rLBP, Investment):** The starting price should be set below the expected market value (e.g., 10/90 project/collateral). This creates a "price floor" that rises over time. Sellers are incentivized to wait until the pool's bid price rises to an acceptable level, allowing the treasury to accumulate at progressively higher prices until market equilibrium is reached.

In both cases, the LBP functions as a **continuous auction** where the weight shift acts as the "forcing function" that drives price discovery without requiring the pool operator to manually adjust parameters.

## Advantages

### Programmable Price Pressure

During a weight shift, one token experiences mechanical sell pressure while the other experiences buy pressure. This occurs **independently of swap volume**, making LBPs effective even in low-liquidity environments. When combined with organic trading activity, the price converges toward market consensus without requiring external oracles or manual intervention.

**Application Examples:**
- **Token Launch:** Downward pressure from 99/1 → 20/80 discourages early bot sniping, allowing price discovery through organic demand.
- **Treasury Divestment:** A DAO slowly selling 49 trillion AKITA tokens over 1 year used weight shifts to create a "soft price floor," stabilizing the market (Gitcoin case study).
- **rLBP Buyback:** Upward pressure from 10/90 → 70/30 creates a rising bid, allowing TempleDAO to accumulate $43M with only +0.13% execution premium.

### Fair Market Dynamics

LBPs create anti-extraction properties through time-dependent pricing. By starting at extreme weights (high for distribution, low for accumulation), the pool **disincentivizes front-running and bot manipulation**.

**Distribution Scenarios:** Starting with a high price (99/1) makes it irrational for bots to buy immediately, as the weight shift guarantees price decay. Legitimate participants benefit from waiting for the price to fall to fair value.

**Accumulation Scenarios:** Starting with a low price (10/90) makes it irrational for holders to sell immediately, as the weight shift guarantees price appreciation. The treasury accumulates only when sellers voluntarily accept the pool's rising bid.

This architecture promotes **organic participation** and **broad distribution** in token launches, while enabling **efficient execution** in institutional operations without triggering panic or predatory MEV extraction.

### Capital Efficiency

LBPs allow operators to achieve large-scale objectives with minimal starting capital. Unlike 50/50 pools that require equal value on both sides, LBPs leverage extreme weight ratios to "manufacture depth."

**Token Launch Example:** A team launching a token in a traditional 50/50 pool must provide 50% DAI and 50% TOKEN. In an LBP starting at 99/1, the team provides only ~1% of the liquidity value in collateral. As weights shift toward 20/80, the pool mathematically forces the accumulation of DAI, leaving the treasury with significantly more funding than at initialization.

**Treasury Divestment Example:** A DAO divesting a grant token into USDC can start with 90/10 (90% grant token, 10% USDC). Over months, as the weight shifts to 30/70, the DAO accumulates USDC while the illiquid grant token is distributed to the market. In Balancer V3, the USDC can be deposited into Boosted Pools (e.g., Aave) to earn yield during the divestment period, further offsetting execution costs.

**rLBP Buyback Example:** A treasury conducting a buyback starts with 90% collateral (DAI) and 10% project token. The treasury deploys capital only once, and the weight shift mechanically creates buy pressure without requiring additional deposits or manual order management.

### Role Reversal: Maker vs. Taker

In traditional execution strategies (e.g., TWAP), the treasury acts as a **Liquidity Taker**, consuming existing market depth and paying swap fees. In an LBP, the treasury becomes a **Liquidity Maker**, earning swap fees on every arbitrage transaction.

| Execution Method | Role | Fees Paid/Earned | Market Impact |
| :--- | :--- | :--- | :--- |
| TWAP / Market Orders | Taker | Pays Fees | High (depends on external depth) |
| LBP (Any Configuration) | Maker | Earns Fees | Self-Created (via weight shifts) |

**Mechanism:** Arbitrageurs rebalance the LBP to align its internal price with external markets. Every rebalancing transaction generates swap fees, which accrue to the pool operator. For long-duration operations (e.g., 1-year divestments), these fees can offset a significant portion of the execution cost.

### Immediate Liquidity

Once the LBP concludes, immediate access to the proceeds is available. The pool operator can remove liquidity without lock-up periods or withdrawal delays.

**Token Launch:** New token holders can immediately trade their tokens, and the project treasury can access the raised capital (e.g., DAI, USDC) to fund development, liquidity mining, or operational expenses.

**Treasury Operations:** For divestment or buyback operations, the acquired assets are immediately available for redeployment. A DAO completing a 6-month divestment can instantly allocate the accumulated stablecoins to new investments, grants, or protocol incentives without waiting for vesting schedules.

## Weight Shift Visualization

The following diagram illustrates a standard distribution LBP (e.g., Token Launch or Divestment) shifting from 80/20 TOKEN/DAI to 20/80. This weight shift creates downward price pressure on TOKEN, allowing the pool to accumulate DAI over time as traders arbitrage the price differential.

![Liquidity Bootstrapping pool weight shifts](/images/pool_LBP.webp)

**Note:** For accumulation scenarios (rLBP), the weight shift operates in reverse: starting with high collateral weight (e.g., 90/10 DAI/TOKEN) and shifting toward the project token (e.g., 30/70), creating upward price pressure.

## Pool Settings

LBPs are highly configurable. Here are the key parameters and settings, as defined in the pool implementation:

- **Tokens**: LBPs are always two-token pools. The specific tokens depend on the use case:
  - **Token Launch / Divestment:** Project token + Reserve token (e.g., USDC, WETH, DAI).
  - **rLBP / Investment:** Target token + Collateral token (e.g., governance token + DAI).
- **Weights**: The pool owner specifies the starting and ending weights for both tokens. These weights change linearly over the operation period.
  - **Distribution (Launch/Divestment):** Start with high project token weight (e.g., 99/1), end with low project token weight (e.g., 20/80).
  - **Accumulation (rLBP/Investment):** Start with low target token weight (e.g., 10/90), end with high target token weight (e.g., 70/30).
- **Operation Period**: The pool owner sets the `startTime` and `endTime` (timestamps). Swaps are only enabled between these times.
- **Liquidity Provision**: Only the owner can add liquidity, and only before the operation starts.
- **Swaps**: Optionally, the pool can block selling the project token back into the pool (`blockProjectTokenSwapsIn`). This is typically enabled for token launches to prevent manipulation, but disabled for rLBPs where sellers must deposit the target token.
- **Trusted Router**: All pool interactions must go through a trusted router to ensure correct sender reporting and security.

## Pool Migration

It is possible to either create a standalone LBP or create one that can easily be migrated to a weighted pool after the operation has concluded. To use this feature the pool factory offers a `createWithMigration` function. For this additional parameters are required:

- `bptLockDuration`: The time in seconds the BPT of the created weighted pool is locked before the liquidity can be removed from the created weighted pool. 
- `bptPercentageToMigrate`: The percentage of the liquidity to be migrated from the LBP to the created weighted pool.
- `migrationWeightProjectToken`: Defines the weight of the project token in the created weighted pool.
- `migrationWeightReserveToken`: Defines the weight of the reserve token in the created weighted pool.

The migration happens via the [`LBPMigrationRouter`](https://github.com/balancer/balancer-deployments/tree/master/v3/tasks/20251219-v3-liquidity-bootstrapping-pool-v3).

**Primary Use Case:** This feature is most commonly used for **Token Launches**, where the LBP concludes with a successful distribution and the project wishes to establish permanent liquidity. By migrating to a standard weighted pool (e.g., 80/20 or 50/50), the project token becomes immediately tradable on Balancer without requiring a new pool deployment or liquidity migration process.

**Treasury Operations:** For divestment or buyback operations, migration is typically unnecessary, as the objective is to acquire or distribute assets rather than maintain ongoing liquidity. However, a DAO completing a large divestment may choose to migrate remaining liquidity to a weighted pool to provide continued market access for the divested token.


**Technical Parameters (from the implementation):**

- `projectToken` / `reserveToken`: ERC20 addresses for the tokens.
- `projectTokenStartWeight` / `reserveTokenStartWeight`: Initial weights (scaled).
- `projectTokenEndWeight` / `reserveTokenEndWeight`: Final weights (scaled).
- `startTime` / `endTime`: UNIX timestamps for the sale window.
- `blockProjectTokenSwapsIn`: Boolean to restrict project token sales.
- `poolCreator`: The account accrueing [pool creator fees](../core-concepts/pool-creator-fee.md) 
- Only two tokens are allowed per pool.

---
