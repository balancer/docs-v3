---
order: 2
title: Hooks
---
# Hooks

:::info Get Started
To get started building your own hook check out the [guide](../../build-a-custom-amm/build-an-amm/extend-existing-pool-type-using-hooks.md).
:::

Hooks introduce a new approach to managing a pool's execution logic. They are designed to enhance pool operations and allow developers to tailor pool behavior to their specific use cases. Hooks can execute actions during pool operation and also compute a dynamic swap fee. Potential applications for pool hooks include:
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
    shouldCallAfterRemoveLiquidity: false
})
```

Whenever a pool is registered in the Vault, part of the [`PoolConfig`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L26-L37) stores the information which hooks are enabled.

:::info
If an entry of the `PoolHooks` is passed as false, the Vault will not call the respective hook function on the pool contract.
:::

## Hook implementation


A set of [different pool hooks](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IPoolHooks.sol) are available to be implemented, depending on what part of the execution flow the additional logic is needed. All hooks (except `computeFee`) are expected to return a `boolean` type of either `true` on success or `false` on failure. The available hooks are:

- `onBeforeInitialize`
- `onAfterInitialize`
- `onBeforeAddLiquidity`
- `onAfterAddLiquidity`
- `onBeforeRemoveLiquidity`
- `onAfterRemoveLiquidity`
- `onBeforeSwap`
- `onAfterSwap`

:::info hooks & reentrancy
It is possible to reenter the Vault as part of a hook execution as only the respective internal function like `_swap`, `_addLiquidity` & `_removeLiquidity` are reentrancy protected.
:::

:::info Creation
Balancer provides a `WeightedPoolWithHooksFactory`. During pool creation, this factory takes the hooks' bytecode and deploys both the hooks and the pool contract.
:::

## Dynamic swap fee hook
Besides the 'before' and 'after' hooks, pools can also implement a - [`computeFee`](/concepts/pools/dynamic-swap-fees.html) hook to allow for dynamic fee computation. Similar to the hooks mentioned above the dynamic swap fee hook needs to be:
1. registered during the pool registration process.
2. implemented as part of the pools code.

### Dynamic Swap fee Hook registration
During pool registration, a boolean value is passed to indicate whether the pool has a dynamic swap fee.
```solidity
function registerPool(
    ...
    bool hasDynamicSwapFee
) external;
```

### Dynamic Swap fee Hook implementation
Whenever the Vault fetches the swap fee, it checks if the pool has dynamic swap fee and if so, it calls into the pools `computeFee` function. Otherwise it reads the `PoolConfig.staticSwapFeePercentage`.

```solidity
function computeFee(PoolData memory poolData, SwapLocals memory vars) external view returns (uint256);
```

## Hook Choice

There are two approaches to utilise hooks. Either as a developer, you:

### Choose to extend an existing pool type with Hooks.
Balancer offers various factories, such as `WeightedPoolFactoryWithHooks` and `StablePoolFactoryWithHooks`, that extend existing Pool Types with hooks. To use this approach, you need to pass the hooks' bytecode into the factory's create function. This approach follows a proxy behavior pattern, where the pool contract calls the hook contract. You can find more information in [this guide](/concepts/developer-guides/extend-existing-pool-type-using-hooks.html).

### Implement hooks as part of a custom pool

If you are looking for a more flexible way of utilizing hooks, you can take a look at the [custom pool guide](/concepts/developer-guides/create-custom-amm-with-novel-invariant.html).



