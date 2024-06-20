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

Yield fees are computed by taking the difference in `currentLiveBalance` and `lastLiveBalance` and multiplying it by the `aggregateYieldFeePercentage`. The `aggregateYieldFeePercentage` is set by protocol governance and is defined in the [`ProtocolFeeController`](https://github.com/balancer/balancer-v3-monorepo/blob/10079235a0fec9cf52c53cf6f231b615fa297ab2/pkg/vault/contracts/ProtocolFeeController.sol#L61). Note the use of live balances which is described [here](./token-scaling.md#live-balances).

:::info What does `aggregate` mean?

:::

```solidity
function _computeYieldFeesDue(
    PoolData memory poolData,
    uint256 lastLiveBalance,
    uint256 tokenIndex,
    uint256 aggregateYieldFeePercentage
) internal pure returns (uint256 aggregateYieldFeeAmountRaw) {
    uint256 currentLiveBalance = poolData.balancesLiveScaled18[tokenIndex];

    // Do not charge fees if rates go down. If the rate were to go up, down, and back up again, protocol fees
    // would be charged multiple times on the "same" yield. For tokens subject to yield fees, this should not
    // happen, or at least be very rare. It can be addressed for known volatile rates by setting the yield fee
    // exempt flag on registration, or compensated off-chain if there is an incident with a normally
    // well-behaved rate provider.
    if (currentLiveBalance > lastLiveBalance) {
        unchecked {
            // Magnitudes checked above, so it's safe to do unchecked math here.
            uint256 aggregateYieldFeeAmountScaled18 = (currentLiveBalance - lastLiveBalance).mulUp(
                aggregateYieldFeePercentage
            );

            // A pool is subject to yield fees if poolSubjectToYieldFees is true, meaning that
            // `protocolYieldFeePercentage > 0`. So, we don't need to check this again in here, saving some gas.
            aggregateYieldFeeAmountRaw = aggregateYieldFeeAmountScaled18.toRawUndoRateRoundDown(
                poolData.decimalScalingFactors[tokenIndex],
                poolData.tokenRates[tokenIndex]
            );
        }
    }
}
```
The `aggregateYieldFeeAmountRaw` represents the final computed yield fee value. Here, 'Raw' signifies that the [rate scaling](./token-scaling.md#rate-scaling) has been reversed, as indicated by the `toRawUndoRateRoundDown` expression.

:::info
to check if a token in a liquidity pool is subject to yield fees, you need to listen to the `PoolRegistered` event of the pool creation transaction. The percentage of yield fees charged by the vault can be read via `vault.getYieldFeePercentage()`. 
:::

