---
order: 7
title: reCLAMM Pool Math
---

# Readjusting Concentrated Liquidity AMM Pool Math

## Intro

The `Readjusting Concentrated Liquidity AMM` (reCLAMM) is a pool based on a "constant product," essentially equivalent to standard weighted math (with a clever redefinition of the token balances). The idea is to concentrate liquidity by adding price bounds to the constant product curve using virtual balances: $L = (R_a + V_a)(R_b + V_b)$, where $R_a$ and $R_b$ are the real balances of the token, and $V_a$ and $V_b$ are the virtual balances of the token.

Currently, in fungible concentrated liquidity pools with fixed price intervals, LPs may need to actively migrate liquidity between CL pools to avoid losing fee revenue to pools that have gone out of range. The `Readjusting CL AMM` is a pool that automatically readjusts the price interval, so that a retail LP can confidently deposit assets and rely on the pool to manage them efficiently and profitably.

## Concepts

### Virtual Balances

Virtual Balances can be understood as offsets to the real token balances, so that the balances of the pool are never lower than the virtual balance. (`balance = real balance + virtual balance`)

Therefore, even if the real balance of a token goes to zero, the virtual balance will keep the token balance (and therefore price) above zero. In practice, it restricts the token price between two bounds, defined by the virtual balances of each token. The image below illustrates a constant product price curve with hard price limits, "soft" margins (described later - basically the threshold where the pool will begin self-adjusting), and the "target" price, usually close to the middle of the range.

![reCLAMM price curve illustration](/images/reclamm-initial-state.png)

### Initial Virtual Balances

During pool creation, the pool creator will define the `minimum price` ($P_{a_{min}}$) and the `maximum price` ($P_{a_{max}}$). Given these three parameters, we can calculate the initial virtual balances.

The invariant of a reCLAMM Pool is calculated as follows:

$L = (R_a + V_a)(R_b + V_b)$

Where $R_a$ and $R_b$ are the real balances, $V_a$ and $V_b$ are the virtual balances, and $L$ is the invariant. The current price of the pool is given by:

$P_a = \frac{R_b + V_b}{R_a + V_a}$

Note that we have (arbitrarily) defined it as B/A (i.e., prices represent the value of token A denominated in token B. In other words, how many B tokens equal the value of one A token.)

Given the price formula, we know that the minimum price happens when the denominator takes on its maximum value: $R_a = R_{a_{max}}$. In this state, $R_b = 0$. (At the edges, one of the balances will be maximum, and the other balance will be 0). Before the initialization of the pool the "maximum" balance is not known - so, to calculate the initial balances of the pool, we set the maximum balance of token A to an arbitrary value, and then we can scale accordingly when the initialization amounts are known:

$P_{a_{min}} = \frac{V_b}{R_{a_{max}} + V_a}, P_{a_{max}} = \frac{R_{b_{max}} + V_b}{V_a}$

Since the invariant is constant, we can deduce that the invariant formulas in these two edge points are, respectively:

$L = (R_{a_{max}} + V_a)(V_b)$

$L = (V_a)(R_{b_{max}} + V_b)$

One last concept important to calculate the initial virtual balances is the price ratio, defined in the next section. Since $Q_0^2 = \frac{P_{a_{max}}}{P_{a_{min}}}$, substituting the max and min price formulas, we have:

$Q_0^2 = \frac{(R_{a_{max}} + V_a)(R_{b_{max}} + V_b)}{V_aV_b}$

Using the two invariant formulas for the edges, we have

$Q_0^2 = \frac{\frac{L}{V_b}\frac{L}{Va}}{V_aV_b} = \frac{L^2}{V_a^2V_b^2}$

Now we have a way to calculate the invariant based on the virtual balances. Since $Q_0^2 = \frac{P_{a_{max}}}{P_{a_{min}}}$, 

$L = V_aV_b\sqrt{\frac{P_{a_{max}}}{P_{a_{min}}}}$

Now we need a way to use these prices to calculate $V_a$ and $V_b$. Since the virtual balances are proportional to the real balances, we will randomly choose a $R_{a_{max}} = R_{a_{max}}'$, which will allow us to calculate $V_a'$ and $V_b'$. When the pool is initialized we can find $V_a$ and $V_b$ by multiplying the $V_a'$ and $V_b'$ by the rate $\frac{R_{a_{max}}}{R_{a_{max}}'}$, where $R_{a_{max}}$ is calculated based on the initialization balances.

So, using the invariant $L = (R_{a_{max}}' + V_a')(V_b')$, we have that

$(R_{a_{max}}' + V_a')(V_b') = V_a'V_b'\sqrt{\frac{P_{a_{max}}}{P_{a_{min}}}}$

$V_b'$ cancels out, so we can isolate $V_a'$:

$V_a' = \frac{R_{a_{max}}'}{\sqrt{\frac{P_{a_{max}}}{P_{a_{min}}}} - 1}$

Using the $P_{a_{min}}$ formula, we have:

$V_b' = (R_{a_{max}}' + V_a')(P_{a_{min}})$

### Initial Real Balances

Now we need to find the balances $R_a'$ and $R_b'$ corresponding to the desired `target price` ($P_{a_{target}}$), which was also given by the user when the pool was created. These values will be used to inform the initializer of the pool of the correct token proportion required to initialize the pool at the given target price.

To calculate it, let's use $P_{a_{target}} = \frac{R_b' + V_b'}{R_a' + V_a'}$ , $L = (R_a' + V_a')(R_b' + V_b')$ and $Q_0 = \frac{L}{V_a'V_b'}$.

Using the invariant formula in $P_{a_{target}}$, we have that $P_{a_{target}} = \frac{(R_b' + V_b')^2}{L}$.

Since $L = Q_0V_a'V_b'$, $P_{a_{target}} = \frac{(R_b' + V_b')^2}{Q_0V_a'V_b'}$, which leads to

$R_b' = \sqrt{P_{a_{target}}Q_0V_a'V_b'} - V_b'$

Then, isolating $R_a'$ in the $P_{a_{target}}$ formula, we have

$R_a' = \frac{R_b' + V_b' - V_a'P_{target}}{P_{target}}$

### Balance Ratio

As noted above, the Balance Ratio is the proportion of token B in relation to token A that must be used to initialize the pool, so that the target price is respected.

$balanceRatio = \frac{R_b'}{R_a'}$

### Initialization

Finally, when initializing, we need to scale $V_a'$ and $V_b'$ to the initial balances of the pool. The scale is $\frac{R_a}{R_a'}$ (which is the same rate as $\frac{R_{a_{max}}}{R_{a_{max}}'}$). So

$V_a = \frac{R_aV_a'}{R_a'}, V_b = \frac{R_aV_b'}{R_a'}$

## Price Ratio ($Q_0^2$)

The Price Ratio is the ratio between the high and low price bounds of the range. The current price of token A is defined as $P_A = \frac{R_b + V_b}{R_a + V_a}$.

The highest price of A ($P_{max_A}$) is reached when the real balance of A is 0. So, the price is defined as:

![reCLAMM price equation](/images/reclamm-price-equation.png)

The Price Ratio is calculated as $Q_0^2 = \frac{P_{max_A}}{P_{min_A}}$.

For example, let's say the pool has virtual balances of 1000 of each token. Also, let's assume that when the real balance of token A is 0, token B is 1000 ($R_{max_{B}}$), and vice versa.

In the example, $P_{max_{A}} = \frac{1000 + 1000}{1000} = 2$ and $P_{min_{A}} = \frac{1000}{1000 + 1000} = 0.5$, so $Q_0^2 = \frac{2}{0.5} = 4$.

### Price Ratio Update

The Price Ratio can be updated by a pool manager. This update is gradual, analogous to updating the amplification factor of a Stable Pool. The pool manager defines a start and end time and a target $Q_{0_{target}}$, and then $Q_{0_{new}}$ is calculated as an interpolation between the initial and final values, $Q_{0_{initial}}$ and $Q_{0_{target}}$.

$\sqrt{Q_{0_{new}}} = \sqrt{Q_{0_{initial}}}(\frac{\sqrt{Q_{0_{target}}}}{\sqrt{Q_{0_{initial}}}})^{\frac{blockTimestamp - startQ0Time}{endQ0Time - startQ0Time}}$

## Pool Centeredness

As noted above, the main idea of this pool is to manage the price interval such that the market price stays within it as much as possible. The pool won't use an external oracle, so we need a mechanism to determine whether the market price is within the current price interval: `Pool Centeredness`.

`Pool Centeredness` is a number (a percentage) that describes how far the pool balances are from the center of the current interval. The number goes from 0 to 1, where 0 means that the balances are at the edge and 1 means that the balances are exactly in the middle of the current price range, which is the case when the pool is initialized. The number is calculated as follows:

1. First, if $R_a$ or $R_b$ are 0, we know that pool centeredness is 0.
2. If not, we calculate $\frac{R_a}{R_b}$ and compare with $\frac{V_a}{V_b}$. Since the virtual balances were calculated based on the real balances, these rates are the same near the center of the interval.
    1. If $\frac{R_a}{R_b} < \frac{V_a}{V_b}$, $centeredness = \frac{\frac{R_a}{R_b}}{\frac{V_a}{V_b}}=\frac{R_a V_b}{R_b V_a}$
    
    2. Otherwise, $centeredness = \frac{\frac{R_b}{R_a}}{\frac{V_b}{V_a}}=\frac{R_b V_a}{R_a V_b}$

## Pool Centeredness Margin

We could wait for the centeredness to be zero before moving the price interval, but that means we would wait for one of the real balances to be zero, which in practice means no exposure to one of the assets of the pool, and lost trade opportunities. The balance doesn't have to literally go to zero for the pool to get "stuck"; there could also be a dust balance worth less than the gas required to arb it. To avoid this situation, we introduce the concept of Centeredness Margin (see the image above used to illustrate the concept of virtual balances).

Margin is a number (also a percentage) from 0 to 1, very similar to pool centeredness, and helps calculate whether the pool is `IN RANGE` (Pool Centeredness > Margin) or `OUT OF RANGE` (Pool Centeredness ≤ Margin). If the pool is `OUT OF RANGE` , the price interval will be recalculated (which, in practice, means that we will recalculate the virtual balances).

## Daily Price Shift Exponent

The `Daily Price Shift Exponent` is a percentage that defines the speed at which the virtual balances will change per day. A value of 100% (i.e, FP 1) means that the min and max prices will double (or halve) every day, until the pool price is within the range defined by the margin. We use the following formula to calculate the current virtual balance of a token:

$V_{next} = V_{current}(1 - \tau)^{n + 1}$

where $\tau$ is a time constant, defined as $\tau = \frac{PriceShiftDailyRate}x$. If we want $V_{next} = 2V_{current}$ in the following day, `DailyPriceShiftExponent = 100%`, so we can easily find $x$ as 124649.35015039.

Therefore, $\tau = \frac{PriceShiftDailyRate}{124649.35015039}$.

Using $\tau$ and the seconds passed since the last swap ($n$) we can calculate the target virtual balances:

1. If the current price is closer to $P_{min_A}$ ($\frac{R_a}{R_b} >= \frac{V_a}{V_b}$):
    
    $V_{b_{next}} = V_{b_{current}}(1 - \tau)^{n + 1}$
    
    $V_{a_{next}} = R_a \frac{V_{b_{next}} + R_b}{V_{b_{next}}(Q_0-1) - R_b}$
    
2. In the current price is closer to $P_{max_A}$ ($\frac{R_a}{R_b} < \frac{V_a}{V_b}$):
    
    $V_{a_{next}} = V_{a_{current}}(1 - \tau)^{n + 1}$
    
    $V_{b_{next}} = R_b \frac{V_{a_{next}} + R_a}{V_{a_{next}}(Q_0-1) - R_a}$
    
In the code, we store $1 - \tau$ for convenient, and refer to it as the `dailyPriceShiftBase`, as it is the base of the exponential function used to update the virtual balances.

If there are no swaps that bring the pool back into range, we need an additional guardrail to prevent the range from shifting “past” the center point. We do this by imposing a minimum value on the “overvalued” token (i.e., the one with the lower balance: `o` = `b` in case 1 above, and `a` in case 2), given by the virtual balance when centeredness = 1:

    $V_{o_{min}} = \frac{R_{o}}{\sqrt Q_0-1)}$

## Price Interval Update

Given the new price ratio ($Q_{0_{new}}$), we can calculate the new virtual balances. There are several ways to do this, and we decided to update it keeping the pool centeredness constant. That's because, if pool centeredness is not constant, an update in the price ratio can take the pool from an `IN RANGE`state to an `OUT OF RANGE` state without a user action, so it can introduce inconsistencies when moving the price interval to follow the market price.

To keep the pool centeredness constant, we need to calculate the new virtual balances based on the following (we are using the centeredness if $\frac{R_a}{R_b} < \frac{V_a}{V_b}$, but a similar derivation applies to the other case):

$centeredness = \frac{R_aV_b}{R_bV_a}$

$Q_0 = \frac{P_{a_{max}}}{P_{a_{min}}} = \frac{L}{V_aV_b} = \frac{(R_a + V_a)(R_b + V_b)}{V_aV_b}$

Since we have $R_a$, $R_b$, $Q_{0_{new}}$ and $centeredness$, we can calculate $V_a$ and $V_b$.

1. Isolate $V_a$ in the $Q_0$ formula: $V_a = \frac{R_a(R_b + V_b)}{V_bQ_{0_{new}} - R_b - V_b}$
2. Isolate $V_b$ in the centeredness formula: $V_b = \frac{R_bV_acenteredness}{R_a}$ (if $\frac{R_a}{R_b} > \frac{V_a}{V_b}$, `centeredness` goes in the denominator)
3. Replace $V_a$ formula in the $V_b$ formula, and the result will be:

$V_b^2 (Q_{0_{new}} - 1) - V_b (R_b(1 + centeredness)) - R_b^2centeredness = 0$

4. Resolve the formula above with Bhaskara to find the value of $V_b$, then replace the value of $V_b$ in the $V_a$ formula.

## Calculation of the Virtual Balances

### When initializing the pool

During pool creation, pass minimum and maximum prices of A ($P_{a_{min}}$ and $P_{a_{max}}$), target price $P_{target}$. The contract also needs to assume an arbitrary $R_{a_{max}}'$, which we suggest should be `1000 * FixedPoint.ONE`.

This allows the pool, during creation, to calculate the virtual balances as:

$V_{a}' = \frac{R_{a_{max}}'}{Q_0 - 1}$

$V_b' = P_{a_{min}}(R_{a_{max}}' + V_a')$

Note, in the equation above, that $Q_0 = \sqrt\frac{P_{a_{max}}}{P_{a_{min}}}$. Also, note that $V_a'$ and $V_b'$ are scaled according to $R_{a_{max}}'$. During the pool initialization, these parameters will be scaled according to the real balances.

Calculate the theoretical balances $R_a'$ and $R_b'$ for the default $R_{a_{max}}'$.

$R_b' = \sqrt{P_{target}V_b'V_a'Q_0} - V_b'$

$R_a' = \frac{R_b' + V_b' - V_a'P_{target}}{P_{target}}$

Calculate the pool centeredness using the parameters above, and check if the pool centeredness is above the margin. If not, reverts.

### Balance Ratio Getter

Between pool creation and initialization, the user must be able to calculate the correct token proportions (i.e., the Balance Ratio) needed to ensure the target price is respected. This balance ratio is given by: $\frac{R_b'}{R_a'}$.

### Pool initialization

To initialize the pool, we receive the real balances $R_a$ and $R_b$, and need to validate that
 $\frac{R_b}{R_a}==\frac{R_b'}{R_a'}$, with some margin of error (0.01%).

If this is false, revert. Otherwise, calculate the scale of $V_a$ and $V_b$, which is $scale = \frac{R_a}{R_a'}$. Therefore, $V_a = scaleV_a'$ and $V_b = scaleV_b'$.

Finally, ensure the price is close enough to the target price, and the centeredness is above margin.

### On Swap

When executing onSwap, three steps must be performed:

1. Calculate $Q_{0_{current}}$. If `blockTimestamp > endQ0Time`, return $Q_{0_{target}}$. Else, calculate $Q_{0_{current}}$ based on the formula:
    
    $\sqrt{Q_{0_{current}}} = \sqrt{Q_{0_{initial}}}(\frac{\sqrt{Q_{0_{target}}}}{\sqrt{Q_{0_{initial}}}})^{\frac{blockTimestamp - startQ0Time}{endQ0Time - startQ0Time}}$
    
2. Update the virtual balances as follows, keeping the pool centeredness constant. This won't move the pool `OUT OF RANGE` if there's no swap, which makes off-chain calculations more reliable and optimizes the price interval calculation when the pool is `OUT OF RANGE`.

    a. Calculate the `centerednessFactor` ($C_f$) using the method described in the [Pool Centeredness](#pool-centeredness) section above.
        
    b. Calculate $V_b$. It's a Bhaskara formula (notice that there's no minus sign, to avoid issues with unsigned math):
        - $a = Q_{0_{current}} - 1$
        - $b = R_b(1 + C_f)$
        - $c = R_b^2C_f$
        - $V_{b_{new}} = \frac{b + \sqrt{b^2 + 4ac}}{2a}$
    
    c. Calculate $V_a=\frac{R_aV_{b_{new}}}{R_b * C_f}$. Notice that $C = \frac{R_aV_{b_{old}}}{R_bV_{a_{old}}}$, so the $V_{a_{new}}$ equation can be simplified to $V_{a_{new}} = \frac{V_{a_{old}}V_{b_{new}}}{V_{b_{old}}}$. This simplification is useful, since it allows $V_{a_{new}}$ to be calculated with $R_a = 0$ or $R_b = 0$.

3. Check whether the pool is `OUT OF RANGE`

    If so, update the virtual balances using the formulas from the [Daily Price Shift Exponent](#daily-price-shift-exponent) section above. If the virtual balances were updated due to Q0 updating, use the new virtual balances.

**IMPORTANT:** Notice that Virtual Balances are not recalculated on every swap. This is because rounding issues in the calculation of virtual balances may lead to inconsistencies with the pool invariant and return more tokens to the user, potentially draining the pool.

Since we do not update the virtual balances on swaps, fee collection causes the invariant to grow slowly as the virtual balances remain constant. This slowly increases the price ratio, which has the effect of de-concentrating liquidity. Note that under these conditions, the price ratio will slowly diverge from what was set by the admin. If this is undesirable, the admin can always reset it to the original value, and it will slowly reconcentrate liquidity to the original range.

### On Add/Remove Liquidity

When adding or removing liquidity (which can only be done proportionally), we need to increase the virtual balances in the same proportion that we increased the real balances. That will ensure that the token prices don't change.

In the `onBefore[Add|Remove]Liquidity` hooks, calculate the proportion as follows:

$proportion = \frac{bpt[Out|In]}{totalSupply}$

Use `bptOut` when adding liquidity, and `bptIn` when removing it.

Finally, scale virtual balances A and B by this proportion ($V_{new} = V_{old} * (1 ± proportion)$)

# Calculation of Swap Result

In the equations below, we will replace `Token A` and `Token B` by `Token In`  and `Token Out` .

So, the invariant can be described as

$$
L = (R_i + V_i)(R_o + V_o)
$$

When a swap occurs, the invariant $L$ is constant, so

$$
L= (R_i + V_i + amountIn)(R_o + V_o - amountOut)
$$

Isolating amountIn and amountOut in the equation above is a prerequisite for calculating the swap result. Notice that all swaps are calculated after the virtual balances are updated (when the price ratio is changing or the pool is out of range). 

## Exact In

$$
(R_i + V_i)(R_o + V_o) = (R_i + V_i + amountIn)(R_o + V_o - amountOut)
$$

So, isolating `amountOut` we have:

$$
amountOut = (R_o + V_o) - \frac{(R_i + V_i)(R_o + V_o)}{R_i + V_i + amountIn}
$$

We can use the same denominator on the right:

$$
amountOut = \frac{(R_o + V_o)(R_i + V_i + amountIn) - (R_i + V_i)(R_o + V_o)}{R_i + V_i + amountIn}
$$

Now, if we expand the multiplications, we have:

$$
amountOut = \frac{R_oR_i + R_oV_i + R_oamountIn + V_oR_i + V_oV_i + V_oamountIn - R_oR_i - R_oV_i - V_oR_i - V_oV_i}{R_i + V_i + amountIn}
$$

All terms except those involving amountIn cancel out, so the final equation is:

$$
amountOut = \frac{(R_o + V_o)amountIn}{R_i + V_i + amountIn}
$$

## Exact Out

$$
(R_i + V_i)(R_o + V_o) = (R_i + V_i + amountIn)(R_o + V_o - amountOut)
$$

So, isolating `amountIn` we have:

$$
amountIn = \frac{(R_i + V_i)(R_o + V_o)}{R_o + V_o - amountOut} - (R_i + V_i)
$$

We can use the same denominator on the right:

$$
amountIn = \frac{(R_i + V_i)(R_o + V_o) - (R_i + V_i)(R_o + V_o - amountOut)}{R_o + V_o - amountOut}
$$

Now, if we expand the multiplications, we have:

$$
amountIn = \frac{R_oR_i + R_oV_i  + V_oR_i + V_oV_i - R_oR_i - R_oV_i + R_iamountOut - V_oR_i - V_oV_i + V_iamountOut}{R_o + V_o - amountOut}
$$

All terms except those involving amountOut cancel out, so the final equation is:

$$
amountIn = \frac{(R_i + V_i)amountOut}{R_o + V_o - amountOut}
$$
