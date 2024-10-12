---
title: Swap Fee
order: 8
---
# Swap fee
A swap fee is charged for each swap, as well as on the non-proportional amounts in add/remove liquidity operations. When a pool is registered, the initial swap fee is passed as a parameter and stored as part of [the pool's configuration](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L28-L39). The swap fee is always charged on the calculated amount (i.e., on `amountOut` for EXACT_IN, and `amountIn` for EXACT_OUT).

:::info
Let's imagine a liquidity pool that maintains an equal balance of DAI and USDC, known as a 50/50 pool. A user decides to add liquidity to this pool, but does so in an unbalanced manner: they contribute 15 DAI and 10 USDC.

In order to maintain the balance of the pool, an equal amount of DAI and USDC should be added. In this case, that would be 10 DAI and 10 USDC. This balanced contribution is referred to as the 'proportional add portion'.

However, the user has added an extra 5 DAI, which is not matched by an equivalent amount of USDC. This extra 'non-proportional' contribution disrupts the balance of the pool. As a result, the pool charges swap fees on this non-proportional amount.

The exact amount of the non-proportional contribution, and therefore the amount that incurs swap fees, is determined by the current balances of DAI and USDC in the pool.
:::

## Setting a static swap fee
Users who have been granted authorization have the capability to set a fixed swap fee percentage for liquidity pools. This can be done by invoking the `vault.setStaticSwapFeePercentage(address pool, uint256 swapFeePercentage)` function.

If users prefer not to have the swap fee of a pool controlled by Balancer governance (through the `Authorizer`), they can opt out by providing a non-zero address for the `swapManager`. This address could be a multi-sig or custom contract.

Unlike in v2, v3 does not impose limits on the swap fee percentage at the Vault level. Rather, these limits are set at the pool level (0.001% - 10% for standard Balancer Weighted, and 0.0001% - 10% for  Stable pools).

## Swap fees by pool type.
Different types of pools can have varying minimum and maximum swap fees. These variations are determined by the mathematical security properties and specific product requirements. Maximum and minimum swap fees are set on a per pool basis implemented via the `ISwapFeePercentageBounds` interface, which is inherited by `IBasePool`:
```solidity
/// @return minimumSwapFeePercentage The minimum swap fee percentage for a pool
    function getMinimumSwapFeePercentage() external view returns (uint256);
/// @return maximumSwapFeePercentage The maximum swap fee percentage for a pool
    function getMaximumSwapFeePercentage() external view returns (uint256);
```

This means that all new pool types (assuming they implement `IBasePool`) will need to think about what the swap fee range should be, according to the pool type's math and other constraints, then override and set the values accordingly. (Note that invariant limits must also be defined for new pool types, by implementing `IUnbalancedLiquidityInvariantRatioBounds`.)

## Dynamic swap fee
Liquidity pools can be set up to use dynamic swap fees. When registering a pool with a dynamic swap fee, `shouldCallComputeDynamicSwapFee` should be true in the HooksConfig.

Instead of getting the swap fee from the [pool's configuration](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L28-L39), the Vault uses the [`onComputeDynamicSwapFeePercentage()`](/developer-reference/contracts/hooks-api.html#oncomputedynamicswapfeepercentage) hook to fetch the dynamic swap fee from the pool. This function returns the swap fee percentage to be used for the current swap. It's important to note that even when a pool is set to use dynamic swap fees, it still maintains a static swap fee, which is not directly used (though it is sent to the dynamic fee hook for reference).

:::info
The capability to compute dynamic swap fee percentages opens up new and creative ways to calculate fees. For example, the fees can be adjusted depending on the swap direction, or configured to maintain a token's pegged value.

In addition to these, dynamic swap fees can also be used to:

- Adjust fees based on market conditions: higher fees can be charged during periods of high volatility to discourage frequent trading and maintain stability.
- Implement tiered fee structures: different fees can be charged based on the size of the swap, with larger swaps incurring higher fees.
- Encourage certain types of trading behavior: lower fees can be set for trades that contribute to the pool's liquidity or stability.
:::
