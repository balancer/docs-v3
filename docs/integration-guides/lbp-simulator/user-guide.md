---
order: 1
title: User guide
---

# LBP Simulator User Guide

## Overview
The LBP Simulator lets you configure a Liquidity Bootstrapping Pool (LBP), model buy and sell pressure, and watch how prices, weights, and liquidity evolve over time. It also includes a simulated trading panel for swaps, limit orders, and TWAP.

## Getting Started
1. Open the simulator page.
2. Click `Configure your LBP` or use the keyboard shortcut kbd `⌘ + b` to open the configuration panel.
3. Set your parameters, then press `Play` to run the simulation.
4. Use the chart tabs and stats cards to read results.

## Core Configuration
All core settings live in the `Configure your LBP` panel.

**Timeline**
- `Duration`: Total campaign length in days. This controls how long the LBP runs and how quickly weights shift.
- `Play/Pause`: Starts or stops the simulation clock.
- `Speed`: Changes how fast the simulation advances (`1x`, `5x`, `10x`).
- `Buy & sell` / `Buy only`: Toggles whether sell pressure is included. `Buy only` disables selling pressure by setting it to zero.

**Tokenomics**
- `Total Supply`: Total token supply used to compute valuation metrics.
- `% for Sale`: Share of total supply sold through the LBP. This drives the `Tokens for sale` amount.
- `Initial Liquidity (Collateral token)`: Starting collateral balance in the pool (USDC/USDT/ETH/wETH). This anchors the starting price.

**Weights**
- `Start (Token / Collateral)`: Initial pool weights. Higher token weight means a higher starting price.
- `End (Token / Collateral)`: Final pool weights at the end of the LBP.
- `Collateral Token`: Selects the collateral asset (`USDC`, `USDT`, `ETH`, `wETH`).
- `Swap Fee`: Fee charged on swaps (1%–5%).

## Buy Pressure Model
Open `Model the buy pressure` to configure market demand assumptions.

- `Preset`: `Bullish` (steadier/higher buying) or `Bearish` (lighter early, ramps later).
- `Magnitude`: Sets the base scale of cumulative buy volume.
- `Multiplier`: Scales the curve up or down (e.g. 0.5x, 2x).

This model affects how much simulated buy volume is applied over time.

To understand more about the curve modeling, read the article that discusses the study conducted to determine the purchase and sale curves modeled in the app.
<a href="/lbp_modeling_demmand_curve.pdf" target="_blank" rel="noopener noreferrer">
  Modeling a demand pressure curve article
</a>


## Sell Pressure Model
Open `Model the sell pressure` to configure sell behavior. This is only active when `Buy & sell` is selected.

- `Loyal community`
  - `Total sold share of community tokens (%)`: Approximate fraction of community tokens sold over the whole campaign.
  - `Concentration at start & end (%)`: How much of the sell activity happens early and late vs. evenly distributed.
- `Greedy community`
  - `Profit spread above cost basis (%)`: Sell trigger threshold above average entry price.
  - `Portion of holdings sold on trigger (%)`: Portion sold each time the trigger is hit.

## Trading Panel (Simulated)
The right-side panel lets you simulate actions using a wallet-style flow.

**Swap**
- Buy or sell the token instantly at the current simulated price.
- Use `Max` to spend your full balance.

**Limit**
- Set a target price and a maximum spend.
- When the simulated price reaches the target, the order executes.

**TWAP**
- Split a total amount into multiple parts over a time period.
- The simulator executes the parts across the chosen duration.

All trades are simulated and do not use real funds.

## Results and Charts
Use the chart tabs to explore outcomes.

- `Price over time`: Spot price evolution during the LBP. When paused, dotted paths show potential price scenarios.
- `Sales`: Displays simulated swap activity.
- `Demand curve`: Shows buy and sell pressure over time (net pressure included).
- `Weights`: Shows how token and collateral weights shift through the campaign.

## Key Metrics (Stats Cards)
The header and stat cards summarize current results.

- `Tokens for sale`: Total tokens allocated to the LBP from `% for Sale`.
- `Implied Market Cap`: Current price × tokens for sale.
- `Starting price`: Initial spot price.
- `Current price`: Current spot price.
- `FDV`: Fully diluted valuation (current price × total supply).
- `TVL`: Total value locked in the pool.
- `Total Raised`: Net collateral accumulated in the pool.
- `Total fees`: Approximate fees collected based on swap fee.
- `Time remaining`: Remaining time in the simulation.

## Tips
- Use a high start token weight and low end token weight to mimic a classic LBP price decay.
- Increase initial collateral or reduce `% for Sale` to raise the starting price.
- Compare `Bullish` vs `Bearish` buy pressure to see how sensitive pricing is to demand.
