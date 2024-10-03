---
title: Yield Fee
order: 7
---
# Introduction

Balancer Protocol Fees are collected by the Balancer Protocol on most operations, as a percentage of either pool swap fees or token yield. The Yield Fee is a specific type of Protocol fee that is applied to yield-bearing tokens, such as wstETH. The fee percentage is controlled by Balancer governance.

The Yield Fee is distributed in three primary ways:
- as liquidity incentives for [core pools](https://forum.balancer.fi/t/bip-19-incentivize-core-pools-l2-usage/3329). This forms a key part of the [Yield Bearing Asset Thesis](https://medium.com/balancer-protocol/balancer-the-yield-bearing-asset-thesis-f44489ba2deb).
- to the Balancer DAO, providing a source of revenue for the protocol and contributing to the operational costs.
- to veBAL holders.

# Implementation

Yield fees are charged on every state changing Vault interaction if:
- the token is configured as a [WITH_RATE](token-types.md#tokens-with-external-rates-with_rate) type with `paysYieldFees` set to `true`
- yield has accrued since the last fee computation

Yield fees are computed by taking the difference between `currentLiveBalance` and `lastLiveBalance` and multiplying it by the `aggregateYieldFeePercentage`. The `aggregateYieldFeePercentage` is set by Balancer governance, and is defined in the [`ProtocolFeeController`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/ProtocolFeeController.sol). Note the use of live balances, which are described [here](./token-scaling.md#live-balances).

:::info What does `aggregate` mean?
Collected fees are allocated between up to three recipients: the Balancer protocol, the pool creator (if defined on registration), and the LPs. The `ProtocolFeeController` is used to set the percentages for swap and yield fees for both the protocol and pool creators. In general, the protocol fee is collected first, and the remaining balance is split between the pool creator and LPs. See [this interface](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IProtocolFeeController.sol#L187-L194) for an example calculation.

For performance reasons, the Vault stores only the aggregate percentage (i.e., the total fee, to be allocated later by the controller), computes only one "cut," and emits no events on the critical path. Collected aggregate fees can then be permissionlessly transferred to the `ProtocolFeeController`, where they are split between the protocol and pool creator, and available for permissioned withdrawal. The controller emits events that allow off-chain processes to monitor swap and yield fees per pool, albeit not in "real time" on every operation.

The Vault stores accrued fees per pool per token in an _aggregateFeeAmounts[pool][token] mapping. The `bytes32` slot holds both yield and swap fees accrued by this pool.
```solidity
// Aggregate protocol swap/yield fees accumulated in the Vault for harvest.
// Reusing PackedTokenBalance for the bytes32 values to save bytecode (despite differing semantics).
// It's arbitrary which is which: we define raw = swap; derived = yield.
mapping(address pool => mapping(IERC20 token => bytes32 packedFeeAmounts)) internal _aggregateFeeAmounts;
```
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
To check whether a token in a liquidity pool is subject to yield fees, you can call `vault.getPoolTokenInfo(address pool)`. The percentage of yield fees charged by the vault for a given pool can be read via `protocolFeeController.getPoolProtocolYieldFeeInfo(address pool)`. 
:::

