---
order: 7
title: Concentrated Liquidity
---
# Concentrated Liquidity

## Introduction

In traditional automated market makers (AMMs), liquidity providers (LPs) deposit tokens across the entire possible price range: i.e., from $0 to ∞ for ETH/USDC. Yet in practice, most trading happens within a narrow price range that shifts relatively slowly along with the market price. That means most of the liquidity sits idle, earning no fees for LPs.

Concentrated liquidity cuts off the "long tail" of increasingly unlikely price points, and lets LPs allocate their liquidity to a restricted range. When the market price is within that range (say, $1,500 - $2,500), the liquidity is "deeper" there, which has positive effects for both retail traders and LPs. Traders get the benefit of trading in a pool with effectively higher liquidity, enabling larger trades with less slippage. For the same reason, LPs earn more fees per dollar invested from the increased trade volume.

Imagine liquidity as the “water level” in a pool. Providing liquidity over the full range is like filling the whole pool uniformly: all LPs participate equally, with the total value (and fee revenue) effectively the same for each LP, regardless of price.

Concentrated liquidity is like adding dividers to section the pool into shallow and deep areas. Instead of just dumping their liquidity into one big Olympic-sized space, they can effectively pour it into just one part of the pool, so that the “water” is much deeper there: deep enough for even the whales to trade freely. And since the fees are also proportional to the “height” of the water, those who contributed to the “deep end” earn a higher portion of the total fees.

To quantify the degree of concentration (sometimes called the "gain"), we must first define a reference range. Theoretically the "full range" would be zero to infinity, but we cannot actually use that, as neither the pool math nor the analytical math formula can handle zeroes or infinities. For the ETH price, the all-time recorded low was around 43 cents, and the all-time recorded high was over $4,800. So a good "reference range" would be $0.50 to ~10x the ATH, or $50,000. This gives a full range ratio of 50,000 / 0.5 = 100,000. The ratio of this reference range to a smaller concentrated range (in log space) provides a way to quantify the degree of concentration.

$concentration = \frac{ln(ReferenceRangeRatio)}{ln(ConcentratedRangeRatio)}$
​
Restricting the range to $1,000 - $4,000, we have:

$concentration = \frac{ln(100,000)}{ln(4,000/1,000)}$ ~ 8.3x

![Concentrated liquidity illustration](/images/eth-concentrated.gif)

Of course, these benefits come at a cost. If the price moves outside the defined range, LPs allocated to that range stop earning fees. That might mean all of them or only a subset, depending on how concentrated liquidity is implemented on a particular protocol. For pools with a single defined range shared by all LPs, trading through that pool might be halted.

For example, say an LP opens a position in the pool described above when ETH is trading at $2,000, using 50/50 ETH/USDC. If the ETH price dropped below the lower bound of the range (say, to $1,200), that LP's position would be 100% ETH - which was "bought high" between $1,500 and $2,000. Conversely, if the ETH price rose to $3,000, an LP liquidating that position would get 100% USDC - which was "sold low" between $2,000 and $2,500.

![Range trading fees illustration](/images/liquidity-range-fees.gif)

The concentrated liquidity approach improves capital efficiency (more fees for less capital), and lets pool designers (and in some cases the LPs themselves) tailor their strategies. But it also introduces the need for active position management - particularly with volatile assets or narrow price ranges. In some protocols, LPs can adjust their positions directly. In others, they might need to migrate between pools.

AMM design generally - and concentrated liquidity implementation in particular - is a hot topic in DeFi, and has inspired much innovation. The following sections trace the part of that history most relevant to the development of "fungible" concentrated liquidity solutions on Balancer.

## Non-fungible (NFT-based) Concentrated Liquidity

### Rise of the Unicorn

There are two main approaches to implementing concentrated liquidity. The first was pioneered by Uniswap v3 in 2021. This is the most flexible approach in some ways, and certainly allows the most granular control over liquidity. With this approach, each LP individually decides the price range over which they would like to provide liquidity, and receives an NFT token with these configuration details. LPs can adjust their positions over time to stay "in range" and continue earning fees. Since most pools are supplied by many LPs with diverse price ranges, they retain some liquidity even during large price swings in volatile markets.

Of course, there is a natural trade-off here between potential revenue and position maintenance. The narrower the price range, the higher the fees. However, a narrow range also means the price is more likely to move beyond it, requiring more frequent position adjustments. Otherwise, frequent "no fee" periods could make the position underperform those with wider ranges.

Uniswap uses a "tick" system to manage the granularity of liquidity provision. To ensure smooth pool operation (and well-behaved math), user-defined price ranges cannot be arbitrarily narrow. A tick corresponds to one "basis point" (i.e., a price range where the difference between the bounds is 0.01%). These are like the distance marks along the bottom of a swimming pool. Continuing the analogy from above, the liquidity "dividers" can only be placed on those marks.

Uniswap pools also have discrete fees, and to keep fee allocation fairly uniform, higher fees mean wider tick spacing. At the lowest fee tier (0.01%), a tick simply equals one basis point, and liquidity can be provided at that level of granularity. At the highest tier (1%), the resolution is 100 basis points.

![Non-fungible CL illustration](/images/cl-illustration.png)

Though we at Balancer, noting the importance and prominence of concentrated liquidity in Defi, (very) briefly considered trying to support this sort of liquidity in the v3 Vault, we quickly realized that this was incompatible with our long-term goals. Balancer is optimized for fungibility, with a focus on native support for yield-bearing tokens and "long-tail" liquidity, so we stayed in our swim lane — between the ticks, as it were. In the NFT-based concentrated liquidity space, the Unicorn stands alone.

## Fungible (LP-token-based) Concentrated Liquidity

### Concentrated Liquidity on Balancer - Gyroscope Pools

[Gyro pools](../explore-available-balancer-pools/gyroscope-pool/README.md) take a different approach to concentrated liquidity. First, it is “fungible." Instead of NFTs, users receive regular AMM LP tokens. This makes positions composable, and plays well with the rest of Balancer and other AMMs. It is a sort of specialization of Uniswap v3, which gives up the generality and precision of the tick system in exchange for a simpler pool architecture.

2-CLP pools are a bit like a Uniswap v3 pool where everyone added liquidity in exactly the same range (and couldn’t update it). Since the alpha and beta parameters cannot be changed after deployment, there is no position management within pools; users wishing to reallocate must withdraw from one pool and deposit to another in a different range. Accordingly, the price ranges tend to be somewhat wider and require less frequent attention, in exchange for somewhat lower (but still significant) benefits of concentration.

E-CLPs are likewise efficient liquidity concentrators, so named because their price curve is an ellipse, technically formed by transforming a “constant circle” with stretch (lambda), rotation (phi), and displacement (alpha, beta) parameters. Like 2-CLPS, these parameters are fixed on deployment.

Used for stable assets (such as Gyroscope’s own GYD), they “stretch” the flat part of the curve around a price peg, but not necessarily symmetrically. This allows very precise control or “focus” around the target price.

When using with yield-bearing assets and rate providers, the precision can be increased even further, helping mitigate LVR (loss vs. rebalancing), and automating liquidity management. Performance can be further enhanced with “re-hype” E-CLPS (using auto-rehypothecation - basically, depositing underlying assets supplied to E-CLPs on lending markets). The latest versions allow shifting some parameters, so that they are no longer fixed per pool. See details [here](https://docs.gyro.finance/pools/rehype-e-clps).

![Non-fungible CL illustration](/images/rehype.png)

### Readjusting Concentrated Liquidity AMM (ReClamm) Pools

[Reclamm Pools](../explore-available-balancer-pools/reclamm-pool/reclamm-pool.md) are the next logical step. To summarize the discussion above:

Uniswap pools offer highly granular concentrated liquidity positions, but they are non-fungible and must be actively managed by the LP. There is a direct trade-off between capital efficiency and ease of management.

Gyro pools offer fungible concentrated liquidity over moderate ranges, but the parameters are fixed, so management of volatile assets may involve liquidity migration.

ReClamm pools offer fungible concentrated liquidity similar to 2-CLPs - but as the name implies, the parameters are not fixed. Essentially, the pools manage the liquidity on behalf of the LPs, with no user intervention required.

Triggered by swaps or liquidity operations, the pool can adjust the price range automatically to keep itself “in range” (i.e., maintain the price within the liquidity bounds), whichever way the market moves. The pool creator can set the initial price range, as well as the margin - the “sensitivity” of the pool - which determines how quickly the pool responds to market price changes.

Generally, the higher the volatility, the lower the margin, which makes the pool less sensitive to price changes and more gas-efficient. (If necessary, these can even be changed after deployment - but only slowly, to prevent manipulation.)

The field is always advancing. There are now "ALMs" (automated liquidity managers), third party services that can relieve users of position maintenance. For instance, Arrakis Pro works on Uniswap V3 and V4, but has much broader application. The focused goal of ReClamm pools is to remove the burden of active user management, without sacrificing capital efficiency: a true "fire-and-forget" concentrated liquidity position native to Balancer. And in contrast to some "strategy" solutions, it is completely transparent.