---
order: 8
title: Protocol Fee collector API
---

# ProtocolFeesCollector

The protocol Fees collector is an upgradeable contract managing fee related activities.

### `getGlobalProtocolSwapFeePercentage`

```solidity
function getGlobalProtocolSwapFeePercentage() external view returns (uint256);
```
This function returns the current global protocol swap fee percentage.

### `getGlobalProtocolYieldFeePercentage`

```solidity
function getGlobalProtocolYieldFeePercentage() external view returns (uint256);
```
This function returns the current global protocol yield fee percentage.

### `getPoolProtocolSwapFeeInfo`

```solidity
function getPoolProtocolSwapFeeInfo(address pool) external view returns (uint256, bool);
```
This function returns the current protocol swap fee for a given pool and a boolean indicating if the protocol fee has been overridden.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool for which to get the protocol swap fee info  |

### `getPoolProtocolYieldFeeInfo`

```solidity
function getPoolProtocolYieldFeeInfo(address pool) external view returns (uint256, bool);
```
This function returns the current protocol yield fee for a given pool and a boolean indicating if the protocol fee has been overridden.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool for which to get the protocol yield fee info  |

### `getProtocolFeeAmounts`

```solidity
function getProtocolFeeAmounts(address pool) external view returns (uint256[] memory feeAmounts);
```
This function returns the amount of each pool token allocated to the protocol for withdrawal. It includes both swap and yield fees.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool on which fees were collected  |

### `getPoolCreatorFeeAmounts`

```solidity
function getPoolCreatorFeeAmounts(address pool) external view returns (uint256[] memory feeAmounts);
```
This function returns the amount of each pool token allocated to the pool creator for withdrawal. It includes both swap and yield fees.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool on which fees were collected  |

### `computeAggregateFeePercentage`

```solidity
function computeAggregateFeePercentage(
    uint256 protocolFeePercentage,
    uint256 poolCreatorFeePercentage
) external pure returns (uint256 aggregateFeePercentage);
```
This function returns a calculated aggregate percentage from protocol and pool creator fee percentages. It's not tied to any particular pool; this just performs the low-level "additive fee" calculation.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| protocolFeePercentage  | uint256  | The protocol portion of the aggregate fee percentage  |
| poolCreatorFeePercentage  | uint256  | The pool creator portion of the aggregate fee percentage  |

### `updateProtocolSwapFeePercentage`

```solidity
function updateProtocolSwapFeePercentage(address pool) external;
```
This function overrides the protocol swap fee percentage for a specific pool. This is a permissionless call, and will set the pool's fee to the current global fee, if it is different from the current value, and the fee is not controlled by governance (i.e., has never been overridden).

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool we are setting the protocol swap fee on  |

### `updateProtocolYieldFeePercentage`

```solidity
function updateProtocolYieldFeePercentage(address pool) external;
```
This function overrides the protocol yield fee percentage for a specific pool. This is a permissionless call, and will set the pool's fee to the current global fee, if it is different from the current value, and the fee is not controlled by governance (i.e., has never been overridden).

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool we are setting the protocol yield fee on  |

### `registerPool`

```solidity
function registerPool(
    address pool,
    address poolCreator,
    bool protocolFeeExempt
) external returns (uint256 aggregateSwapFeePercentage, uint256 aggregateYieldFeePercentage);
```
This function adds pool-specific entries to the protocol swap and yield percentages. This must be called from the Vault during pool registration. It will initialize the pool to the global protocol fee percentage values, and return the initial aggregate fee percentages, based on an initial pool creator fee of 0.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool being registered  |
| poolCreator  | address  | The address of the pool creator (or 0 if there won't be a pool creator fee)  |
| protocolFeeExempt  | bool  | If true, the pool is initially exempt from protocol fees  |

### `receiveAggregateFees`

```solidity
function receiveAggregateFees(
    address pool,
    uint256[] memory swapFeeAmounts,
    uint256[] memory yieldFeeAmounts
) external;
```
This function is called by the Vault when aggregate swap or yield fees are collected. This must be called from the Vault, during permissionless collection. Note that since charging protocol fees (i.e., distributing tokens between pool and fee balances) occurs in the Vault, but fee collection happens in the ProtocolFeeController, the swap fees reported here may encompass multiple operations.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool on which the swap fees were charged  |
| swapFeeAmounts  | uint256[]  | An array parallel to the pool tokens, with the swap fees collected in each token  |
| yieldFeeAmounts  | uint256[]  | An array parallel to the pool tokens, with the yield fees collected in each token  |

### `setGlobalProtocolSwapFeePercentage`

```solidity
function setGlobalProtocolSwapFeePercentage(uint256 newProtocolSwapFeePercentage) external;
```
This function sets the global protocol swap fee percentage, used by standard pools.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| newProtocolSwapFeePercentage  | uint256  | The new protocol swap fee percentage  |

### `setGlobalProtocolYieldFeePercentage`

```solidity
function setGlobalProtocolYieldFeePercentage(uint256 newProtocolYieldFeePercentage) external;
```
This function sets the global protocol yield fee percentage, used by standard pools.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| newProtocolYieldFeePercentage  | uint256  | The new protocol yield fee percentage  |

### `setProtocolSwapFeePercentage`

```solidity
function setProtocolSwapFeePercentage(address pool, uint256 newProtocolSwapFeePercentage) external;
```
This function overrides the protocol swap fee percentage for a specific pool.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool we are setting the protocol swap fee on  |
| newProtocolSwapFeePercentage  | uint256  | The new protocol swap fee percentage for the specific pool  |

### `setProtocolYieldFeePercentage`

```solidity
function setProtocolYieldFeePercentage(address pool, uint256 newProtocolYieldFeePercentage) external;
```
This function overrides the protocol yield fee percentage for a specific pool.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool we are setting the protocol yield fee on  |
| newProtocolYieldFeePercentage  | uint256  | The new protocol yield fee percentage  |

### `setPoolCreatorSwapFeePercentage`

```solidity
function setPoolCreatorSwapFeePercentage(address pool, uint256 poolCreatorSwapFeePercentage) external;
```
This function assigns a new pool creator swap fee percentage to the specified pool.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The address of the pool for which the pool creator fee will be changed  |
| poolCreatorSwapFeePercentage  | uint256  | The new pool creator swap fee percentage to apply to the pool  |

### `setPoolCreatorYieldFeePercentage`

```solidity
function setPoolCreatorYieldFeePercentage(address pool, uint256 poolCreatorYieldFeePercentage) external;
```
This function assigns a new pool creator yield fee percentage to the specified pool.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The address of the pool for which the pool creator fee will be changed  |
| poolCreatorYieldFeePercentage  | uint256  | The new pool creator yield fee percentage to apply to the pool  |

### `withdrawProtocolFees`

```solidity
function withdrawProtocolFees(address pool, address recipient) external;
```
This function withdraws collected protocol fees for a given pool. It sends swap and yield protocol fees to the recipient.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool on which fees were collected  |
| recipient  | address  | Address to send the tokens  |

### `withdrawPoolCreatorFees`

```solidity
function withdrawPoolCreatorFees(address pool, address recipient) external;
```
This function withdraws collected pool creator fees for a given pool. It sends swap and yield pool creator fees to the recipient.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool on which fees were collected  |
| recipient  | address  | Address to send the tokens  |