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
Optional hook to be executed before pool initialization.

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
Optional hook to be executed after pool initialization.

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
    uint256[] memory amountsInScaled18,
    uint256 bptAmountOut,
    uint256[] memory balancesScaled18,
    bytes memory userData
) external returns (bool success);
```
Optional hook to be executed after adding liquidity.

**Parameters:**

| Name              | Type               | Description                                              |
|-------------------|--------------------|----------------------------------------------------------|
| router            | address            | The address (usually a router contract) that initiated a swap operation on the Vault |
| amountsInScaled18 | uint256[] memory   | Scaled amounts of tokens added in token registration order |
| bptAmountOut      | uint256            | Amount of pool tokens minted                             |
| balancesScaled18  | uint256[] memory   | Current pool balances in token registration order        |
| userData          | bytes memory       | Additional (optional) data provided by the user          |

**Returns:**

| Name      | Type   | Description                                              |
|-----------|--------|----------------------------------------------------------|
| success   | bool   | True if the pool wishes to proceed with settlement       |

### `onBeforeRemoveLiquidity`

```solidity
function onBeforeRemoveLiquidity(
    address router,
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
    uint256 bptAmountIn,
    uint256[] memory amountsOutScaled18,
    uint256[] memory balancesScaled18,
    bytes memory userData
) external returns (bool success);
```
Optional hook to be executed after removing liquidity.

**Parameters:**

| Name              | Type               | Description                                              |
|-------------------|--------------------|----------------------------------------------------------|
| router            | address            | The address (usually a router contract) that initiated a swap operation on the Vault |
| bptAmountIn       | uint256            | Amount of pool tokens to burn                            |
| amountsOutScaled18| uint256[] memory   | Amount of tokens to receive in token registration order  |
| balancesScaled18  | uint256[] memory   | Current pool balances in token registration order        |
| userData          | bytes memory       | Additional (optional) data provided by the user          |

**Returns:**

| Name      | Type   | Description                                              |
|-----------|--------|----------------------------------------------------------|
| success   | bool   | True if the pool wishes to proceed with settlement       |

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

### `onComputeDynamicSwapFee`

```solidity
function onComputeDynamicSwapFee(
    PoolSwapParams calldata params,
    uint256 staticSwapFeePercentage
) external view returns (bool success, uint256 dynamicSwapFee);
```
Called before `onBeforeSwap` if the pool has dynamic fees.

**Parameters:**

| Name                    | Type                       | Description                                              |
|-------------------------|----------------------------|----------------------------------------------------------|
| params                  | PoolSwapParams   | Swap parameters                                          |
| staticSwapFeePercentage | uint256                    | Value of the static swap fee, for reference              |

**Returns:**

| Name           | Type   | Description                                              |
|----------------|--------|----------------------------------------------------------|
| success        | bool   | True if the pool wishes to proceed with settlement       |
| dynamicSwapFee | uint256| Value of the swap fee                                    |

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>