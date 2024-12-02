---
order: 2
title: Hooks
---
# Hooks

:::info Get Started
To get started building your own hook check out the [guide](/build/build-a-hook/extend-existing-pool-type.md).
:::

Hooks introduce a framework to extend existing pool types at various key points throughout the pool’s lifecycle. Hooks can execute actions during pool operation and also compute a dynamic swap fee. Potential applications for hooks include:
- LVR (Loss versus Rebalancing) reduction 
- Dynamic Fees
- Automatic Gauge locking
- Sell or Buy limits

## Hook Contracts

Hooks are implemented as standalone contracts that can have their own internal logic and state. One hook contract can facilitate many pools (and pool types). The hook system is flexible and allows developers to implement custom logic at the following points of the pool lifecycle:

- `onRegister`
- `onBeforeInitialize`
- `onAfterInitialize`
- `onBeforeAddLiquidity`
- `onAfterAddLiquidity`
- `onBeforeRemoveLiquidity`
- `onAfterRemoveLiquidity`
- `onBeforeSwap`
- `onAfterSwap`
- `onComputeDynamicSwapFeePercentage`

Refer to the [Pool hooks API](/developer-reference/contracts/hooks-api.html) page for full function references. The swap, liquidity, and dynamic swap fee hooks are reentrant (i.e., you can call additional Vault operations during them, such as a swap after adding liquidity).

Each Hook contract must implement the `getHookFlags` function which returns a `HookFlags` indicating which hooks are supported:
```solidity
/**
 * @notice Return the set of hooks implemented by the contract.
 * @return hookFlags Flags indicating which hooks the contract supports
 */
function getHookFlags() external returns (HookFlags memory hookFlags);
```

```solidity
/**
  * @dev `enableHookAdjustedAmounts` must be true for all contracts that modify the `amountCalculated`
  * in after hooks. Otherwise, the Vault will ignore any "hookAdjusted" amounts. Setting any "shouldCall"
  * flags to true will cause the Vault to call the corresponding hook during operations.
  */
struct HookFlags {
    bool enableHookAdjustedAmounts;
    bool shouldCallBeforeInitialize;
    bool shouldCallAfterInitialize;
    bool shouldCallComputeDynamicSwapFee;
    bool shouldCallBeforeSwap;
    bool shouldCallAfterSwap;
    bool shouldCallBeforeAddLiquidity;
    bool shouldCallAfterAddLiquidity;
    bool shouldCallBeforeRemoveLiquidity;
    bool shouldCallAfterRemoveLiquidity;
}
```
This decision is final and cannot be changed for a pool once it is registered, as each pool's hook configuration is stored in the Vault and set at pool registration time. During pool registration, the Vault calls into the Hooks contract and [retrieves](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/VaultExtension.sol#L569-L573) the `HookFlags`. 

:::info Hooks and reentrancy
It is possible to reenter the Vault as part of a hook execution, as only the internal functions for each operation are reentrancy protected (e.g., `_swap`, `_addLiquidity` and `_removeLiquidity`).
:::

## How Pools and Hooks Are Connected

When a new pool is registered a hook contract address can be passed to "link" the pool and the hook (use the zero address if there is no hook). This configuration is immutable and cannot change after the pool is registered.

![Vault-Pool-Hooks relation](/images/hooks.png)

The architecture shows that a hooks contract is a standalone contract, which can be used by multiple pools of the same type (WeightedPools) but also multiple pools of different pool types (WeightedPools, StablePools). The address of the hook is passed to the pool registration.

```solidity
function registerPool(
    address pool,
    ...
    address poolHooksContract,
) external;
```

::: info
If you want your Hooks contract to be used, you must implement `onRegister` as the Vault calls it during the [pool registration](https://github.com/balancer/balancer-v3-monorepo/blob/49553c0546121f7725e0b024b240d6e722f02538/pkg/vault/contracts/VaultExtension.sol#L175). The intention of `onRegister` is for the developer to verify that the pool should be allowed to use the hooks contract.
:::

Afterwards the pool is linked to the hook via the `_hooksContracts` mapping, shown below.

```solidity
// The hooks contracts associated with each pool.
mapping(address pool => IHooks hooksContract) internal _hooksContracts;
```


## Adjusted amounts - using hooks to change `amountCalculated`.

Remember that pool liquidity operations like `swap`, `addLiquidity` and `removeLiquidity` signal to the Vault the entries on the credit and debt tab. These entries can either be calculated as part of custom pool implementations or pools in combination with hooks. Both have the capability to determine the amount of credits and debts the vault adds to the tab.

The reason hooks also have this capability is to change `amountCalculated` for existing pool types from established factories. This allows for more fine-grained pool tuning capabilities in `after` hooks. 
![Vault-Pool-Hooks relation](/images/hook-delta.png)


::: info
When `enableHookAdjustedAmounts == true`, hooks are able to modify the result of a liquidity or swap
operation by implementing an after hook. For simplicity, the vault only supports modifying the
calculated part of the operation. As such, when a hook supports adjusted amounts, it can not support
unbalanced liquidity operations as this would introduce instances where the amount calculated is the
input amount (`EXACT_OUT`).
:::

A detailed view of what an `after` hook for a given liquidity operation can change is displayed below:

| Operation                            | Hook cannot change       | Hook _can_ change     |
| --------                             |    -------               |  -------            |
| addLiquidityProportional             | uint256[] amountsIn      | exactBptAmountOut   |
| addLiquidityUnbalanced               | *not supported*          | *not supported*     |
| addLiquiditySingleTokenExactOut      | *not supported*          | *not supported*     |
| addLiquidityCustom                   | *not supported*          | *not supported*     |
| removeLiquidityProportional          | uint256 exactBptAmountIn | uint256[] amountsOut|
| removeLiquiditySingleTokenExactIn    | *not supported*          | *not supported*     |
| removeLiquiditySingleTokenExactOut   | *not supported*          | *not supported*     |
| removeLiquidityCustom                | *not supported*          | *not supported*     |
| swapSingleTokenExactIn               | uint256 exactAmountIn    | uint256 amountOut   |
| swapSingleTokenExactOut              | uint256 exactAmountOut   | uint256 amountIn    |


## Hook examples
If you want to get started with developing your own hooks contract, check out the [developing a hooks contract](/build/build-a-hook/extend-existing-pool-type.html) page. Various hook examples are shown there. Additionally the monorepo displays more ideas on how to approach hook development.


<style scoped>
table {
    display: table;
    width: 100%;
}
table th:first-of-type, td:first-of-type {
    width: 30%;
}
table th:nth-of-type(2) {
    width: 40%;
}
td {
    max-width: 0;
    overflow: hidden;
}
</style>