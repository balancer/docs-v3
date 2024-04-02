---
order: 1
title: Onchain API
---

# The Vault

:::info Use the Router for swap, add liquidity and remove liquidity operations 
The [Router](../router/overview.html) is the primary entry-point for the Balancer Protocol. It exposes developer friendly interfaces for complex protocol interactions.
:::

:::info Interacting with the Vault on-chain
The  Ethereum Virtual Machine (EVM) imposes bytecode restrictions that limit the size of deployed contracts. In order to achieve the desired functionality, the Vault exceeds
the bytecode limit of ###kb. To overcome this, the Vault inherits from OpenZeppelin's Proxy contract and leverages delegate calls,
allowing for the vault to utilize the functionality of more than one deployed smart contract.

When interacting with the Balancer Vault via solidity, it is recommended to cast the Vaults address to an `IVault`. You can find the interface [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IVault.sol) or as part of [this]() npm package.
:::

## Transient accounting

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
 * @return amountsOut Actual calculated amounts of output tokens, sorted in token alphanumeric order
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
| amountsOut            | `uint256[]` | Actual calculated amounts of output tokens, sorted in token alphanumeric order. |


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

## Admin functionalities

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


<style scoped>
table {
    display: table;
    width: 100%;
}
table th:first-of-type, td:first-of-type {
    width: 30%;
}
table th:nth-of-type(2) {
    width: 40%;
}
td {
    max-width: 0;
    overflow: hidden;
}
</style>

