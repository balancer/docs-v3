---
order: 0
title: Overview

features:
  - title: How to use the simulator
    icon: /images/build.svg
    iconDark: /images/build-dark.svg
    details: Walkthrough a quick guide of the simulator usage.
    link: /integration-guides/lbp-simulator/user-guide.md

---

# LBP Simulator

## What is the simulator?
The LBP Simulator is an interactive, client-side tool for modeling a Liquidity Bootstrapping Pool (LBP). It lets you configure a launch/divestment/buyback setup and watch how price, weights, and demand dynamics evolve over time. The goal is to make LBP mechanics more intuitive and to help teams explore tradeoffs before going on-chain.

## What it can do
- Configure core LBP parameters (token name/symbol, supply, percentage for sale, start and end weights, duration, fees, initial balances).
- Model demand and sell pressure curves to see how different market behaviors affect the price path.
- Run the simulation with play/pause controls and adjustable speed.
- Visualize outcomes across multiple charts:
  - Price over time
  - Sales / swaps
  - Demand curve
  - Weight changes
- Execute simulated actions with a wallet-style flow:
  - Instant swaps
  - Limit orders
  - TWAP (time‑weighted average price) orders

## How it works (high-level)
- The simulator computes price and pool balances step‑by‑step using LBP math.
- A client-side store (Zustand) holds configuration, state, and user actions.
- Charts and stats are derived from the simulation state and update as inputs change.


## Intended use
- Explore LBP configuration strategies.
- Compare different demand/sell pressure assumptions.
- Communicate launch mechanics with a clear, visual narrative.

## User guide
<br/>