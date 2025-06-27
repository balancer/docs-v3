---
order: 2
title: Vault Configuration
---

# Vault Constants (defined in code)

## Pool Minimum Total Supply

`_POOL_MINIMUM_TOTAL_SUPPLY` is set to 1e6, and corresponds to the "MINIMUM_BPT" in v2.

It is a system guardrail designed to 1) prevent a single LP from owning the entire pool; and 2) prevent pools from being completely drained (i.e., it's a more general and principled alternative to the minimum balances of v1)

BPT (Balancer Pool Tokens) are always 18-decimals, so this corresponds directly to an amount of Wei. The system burns this amount on initialization, such that the initializer receives slightly less than the initial total supply. It is also checked on remove liquidity, ensuring that the total supply never drops below this minimum.

## Buffer Minimum Total Supply

`_BUFFER_MINIMUM_TOTAL_SUPPLY` is set to 1e4, and corresponds to a value in native underlying token decimals.

Unlike with regular pools, buffer liquidity is not tokenized, but tracked internally. Nevertheless, we have a buffer guardrail analogous to the Pool Minimum Total Supply, with the same purpose and implementation. The system assigns this amount of buffer shares to address 0 (equivalent to "burning" them), and credits the initializer with slightly less. As with regular pools, the system will revert on liquidity removal if the resulting total shares would drop below this value. For reference, this minimum value would be 1 cent for USDC (which has 6 decimals).

## Minimum/Maximum Tokens

v3 supports the same token count as v2. Pools must have between 2 (`MIN_TOKENS`) and 8 (`MAX_TOKENS`) tokens.

Note that this is a constraint on all pools imposed by the Vault, but individual pool types might be more restrictive. For instance, Gyro 2CLP pools must be 2-token, and Stable pools have a lower maximum of 5 tokens.

## Maximum Token Decimals

As with v2, v3 supports up to 18 decimals (`_MAX_TOKEN_DECIMALS`). (Tokens must also implement `IERC20Metadata.decimals`.) v3 reverts with the specific custom error `InvalidTokenDecimals` if this value is exceeded. (v2 reverts with a general numeric error.)

## Maximum Pause Window Duration

`_MAX_PAUSE_WINDOW_DURATION` is set to 4 years, so the deployed value is equal to the maximum.

Note that this only applies to the Vault. Pools may have longer pause windows, up to the maximum 32-bit timestamp.

## Maximum Buffer Period Duration

`_MAX_BUFFER_PERIOD_DURATION` is set to 180 days (6 months), so the deployed value is equal to the maximum.

This does apply to pools, since they use the Vault's buffer period.

# Vault Immutables (set on deployment)

## Pause window duration

This was set to 4 years.

The Vault can be reversibly paused (i.e., all state-changing operations blocked, except recovery mode withdrawals) at any time during the pause window. The idea is to enable fast action if we _suspect_ something is going on. We can pause for safety, investigate the issue, and unpause at leisure if it turns out to be a false alarm.

While it's certainly important for security to be able to pause the Vault, it must also be non-custodial and permissionless: that is a core feature of Balancer, and just as important. If governance could pause the Vault forever, it would undermine this principle, as we can't know how governance might evolve over long time periods, and can't be sure it will never be compromised in some way. Accordingly, the pause window is not perpetual. After it expires, the Vault can no longer be paused, and will remain permissionless forever.

In v2, we thought of this as the "burn in" period, during which we could pause the Vault in case we discovered a critical vulnerability after launch. It seems hopelessly naive in retrospect, but we thought 3 months would be sufficient: surely any serious vulnerabilities would be found within three months!

One of the big lessons from v2 was that vulnerabilities can be found _much_ later than three months after launch (for v2, it took over two years). Based on that, we set the pause window to equal the maximum expected life of v3.

We also strengthened the non-custodial guarantees in v3, by building Recovery Mode (can't fail proportional withdrawal) into the Vault, so that it is supported for all current and future pools. (In v2, it was done at the pool level, and only added in later versions, so a new pool type could implement it differently, or opt out entirely.) Not only that, Recovery Mode becomes permissionless if the Vault or Pool is paused, so that funds can never be locked by governance action (e.g., if a compromised governance were to pause the Vault but _not_ enable Recovery Mode; on v2, this would lock funds).

`_vaultPauseWindowEndTime` and `_vaultBufferPeriodEndTime` are set based on the pause window and buffer period; the pause window duration itself isn't stored directly.

## Buffer period duration

`_vaultBufferPeriodDuration` was set to 6 months (twice the v2 value of 3 months).

What if a vulnerability is found one day before the pause window expires? We could pause the Vault on the last day - but we'd only have one day to fix the issue before the Vault became permanently unpaused. This is the purpose of the Buffer Period. If the Vault is in the paused state when the window expires, it will _remain_ paused for this additional buffer period, to allow enough time to investigate and correct whatever led to the pause. The Vault can still be unpaused at any point (and will unpause itself when the buffer expires), but it can no longer be _paused_, since the primary window has expired.

There was no particular reason for setting this to 6 months; it was just thought that given the longer pause window, the buffer period should also be longer: and it does make sense. We have had issues in the past where the problem is an interaction between the Vault and another protocol (e.g., the Synthetix double-entry point vulnerability). If we need to wait for another protocol to change something, that could easily be a lengthy process.

## Minimum trade amount

`_MINIMUM_TRADE_AMOUNT` was set to 1e6.

Along with minimum pool fees and other similar measures, it is a "guardrail" - an additional safeguard meant to guard against "unknown unknowns." We know that many attacks involve exploiting rounding errors. A common pattern is for an attacker to first push a pool to its limits (e.g., greatly unbalance the liquidity, possibly using flash loans), then makes repeated transactions that exploit rounding, which typically is only possible with very small trade amounts.

In practice, there is really no valid use case for trading tiny values. It obviously makes no sense to buy $0.00001 of ETH with USDC, as the gas costs would swamp any profits. If someone is trying to do this, either 1) they are using Etherscan and forgot about token decimals; or 2) it's some kind of attack. Accordingly, we simply disallow it.

Note that this is a "scaled" value - a number of Wei _after_ token decimal and rate scaling, and it applies to either side of a swap. It also applies to adding/removing liquidity (with the caveat that for single or exact token operations, 0 is allowed for tokens that aren't participating).

## Minimum wrap amount

`_MINIMUM_WRAP_AMOUNT` was set to 1e4.

This is another guardrail, similar to the minimum trade amount, but for ERC4626 buffers. Note that this is an "unscaled" value, corresponding to an amount in underlying token decimals. It prohibits any wrap or unwrap operation that yields less than this amount, for the same reasons noted above. Buffer operations are essentially internal swaps, and are subject to this analogous guardrail. This corresponds to 1 cent of USDC (as USDC has 6 decimals), or $10 of BTC at current prices (~ 100k).

# Protocol Fee Controller Constants

## Maximum Protocol Swap Fee Percentage

`MAX_PROTOCOL_SWAP_FEE_PERCENTAGE` was set to 50%, same as v2.

This protects users and pool creators from governance risk; protocol fees can never be set above this value. Also, protocol fees are taken from the swap fee, so it's also limited by the swap fee. It is also possible for new pools to opt out of protocol fees entirely, at least initially.

## Maximum Protocol Yield Fee Percentage

`MAX_PROTOCOL_YIELD_FEE_PERCENTAGE` was set to 50%.

Since v3 is a yield-bearing token hub, it also has a maximum yield fee percentage, set to the same value as the swap fee. It is possible for new pools to opt out of protocol fees entirely, at least initially.

## Maximum Pool Creator Fee Percentage

`MAX_CREATOR_FEE_PERCENTAGE` was set to 99.999%.

This limit arises from the math (particularly ExactOut swaps), where a 100% fee would cause the swap to revert. In practice, final pool creator fees are expected to be much less than this. However, there are use cases (e.g., MEV reduction) where very high pool creator fees are appropriate (as they are promptly returned to LPs).

# Weighted Pool Constants

## Minimum Swap Fee Percentage

`_MIN_SWAP_FEE_PERCENTAGE` is set to 0.001%.

The minimum swap fee is a system guardrail designed to ensure that all operations are "lossy" (i.e., that there is no possible operation that can receive more tokens than it deposits). The system is designed to round correctly in all cases, and adjust the final results as necessary to fully compensate for any possible precision loss (e.g., in the invariant calculation, which uses the `pow` function and has a relatively wide margin of error). This means the system should work properly and prevent any leakage of value even with zero fees. Nevertheless, this guardrail is applied as an extra measure to ensure any attack is unprofitable.

The value is higher than v2's 0.0001%, and was derived from rigorous analysis of Weighted Math and extensive fuzz testing. This higher value makes sense, as v3's [Liquidity invariant approximation](/concepts/vault/liquidity-invariant-approximation.html) introduces an additional component of the "error bar" that was not present in v2.

## Maximum Swap Fee Percentage

`_MAX_SWAP_FEE_PERCENTAGE` is set to 10%, the same as in v2.

This is there to protect users, and is similar to the Protocol Fee Controllers limits on fees. It ensures a malicious pool operator cannot raise fees to confiscatory levels -- at least static swap fees. Pools that support dynamic swap fees can raise them much higher, but core pools do not support this.

## Minimum Weight

`_MIN_WEIGHT` is set to 1%, same as in v2.

This is a somewhat arbitrary constraint placed on Weighted Pools, which was then used to set boundary conditions and determine other limits in a principled fashion (e.g., the In/Out and Invariant Ratios). Since AMMs have trouble at the "extremes" of the price curve, supporting lower weights didn't seem practical.

## Maximum In/Out Ratios

`_MAX_IN_RATIO` and `_MAX_OUT_RATIO` are set to 30%, same as v2.

v3 uses the same Weighted Math as v2, and the same minimum weight, so the same limits apply. Essentially, you cannot increase an individual token balance by more than 30% in a single operation.

## Minimum/Maximum Invariant Ratios

`_MIN_INVARIANT_RATIO` and `_MAX_INVARIANT_RATIO` are set to 70% and 300% respectively, same as v2.

v3 uses the same Weighted Math as v2, and the same minimum weight, so the same limits apply. Essentially, the total invariant cannot increase more than 3x, or decrease to less than 0.7x of the current value in a single operation.

# Stable Pool Constants

## Minimum/Maximum Amplification Parameter

`MIN_AMP` is 1; `MAX_AMP` is 50,000 (previously, and in v2, the limit was 5,000). These values ultimately arise from the math in Curve's StableSwap. Higher values "flatten" the price curve (i.e., have a greater range were the tokens trade at essentially 1:1), and lower values make it more sensitive to the balances, and behave more like the Weighted Math price curve. Higher liquidity and lower volatility pools can generally have higher Amplification Parameters.

There is also an `AMP_PRECISION` constant, set to 1000. The integer 1-5000 values are multiplied by this factor for greater precision in calculation; the Amplification Parameter is used for the invariant computation.

## Minimum Amplification Parameter Update Time, and Maximum Daily Rate

`_MIN_UPDATE_TIME` is set to 1 day, and `_MAX_AMP_UPDATE_DAILY_RATE` to 2, same as v2.

Stable Pools allow changing the Amplification Parameter, but limit the rate of change, as instantaneous changes would allow price manipulation. These limits mean that any change must take at least one day, and the Amplification Parameter cannot change more than a factor of two in a single day, in either direction. In other words, if the initial parameter is 200, it cannot decrease below 100 (200 / 2) or above 400 (200 * 2) within a day.

## Minimum Swap Fee Percentage

`_MIN_SWAP_FEE_PERCENTAGE` is set to 1e12 (0.0001%), same as v2. As with Weighted Pools, this is a guardrail to protect LPs, and ensures at least minimal revenue from swaps. Since the StableSwap invariant has a much lower error, the minimum fee can be much lower.

## Maximum Swap Fee Percentage

`_MAX_SWAP_FEE_PERCENTAGE` is set to 10%, same as v2 (and same as the Weighted Pool), for all the same reasons.

## Minimum/Maximum Invariant Ratios

`MIN_INVARIANT_RATIO` is set to 60%, and `MAX_INVARIANT_RATIO` is set to 500%. These have no analog in v2 (which had no limits). They may not be necessary in v3 either, but were added as an additional safety guardrail.

## Maximum Tokens

`MAX_STABLE_TOKENS` is set to 5, same as v2.

This limit arises from the StableSwap math, and is the maximum number of tokens for which the invariant approximation holds.

# Router Constants

## Maximum Token Amount

`_MAX_AMOUNT` is set to 2^128 - 1, or type(uint128).max in Solidity.

This is the maximum balance of a token within a pool, which is constrained by the packed balance storage. (The Vault stores both the raw and scaled balances in a single slot, in 128 bits each.) v2 additionally stored a timestamp (for use with oracles), so the maximum balance there was lower: 2^112 - 1.

# Weighted/Stable Pool Immutables

## PauseWindowDuration:

These were set to 4 years for both Weighted and Stable pools.

This is the same value as the Vault, as was done in v2. Note that the pause window is factory-specific, and the time period is relative to the _factory_ deployment (not the pool). All pools become permissionless at the same time. New pool factories can use different values, or even opt out by setting it to zero (not recommended).

Note also that the buffer period duration is not configurable at the pool factory level: the pools always use the Vault's buffer period.
