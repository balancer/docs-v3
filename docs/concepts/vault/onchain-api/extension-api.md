---
order: 3
title: Extension API
---

## Transient accounting

### getLocker

```solidity
/**
 * @notice Returns the address at the specified index of the _lockers array.
 * @param index The index of the locker's address to fetch
 * @return The address at the given index
 */
function getLocker(uint256 index) external view returns (address);
```

This function returns the address at the specified index of the _lockers array.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| index                 | `uint256` | The index of the locker's address to fetch. |
| locker                | `address` | The address at the given index. |

### getLockersCount

```solidity
/**
 * @notice Returns the total number of lockers.
 * @return The number of lockers
 */
function getLockersCount() external view returns (uint256);
```

This function returns the total number of lockers.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| lockersCount          | `uint256` | The total number of lockers. |

### getNonzeroDeltaCount

```solidity
/**
 *  @notice Returns the count of non-zero deltas.
 *  @return The current value of _nonzeroDeltaCount
 */
function getNonzeroDeltaCount() external view returns (uint256);
```

This function returns the count of non-zero deltas.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| nonzeroDeltaCount     | `uint256` | The count of non-zero deltas. |

### getTokenDelta

```solidity
/**
 * @notice Retrieves the token delta for a specific user and token.
 * @dev This function allows reading the value from the `_tokenDeltas` mapping.
 * @param user The address of the user for whom the delta is being fetched
 * @param token The token for which the delta is being fetched
 * @return The delta of the specified token for the specified user
 */
function getTokenDelta(address user, IERC20 token) external view returns (int256);
```

This function retrieves the token delta for a specific user and token.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| user                  | `address` | The address of the user for whom the delta is being fetched. |
| token                 | `IERC20`  | The token for which the delta is being fetched. |
| tokenDelta            | `int256`  | The delta of the specified token for the specified user. |

### getTokenReserve

```solidity
/**
 * @notice Retrieves the reserve of a given token.
 * @param token The token for which to retrieve the reserve
 * @return The amount of reserves for the given token
 */
function getTokenReserve(IERC20 token) external view returns (uint256);
```

This function retrieves the reserve of a given token.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| token                 | `IERC20`  | The token for which to retrieve the reserve. |
| tokenReserve          | `uint256` | The amount of reserves for the given token. |

## Pool registration

### registerPool

```solidity
/**
 * @notice Registers a pool, associating it with its factory and the tokens it manages.
 * @dev A pool can opt-out of pausing by providing a zero value for the pause window, or allow pausing indefinitely
 * by providing a large value. (Pool pause windows are not limited by the Vault maximums.) The vault defines an
 * additional buffer period during which a paused pool will stay paused. After the buffer period passes, a paused
 * pool will automatically unpause.
 *
 * A pool can opt out of Balancer governance pausing by providing a custom `pauseManager`. This might be a
 * multi-sig contract or an arbitrary smart contract with its own access controls, that forwards calls to
 * the Vault.
 *
 * If the zero address is provided for the `pauseManager`, permissions for pausing the pool will default to the
 * authorizer.
 *
 * @param pool The address of the pool being registered
 * @param tokenConfig An array of descriptors for the tokens the pool will manage
 * @param pauseWindowEndTime The timestamp after which it is no longer possible to pause the pool
 * @param pauseManager Optional contract the Vault will allow to pause the pool
 * @param hookConfig Flags indicating which hooks the pool supports
 * @param liquidityManagement Liquidity management flags with implemented methods
 */
function registerPool(
    address pool,
    TokenConfig[] memory tokenConfig,
    uint256 pauseWindowEndTime,
    address pauseManager,
    PoolHooks calldata hookConfig,
    LiquidityManagement calldata liquidityManagement
) external;
```

This function registers a pool, associating it with its factory and the tokens it manages.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| pool                  | `address` | The address of the pool being registered. |
| tokenConfig           | `TokenConfig[]` | An array of descriptors for the tokens the pool will manage. |
| pauseWindowEndTime    | `uint256` | The timestamp after which it is no longer possible to pause the pool. |
| pauseManager          | `address` | Optional contract the Vault will allow to pause the pool. |
| hookConfig            | `PoolHooks` | Flags indicating which hooks the pool supports. |
| liquidityManagement   | `LiquidityManagement` | Liquidity management flags with implemented methods. |

### isPoolRegistered

```solidity
/**
 * @notice Checks whether a pool is registered.
 * @param pool Address of the pool to check
 * @return True if the pool is registered, false otherwise
 */
function isPoolRegistered(address pool) external view returns (bool);
```

This function checks whether a pool is registered.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| pool                  | `address` | Address of the pool to check. |
| isRegistered          | `bool`  | True if the pool is registered, false otherwise. |

### initialize

```solidity
/**
 * @notice Initializes a registered pool by adding liquidity; mints BPT tokens for the first time in exchange.
 * @param pool Address of the pool to initialize
 * @param to Address that will receive the output BPT
 * @param tokens Tokens used to seed the pool (must match the registered tokens)
 * @param exactAmountsIn Exact amounts of input tokens
 * @param minBptAmountOut Minimum amount of output pool tokens
 * @param userData Additional (optional) data required for adding initial liquidity
 * @return bptAmountOut Output pool token amount
 */
function initialize(
    address pool,
    address to,
    IERC20[] memory tokens,
    uint256[] memory exactAmountsIn,
    uint256 minBptAmountOut,
    bytes memory userData
) external returns (uint256 bptAmountOut);
```

This function initializes a registered pool by adding liquidity; mints BPT tokens for the first time in exchange.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| pool                  | `address` | Address of the pool to initialize. |
| to                    | `address` | Address that will receive the output BPT. |
| tokens                | `IERC20[]` | Tokens used to seed the pool (must match the registered tokens). |
| exactAmountsIn        | `uint256[]` | Exact amounts of input tokens. |
| minBptAmountOut       | `uint256` | Minimum amount of output pool tokens. |
| userData              | `bytes` | Additional (optional) data required for adding initial liquidity. |
| bptAmountOut          | `uint256` | Output pool token amount. |

## Pool information

### isPoolInitialized

```solidity
/**
 * @notice Checks whether a pool is initialized.
 * @dev An initialized pool can be considered registered as well.
 * @param pool Address of the pool to check
 * @return True if the pool is initialized, false otherwise
 */
function isPoolInitialized(address pool) external view returns (bool);
```

This function checks whether a pool is initialized.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| pool                  | `address` | Address of the pool to check. |
| isInitialized         | `bool`  | True if the pool is initialized, false otherwise. |

### getPoolTokens

```solidity
/**
 * @notice Gets the tokens registered to a pool.
 * @param pool Address of the pool
 * @return tokens List of tokens in the pool
 */
function getPoolTokens(address pool) external view returns (IERC20[] memory);
```

This function gets the tokens registered to a pool.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| pool                  | `address` | Address of the pool. |
| tokens                | `IERC20[]` | List of tokens in the pool. |

### getPoolTokenInfo

```solidity
/**
 * @notice Gets the raw data for a pool: tokens, raw balances, scaling factors.
 * @return tokens Tokens registered to the pool
 * @return tokenTypes The types of all registered tokens
 * @return balancesRaw Corresponding raw balances of the tokens
 * @return scalingFactors Corresponding scalingFactors of the tokens
 * @return rateProviders Corresponding rateProviders of the tokens (or zero for tokens with no rates)
 */
function getPoolTokenInfo(
    address pool
)
    external
    view
    returns (IERC20[] memory, TokenType[] memory, uint256[] memory, uint256[] memory, IRateProvider[] memory);
```

This function gets the raw data for a pool: tokens, raw balances, scaling factors.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| pool                  | `address` | Address of the pool. |
| tokens                | `IERC20[]` | Tokens registered to the pool. |
| tokenTypes            | `TokenType[]` | The types of all registered tokens. |
| balancesRaw           | `uint256[]` | Corresponding raw balances of the tokens. |
| scalingFactors        | `uint256[]` | Corresponding scalingFactors of the tokens. |
| rateProviders         | `IRateProvider[]` | Corresponding rateProviders of the tokens (or zero for tokens with no rates). |

### getPoolConfig

```solidity
/**
 * @notice Gets the configuration parameters of a pool.
 * @param pool Address of the pool
 * @return Pool configuration
 */
function getPoolConfig(address pool) external view returns (PoolConfig memory);
```

This function gets the configuration parameters of a pool.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| pool                  | `address` | Address of the pool. |
| PoolConfig            | `PoolConfig` | Pool configuration. |

## Pool Tokens

### totalSupply

```solidity
/**
 * @notice Gets total supply of a given ERC20 token.
 * @param token Token's address
 * @return Total supply of the token
 */
function totalSupply(address token) external view returns (uint256);
```

This function gets the total supply of a given ERC20 token.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| token                 | `address` | Token's address. |
| Total supply          | `uint256` | Total supply of the token. |

### balanceOf

```solidity
/**
 * @notice Gets balance of an account for a given ERC20 token.
 * @param token Token's address
 * @param account Account's address
 * @return Balance of the account for the token
 */
function balanceOf(address token, address account) external view returns (uint256);
```

This function gets the balance of an account for a given ERC20 token.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| token                 | `address` | Token's address. |
| account               | `address` | Account's address. |
| Balance               | `uint256` | Balance of the account for the token. |

### allowance

```solidity
/**
 * @notice Gets allowance of a spender for a given ERC20 token and owner.
 * @param token Token's address
 * @param owner Owner's address
 * @param spender Spender's address
 * @return Amount of tokens the spender is allowed to spend
 */
function allowance(address token, address owner, address spender) external view returns (uint256);
```

This function gets the allowance of a spender for a given ERC20 token and owner.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| token                 | `address` | Token's address. |
| owner                 | `address` | Owner's address. |
| spender               | `address` | Spender's address. |
| Allowance             | `uint256` | Amount of tokens the spender is allowed to spend. |

### transfer

```solidity
/**
 * @notice Transfers pool token from owner to a recipient.
 * @dev Notice that the pool token address is not included in the params. This function is exclusively called by
 * the pool contract, so msg.sender is used as the token address.
 *
 * @param owner Owner's address
 * @param to Recipient's address
 * @param amount Amount of tokens to transfer
 * @return True if successful, false otherwise
 */
function transfer(address owner, address to, uint256 amount) external returns (bool);
```

This function transfers pool token from owner to a recipient.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| owner                 | `address` | Owner's address. |
| to                    | `address` | Recipient's address. |
| amount                | `uint256` | Amount of tokens to transfer. |
| Success               | `bool`    | True if successful, false otherwise. |

### transferFrom

```solidity
/**
 * @notice Transfers pool token from a sender to a recipient using an allowance.
 * @dev Notice that the pool token address is not included in the params. This function is exclusively called by
 * the pool contract, so msg.sender is used as the token address.
 *
 * @param spender Address allowed to perform the transfer
 * @param from Sender's address
 * @param to Recipient's address
 * @param amount Amount of tokens to transfer
 * @return True if successful, false otherwise
 */
function transferFrom(address spender, address from, address to, uint256 amount) external returns (bool);
```

This function transfers pool token from a sender to a recipient using an allowance.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| spender               | `address` | Address allowed to perform the transfer. |
| from                  | `address` | Sender's address. |
| to                    | `address` | Recipient's address. |
| amount                | `uint256` | Amount of tokens to transfer. |
| Success               | `bool`    | True if successful, false otherwise. |

### approve

```solidity
/**
 * @notice Approves a spender to spend pool tokens on behalf of sender.
 * @dev Notice that the pool token address is not included in the params. This function is exclusively called by
 * the pool contract, so msg.sender is used as the token address.
 *
 * @param owner Owner's address
 * @param spender Spender's address
 * @param amount Amount of tokens to approve
 * @return True if successful, false otherwise
 */
function approve(address owner, address spender, uint256 amount) external returns (bool);
```

This function approves a spender to spend pool tokens on behalf of sender.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| owner                 | `address` | Owner's address. |
| spender               | `address` | Spender's address. |
| amount                | `uint256` | Amount of tokens to approve. |
| Success               | `bool`    | True if successful, false otherwise. |

## Pool pausing

### isPoolPaused

```solidity
/**
 * @notice Indicates whether a pool is paused.
 * @param pool The pool to be checked
 * @return True if the pool is paused
 */
function isPoolPaused(address pool) external view returns (bool);
```

This function indicates whether a pool is paused.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| pool                  | `address` | The pool to be checked. |
| isPaused              | `bool`    | True if the pool is paused. |

### getPoolPausedState

```solidity
/**
 * @notice Returns the paused status, and end times of the Pool's pause window and buffer period.
 * @dev Note that even when set to a paused state, the pool will automatically unpause at the end of
 * the buffer period.
 *
 * @param pool The pool whose data is requested
 * @return paused True if the Pool is paused
 * @return poolPauseWindowEndTime The timestamp of the end of the Pool's pause window
 * @return poolBufferPeriodEndTime The timestamp after which the Pool unpauses itself (if paused)
 * @return pauseManager The pause manager, or the zero address
 */
function getPoolPausedState(address pool) external view returns (bool, uint256, uint256, address);
```

This function returns the paused status, and end times of the Pool's pause window and buffer period.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| pool                  | `address` | The pool whose data is requested. |
| paused                | `bool`    | True if the Pool is paused. |
| poolPauseWindowEndTime| `uint256` | The timestamp of the end of the Pool's pause window. |
| poolBufferPeriodEndTime| `uint256` | The timestamp after which the Pool unpauses itself (if paused). |
| pauseManager          | `address` | The pause manager, or the zero address. |

## Fees

### getProtocolSwapFeePercentage

```solidity
/**
 * @notice Retrieves the current protocol swap fee percentage.
 * @return The current protocol swap fee percentage
 */
function getProtocolSwapFeePercentage() external view returns (uint256);
```

This function retrieves the current protocol swap fee percentage.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| Swap Fee Percentage   | `uint256` | The current protocol swap fee percentage. |

### getProtocolYieldFeePercentage

```solidity
/**
 * @notice Retrieves the current protocol yield fee percentage.
 * @return The current protocol yield fee percentage
 */
function getProtocolYieldFeePercentage() external view returns (uint256);
```

This function retrieves the current protocol yield fee percentage.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| Yield Fee Percentage  | `uint256` | The current protocol yield fee percentage. |

### getProtocolFees

```solidity
/**
 * @notice Returns the accumulated swap and yield fee in `token` collected by the protocol.
 * @param token The address of the token in which fees have been accumulated
 * @return The total amount of fees accumulated in the specified token
 */
function getProtocolFees(address token) external view returns (uint256);
```

This function returns the accumulated swap and yield fee in `token` collected by the protocol.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| token                 | `address` | The address of the token in which fees have been accumulated. |
| Fees                  | `uint256` | The total amount of fees accumulated in the specified token. |

### getStaticSwapFeePercentage

```solidity
/**
 * @notice Fetches the static swap fee percentage for a given pool.
 * @param pool The address of the pool whose static swap fee percentage is being queried
 * @return The current static swap fee percentage for the specified pool
 */
function getStaticSwapFeePercentage(address pool) external view returns (uint256);
```

This function fetches the static swap fee percentage for a given pool.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| pool                  | `address` | The address of the pool whose static swap fee percentage is being queried. |
| Swap Fee Percentage   | `uint256` | The current static swap fee percentage for the specified pool. |

## Recovery Mode

### isPoolInRecoveryMode

```solidity
/**
 * @notice Checks whether a pool is in recovery mode.
 * @param pool Address of the pool to check
 * @return True if the pool is initialized, false otherwise
 */
function isPoolInRecoveryMode(address pool) external view returns (bool);
```

This function checks whether a pool is in recovery mode.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| pool                  | `address` | Address of the pool to check. |
| isInRecoveryMode      | `bool`    | True if the pool is in recovery mode, false otherwise. |

### removeLiquidityRecovery

```solidity
/**
 * @notice Remove liquidity from a pool specifying exact pool tokens in, with proportional token amounts out.
 * The request is implemented by the Vault without any interaction with the pool, ensuring that
 * it works the same for all pools, and cannot be disabled by a new pool type.
 *
 * @param pool Address of the pool
 * @param from Address of user to burn pool tokens from
 * @param exactBptAmountIn Input pool token amount
 * @return amountsOut Actual calculated amounts of output tokens, sorted in token registration order
 */
function removeLiquidityRecovery(
    address pool,
    address from,
    uint256 exactBptAmountIn
) external returns (uint256[] memory amountsOut);
```

This function removes liquidity from a pool specifying exact pool tokens in, with proportional token amounts out.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| pool                  | `address` | Address of the pool. |
| from                  | `address` | Address of user to burn pool tokens from. |
| exactBptAmountIn      | `uint256` | Input pool token amount. |
| amountsOut            | `uint256[]` | Actual calculated amounts of output tokens, sorted in token registration order. |


## Queries

### quote

```solidity
/**
 * @notice Performs a callback on msg.sender with arguments provided in `data`.
 * @dev Used to query a set of operations on the Vault. Only off-chain eth_call are allowed,
 * anything else will revert.
 *
 * Allows querying any operation on the Vault that has the `withLocker` modifier.
 *
 * Allows the external calling of a function via the Vault contract to
 * access Vault's functions guarded by `withLocker`.
 * `transient` modifier ensuring balances changes within the Vault are settled.
 *
 * @param data Contains function signature and args to be passed to the msg.sender
 * @return result Resulting data from the call
 */
function quote(bytes calldata data) external payable returns (bytes memory result);
```

This function performs a callback on msg.sender with arguments provided in `data`.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| data                  | `bytes`   | Contains function signature and args to be passed to the msg.sender. |
| result                | `bytes`   | Resulting data from the call. |

### isQueryDisabled

```solidity
/**
 * @notice Checks if the queries enabled on the Vault.
 * @return If true, then queries are disabled
 */
function isQueryDisabled() external view returns (bool);
```

This function checks if the queries are enabled on the Vault.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| isDisabled            | `bool`    | If true, then queries are disabled. |

## ERC4626 Buffers

### registerBuffer

```solidity
/**
 * @notice Register an ERC4626BufferPool, an "internal" pool to maintain a buffer of base tokens for swaps.
 * @param wrappedToken The ERC4626 token to be buffered
 * @param pool The pool associated with the buffer
 * @param pauseManager The pause manager associated with the pool
 * @param pauseWindowEndTime The pool's pause window end time
 */
function registerBuffer(
    IERC4626 wrappedToken,
    address pool,
    address pauseManager,
    uint256 pauseWindowEndTime
) external;
```

This function registers an ERC4626BufferPool, an "internal" pool to maintain a buffer of base tokens for swaps.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| wrappedToken          | `IERC4626`| The ERC4626 token to be buffered. |
| pool                  | `address` | The pool associated with the buffer. |
| pauseManager          | `address` | The pause manager associated with the pool. |
| pauseWindowEndTime    | `uint256` | The pool's pause window end time. |

## Default lockers

### getVaultAdmin

```solidity
/**
 * @notice Returns the Vault Admin contract address.
 */
function getVaultAdmin() external view returns (address);
```

This function returns the Vault Admin contract address.

| Name                  | Type      | Description   |
| --------------------- | --------- | ------------- |
| Vault Admin           | `address` | The Vault Admin contract address. |
