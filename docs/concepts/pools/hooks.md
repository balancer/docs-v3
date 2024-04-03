---
order: 5
title: Hooks
---
# Hooks

:::info Get Started
To get started building your own hook check out the [guide](../developer-guides/extend-existing-pool-type-using-hooks.md).
:::

Hooks introduce a new approach to managing a pool's execution logic. They are designed to enhance pool operations and allow developers to tailor pool behavior to their specific use cases. Hooks can execute actions during pool operation and also compute a dynamic swap fee. Potential applications for pool hooks include:
- LVR (Loss versus Rebalancing) reduction 
- Dynamic Fees
- Automatic Gauge locking
- Sell or Buy limits


A hook is a codeblock that implements arbitrary logic in a pool or external contract. Whenever a pool is registered in the Vault, part of the [`PoolConfig`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L26-L37) stores this information. A set of [8 different pool hooks](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L9-L18) are available to be implemented, depending on what part of the execution flow the additional logic is needed. All hooks are expected to return a `boolean` type of either `true` on success or `false` on failure. The available hooks are:

- `onBeforeInitialize`
- `onAfterInitialize`
- `onBeforeAddLiquidity`
- `onAfterAddLiquidity`
- `onBeforeRemoveLiquidity`
- `onAfterRemoveLiquidity`
- `onBeforeSwap`
- `onAfterSwap`
- [`computeFee`](/concepts/pools/dynamic-swap-fees.html)

:::info hooks & reentrancy
It is possible to reenter the Vault as part of a hook execution as only the respective internal function like `_swap`, `_addLiquidity` & `_removeLiquidity` are reentrancy protected.
:::

:::info Creation
Balancer provides a `WeightedPoolWithHooksFactory` which as part of pool creation take the hooks bytecode and deploys the hooks as well as pool contract.
:::

## Hook architecture
Various choices for hook implementations are possible. Either:
- Implement the hook logic as part of the Pool contract
- Forward hook execution to external contracts as the preferred option for hook developers

It is up to the developer to choose where the logic is implemented. From a design perspective the below example follows a separation of hook contract functionality & pool contract functionality to increase readability and make reusing of hook functionality easier for a developer. The example hooks follow a proxy behavior pattern where the pool contract calls the hook contract. 

### Base implementation

```solidity
abstract contract PoolWithHooks is IPoolHooks {
    //...

    /// @inheritdoc IPoolHooks
    function onBeforeSwap(IBasePool.PoolSwapParams memory params) public virtual returns (bool success) {
        return hooksContract.onBeforeSwap(params);
    }
}
```

