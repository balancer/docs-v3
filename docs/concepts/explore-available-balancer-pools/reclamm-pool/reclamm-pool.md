---
order: 6
title: Readjusting Concentrated Liquidity AMM Pool
---
# Readjusting Concentrated Liquidity AMM Pools

## Overview

ReClamm Pools are conceptually similar to [Gyro 2-CLPs](../gyroscope-pool/gyro-2clp.md). They are pools that concentrate liquidity (for all LPs) in a certain price range, so this range is one of the critical initialization parameters. However, unlike Gyro Pools, this price range is not fixed at deployment time. It can "shift" from the initialized values; i.e., move up or down along the constant product price curve, maintaining the same interval, in response to price changes that "unbalance" the pool. This happens automatically, without user or admin intervention, when triggered by the results of swaps or liquidity operations.

The pool is initialized with a price range and target price (= market price at deployment time), which is typically near the center of the range, but doesn't strictly need to be. The pool creator also sets the margin - a symmetrical "distance" from the edges of the price range, expressed as a percentage, which determines how much imbalance is required to trigger the start of a price range adjustment. For instance, a margin of 20% means the pool will react to an imbalance greater than 60/40: 10% on either side. Finally, the pool creator must specify the daily price shift exponent, which determines how fast the price range shifts when triggered.

The following diagram shows a pool that is `OUT OF RANGE`. The current price is within the price range (as it must be), but above the margin. In this state, the pool will be shifting the price range "up" toward higher prices, following the market, and attempting to bring the market price back inside the margins.

![ReClamm out of range](/images/PoolRange.png)

::: info
ReClamm Pools are always two-token pools.

- The minimum swap fee percentage is 0.1% (note - much higher than the Weighted Pool, reflecting the greater number of moving parts, especially those involving exponential functions)
- The maximum swap fee is 10%
- The invariant bounds are unused in this pool, as liquidity can only be added or removed proportionally
- The initialization and other parameters are described in detail below
  :::

Note that the swap fee and invariant limits are defined in `ReclammPool` through implementing the `ISwapFeePercentageBounds` and `IUnbalancedLiquidityInvariantRatioBounds` interfaces, which are included in `IBasePool`.

See [here](../../../integration-guides/aggregators/pool-maths-and-details.md) for a more detailed reference.

## Price range mechanism

One fundamental thing to understand is how the price range is defined and enforced in the first place, given that the price curve is essentially "weighted math" (constant product), and the price is normally determined by the token balances, which are unconstrained (beyond needing to be greater than 0).

The answer is the introduction of "offsets" to the real balances called "virtual" balances, such that the token balances used to calculate the invariant are redefined as the sum of the real and virtual balances. These virtual balances fix the price curve on both ends, cutting off the long tail and ensuring non-zero minimum and maximum prices, even as the real balances approach zero. (This mechanism is shared by Gyro pools, but the terminology here is very slightly different.)

## Initialization

What we really need internally is the "ratio" of the minimum and maximum prices, but since calculating this is unintuitive and a lot to ask of integrators, we created an initialization mechanism that takes very simple input: the actual minimum and maximum prices, and a target price. Two additional parameters are required to specify the behavior of the pool after initialization (margin and price shift exponent); those are described below.

One question that arises immediately is: how do we define the price? There are after all *two* ways to define the price of a 2-token pool: A in terms of B, or B in terms of A. We have chosen to define the prices as B/A; i.e., prices represent the value of token A denominated in token B. In other words, how many B tokens equal the value of one A token. Since Balancer pool tokens must be registered in numerical order, the "direction" of the ratio is deterministic.

When the pool is created from the factory, these initial values are stored immutably; they are only used during initialization.

The initialization process essentially derives the "internal" parameters from the initial user input, and given the real token balances being supplied, checks that the resulting prices match their intended values: otherwise the pool would be vulnerable to losses through arbitrage.

See the link below for the detailed math, but we start with the definition of the invariant:

$L = (R_a + V_a)(R_b + V_b)$

And the price, recalling that it is defined as B/A:

$P_a = \frac{R_b + V_b}{R_a + V_a}$

We know the desired price *ratio* (max/min), and we see that these values can be derived by setting each real balance to 0. At the edges, one of the balances will be the maximum value, and the other will be 0. The "maximum balance" is really a placeholder needed for intermediate calculations (it will cancel out later), so we can assign it a convenient arbitrary value (e.g., 1000). Given the invariant and these price bounds, we can derive initial values for the virtual balances.

Recall that the total balances (which determine the actual price) are defined as the sum of the real and virtual balances. We know the virtual balances and the target price, so it is now possible to calculate the "theoretical" real balances that would result in the target price.

Given this information, we can calculate the "centeredness" of the pool (defined below). This is a measure of balance. A value of 1 means the pool is perfectly balanced, and 0 means it is at one of the edges of the range. We expect that the target price will be roughly in the middle of the target range, so that the initial centeredness is in the neighborhood of 1: but it does not need to be exact. What it does need to be is above the margin: otherwise, the pool would be out of range immediately. If this happens (i.e., the target price is too close to one of the edges), initialization will fail.

The next step is to "scale" the virtual balances. This is basically the inverse of the operation above that calculated the theoretical virtual balances from arbitrary real balances. Now that we know the real token balances the initializer intends to deposit, we can use the ratios determined above to calculate the actual initial virtual balances.

Finally, we validate that the ratio of the real balances corresponds to the theoretical ratio arising from the initial inputs, and that the actual price after initialization closely matches the initial target price. These values might not match exactly, due to rounding or precision errors, so there is a built-in tolerance of 0.01%. If any of these validations fail, initialization reverts, insuring the user against configuration errors.

We provide a helper function, `computeInitialBalances`, to assist with these calculations. Given the actual intended deposit amount of one of the tokens - and the initial parameters set on deployment - the contract can calculate how much of the other token must be supplied to pass all the initialization checks.

## Centeredness Margin

The centeredness margin is another parameter that must be set on deployment. Unlike the initial target and range, it is not immutable, and can be changed later by admin action.

This is a percentage value in the range of 0 - 50%. A value of 0 would mean there is effectively no margin - real balances can go to 0, and the pool will never readjust. (This degenerate case is effectively the same as a Gyro 2-CLP: completely insensitive to price movement, until the pool goes out of range and effectively halts.)

A value of 50% means the pool is always "out of range," unless it is *perfectly* balanced. This is maximal sensitivity to price changes; essentially it would always be shifting the range (and incurring somewhat higher gas costs). We expect most pools to be configured somewhere in the middle.

## Daily price shift exponent

The centeredness margin is the final parameter (relating to ReClamm functionality) that must be set on deployment. Unlike the initial target and range, it is not immutable, and can be changed later by admin action.

This is also a percentage, and it controls the "doubling rate" of the price shift. At 100%, the prices will double (or halve) in one day. This rate is non-linear, and means that the prices will be multiplied (or divided) by 2^(`dailyPriceShiftExponent`) per day. So 200% corresponds to 2^2 or 4x, and 300% corresponds to 2^3 or 8x.

## Admin actions

ReClamm Pool admins can do three things: 1) change the centeredness margin (the threshold for updates); 2) change the daily price shift exponent (the speed of updates); and 3) initiate an update to the price interval (i.e., the distance, or ratio, between the minimum and maximum price bounds), or simply stop an ongoing update. All of these changes will update the virtual balances (and potentially slightly change the price).

All of these functions require the pool to be initialized.

To prevent manipulation, changing the margin also requires the Vault to be locked (i.e., not in the middle of a transaction, which could transiently set balances to arbitrary values), and the pool to be "in range" both before and after. It is not possible to "move the goal posts" by admin action in such a way as to make the pool start or stop an update. Otherwise, it is capped at 50%, as described above.

Similarly, the daily price shift exponent can only be changed when the Vault is locked. As it is only altering the speed of the update, it does not check for centeredness. The price shift exponent is capped at 500% (corresponding to 32x in a day).

Admins can also change the price ratio (actually its fourth root), supplying the new ratio and a start and end time. There is a minimum duration for the update (6 hours), and a minimum amount of ratio change: 1000 wei. (This is loosely analogous to Uniswap's "tick" resolution limit, introduced for similar reasons.)

These are "best effort" checks to keep the pool well-behaved, but are not hard guarantees. There is also a way to simply stop an ongoing update, which will fix the price ratio at its current value. Note that it is not necessary to stop an ongoing update before starting a new one. Starting an update while one is ongoing is equivalent to stopping and immediately restarting with the new parameters.

Note that it is possible for the price range to be both shifting up or down and expanding or contracting at the same time. Gas costs will be higher during these operations, compared to "in range" swaps with no ongoing price ratio update.

## Simulator

A simulator is deployed [here](https://aclamm.web.app/reclamm). You can set the initial parameters manually - or load them from a real deployed ReClamm pool, then change the settings to see how a real pool would respond (including simulating swaps).

See [this page](./reclamm-pool-math.md) for details of the math.
