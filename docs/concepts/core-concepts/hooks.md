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
- `onComputeDynamicSwapFee`

Each Hook contract must implement the `getHooksConfig` function which returns a `HooksConfig` indicating which hooks are supported:

```solidity
struct HooksConfig {
    bool shouldCallBeforeInitialize;
    bool shouldCallAfterInitialize;
    bool shouldCallComputeDynamicSwapFee;
    bool shouldCallBeforeSwap;
    bool shouldCallAfterSwap;
    bool shouldCallBeforeAddLiquidity;
    bool shouldCallAfterAddLiquidity;
    bool shouldCallBeforeRemoveLiquidity;
    bool shouldCallAfterRemoveLiquidity;
    address hooksContract;
}
```

:::info hooks & reentrancy
It is possible to reenter the Vault as part of a hook execution as only the respective internal function like `_swap`, `_addLiquidity` & `_removeLiquidity` are reentrancy protected.
:::

:::info data passed to hooks
The Vault calls a pool's hooks and passes data. The passed data for each individual hook is available in the [Pool hooks API](/developer-reference/contracts/hooks-api.html) section.
:::

## How Pools & Hooks Are Connected

When a new pool is registered a hook contract address can be passed to "link" the pool and the hook (for no hook use the zero address). This configuration is immutable and cannot change after the pool is registered.

```solidity
function registerPool(
    address pool,
    ...
    address poolHooksContract,
) external;
```

During registration the Vault calls `getHooksConfig` to determine which hooks are supported and stores it to a pool/hook mapping:

```solidity
mapping(address => HooksConfig) internal _hooksConfig;
```

## Hook Deltas - using hooks to change `amountCalculated`.

Remember that pool liquidity operations like `swap`, `addLiquidity` and `removeLiquidity` signal to the Vault the entries on the credit & debt tab. These entries can either be calculated as part of custom pool implementations or hooks. Both have the capability to determine the amount of credit & debt the vault adds to the tab.

The reason hooks also have this capability is to change `amountCalculated` of already existing pool types from established factories.

::: info
Hooks can change the `amountCalculated` for liquidity operations but cannot change `amountGiven`. 
:::

A detailed view of what a `after` hook for a given liquidity operation can change is displayed below:

| Operation                            | Unchanged                |  Can be changed     |
| --------                             |    -------               |  -------            |
| addLiquidityProportional             | uint256[] amountsIn      | exactBptAmountOut   |
| addLiquidityUnbalanced               | uint256[] exactAmountsIn | bptAmountOut        |
| addLiquiditySingleTokenExactOut      | uint256 amountIn         | exactBptAmountOut   |
| addLiquidityCustom                   | *not supported*          | *not supported*     |
| removeLiquidityProportional          | uint256 exactBptAmountIn | uint256[] amountsOut|
| removeLiquiditySingleTokenExactIn    | uint256 exactBptAmountIn | uint256 amountOut   |
| removeLiquiditySingleTokenExactOut   | uint256 exactAmountOut   | uint256 bptAmountIn |
| removeLiquidityCustom                | *not supported*          | *not supported*     |
| swapSingleTokenExactIn               | uint256 exactAmountIn    | uint256 amountOut   |
| swapSingleTokenExactOut              | uint256 exactAmountOut   | uint256 amountIn    |


## Dynamic Swap Fee Hook

The Dynamic Swap Fee Hook enables hook developers to adjust pool fees for various strategic purposes, e.g. market volatility.

If the Dynamic Swap Fee Hook is enabled the Hook must implement the `onComputeDynamicSwapFee` function to compute the swap fee:

```solidity
/**
 * @notice Called before `onBeforeSwap` if the pool has dynamic fees.
 * @param params Swap parameters (see IBasePool.PoolSwapParams for struct definition)
 * @return success True if the pool wishes to proceed with settlement
 * @return dynamicSwapFee Value of the swap fee
 */
function onComputeDynamicSwapFee(
    IBasePool.PoolSwapParams calldata params
) external view returns (bool success, uint256 dynamicSwapFee);
```

Note that the function has access to the swap parameters which can be used as part of the fee computation:
```solidity
struct PoolSwapParams {
    SwapKind kind;
    uint256 amountGivenScaled18;
    uint256[] balancesScaled18;
    uint256 indexIn;
    uint256 indexOut;
    address router;
    bytes userData;
}
```

Now, whenever the Vault fetches the swap fee it will use the returned `dynamicSwapFee` value.