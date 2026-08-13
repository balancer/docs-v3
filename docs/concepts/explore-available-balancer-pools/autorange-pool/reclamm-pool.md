---
order: 6
title: AutoRange Pool
---

# AutoRange Pools

## Overview

AutoRange Pools are **fungible concentrated liquidity pools** that focus liquidity within a predefined price range, allowing LPs to earn greater fees with less capital, especially when the market price remains within that range. This concentration is initialized with a **target price** and **range bounds**, enabling the pool to deliver capital efficiency over traditional constant-product models.

What sets AutoRange Pools apart is their **adaptive nature**. As trading activity or liquidity operations shift the market price, AutoRange Pools are able to **automatically move** their price range, up or down the price curve, without any intervention from users or governance. This "re-centering" behavior activates only when the pool becomes sufficiently unbalanced, based on a margin threshold defined at deployment. Once triggered, the pool begins gradually shifting its range in the direction of market pressure, ensuring liquidity stays useful and active.
To enable this adaptive behavior, AutoRange Pools are configured with a few key parameters:

- A **target price**, often set near the current market price at deployment.
- A **price range**, where all the pool's liquidity is initially concentrated.
- A **margin**, expressed as a percentage, defining how much imbalance is tolerated before the range begins shifting.
- A **daily shift exponent**, which controls how quickly the pool adjusts its range when out of balance.

For example, if the margin is set at 20%, the pool tolerates up to a 60/40 imbalance (a deviation of 10% in either direction from a 50/50 balance). Once this threshold is crossed, the pool begins migrating its range incrementally over time, following the market.

This design offers LPs the benefit of concentrated liquidity **without the need for manual range resets**. It suits passive LPs seeking to stay aligned with market trends while still capturing the fee benefits of a tighter range.

Those familiar with other concentrated liquidity designs may notice echoes of similar mechanisms, like pools that start with fixed ranges around a target price, but unlike those, an AutoRange Pool's range is not locked. Instead, it evolves in response to the market, maintaining efficiency over time without additional user action.

The following diagram shows a pool that is `OUT OF RANGE`. The current price is within the price range (as it must be), but above the margin. In this state, the pool will be shifting the price range "up" toward higher prices, following the market, and attempting to bring the market price back inside the margins.

![AutoRange pool out of range](/images/PoolRange.png)

::: info
AutoRange Pools are always two-token pools.

- The minimum swap fee percentage is 0.001% (note - same as the Weighted Pool)
- The maximum swap fee is 10%
- The invariant bounds are unused in this pool, as liquidity can only be added or removed proportionally
- The initialization and other parameters are described in detail below
  :::

Note that the swap fee and invariant limits are defined in `ReClammPool` through implementing the `ISwapFeePercentageBounds` and `IUnbalancedLiquidityInvariantRatioBounds` interfaces, which are included in `IBasePool`.

See [here](../../../integration-guides/aggregators/pool-maths-and-details.md) for a more detailed reference.

## Advantages of AutoRange Pools

- All the benefits of concentrated liquidity: higher fees and better capital efficiency (when in range, same math as UniV3)
- None of the maintenance required with traditional concentrated liquidity pools: LP-and-forget
- Moreover, unlike with third-party ALMs, the price range adjustment is entirely transparent
- Fungible positions can be incentivized, making them ideal for guaranteeing deep DAO token liquidity
- Calculations simplified by having all LPs share the same price range
- AutoRange Pools automatically adjust to market conditions; LPs should always be earning fees
- While designed to be maintenance-free, AutoRange Pools are tunable by admins if necessary in extreme conditions

These are designed for maintaining deep liquidity, and should not be used for token launches, or with tokens that have low liquidity or otherwise manipulable prices (e.g., using direct collateral or relying on non-aggregated on-chain oracles).

## Price range mechanism

One fundamental thing to understand is how the price range is defined and enforced in the first place, given that the price curve is essentially "weighted math" (constant product), and the price is normally determined by the token balances, which are unconstrained (beyond needing to be greater than 0).

The answer is the introduction of "offsets" to the real balances called "virtual" balances, such that the token balances used to calculate the invariant are redefined as the sum of the real and virtual balances. These virtual balances fix the price curve on both ends, cutting off the long tail and ensuring non-zero minimum and maximum prices, even as the real balances approach zero. (This mechanism is shared by Gyro pools, but the terminology here is very slightly different.)

Higher virtual balances (relative to the real balances) means higher concentration.

## Initialization

What we really need internally is the "ratio" of the minimum and maximum prices, but since calculating this is unintuitive and a lot to ask of integrators, we created an initialization mechanism that takes very simple input: the actual minimum and maximum prices, and a target price. Two additional parameters are required to specify the behavior of the pool after initialization (margin and price shift exponent); those are described below.

One question that arises immediately is: how do we define the price? There are after all _two_ ways to define the price of a 2-token pool: A in terms of B, or B in terms of A. We have chosen to define the prices as B/A; i.e., prices represent the value of token A denominated in token B. In other words, how many B tokens equal the value of one A token. Since Balancer pool tokens must be registered in numerical order, the "direction" of the ratio is deterministic.

When the pool is created from the factory, these initial values are stored immutably; they are only used during initialization.

The initialization process essentially derives the "internal" parameters from the initial user input, and given the real token balances being supplied, checks that the resulting prices match their intended values: otherwise the pool would be vulnerable to losses through arbitrage.

See the link below for the detailed math, but we start with the definition of the invariant:

$L = (R_a + V_a)(R_b + V_b)$

And the price, recalling that it is defined as B/A:

$P_a = \frac{R_b + V_b}{R_a + V_a}$

We know the desired price _ratio_ (max/min), and we see that these values can be derived by setting each real balance to 0. At the edges, one of the balances will be the maximum value, and the other will be 0. The "maximum balance" is really a placeholder needed for intermediate calculations (it will cancel out later), so we can assign it a convenient arbitrary value (e.g., 1000). Given the invariant and these price bounds, we can derive initial values for the virtual balances.

Recall that the total balances (which determine the actual price) are defined as the sum of the real and virtual balances. We know the virtual balances and the target price, so it is now possible to calculate the "theoretical" real balances that would result in the target price.

Given this information, we can calculate the "centeredness" of the pool (defined below). This is a measure of balance. A value of 1 means the pool is perfectly balanced, and 0 means it is at one of the edges of the range. We expect that the target price will be roughly in the middle of the target range, so that the initial centeredness is in the neighborhood of 1: but it does not need to be exact. What it does need to be is above the margin: otherwise, the pool would be out of range immediately. If this happens (i.e., the target price is too close to one of the edges), initialization will fail.

That check is a minimum, not a recommendation. A target price close to one edge of the range can pass it while starting the pool only fractionally above the margin, and a pool in that state is one small price or rate movement away from going out of range. Choose the target price so the pool starts with real headroom above the margin. A target near the geometric center of the range starts at a centeredness close to 1, which is generally the best choice.

The next step is to "scale" the virtual balances. This is basically the inverse of the operation above that calculated the theoretical virtual balances from arbitrary real balances. Now that we know the real token balances the initializer intends to deposit, we can use the ratios determined above to calculate the actual initial virtual balances.

Finally, we validate that the ratio of the real balances corresponds to the theoretical ratio arising from the initial inputs, and that the actual price after initialization closely matches the initial target price. These values might not match exactly, due to rounding or precision errors, so there is a built-in tolerance of 0.01%. If any of these validations fail, initialization reverts, insuring the user against configuration errors.

We provide a helper function, `computeInitialBalancesRaw`, to assist with these calculations. Given the actual intended deposit amount of one of the tokens - and the initial parameters set on deployment - the contract can calculate how much of the other token must be supplied to pass all the initialization checks.

One final twist involves the handling of wrapped tokens with rate providers, which are expected to be commonly used in AutoRange Pools. Recall that the prices are passed in during initialization - but how were they calculated? It's possible the pool creator wants to use the direct price of the wrapped token (e.g., for non-boosted pools with tokens like wstETH). In this case, the price does not include the rate provider, even though the token has one. In other cases (e.g., boosted pools with tokens like waUSDC), the creator might want to use the price of the underlying token instead. In that case, the price does incorporate the rate, and the initialization calculation must accommodate that. Accordingly, along with the price range and target values, the pool is deployed with flags indicating whether to use the rate provider for each token during initialization.

## Rate providers after initialization

The rate enters the pool's math once, at initialization, where it is built into the starting virtual balances. It is not re-applied afterwards. The Vault continues to rate-scale the pool's real balances on every operation, but the virtual balances stay in the frame they were set in. As a rate rises, the pool's quoted price therefore drifts away from the true underlying price, and arbitrage collects the difference from liquidity providers.

For a normal yield-bearing token this is a measured and negligible effect: a few parts per million of the yield the pool earns, comfortably covered by the minimum swap fee. It is not a reason to avoid these pools. The one lasting consequence is cosmetic rather than a risk to funds: over multi-year horizons the configured price range slides slightly in underlying terms as the rate compounds.

What matters is how fast the rate moves, not how large it is. A rate that changes quickly, moves in both directions, or can be moved by an outside party is the unsuitable case, because the size of the drift between arbitrage opportunities is what sets the loss. Three practical consequences:

- Prefer tokens whose rate accrues slowly and monotonically. Avoid rates that are volatile, that can jump, or that a third party can influence directly.
- Check what it would cost someone to move the rate, against what the pool holds of that token. An ERC4626 wrapper accepts a transfer from anyone, and its assets per share rise in proportion, so its rate is movable at a price. That price scales with everything backing the wrapper while the gain scales with the pool's own balance, which means a pool holding a small share of a deeply backed wrapper is well protected, and a pool holding much of a thinly backed one is not. The ratio, not the absolute size, is what matters.
- Give a pool with a rate provider extra headroom above its centeredness margin. A rate change moves the pool's centeredness without any swap taking place, so a pool sitting just above its margin can be pushed out of range by rate movement alone.

## Centeredness Margin

The centeredness margin is another parameter that must be set on deployment. Unlike the initial target and range, it is not immutable, and can be changed later by admin action.

This is a percentage value in the range of 0 - 90%. A value of 0 would mean there is effectively no margin - real balances can go to 0, and the pool will never readjust. This degenerate case is effectively the same as a Gyro 2-CLP at the full price range: completely insensitive to price movement, until the pool goes out of range and effectively halts. (Technically, AutoRange Pools act like 2-CLPs constructed with the current range whenever they're in range and not updating the price ratio.)

A value of 100% would mean the pool is always "out of range," unless it is _perfectly_ balanced. This is maximal sensitivity to price changes; essentially it would always be shifting the range (and incurring somewhat higher gas costs). Since the margin can only be changed when the pool is in range both before and after, it would be very difficult to lower it from 100%. Mainly for this reason, the maximum was set to 90%. We expect most pools to be configured somewhere in the middle.

![Centeredness margin illustration](/images/centeredness.gif)

Note that the centeredness measure is symmetric around the center point. On initialization, the pool centeredness should be very close to 1. As swaps move the real balances (with constant virtual balances), the centeredness will move up or down the price curve _away_ from 1 and toward the margins (for these examples, we are using margins from 0 to 50%).

When the centeredness falls below 50%, the market price point will be above the upper or below the lower price margin on the curve, heading toward one of the edges of the price range (where one of the real token balances would be 0).

![Centeredness illustration](/images/centeredness-56.png)

## Daily price shift exponent

The daily price shift exponent is the final parameter (specific to AutoRange Pools) that must be set on deployment. Unlike the initial target and range, it is not immutable, and can be changed later by admin action.

This is also a percentage, and it controls the "doubling rate" of the price shift. The rate is non-linear: the exponent is the power of two applied per day, so an exponent of 100% corresponds to 2^1, or doubling in a day, and 50% corresponds to 2^0.5, or about 1.41x per day.

**The maximum permitted value is 50%**, so the fastest a pool can be configured to shift is roughly 1.41x per day. Values above 50% are rejected at deployment with `DailyPriceShiftExponentTooHigh`. The 100% figure is the calibration reference the formula is built around, not a settable value.

Note also that 2^(`dailyPriceShiftExponent`) per day is the rate when the out-of-range side of the pool holds no real balance. When it holds some, both virtual balances move during the shift and the price range moves faster than the exponent alone suggests. Treat the exponent as a calibration of the underlying decay rather than as a promise about how fast the price range will move in any given state.

A higher exponent increases the pool's exposure to a trader pushing the pool out of range and unwinding against the shifted range, so it should be paired with a higher swap fee. As a guideline, keep the swap fee at or above `0.001% * (exponent / 5%)`: an exponent of 5% is safe at the 0.001% minimum fee, and the maximum 50% exponent should be configured with a fee of at least 0.01%.

Note that the math prevents the price from "overshooting" in either direction due to inactivity (i.e., shifting past the center point, where centeredness equals 1, if there is an extended period with no swaps).

## Admin actions

AutoRange Pool admins can do three things: 1) change the centeredness margin (the threshold for updates); 2) change the daily price shift exponent (the speed of updates); and 3) initiate an update to the price interval (i.e., the distance, or ratio, between the minimum and maximum price bounds), or simply stop an ongoing update. All of these changes will update the virtual balances (and potentially slightly change the price).

All of these functions require the pool to be initialized.

To prevent manipulation, changing the margin also requires the Vault to be locked (i.e., not in the middle of a transaction, which could transiently set balances to arbitrary values), and the pool to be "in range" both before and after. It is not possible to "move the goal posts" by admin action in such a way as to make the pool start or stop an update.

Similarly, the daily price shift exponent can only be changed when the Vault is locked. As it is only altering the speed of the update, it does not check for centeredness. As described above, the price shift exponent is capped at 50%, corresponding to a shift of about 1.41x per day.

Admins can also change the price ratio, supplying the new ratio and a start and end time. There is a minimum duration for the update (1 day), and a minimum amount of ratio change: 1e6 wei. (This is loosely analogous to Uniswap's "tick" resolution limit, introduced for similar reasons.)

These are "best effort" checks to keep the pool well-behaved, but are not hard guarantees. There is also a way to simply stop an ongoing update, which will fix the price ratio at its current value. Note that it is not necessary to stop an ongoing update before starting a new one. Starting an update while one is ongoing is equivalent to stopping and immediately restarting with the new parameters.

Note that it is possible for the price range to be both shifting up or down and expanding or contracting at the same time. Gas costs will be higher during these operations, compared to "in range" swaps with no ongoing price ratio update.

## Recovery mode is one-way for AutoRange Pools

AutoRange Pools have one important operational restriction that does not apply to most other pool types.

Recovery mode withdrawals go directly through the Vault and bypass all pool hooks. For most pools, this is harmless because the pool does not maintain state that must be updated during a withdrawal. However, AutoRange Pools are not stateless. When liquidity is removed normally, their virtual balances are scaled down along with their real balances. A recovery mode withdrawal bypasses that update, leaving the pool with virtual balances sized for liquidity that is no longer present.

As a result, the pool's quoted price no longer matches its real balances. The size of the mismatch depends on where the pool was within its range when the withdrawal occurred. A pool near the center may move very little, while a pool with centeredness of 0.3 or less can be displaced by more than one-third. Any subsequent swap would therefore execute against an incorrect price, at the expense of the remaining liquidity providers.

**An AutoRange Pool that has processed a recovery mode withdrawal must not be returned to normal, swap-enabled operation.**

Two practical details matter:

 - Recovery mode does not itself disable swaps; pausing does. For other pool types, enabling recovery mode without pausing may be unusual but safe. For an AutoRange Pool, it is not. The pool should never be both unpaused and in recovery mode.
- The dangerous action is restoring swaps by unpausing the pool. That does not necessarily require governance. If the pool was deployed with a pauseManager, that account can pause and unpause it independently. While the pool is paused, recovery mode is permissionless, so the pool can enter recovery mode without action from either governance or the pool admin.

For the same reason, deploying an AutoRange Pool without pausing support is discouraged. Pausing is the mechanism that keeps the pool out of operation after a recovery mode withdrawal. Without it, this restriction cannot be enforced.

## Simulator

A simulator is deployed [here](https://aclamm.web.app/reclamm). You can set the initial parameters manually - or load them from a real deployed AutoRange Pool, then change the settings to see how a real pool would respond (including simulating swaps).

See [this page](./reclamm-pool-math.md) for details of the math.
