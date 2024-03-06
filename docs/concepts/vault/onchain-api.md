---
order: 0
title: Onchain API
---

# Intro


# Admin context

### getPauseWindowEndTime

```solidity
/**
 * @notice Returns Vault's pause window end time.
 * @dev This value is immutable; the getter can be called by anyone.
 */
function getPauseWindowEndTime() external view returns (uint256);
```

This function is used to retrieve the end time of the Vault's pause window. The pause window is a period during which the Vault's operations are suspended. This function does not require any parameters and can be called by anyone due to its `external` visibility. The returned value is a `uint256` representing the end time of the pause window.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
|                       |           |               |
| pauseWindowEndTime    | `uint256` | The end time of the Vault's pause window. This value is immutable and can be retrieved by anyone. |


### getBufferPeriodDuration

```solidity
/**
 * @notice Returns Vault's buffer period duration.
 * @dev This value is immutable; the getter can be called by anyone.
 */
function getBufferPeriodDuration() external view returns (uint256);
```

This function returns the duration of the Vault's buffer period. This value is immutable and can be retrieved by anyone.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| bufferPeriodDuration  | `uint256` | The duration of the Vault's buffer period. This value is immutable and can be retrieved by anyone. |

### getBufferPeriodEndTime

```solidity
/**
 * @notice Returns Vault's buffer period end time.
 * @dev This value is immutable; the getter can be called by anyone.
 */
function getBufferPeriodEndTime() external view returns (uint256);
```

This function returns the end time of the Vault's buffer period. This value is immutable and can be retrieved by anyone.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| bufferPeriodEndTime   | `uint256` | The end time of the Vault's buffer period. This value is immutable and can be retrieved by anyone. |

### getMinimumPoolTokens

```solidity
/**
 * @notice Get the minimum number of tokens in a pool.
 * @dev We expect the vast majority of pools to be 2-token.
 * @return The token count of a minimal pool
 */
function getMinimumPoolTokens() external pure returns (uint256);
```

This function returns the minimum number of tokens that can be in a pool. It is expected that the vast majority of pools will be 2-token pools.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| minimumPoolTokens     | `uint256` | The minimum number of tokens that can be in a pool. |

### getMaximumPoolTokens

```solidity
/**
 * @notice Get the maximum number of tokens in a pool.
 * @return The token count of a minimal pool
 */
function getMaximumPoolTokens() external pure returns (uint256);
```

This function returns the maximum number of tokens that can be in a pool.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| maximumPoolTokens     | `uint256` | The maximum number of tokens that can be in a pool. |

### vault

```solidity
/// @dev Returns the main Vault address.
function vault() external view returns (IVault);
```

This function returns the main Vault address.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| vault                 | `IVault`  | The main Vault address. |

### getPoolTokenRates

```solidity
/**
 * @notice Retrieve the scaling factors from a pool's rate providers.
 * @dev This is not included in `getPoolTokenInfo` since it makes external calls that might revert,
 * effectively preventing retrieval of basic pool parameters. Tokens without rate providers will always return
 * FixedPoint.ONE (1e18).
 */
function getPoolTokenRates(address pool) external view returns (uint256[] memory);
```

This function retrieves the scaling factors from a pool's rate providers. If a token does not have a rate provider, it will return FixedPoint.ONE (1e18).

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| pool                  | `address` | The address of the pool from which to retrieve the scaling factors. |
| poolTokenRates        | `uint256[]` | The scaling factors from the pool's rate providers. |

### isVaultPaused

```solidity
/**
 * @notice Indicates whether the Vault is paused.
 * @return True if the Vault is paused
 */
function isVaultPaused() external view returns (bool);
```

This function indicates whether the Vault is paused.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| isVaultPaused         | `bool`  | Indicates whether the Vault is paused. |

### getVaultPausedState

```solidity
/**
 * @notice Returns the paused status, and end times of the Vault's pause window and buffer period.
 * @return paused True if the Vault is paused
 * @return vaultPauseWindowEndTime The timestamp of the end of the Vault's pause window
 * @return vaultBufferPeriodEndTime The timestamp of the end of the Vault's buffer period
 */
function getVaultPausedState() external view returns (bool, uint256, uint256);
```

This function returns the paused status, and end times of the Vault's pause window and buffer period.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| paused                | `bool`  | Indicates whether the Vault is paused. |
| vaultPauseWindowEndTime | `uint256` | The timestamp of the end of the Vault's pause window. |
| vaultBufferPeriodEndTime | `uint256` | The timestamp of the end of the Vault's buffer period. |

### pauseVault

```solidity
/**
 * @notice Pause the Vault: an emergency action which disables all operational state-changing functions.
 * @dev This is a permissioned function that will only work during the Pause Window set during deployment.
 */
function pauseVault() external;
```

This function pauses the Vault, disabling all operational state-changing functions.

### unpauseVault

```solidity
/**
 * @notice Reverse a `pause` operation, and restore the Vault to normal functionality.
 * @dev This is a permissioned function that will only work on a paused Vault within the Buffer Period set during
 * deployment. Note that the Vault will automatically unpause after the Buffer Period expires.
 */
function unpauseVault() external;
```

This function reverses a `pause` operation, restoring the Vault to normal functionality.

### pausePool

```solidity
/**
 * @notice Pause the Pool: an emergency action which disables all pool functions.
 * @dev This is a permissioned function that will only work during the Pause Window set during pool factory
 * deployment.
 */
function pausePool(address pool) external;
```

This function pauses a Pool, disabling all its functions.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| pool                  | `address` | The address of the pool to be paused. |

### unpausePool

```solidity
/**
 * @notice Reverse a `pause` operation, and restore the Pool to normal functionality.
 * @dev This is a permissioned function that will only work on a paused Pool within the Buffer Period set during
 * deployment. Note that the Pool will automatically unpause after the Buffer Period expires.
 */
function unpausePool(address pool) external;
```

This function reverses a `pause` operation on a Pool, restoring it to normal functionality.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| pool                  | `address` | The address of the pool to be unpaused. |

### setProtocolSwapFeePercentage

```solidity
/**
 * @notice Sets a new swap fee percentage for the protocol.
 * @param newSwapFeePercentage The new swap fee percentage to be set
 */
function setProtocolSwapFeePercentage(uint256 newSwapFeePercentage) external;
```

This function sets a new swap fee percentage for the protocol.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| newSwapFeePercentage  | `uint256` | The new swap fee percentage to be set for the protocol. |

### setProtocolYieldFeePercentage

```solidity
/**
 * @notice Sets a new yield fee percentage for the protocol.
 * @param newYieldFeePercentage The new swap fee percentage to be set
 */
function setProtocolYieldFeePercentage(uint256 newYieldFeePercentage) external;
```

This function sets a new yield fee percentage for the protocol.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| newYieldFeePercentage | `uint256` | The new yield fee percentage to be set for the protocol. |

### setStaticSwapFeePercentage

```solidity
/**
 * @notice Assigns a new static swap fee percentage to the specified pool.
 * @param pool The address of the pool for which the static swap fee will be changed
 * @param swapFeePercentage The new swap fee percentage to apply to the pool
 */
function setStaticSwapFeePercentage(address pool, uint256 swapFeePercentage) external;
```

This function assigns a new static swap fee percentage to the specified pool.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| pool                  | `address` | The address of the pool for which the static swap fee will be changed. |
| swapFeePercentage     | `uint256` | The new swap fee percentage to apply to the pool. |

### collectProtocolFees

```solidity
/**
 * @notice Collects accumulated protocol fees for the specified array of tokens.
 * @dev Fees are sent to msg.sender.
 * @param tokens An array of token addresses for which the fees should be collected
 */
function collectProtocolFees(IERC20[] calldata tokens) external;
```

This function collects accumulated protocol fees for the specified array of tokens. The fees are sent to the caller of the function.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| tokens                | `IERC20[]` | An array of token addresses for which the fees should be collected. |

### enableRecoveryMode

```solidity
/**
 * @notice Enable recovery mode for a pool.
 * @dev This is a permissioned function.
 * @param pool The pool
 */
function enableRecoveryMode(address pool) external;
```

This function enables recovery mode for a pool. It is a permissioned function.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| pool                  | `address` | The address of the pool for which to enable recovery mode. |

### disableRecoveryMode

```solidity
/**
 * @notice Disable recovery mode for a pool.
 * @dev This is a permissioned function.
 * @param pool The pool
 */
function disableRecoveryMode(address pool) external;
```

This function disables recovery mode for a pool. It is a permissioned function.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| pool                  | `address` | The address of the pool for which to disable recovery mode. |

### disableQuery

```solidity
/// @notice Disables queries functionality on the Vault. Can be called only by governance.
function disableQuery() external;
```

This function disables the query functionality on the Vault. It can only be called by governance.

### registerBufferPoolFactory

```solidity
/**
 * @notice Add an ERC4626 Buffer Pool factory to the allowlist for registering buffers.
 * @dev Since creating buffers is permissionless, and buffers are mapped 1-to-1 to pools (and cannot
 * be removed), it would be possible to register a malicious buffer pool for a desirable wrapped token,
 * blocking registration of the legitimate one.
 *
 * This way, we can validate Buffer Pool contracts and prevent the issue described above, while retaining
 * the flexibility to upgrade the Buffer Pool implementation, and support partner innovation, in case a
 * wrapper arises that is incompatible with the standard Buffer Pool.
 *
 * @param factory The factory to add to the allowlist
 */
function registerBufferPoolFactory(address factory) external;
```

This function adds an ERC4626 Buffer Pool factory to the allowlist for registering buffers.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| factory               | `address` | The address of the factory to add to the allowlist. |

### deregisterBufferPoolFactory

```solidity
/**
 * @notice Remove an ERC4626 Buffer Pool factory from the allowlist for registering buffers.
 * @dev For maximum flexibility, there are separate functions for registration and deregistration,
 * so that permissions can be assigned separately.
 *
 * @param factory The factory to remove from the allowlist
 */
function deregisterBufferPoolFactory(address factory) external;
```

This function removes an ERC4626 Buffer Pool factory from the allowlist for registering buffers.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| factory               | `address` | The address of the factory to remove from the allowlist. |

### setAuthorizer

```solidity
/**
 * @notice Sets a new Authorizer for the Vault.
 * @dev The caller must be allowed by the current Authorizer to do this.
 * Emits an `AuthorizerChanged` event.
 */
function setAuthorizer(IAuthorizer newAuthorizer) external;
```

This function sets a new Authorizer for the Vault. The caller must be allowed by the current Authorizer to do this.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| newAuthorizer         | `IAuthorizer` | The new Authorizer for the Vault. |