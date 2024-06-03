---
order: 2
title: Hooks
---
# Hooks

:::info Get Started
To get started building your own hook check out the [guide](../../build-a-custom-amm/build-an-amm/extend-existing-pool-type-using-hooks.md).
:::

Hooks introduce a framework to extend existing pool types at various key points throughout the pool’s lifecycle. Hooks can execute actions during pool operation and also compute a dynamic swap fee. Potential applications for hooks include:
- LVR (Loss versus Rebalancing) reduction 
- Dynamic Fees
- Automatic Gauge locking
- Sell or Buy limits

## Hook requirements

A hook is a codeblock that implements arbitrary logic in a pool or external contract. In order to use hooks as part of a pool's operations two steps need to be done.

1. The hook needs to be registered as part of the pool registration process.
2. The hook function needs to be implemented as part of the pools code.

## Hook registration

As part of the [pool registration](https://github.com/balancer/balancer-v3-monorepo/blob/c83f20770c21b8f470af0a64c6368e57439e3a5b/pkg/interfaces/contracts/vault/IVaultExtension.sol#L84) a `PoolHooks` struct containing booleans needs to be passed. If you want a pool to execute the `onBeforeSwap` and `onAfterSwap` hook, you need to pass the following data as part of the pool registration:
```solidity
PoolHooks({
    shouldCallBeforeInitialize: false,
    shouldCallAfterInitialize: false,
    shouldCallBeforeSwap: true,
    shouldCallAfterSwap: true,
    shouldCallBeforeAddLiquidity: false,
    shouldCallAfterAddLiquidity: false,
    shouldCallBeforeRemoveLiquidity: false,
    shouldCallAfterRemoveLiquidity: false,
    shouldCallComputeDynamicSwapFee: false
})
```

Whenever a pool is registered in the Vault, part of the [`PoolConfig`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L26-L37) stores the information which hooks are enabled. This decision is immutable and cannot change after the pool is created.

:::info
If an entry of the `PoolHooks` is passed as false, the Vault will not call the respective hook function on the pool contract.
:::

## Hook implementation


A set of [different pool hooks](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IPoolHooks.sol) are available to be implemented, depending on what part of the execution flow the additional logic is needed. All hooks are expected to return a `boolean` type of either `true` on success or `false` on failure. The available hooks are:

- `onBeforeInitialize`
- `onAfterInitialize`
- `onBeforeAddLiquidity`
- `onAfterAddLiquidity`
- `onBeforeRemoveLiquidity`
- `onAfterRemoveLiquidity`
- `onBeforeSwap`
- `onAfterSwap`
- `onComputeDynamicSwapFee`

:::info hooks & reentrancy
It is possible to reenter the Vault as part of a hook execution as only the respective internal function like `_swap`, `_addLiquidity` & `_removeLiquidity` are reentrancy protected.
:::

:::info Creation
Balancer provides a `WeightedPoolWithHooksFactory` & `StablePoolFactoryWithHooks`. During pool creation, this factory takes the hooks' bytecode and deploys both the hooks and the pool contract.
:::

:::info data passed to hooks
The Vault calls a pool's hooks and passes data. The passed data for each individual hook is available in the [Pool hooks API](/developer-reference/contracts/hooks-api.html) section.
:::

## Dynamic swap fee hook
Besides the 'before' and 'after' hooks, pools can also implement a - [`onComputeDynamicSwapFee`](/concepts/pools/dynamic-swap-fees.html) hook to allow for dynamic fee computation. For a hook to support a dynamic fee, it needs to: Similar to the hooks mentioned above the dynamic swap fee hook needs to be:
1. Set the value of `shouldCallComputeDynamicSwapFee` to `true` in the hook's `getHookConfig` implementation.
2. Implement `onComputeDynamicSwapFee`.

### Dynamic Swap fee Hook registration
In the implementation of `getHooksConfig`, the hook should return `true` for `shouldCallComputeDynamicSwapFee`.

```solidity
function hooksConfig() external pure override returns (HooksConfig memory) {
    return HooksConfig({
        ...
        shouldCallComputeDynamicSwapFee: true
    });
}
```

### Dynamic Swap fee Hook implementation
Whenever the Vault fetches the swap fee, it checks if the hook has a dynamic swap fee. If it does, it calls into the hook's `onComputeDynamicSwapFee` function. Otherwise it reads the `PoolConfig.staticSwapFeePercentage`.

```solidity
function onComputeDynamicSwapFee(
    IBasePool.PoolSwapParams calldata params
) external view returns (bool success, uint256 dynamicSwapFee);
```



