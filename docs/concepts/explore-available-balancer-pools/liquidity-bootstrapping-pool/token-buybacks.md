---
order: 3
title: Token Buybacks
---

# Token Buybacks

The same LBP mechanism can be used to support **accumulation** - buying the project token.

## Mental Model

For DAOs and treasuries, buying back a large amount of a token can be challenging - **market buys** can create abrupt price impact. An LBP buyback configuration approaches this differently: it uses a scheduled weight shift to create a rising bid, and lets arbitrage keep the pool price aligned with external markets.

## Configuration

### 1. Token Setup

- **Reserve token:** The asset the Treasury wishes to spend (e.g., USDC, WETH).
- **Project token:** The asset the Treasury wishes to acquire.

### 2. Weight Schedule

The weight curve should start with the reserve token dominant.

| Parameter         | Example value                         | Reason                            |
| :---------------- | :------------------------------------ | :-------------------------------- |
| **Start weights** | 90% reserve token / 10% project token | Keeps the initial bid low.        |
| **End weights**   | 30% reserve token / 70% project token | Allows the bid to rise over time. |

### 3. Swap Permissions

Ensure that `blockProjectTokenSwapsIn` is set to `false`. The mechanism relies on external actors swapping the project token _in_ to the pool to extract the reserve token.
