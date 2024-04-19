---
title: Yield Fee
order: 7
---
# Introduction

Balancer Protocol Fees are fees collected by the Balancer Protocol instead of Liquidity Providers. The Yield Fee is a specific type of Protocol fee that is applied to yield bearing tokens such as wstETH and the fee percentage is controlled by protocol governance

The Yield Fee is distributed in three primary ways:
- as liquidity incentives for [core pools](https://forum.balancer.fi/t/bip-19-incentivize-core-pools-l2-usage/3329). This forms a key part of the [Yield Bearing Asset Thesis](https://medium.com/balancer-protocol/balancer-the-yield-bearing-asset-thesis-f44489ba2deb).
- to the Balancer DAO, providing a source of revenue for the protocol and contributing to the operational costs.
- to veBAL holders.

# Implementation

Yield fees are charged on every state changing Vault interaction if:
- a token is configured as a [WITH_RATE](token-types.md#tokens-with-external-rates-with_rate) type with `paysYieldFees` set to `true`
- yield has accrued since the last fee computation

Yield fees are computed by taking the difference in `currentLiveBalance` and `lastLiveBalance` and multiplying it by the `yieldFeePercentage`. The `yieldFeePercentage` is set by protocol governance and is global for all pools. Note the use of live balances which is described [here](./token-scaling.md#live-balances)

```solidity
function _computeYieldProtocolFeesDue(
    PoolData memory poolData,
    uint256 lastLiveBalance,
    uint256 tokenIndex,
    uint256 yieldFeePercentage
) internal pure returns (uint256 feeAmountRaw) {
    uint256 currentLiveBalance = poolData.balancesLiveScaled18[tokenIndex];

    // Do not charge fees if rates go down. If the rate were to go up, down, and back up again, protocol fees
    // would be charged multiple times on the "same" yield. For tokens subject to yield fees, this should not
    // happen, or at least be very rare. It can be addressed for known volatile rates by setting the yield fee
    // exempt flag on registration, or compensated off-chain if there is an incident with a normally
    // well-behaved rate provider.
    if (currentLiveBalance > lastLiveBalance) {
        unchecked {
            // Magnitudes checked above, so it's safe to do unchecked math here.
            uint256 liveBalanceDiff = currentLiveBalance - lastLiveBalance;

            feeAmountRaw = liveBalanceDiff.mulDown(yieldFeePercentage).toRawUndoRateRoundDown(
                poolData.decimalScalingFactors[tokenIndex],
                poolData.tokenRates[tokenIndex]
            );
        }
    }
}
```
The `feeAmountRaw` represents the final computed yield fee value. Here, 'Raw' signifies that the [rate scaling](./token-scaling.md#rate-scaling) has been reversed, as indicated by the `toRawUndoRateRoundDown` expression.

:::info
to check if a token in a liquidity pool is subject to yield fees, you need to listen to the `PoolRegistered` event of the pool creation transaction. The percentage of yield fees charged by the vault can be read via `vault.getYieldFeePercentage()`. 
:::

