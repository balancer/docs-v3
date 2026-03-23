---
order: 1
title: Token Launches
---

# Token Launches

The Liquidity Bootstrapping Pool (LBP) is the standard primitive for initial token distribution. The LBP utilizes time-dependent weights to facilitate fair price discovery and capital efficiency.

::: tip New on Balancer v3: Seedless LBPs
Token launch LBPs can be configured as **seedless**, meaning they require **no initial liquidity in the reserve token**.
:::

### Mental Model

You can think of the starting price of your LBP as the ceiling you would want to set for the token sale. This may seem counterintuitive, but since LBPs work differently than other token sales, your starting price should be set much higher than what you believe is the fair price.

This does not mean you are trying to sell the token above what it is worth. Setting a high starting price allows the changing pool weights of your LBP to make their full impact, lowering the price progressively until market equilibrium is reached. Unlike older token sale models, such as bonding curves, users are disincentivized to buy early and instead benefit from waiting for the price to decrease until it reaches a level they believe is fair.

## Advantages

### Capital Efficiency

LBPs can be configured as **seedless**, meaning they require **no initial liquidity in the reserve token**.

### Fair Market Price

LBPs often start with intentionally high prices. This strongly disincentivizes whales and bots from snatching up much of the pool liquidity at the get-go. When LBPs are used for early-stage tokens, this can help increase how widespread the token distribution is.

### Immediate Liquidity

Once the LBP concludes, immediate access to the funds raised is available. The new token holders can immediately trade their token, providing instant liquidity without lengthy lock-up periods.

### Sell Pressure

During a weight shift, the token price of one token experiences sell pressure while the other experiences buy pressure. When this is mixed with modest swap volume, the price approaches the generally agreed-upon market price.

## Configuration

Token launches using LBPs rely on a scheduled **weight shift**.

### Duration

Token launches are typically run over **days** (not weeks or months). A common choice is **48 to 72 hours** (2 to 3 days), which gives participants time to enter without concentrating all activity into a short window.

### Weights

To create the necessary "price ceiling," the **project token** should start with a dominant weight and decrease over time. In practice, avoid weight schedules that go all the way to the extremes (close to 100/0 or 0/100), as pricing becomes highly non-linear near the ends of the range.

