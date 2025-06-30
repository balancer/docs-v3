---
order: 4
title: Liquidity Bootstrapping Pool
---

# Liquidity Bootstrapping Pools (LBPs)

## Overview

Liquidity Bootstrapping Pools (LBPs) are pools that can dynamically change token weighting (e.g 1/99 to 99/1 for TokenA/TokenB). LBPs use [Weighted Math](./weighted-pool/weighted-math.md) with time-dependent weights. The starting and end weights and times are selected by the pool owner. The pool owner is the only address that can add liquidity to the pool, which must be done prior to the start of the sale. Furthermore, the proceeds can only be removed after the end time.

::: info Create an LBP

- [Create an LBP on Balancer Homepage](https://balancer.fi/lbp/create)
- [Create an LBP with the balancer SDK](https://github.com/balancer/b-sdk/blob/main/examples/createAndInitPool/createAndInitLBPoolV3.ts)
- [Create an LBP with a foundry script](https://github.com/balancer/balancer-v3-foundry-starter/pull/5/files)
- Once the LBP has concluded, the token can be easily migrated to a standard pool on Balancer with this [tool]().

  :::

### Mental Model

You can think of the starting price of your LBP as the ceiling you would want to set for the token sale. This may seem counterintuitive, but since LBPs work differently than other token sales, your starting price should be set much higher than what you believe is the fair price.

This does not mean you are trying to sell the token above what it is worth. Setting a high starting price allows the changing pool weights of your LBP to make their full impact, lowering the price progressively until market equilibrium is reached. Unlike older token sale models, such as bonding curves, users are disincentivized to buy early and instead benefit from waiting for the price to decrease until it reaches a level they believe is fair.

## Advantages

### Sell Pressure

During a weight shift, the token price of one token experiences sell pressure while the other experiences buy pressure. When this is mixed with modest swap volume, the price approaches the generally agreed-upon market price.

### Fair Market

LBPs often start with intentionally high prices. This strongly disincentivizes whales and bots from snatching up much of the pool liquidity at the get-go. When LBPs are used for early-stage tokens, this can help increase how widespread the token distribution is.

### Starting Capital Can Be Small

Teams who use LBPs to kickstart the liquidity of a token that has not been well distributed yet can do so with minimal starting capital. For a team running an LBP with their TOKEN and DAI, starting with 10% or 20% DAI, as opposed to 50% DAI ** like they might need on another platform, significantly reduces their starting capital requirements. Shifting from 80/20 TOKEN/DAI ** to 20/80 would look like this:

![Liquidity Bootstrapping pool weight shifts](/images/pool_LBP.webp)

and would ultimately result in the team holding far more DAI at the end of their LBP while reducing the (sometimes extreme) price volatility that teams experience when just launching a 50/50 pool.

### Immediate liquidity

Once the LBP concludes, immediate access to the funds raised is available. The new token holders can immediately trade their token, providing instant liquidity without lengthy lock-up periods.

## Pool Settings

LBPs are highly configurable. Here are the key parameters and settings, as defined in the pool implementation:

- **Tokens**: LBPs are always two-token pools: the project token (being launched) and the reserve token (e.g., a stablecoin or WETH).
- **Weights**: The pool owner specifies the starting and ending weights for both tokens. These weights change linearly over the sale period.
- **Sale Period**: The pool owner sets the `startTime` and `endTime` (timestamps) for the sale. Swaps are only enabled between these times.
- **Liquidity Provision**: Only the owner can add liquidity, and only before the sale starts.
- **Swaps**: Optionally, the pool can block selling the project token back into the pool (`blockProjectTokenSwapsIn`).
- **Trusted Router**: All pool interactions must go through a trusted router to ensure correct sender reporting and security.

**Technical Parameters (from the implementation):**

- `projectToken` / `reserveToken`: ERC20 addresses for the tokens.
- `projectTokenStartWeight` / `reserveTokenStartWeight`: Initial weights (scaled).
- `projectTokenEndWeight` / `reserveTokenEndWeight`: Final weights (scaled).
- `startTime` / `endTime`: UNIX timestamps for the sale window.
- `blockProjectTokenSwapsIn`: Boolean to restrict project token sales.
- Only two tokens are allowed per pool.

---
