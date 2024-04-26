---
title: Swap Fee
order: 8
---
# Swap fee
A swap fee is charged for each swap & unbalanced join and unbalanced exit pool operations on the non proportional amounts. When a pool is registered, the initial swap fee is passed as a parameter and stored as part of [the pool's configuration](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L30). The swap fee is always charged in the token going out of the Vault.

:::info
Let's imagine a liquidity pool that maintains an equal balance of DAI and USDC, known as a 50/50 pool. A user decides to add liquidity to this pool, but does so in an unbalanced manner: they contribute 15 DAI and 10 USDC.

In order to maintain the balance of the pool, an equal amount of DAI and USDC should be added. In this case, that would be 10 DAI and 10 USDC. This balanced contribution is referred to as the 'proportional join part'.

However, the user has added an extra 5 DAI, which is not matched by an equivalent amount of USDC. This extra, or 'non-proportional', contribution disrupts the balance of the pool. As a result, the pool charges swap fees on this non-proportional amount.

The exact amount of the non-proportional contribution, and therefore the swap fees, is determined by the current balances of DAI and USDC in the pool.
:::

## Setting a static swap fee
Users who have been granted authorization have the capability to set a fixed swap fee percentage for liquidity pools. This can be done by invoking the `vault.setStaticSwapFeePercentage(address pool, uint256 swapFeePercentage)` function.

If users prefer not to have the swap fee of a pool controlled by Balancer governance (also known as the authorizer), they can opt out by providing a custom address that is not the zero address. The provided contract could be a multisig or a custom contract.

It's crucial to remember that there is a limit to the static swap fee percentage. It can be set to any value between 0 and 10%, but no higher.

## Swap fees by pool type.
Different types of pools can have varying minimum and maximum swap fees. These variations are determined by the mathematical security properties and specific product requirements. The table below provides the specific minimum and maximum swap fees for each pool type.

| Pool type     | Minimum swap fee  | Maximum swap fee  |
| ----------    |---                |---  |
| Weighted Pool | 0.0001%           | 10% |
| Stable Pool   | 0%                | 10% |

## Dynamic swap fee
Liquidity pools can be set up to use dynamic swap fees. This setting is determined when the pool is registered with the Vault. If a pool has dynamic swap fee is passed as a boolean value in the `PoolRegistrationParams`. When registering a pool with dynamic swap fee, your `PoolRegistrationParams` should include the entry:
```solidity
PoolRegistrationParams({
    //...
    hasDynamicSwapFee: true,
    //...
})
```
Instead of getting the swap fee from the [pool's configuration](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L33), the Vault uses the `_getSwapFeePercentage(PoolConfig memory config)` to fetch the swap fee from the pool. This function returns the swap fee percentage. It's important to note that even when a pool is set to use dynamic swap fees, it still maintains a static swap fee. However, this static fee is not utilized.

:::info
The capability to compute dynamic swap fee percentages opens up new and creative ways to calculate fees. For example, the fees can be adjusted depending on the swap's direction or configured to maintain a token's pegged value.

In addition to these, dynamic swap fees can also be used to:

- Adjust fees based on market conditions: Higher fees can be charged during periods of high volatility to discourage frequent trading and maintain stability.
- Implement tiered fee structures: Different fees can be charged based on the size of the swap, with larger swaps incurring higher fees.
- Encourage certain types of trading behavior: Lower fees can be set for trades that contribute to the pool's liquidity or stability.
:::