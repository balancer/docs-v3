---
order: 8
title: Swap Fees
---

# Swap Fees

::: info More Details
For more detailed information on Swap Fees please see the [Swap Fee Concepts](/concepts/vault/swap-fee.md) section.
:::

A swap fee is charged for each swap, as well as on the non-proportional amounts in add/remove liquidity operations. The swap fee is always charged on the amount in:
* EXACT_IN, on the given amount (see [Vault.sol](https://github.com/balancer/balancer-v3-monorepo/blob/72ccd408936b8786fd4a9e5bd9c7bd6bc08fd991/pkg/vault/contracts/Vault.sol#L370)):
```solidity
// Round up to avoid losses during precision loss.
locals.totalSwapFeeAmountScaled18 = poolSwapParams.amountGivenScaled18.mulUp(swapState.swapFeePercentage);
poolSwapParams.amountGivenScaled18 -= locals.totalSwapFeeAmountScaled18;
```
* EXACT_OUT, the calculated amount (see [Vault.sol](https://github.com/balancer/balancer-v3-monorepo/blob/72ccd408936b8786fd4a9e5bd9c7bd6bc08fd991/pkg/vault/contracts/Vault.sol#L412))):
```solidity
// To ensure symmetry with EXACT_IN, the swap fee used by ExactOut is
// `amountCalculated * fee% / (100% - fee%)`. Add it to the calculated amountIn. Round up to avoid losing
// value due to precision loss. Note that if the `swapFeePercentage` were 100% here, this would revert with
// division by zero. We protect against this by ensuring in PoolConfigLib and HooksConfigLib that all swap
// fees (static, dynamic, pool creator, and aggregate) are less than 100%.
locals.totalSwapFeeAmountScaled18 = amountCalculatedScaled18.mulDivUp(
    swapState.swapFeePercentage,
    swapState.swapFeePercentage.complement()
);
```

Swap fees come in two different forms for V3 pools:

* [Static Swap Fee](/concepts/vault/swap-fee.md#setting-a-static-swap-fee): 
  * Initially set as part of the pool registration. 
  * Authorized addresses can then change the value by invoking the vault.setStaticSwapFeePercentage(address pool, uint256 swapFeePercentage) function.
  * If the staticSwapFeePercentage is changed, it will emit an event: `SwapFeePercentageChanged(pool, swapFeePercentage);`
  * Note - `setStaticSwapFeePercentage` can also be called as part of a regular [hook](../../concepts/core-concepts/hooks.md)
* [Dynamic Swap Fee Using Hooks](/concepts/vault/swap-fee.md#dynamic-swap-fee):
  * Using Hooks a pool can be set up to use dynamic swap fees.
  * The Vault uses the [`onComputeDynamicSwapFeePercentage()`](/developer-reference/contracts/hooks-api.html#oncomputedynamicswapfeepercentage) hook to fetch the dynamic swap fee. This function can implement arbitrary logic.
  * Even when a pool is set to use dynamic swap fees, it still maintains a static swap fee. However, this static fee is not utilized.

The pseudo logic to determine how swap fee is calculated looks like:
```
swapFeePercentage =
     Pool has DynamicSwapFee => call DynamicSwapFeeHook in the pool
     else => load static Swap fee percentage from Vault
```