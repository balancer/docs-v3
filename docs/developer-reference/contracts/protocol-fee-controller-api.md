---
order: 8
title: Protocol Fee Controller API
---

# ProtocolFeesController

The protocol Fees controller is used to manage protocol and pool creator fees for the Vault. Like the authorizer, it can be updated through governance.

### `collectAggregateFees`

```solidity
function collectAggregateFees(address pool) external;
```
This function collects accumulated aggregate swap and yield fees for the specified pool. It makes a permissioned call on `collectAggregateFees` in the Vault to calculate the fee amounts, then calls `sendTo` to transfer the tokens, after which they are distributed to the protocol and pool creator balances. As this affects Vault accounting, it is invoked through `unlock` and a local "hook", with the ProtocolFeeController acting as the "Router". The Vault function supplies credit for the tokens to be taken as fees, and the fee controller takes debt (through `sendTo`), ensuring valid settlement.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool on which all aggregate fees should be collected  |

### `getGlobalProtocolSwapFeePercentage`

```solidity
function getGlobalProtocolSwapFeePercentage() external view returns (uint256);
```
This function returns the current global protocol swap fee percentage. This is the default value used for new pools deployed by standard factories.

### `getGlobalProtocolYieldFeePercentage`

```solidity
function getGlobalProtocolYieldFeePercentage() external view returns (uint256);
```
This function returns the current global protocol yield fee percentage. This is the default value used for new pools deployed by standard factories.

### `getPoolProtocolSwapFeeInfo`

```solidity
function getPoolProtocolSwapFeeInfo(address pool) external view returns (uint256, bool);
```
This function returns the current protocol swap fee for a given pool and a boolean indicating whether the protocol fee has been overridden by governance.
Only pools whose protocol fees have NOT been overridden can be permissionlessly updated using `updateProtocolSwapFeePercentage`.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool for which to get the protocol swap fee info  |

### `getPoolProtocolYieldFeeInfo`

```solidity
function getPoolProtocolYieldFeeInfo(address pool) external view returns (uint256, bool);
```
This function returns the current protocol yield fee for a given pool and a boolean indicating if the protocol fee has been overridden by governance.
Only pools whose protocol fees have NOT been overridden can be permissionlessly updated using `updateProtocolYieldFeePercentage`.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool for which to get the protocol yield fee info  |

### `getProtocolFeeAmounts`

```solidity
function getProtocolFeeAmounts(address pool) external view returns (uint256[] memory feeAmounts);
```
This function returns the amount of each pool token allocated to the protocol and available for withdrawal. It includes both swap and yield fees. Calling `collectAggregateFees` will transfer any pending fees from the Vault to the Protocol Fee Controller, and allocate them to the protocol and pool creator.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool on which fees were collected  |

### `getPoolCreatorFeeAmounts`

```solidity
function getPoolCreatorFeeAmounts(address pool) external view returns (uint256[] memory feeAmounts);
```
This function returns the amount of each pool token allocated to the pool creator and available for withdrawal. It includes both swap and yield fees. Calling `collectAggregateFees` on the Vault will transfer any pending fees from the Vault to the Protocol Fee Controller, and allocate them to the protocol and pool creator.

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
This function returns a calculated aggregate percentage from protocol and pool creator fee percentages. It's not tied to any particular pool; this just performs the low-level "additive fee" calculation. Note that this respects the Vault's 24-bit aggregate fee precision limit. If you try to set a fee such that the aggregate requires greater than 24-bit precision, this will revert.

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
This function adds pool-specific entries for protocol swap and yield percentages. This must be called from the Vault during pool registration. It will initialize the pool to the global protocol fee percentage values (or 0, if the `protocolFeeExempt` flag is set), and return the initial aggregate fee percentages, based on an initial pool creator fee of 0. The idea here is to allow protocols to "test" new pool types with zero fees. Governance can always override the protocol fee percentages: the exemption only sets the starting value, and does not mean the pool creator controls the protocol fee. (The pool creator does exclusively control pool creator fees.)

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool being registered  |
| poolCreator  | address  | The address of the pool creator (or 0 if there won't be a pool creator fee)  |
| protocolFeeExempt  | bool  | If true, the pool is initially exempt from protocol fees  |

### `setGlobalProtocolSwapFeePercentage`

```solidity
function setGlobalProtocolSwapFeePercentage(uint256 newProtocolSwapFeePercentage) external;
```
This function sets the global protocol swap fee percentage, used by standard pools. This is a permissioned call.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| newProtocolSwapFeePercentage  | uint256  | The new protocol swap fee percentage  |

### `setGlobalProtocolYieldFeePercentage`

```solidity
function setGlobalProtocolYieldFeePercentage(uint256 newProtocolYieldFeePercentage) external;
```
This function sets the global protocol yield fee percentage, used by standard pools. This is a permissioned call.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| newProtocolYieldFeePercentage  | uint256  | The new protocol yield fee percentage  |

### `setProtocolSwapFeePercentage`

```solidity
function setProtocolSwapFeePercentage(address pool, uint256 newProtocolSwapFeePercentage) external;
```
This function overrides the protocol swap fee percentage for a specific pool. This is a permissioned call.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool we are setting the protocol swap fee on  |
| newProtocolSwapFeePercentage  | uint256  | The new protocol swap fee percentage for the specific pool  |

### `setProtocolYieldFeePercentage`

```solidity
function setProtocolYieldFeePercentage(address pool, uint256 newProtocolYieldFeePercentage) external;
```
This function overrides the protocol yield fee percentage for a specific pool. This is a permissioned call.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool we are setting the protocol yield fee on  |
| newProtocolYieldFeePercentage  | uint256  | The new protocol yield fee percentage  |

### `setPoolCreatorSwapFeePercentage`

```solidity
function setPoolCreatorSwapFeePercentage(address pool, uint256 poolCreatorSwapFeePercentage) external;
```
This function assigns a new pool creator swap fee percentage to the specified pool. This is a permissioned call; the caller must be the pool creator.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The address of the pool for which the pool creator fee will be changed  |
| poolCreatorSwapFeePercentage  | uint256  | The new pool creator swap fee percentage to apply to the pool  |

### `setPoolCreatorYieldFeePercentage`

```solidity
function setPoolCreatorYieldFeePercentage(address pool, uint256 poolCreatorYieldFeePercentage) external;
```
This function assigns a new pool creator yield fee percentage to the specified pool. This is a permissioned call; the caller must be the pool creator.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The address of the pool for which the pool creator fee will be changed  |
| poolCreatorYieldFeePercentage  | uint256  | The new pool creator yield fee percentage to apply to the pool  |

### `withdrawProtocolFees`

```solidity
function withdrawProtocolFees(address pool, address recipient) external;
```
This function withdraws collected protocol fees for a given pool. It sends swap and yield protocol fees to the recipient. This is a permissioned call.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool on which fees were collected  |
| recipient  | address  | Address to send the tokens  |

### `withdrawPoolCreatorFees`

```solidity
function withdrawPoolCreatorFees(address pool, address recipient) external;
```
This function withdraws collected pool creator fees for a given pool. It sends swap and yield pool creator fees to the recipient. This is a permissioned call; the caller must be the pool creator.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool on which fees were collected  |
| recipient  | address  | Address to send the tokens  |

### `withdrawPoolCreatorFees`

```solidity
function withdrawPoolCreatorFees(address pool) external;
```
This function withdraws collected pool creator fees for a given pool. It sends swap and yield pool creator fees to the registered pool creator. Since there is no recipient, this is a permissionless call, allowing easier automation of fee collection.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool on which fees were collected  |
