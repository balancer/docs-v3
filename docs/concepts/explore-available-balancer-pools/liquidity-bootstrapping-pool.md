---
order: 3
title: Liquidity Bootstrapping Pool
---
# Liquidity Bootstrapping Pools (LBPs)

## Overview

Liquidity Bootstrapping Pools (LBPs) are pools that can dynamically change token weighting (e.g 1/99 to 99/1 for TokenA/TokenB). LBPs use [Weighted Math](./weighted-pool/weighted-math.md) with time-dependent weights. The starting and end weights and times are selected by the pool owner, who also has the power to pause swaps. The pool owner is the only address that can join the pool.

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

![](https://lh3.googleusercontent.com/jJSoUvPnPwQFAEemsJlKZctFspEJrRQhRIncmoaaq5a6_CzyXssVwokti4HQQyIBqVcv5GG9bMKDplrAaDIC3MkdFoVJAprLHu_NhTSWW4GEoMRe3mUhFnB0lG3kVqIGvjK7aGJD=s0)

and would ultimately result in the team holding far more DAI \_\_ at the end of their LBP while reducing the (sometimes extreme) price volatility that teams experience when just launching a 50/50 pool.