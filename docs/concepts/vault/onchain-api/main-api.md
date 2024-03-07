---
order: 1
title: Main API
---

## Transient Accounting

### lock

```solidity
/**
 * @notice Creates a lock context for a sequence of operations.
 * @dev Performs a callback on msg.sender with arguments provided in `data`. The Callback is `transient`,
 * meaning all balances for the caller have to be settled at the end.
 *
 * @param data Contains function signature and args to be passed to the msg.sender
 * @return result Resulting data from the call
 */
function lock(bytes calldata data) external payable returns (bytes memory result);
```

This function creates a lock context for a sequence of operations.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| data                  | `bytes`   | Contains function signature and args to be passed to the msg.sender. |
| result                | `bytes`   | Resulting data from the call. |

### settle

```solidity
/**
 * @notice Settles deltas for a token; must be successful for the current lock to be released.
 * @param token Token's address
 * @return paid Amount paid during settlement
 */
function settle(IERC20 token) external returns (uint256 paid);
```

This function settles deltas for a token; must be successful for the current lock to be released.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| token                 | `IERC20`  | Token's address. |
| paid                  | `uint256` | Amount paid during settlement. |

### sendTo

```solidity
/**
 * @notice Sends tokens to a recipient.
 * @param token Token's address
 * @param to Recipient's address
 * @param amount Amount of tokens to send
 */
function sendTo(IERC20 token, address to, uint256 amount) external;
```

This function sends tokens to a recipient.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| token                 | `IERC20`  | Token's address. |
| to                    | `address` | Recipient's address. |
| amount                | `uint256` | Amount of tokens to send. |

### takeFrom

```solidity
/**
 * @notice Transfers tokens from a sender to the Vault.
 * @dev This function can transfer tokens from users using allowances granted to the Vault.
 * Only trusted routers are permitted to call it. Untrusted routers should use `settle` instead.
 *
 * @param token Token's address
 * @param from Sender's address
 * @param amount Amount of tokens to pull from the sender into the Vault
 */
function takeFrom(IERC20 token, address from, uint256 amount) external;
```

This function transfers tokens from a sender to the Vault.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| token                 | `IERC20`  | Token's address. |
| from                  | `address` | Sender's address. |
| amount                | `uint256` | Amount of tokens to pull from the sender into the Vault. |

## Add liquidity

### addLiquidity

```solidity
/**
 * @notice Adds liquidity to a pool.
 * @dev Caution should be exercised when adding liquidity because the Vault has the capability
 * to transfer tokens from any user, given that it holds all allowances.
 *
 * @param params Parameters for the add liquidity (see above for struct definition)
 * @return amountsIn Actual amounts of input tokens
 * @return bptAmountOut Output pool token amount
 * @return returnData Arbitrary (optional) data with encoded response from the pool
 */
function addLiquidity(
    AddLiquidityParams memory params
) external returns (uint256[] memory amountsIn, uint256 bptAmountOut, bytes memory returnData);
```

This function adds liquidity to a pool.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| params                | `AddLiquidityParams` | Parameters for the add liquidity. |
| amountsIn             | `uint256[]` | Actual amounts of input tokens. |
| bptAmountOut          | `uint256` | Output pool token amount. |
| returnData            | `bytes` | Arbitrary (optional) data with encoded response from the pool. |

## Remove liquidity

### removeLiquidity

```solidity
/**
 * @notice Removes liquidity from a pool.
 * @dev Trusted routers can burn pool tokens belonging to any user and require no prior approval from the user.
 * Untrusted routers require prior approval from the user. This is the only function allowed to call
 * _queryModeBalanceIncrease (and only in a query context).
 *
 * @param params Parameters for the remove liquidity (see above for struct definition)
 * @return bptAmountIn Actual amount of BPT burnt
 * @return amountsOut Actual amounts of output tokens
 * @return returnData Arbitrary (optional) data with encoded response from the pool
 */
function removeLiquidity(
    RemoveLiquidityParams memory params
) external returns (uint256 bptAmountIn, uint256[] memory amountsOut, bytes memory returnData);
```

This function removes liquidity from a pool.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| params                | `RemoveLiquidityParams` | Parameters for the remove liquidity. |
| bptAmountIn           | `uint256` | Actual amount of BPT burnt. |
| amountsOut            | `uint256[]` | Actual amounts of output tokens. |
| returnData            | `bytes` | Arbitrary (optional) data with encoded response from the pool. |

## Swap

### swap

```solidity
/**
 * @notice Swaps tokens based on provided parameters.
 * @dev All parameters are given in raw token decimal encoding.
 * @param params Parameters for the swap (see above for struct definition)
 * @return amountCalculatedRaw Calculated swap amount
 * @return amountInRaw Amount of input tokens for the swap
 * @return amountOutRaw Amount of output tokens from the swap
 */
function swap(
    SwapParams memory params
) external returns (uint256 amountCalculatedRaw, uint256 amountInRaw, uint256 amountOutRaw);
```

This function swaps tokens based on provided parameters.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| params                | `SwapParams` | Parameters for the swap. |
| amountCalculatedRaw   | `uint256` | Calculated swap amount. |
| amountInRaw           | `uint256` | Amount of input tokens for the swap. |
| amountOutRaw          | `uint256` | Amount of output tokens from the swap. |

## Pool Information

### getPoolTokenCountAndIndexOfToken

```solidity
/**
 * @notice Gets the index of a token in a given pool.
 * @dev Reverts if the pool is not registered, or if the token does not belong to the pool.
 * @param pool Address of the pool
 * @param token Address of the token
 * @return tokenCount Number of tokens in the pool
 * @return index Index corresponding to the given token in the pool's token list
 */
function getPoolTokenCountAndIndexOfToken(address pool, IERC20 token) external view returns (uint256, uint256);
```

This function gets the index of a token in a given pool.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| pool                  | `address` | Address of the pool. |
| token                 | `IERC20`  | Address of the token. |
| tokenCount            | `uint256` | Number of tokens in the pool. |
| index                 | `uint256` | Index corresponding to the given token in the pool's token list. |

## Authentication

### getAuthorizer

```solidity
/**
 * @notice Returns the Vault's Authorizer.
 * @return Address of the authorizer
 */
function getAuthorizer() external view returns (IAuthorizer);
```

This function returns the Vault's Authorizer.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| Authorizer            | `IAuthorizer` | Address of the authorizer. |

## Misc

### getVaultExtension

```solidity
/**
 * @notice Returns the Vault Extension address.
 */
function getVaultExtension() external view returns (address);
```

This function returns the Vault Extension address.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| Vault Extension       | `address` | The Vault Extension address. |
