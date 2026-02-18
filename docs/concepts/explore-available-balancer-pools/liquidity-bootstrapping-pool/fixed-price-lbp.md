---
order: 4
title: Fixed Price LBP
---

# Fixed Price LBP

A **Fixed Price LBP** is a Liquidity Bootstrapping Pool that keeps a **constant exchange rate** between the project token and the reserve token for the whole sale. Unlike standard LBPs, there is no scheduled weights changes.

## When to use it?

Use a Fixed Price LBP when you want a **constant-rate token sale**: one project token always costs the same amount of reserve token (1 TOKEN = 10 USDC). Use a **weight-shifting LBP** when you want price discovery (check [Token Launches](./token-launches.md)).

## How it works?

- **Constant price:** The pool uses a fixed rate (e.g. `projectTokenRate`). Swaps are simple: reserve in → project out at that rate (or the reverse, depending on configuration).
- **Invariant:** The pool uses a constant-sum style invariant: `projectBalance * projectTokenRate + reserveBalance`, i.e. total value in terms of the reserve token. No weighted math or time-dependent weights.
- **Buy-only (one-way):** Fixed Price LBPs are configured so that only **buying** the project token with the reserve token is allowed. Selling the project token back into the pool is disabled.
- **Seedless:** Because the sale is one-way, the pool is initialized with **project tokens only**. No reserve tokens are required up front; buyers supply the reserve token when they swap.

## Summary

| Aspect                         | Weight-shifting LBP                              | Fixed Price LBP               |
| :----------------------------- | :----------------------------------------------- | :---------------------------- |
| **Price**                      | Changes over time (weight schedule)              | Constant (fixed rate)         |
| **Use case**                   | Price discovery (launches, divestment, buybacks) | Constant-rate sales           |
| **Initial liquidity**          | Project + reserve (or seedless for some configs) | Project token only (seedless) |
| **Selling project token back** | Configurable                                     | Disabled (buy-only)           |
