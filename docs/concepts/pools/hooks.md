---
order: 5
title: Hooks
---

# Hooks


# Hooks
Balancer supports pools that implement hooks. A hook is a codeblock that implements arbitrary logic in a pool or external contract. Whenever a pool is registered in the Vault, part of the [`PoolConfig`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L26-L37) stores this information. A set of [8 different pool hooks](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L9-L18) are available to be implemented, depending on what part of the execution flow the additional logic is needed. All hooks are expected to return a `boolean` type of either `true` on success or `false` on failure. When working with hooks, the suggestion is to inherit from [`IPoolCallbacks`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IPoolCallbacks.sol) as different hooks have access to different payloads. The available hooks are:

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

## Hook architecture
Various choices for hook implementations are possible. Either:
- Implement the hook logic as part of the Pool contract
- Forward hook execution to external contracts

It is up to the developer to choose where the logic is implemented.

### Hook logic implementation as part of the pool's code

```solidity
contract MyCustomPool is BalancerPoolToken, IBasePool, IPoolCallbacks {
    //...

    uint256 public constant MAX_AMOUNT_GIVEN = 100e18;

    function onBeforeSwap(IBasePool.SwapParams memory params) external view returns (bool) {
        if (params.kind == IVault.SwapKind.GIVEN_IN) {
            require(params.amountGivenScaled18 < MAX_AMOUNT_GIVEN, "amount in exceeds limit");
        } else {
            require(params.amountGivenScaled18 > MAX_AMOUNT_GIVEN, "amount out exceeds limit");
        }
        return true;
    }
}
```

### Hook logic implementation as part of an external contract's code

```solidity
interface IOnBeforeSwapHookContract {
    function swapEnabled() external view returns (bool);
}

contract myCustomPool is BalancerPoolToken, IBasePool, IPoolCallbacks {
    //...

    address public onBeforeSwapTarget;

    function onBeforeSwap(IBasePool.SwapParams memory params) external view returns (bool) {
        return IOnBeforeSwapHookContract(onBeforeSwapTarget).swapEnabled();
    }
}
```

