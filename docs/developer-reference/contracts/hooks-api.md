---
order: 7
title: Hooks API
---

# Hooks
Hooks have access to different data shared from the Vault. These allow a developer to build powerful execution logic when additionally utilizing the shared data.

### `onRegister`

```solidity
function onRegister(
    address factory,
    address pool,
    TokenConfig[] memory tokenConfig,
    LiquidityManagement calldata liquidityManagement
) external returns (bool);
```
Hook to be executed when pool is registered. If it returns false, the registration is reverted. Vault address can be accessed with `msg.sender`.

**Parameters:**

| Name                  | Type                            | Description                                                        |
|-----------------------|---------------------------------|--------------------------------------------------------------------|
| factory               | address                         | Address of the pool factory                                        |
| pool                  | address                         | Address of the pool                                                |
| tokenConfig           | TokenConfig[] memory            | An array of descriptors for the tokens the pool will manage       |
| liquidityManagement   | LiquidityManagement calldata    | Liquidity management flags with implemented methods               |

**Returns:**

| Name      | Type    | Description                                              |
|-----------|---------|----------------------------------------------------------|
| success   | bool    | True if the hook allowed the registration, false otherwise |

### `getHookFlags`

```solidity
function getHookFlags() external returns (HookFlags memory hookFlags);
```
Returns flags informing which hooks are implemented in the contract.

**Returns:**

| Name      | Type               | Description                                              |
|-----------|--------------------|----------------------------------------------------------|
| hookFlags | HookFlags memory   | Flags indicating which hooks the contract supports       |

### `onBeforeInitialize`

```solidity
function onBeforeInitialize(uint256[] memory exactAmountsIn, bytes memory userData) external returns (bool);
```
Optional hook to be executed before pool initialization. Note that unlike the swap and liquidity hooks, the initialize hooks are non-reentrant.

**Parameters:**

| Name          | Type               | Description                                              |
|---------------|--------------------|----------------------------------------------------------|
| exactAmountsIn| uint256[] memory   | Exact amounts of input tokens                            |
| userData      | bytes memory       | Optional, arbitrary data with the encoded request        |

**Returns:**

| Name      | Type   | Description                                              |
|-----------|--------|----------------------------------------------------------|
| success   | bool   | True if the pool wishes to proceed with initialization   |

### `onAfterInitialize`

```solidity
function onAfterInitialize(
    uint256[] memory exactAmountsIn,
    uint256 bptAmountOut,
    bytes memory userData
) external returns (bool);
```
Optional hook to be executed after pool initialization. Note that unlike the swap and liquidity hooks, the initialize hooks are non-reentrant.

**Parameters:**

| Name          | Type               | Description                                              |
|---------------|--------------------|----------------------------------------------------------|
| exactAmountsIn| uint256[] memory   | Exact amounts of input tokens                            |
| bptAmountOut  | uint256            | Amount of pool tokens minted during initialization       |
| userData      | bytes memory       | Optional, arbitrary data with the encoded request        |

**Returns:**

| Name      | Type   | Description                                              |
|-----------|--------|----------------------------------------------------------|
| success   | bool   | True if the pool wishes to proceed with initialization   |

### `onBeforeAddLiquidity`

```solidity
function onBeforeAddLiquidity(
    address router,
    address pool,
    AddLiquidityKind kind,
    uint256[] memory maxAmountsInScaled18,
    uint256 minBptAmountOut,
    uint256[] memory balancesScaled18,
    bytes memory userData
) external returns (bool success);
```
Optional hook to be executed before adding liquidity.

**Parameters:**

| Name              | Type               | Description                                              |
|-------------------|--------------------|----------------------------------------------------------|
| router            | address            | The address (usually a router contract) that initiated a swap operation on the Vault |
| pool              | address   | Pool address, used to fetch pool information from the Vault (pool config, tokens, etc.) |
| kind              | AddLiquidityKind   | The type of add liquidity operation (e.g., proportional, custom) |
| maxAmountsInScaled18 | uint256[] memory | Maximum amounts of input tokens                          |
| minBptAmountOut   | uint256            | Minimum amount of output pool tokens                     |
| balancesScaled18  | uint256[] memory   | Current pool balances in token registration order        |
| userData          | bytes memory       | Optional, arbitrary data with the encoded request        |

**Returns:**

| Name      | Type   | Description                                              |
|-----------|--------|----------------------------------------------------------|
| success   | bool   | True if the pool wishes to proceed with settlement       |

### `onAfterAddLiquidity`

```solidity
function onAfterAddLiquidity(
    address router,
    address pool,
    uint256[] memory amountsInScaled18,
    uint256[] memory amountsInRaw,
    uint256 bptAmountOut,
    uint256[] memory balancesScaled18,
    bytes memory userData
) external returns (bool success, uint256[] memory hookAdjustedAmountsInRaw);
```
Optional hook to be executed after adding liquidity.

**Parameters:**

| Name              | Type               | Description                                              |
|-------------------|--------------------|----------------------------------------------------------|
| router            | address            | The address (usually a router contract) that initiated a swap operation on the Vault |
| pool              | address   | Pool address, used to fetch pool information from the Vault (pool config, tokens, etc.) |
| amountsInScaled18 | uint256[] memory| Actual amounts of tokens added, sorted in token registration order
| amountsInRaw      | uint256[] memory | Actual amounts of tokens added, sorted in token registration order
| bptAmountOut      | uint256            | Amount of pool tokens minted                             |
| balancesScaled18  | uint256[] memory   | Current pool balances in token registration order        |
| userData          | bytes memory       | Additional (optional) data provided by the user          |

**Returns:**

| Name      | Type   | Description                                              |
|-----------|--------|----------------------------------------------------------|
| success   | bool   | True if the pool wishes to proceed with settlement       |
| hookAdjustedAmountsInRaw   | uint256[] memory   | New amountsInRaw, potentially modified by the hook |

### `onBeforeRemoveLiquidity`

```solidity
function onBeforeRemoveLiquidity(
    address router,
    address pool,
    RemoveLiquidityKind kind,
    uint256 maxBptAmountIn,
    uint256[] memory minAmountsOutScaled18,
    uint256[] memory balancesScaled18,
    bytes memory userData
) external returns (bool success);
```
Optional hook to be executed before removing liquidity.

**Parameters:**

| Name              | Type               | Description                                              |
|-------------------|--------------------|----------------------------------------------------------|
| router            | address            | The address (usually a router contract) that initiated a swap operation on the Vault |
| pool              | address   | Pool address, used to fetch pool information from the Vault (pool config, tokens, etc.) |
| kind              | RemoveLiquidityKind| The type of remove liquidity operation (e.g., proportional, custom) |
| maxBptAmountIn    | uint256            | Maximum amount of input pool tokens                      |
| minAmountsOutScaled18 | uint256[] memory | Minimum output amounts in token registration order      |
| balancesScaled18  | uint256[] memory   | Current pool balances in token registration order        |
| userData          | bytes memory       | Optional, arbitrary data with the encoded request        |

**Returns:**

| Name      | Type   | Description                                              |
|-----------|--------|----------------------------------------------------------|
| success   | bool   | True if the pool wishes to proceed with settlement       |

### `onAfterRemoveLiquidity`

```solidity
function onAfterRemoveLiquidity(
    address router,
    address pool,
    RemoveLiquidityKind kind,
    uint256 bptAmountIn,
    uint256[] memory amountsOutScaled18,
    uint256[] memory amountsOutRaw,
    uint256[] memory balancesScaled18,
    bytes memory userData
) external returns (bool success, uint256[] memory hookAdjustedAmountsOutRaw);
```
Optional hook to be executed after removing liquidity.

**Parameters:**

| Name              | Type               | Description                                              |
|-------------------|--------------------|----------------------------------------------------------|
| router            | address            | The address (usually a router contract) that initiated a swap operation on the Vault |
| pool              | address   | Pool address, used to fetch pool information from the Vault (pool config, tokens, etc.) |
| kind              | RemoveLiquidityKind| The type of remove liquidity operation (e.g., proportional, custom) |
| bptAmountIn       | uint256            | Amount of pool tokens to burn                            |
| amountsOutScaled18| uint256[] memory   | Scaled amount of tokens to receive, in token registration order  |
| amountsOutRaw| uint256[] memory   | Actual amount of tokens to receive, in token registration order  |
| balancesScaled18  | uint256[] memory   | Current pool balances in token registration order        |
| userData          | bytes memory       | Additional (optional) data provided by the user          |

**Returns:**

| Name      | Type   | Description                                              |
|-----------|--------|----------------------------------------------------------|
| success   | bool   | True if the pool wishes to proceed with settlement       |
| hookAdjustedAmountsOutRaw   | uint256[] memory   | New amountsOutRaw, potentially modified by the hook |

### `onBeforeSwap`

```solidity
function onBeforeSwap(PoolSwapParams calldata params, address pool) external returns (bool success);
```
Called before a swap to give the Pool an opportunity to perform actions.

**Parameters:**

| Name      | Type                       | Description                                              |
|-----------|----------------------------|----------------------------------------------------------|
| params    | PoolSwapParams   | Swap parameters                                          |
| pool      | address                    | Pool address, used to get pool information from the vault|

**Returns:**

| Name      | Type   | Description                                              |
|-----------|--------|----------------------------------------------------------|
| success   | bool   | True if the pool wishes to proceed with settlement       |

### `onAfterSwap`

```solidity
function onAfterSwap(
    AfterSwapParams calldata params
) external returns (bool success, uint256 hookAdjustedAmountCalculatedRaw);
```
Called after a swap to give the Pool an opportunity to perform actions once the balances have been updated by the swap.

**Parameters:**

| Name      | Type               | Description                                              |
|-----------|--------------------|----------------------------------------------------------|
| params    | AfterSwapParams    | Swap parameters                                          |

**Returns:**

| Name                           | Type   | Description                                              |
|--------------------------------|--------|----------------------------------------------------------|
| success                        | bool   | True if the pool wishes to proceed with settlement       |
| hookAdjustedAmountCalculatedRaw| uint256| New amount calculated, modified by the hook              |

### `onComputeDynamicSwapFeePercentage`

```solidity
function onComputeDynamicSwapFeePercentage(
    PoolSwapParams calldata params,
    address pool,
    uint256 staticSwapFeePercentage
) external view returns (bool success, uint256 dynamicSwapFeePercentage);
```
Called after `onBeforeSwap` and before the main swap operation, if the pool has dynamic fees.

**Parameters:**

| Name                    | Type             | Description                                  |
|-------------------------|------------------|----------------------------------------------|
| params                  | PoolSwapParams   | Swap parameters                              |
| pool                    | address          | Address of the pool                          |
| staticSwapFeePercentage | uint256          | Value of the static swap fee, for reference  |

**Returns:**

| Name           | Type   | Description                                              |
|----------------|--------|----------------------------------------------------------|
| success        | bool   | True if the pool wishes to proceed with settlement       |
| dynamicSwapFeePercentage | uint256| Value of the swap fee                          |

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>