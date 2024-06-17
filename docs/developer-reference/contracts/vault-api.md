---
order: 6
title: Vault API
---

# The Vault

:::info Use the Router for swap, add liquidity and remove liquidity operations 
The [Router](../router/overview.html) is the primary entry-point for the Balancer Protocol. It exposes developer friendly interfaces for complex protocol interactions.
:::

:::info Interacting with the Vault on-chain
The  Ethereum Virtual Machine (EVM) imposes bytecode restrictions that limit the size of deployed contracts. In order to achieve the desired functionality, the Vault exceeds
the bytecode limit of 24.576 kb. To overcome this, the Vault inherits from OpenZeppelin's Proxy contract and leverages delegate calls,
allowing for the vault to utilize the functionality of more than one deployed smart contract.

When interacting with the Balancer Vault via solidity, it is recommended to cast the Vaults address to an `IVault`. You can find the interface [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IVault.sol).
:::

## Transient accounting
### unlock

```solidity
function unlock(bytes calldata data) external payable returns (bytes memory result);
```
This function creates a context for a sequence of operations, effectively "unlocking" the Vault. It performs a callback on `msg.sender` with arguments provided in `data`. The callback is `transient`, meaning all balances for the caller have to be settled at the end.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| data  | bytes  | Contains function signature and args to be passed to the msg.sender  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| result  | bytes  | Resulting data from the call  |

### settle

```solidity
function settle(IERC20 token) external returns (uint256 paid);
```
This function settles deltas for a token. This operation must be successful for the current lock to be released. It returns the amount paid during settlement.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| token  | IERC20  | Token's address  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| paid  | uint256  | Amount paid during settlement  |

### sendTo

```solidity
function sendTo(IERC20 token, address to, uint256 amount) external;
```
This function sends tokens to a recipient. There is no inverse operation for this function. To cancel debts, transfer funds to the Vault and call `settle`.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| token  | IERC20  | Token's address  |
| to  | address  | Recipient's address  |
| amount  | uint256  | Amount of tokens to send  |

### `isUnlocked`

```solidity
function isUnlocked() external view returns (bool);
```
This function returns True if the Vault is unlocked, false otherwise.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | bool  | True if the Vault is unlocked, false otherwise  |

### `getNonzeroDeltaCount`

```solidity
function getNonzeroDeltaCount() external view returns (uint256);
```
This function returns the count of non-zero deltas.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint256  | The current value of _nonzeroDeltaCount  |

### `getTokenDelta`

```solidity
function getTokenDelta(IERC20 token) external view returns (int256);
```
This function retrieves the token delta for a specific user and token.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| token  | IERC20  | The token for which the delta is being fetched  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | int256  | The delta of the specified token for the specified user  |

### `getReservesOf`

```solidity
function getReservesOf(IERC20 token) external view returns (uint256);
```
This function retrieves the reserve (i.e., total Vault balance) of a given token.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| token  | IERC20  | The token for which to retrieve the reserve  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint256  | The amount of reserves for the given token  |

## Add Liquidity
### addLiquidity

```solidity
function addLiquidity(
    AddLiquidityParams memory params
) external returns (uint256[] memory amountsIn, uint256 bptAmountOut, bytes memory returnData);
```
This function adds liquidity to a pool. Caution should be exercised when adding liquidity because the Vault has the capability to transfer tokens from any user, given that it holds all allowances. It returns the actual amounts of input tokens, the output pool token amount, and optional data with an encoded response from the pool.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| params  | AddLiquidityParams  | Parameters for the add liquidity operation  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| amountsIn  | uint256[]  | Actual amounts of input tokens  |
| bptAmountOut  | uint256  | Output pool token amount  |
| returnData  | bytes  | Arbitrary (optional) data with encoded response from the pool  |

## Remove liquidity
### `removeLiquidity`

```solidity
function removeLiquidity(
    RemoveLiquidityParams memory params
) external returns (uint256 bptAmountIn, uint256[] memory amountsOut, bytes memory returnData);
```
This function removes liquidity from a pool. Trusted routers can burn pool tokens belonging to any user and require no prior approval from the user. Untrusted routers require prior approval from the user. This is the only function allowed to call `_queryModeBalanceIncrease` (and only in a query context).

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| params  | RemoveLiquidityParams  | Parameters for the remove liquidity operation  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| bptAmountIn  | uint256  | Actual amount of BPT burnt  |
| amountsOut  | uint256[]  | Actual amounts of output tokens  |
| returnData  | bytes  | Arbitrary (optional) data with encoded response from the pool  |

## Swaps
### `swap`

```solidity
function swap(
    SwapParams memory params
) external returns (uint256 amountCalculatedRaw, uint256 amountInRaw, uint256 amountOutRaw);
```
This function swaps tokens based on provided parameters. All parameters are given in raw token decimal encoding.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| params  | SwapParams  | Parameters for the swap operation  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| amountCalculatedRaw  | uint256  | Calculated swap amount  |
| amountInRaw  | uint256  | Amount of input tokens for the swap  |
| amountOutRaw  | uint256  | Amount of output tokens from the swap  |

## Pool information
### `getPoolTokenCountAndIndexOfToken`

```solidity
function getPoolTokenCountAndIndexOfToken(address pool, IERC20 token) external view returns (uint256, uint256);
```
This function gets the index of a token in a given pool. It reverts if the pool is not registered, or if the token does not belong to the pool.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the pool  |
| token  | IERC20  | Address of the token  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| tokenCount  | uint256  | Number of tokens in the pool  |
| index  | uint256  | Index corresponding to the given token in the pool's token list  |

## Buffers
### `erc4626BufferWrapOrUnwrap`

```solidity
function erc4626BufferWrapOrUnwrap(
    BufferWrapOrUnwrapParams memory params
) external returns (uint256 amountCalculatedRaw, uint256 amountInRaw, uint256 amountOutRaw);
```
This function wraps/unwraps tokens based on provided parameters, using the buffer of the wrapped token when it has enough liquidity to avoid external calls. All parameters are given in raw token decimal encoding.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| params  | BufferWrapOrUnwrapParams  | Parameters for the wrap/unwrap operation  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| amountCalculatedRaw  | uint256  | Calculated swap amount  |
| amountInRaw  | uint256  | Amount of input tokens for the swap  |
| amountOutRaw  | uint256  | Amount of output tokens from the swap  |

## Misc
### `getVaultAdmin`

```solidity
function getVaultAdmin() external view returns (address);
```
This function returns the Vault Admin contract address.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | address  | The address of the Vault Admin contract  |

### `getAuthorizer`

```solidity
function getAuthorizer() external view returns (IAuthorizer);
```
This function returns the Vault's Authorizer.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | IAuthorizer  | Address of the authorizer  |

### `getVaultExtension`

```solidity
function getVaultExtension() external view returns (address);
```
This function returns the Vault Extension address.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | address  | Address of the VaultExtension  |

### `getProtocolFeeController`

```solidity
function getProtocolFeeController() external view returns (IProtocolFeeController);
```
This function returns the Protocol Fee Controller address.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | IProtocolFeeController  | Address of the ProtocolFeeController  |

## Pool registration
### `registerPool`

```solidity
function registerPool(
    address pool,
    TokenConfig[] memory tokenConfig,
    uint256 swapFeePercentage,
    uint32 pauseWindowEndTime,
    bool protocolFeeExempt,
    PoolRoleAccounts calldata roleAccounts,
    address poolHooksContract,
    LiquidityManagement calldata liquidityManagement
) external;
```
This function registers a pool, associating it with its factory and the tokens it manages.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The address of the pool being registered  |
| tokenConfig  | TokenConfig[]  | An array of descriptors for the tokens the pool will manage  |
| swapFeePercentage  | uint256  | The initial static swap fee percentage of the pool  |
| pauseWindowEndTime  | uint32  | The timestamp after which it is no longer possible to pause the pool  |
| protocolFeeExempt  | bool  | If true, the pool's initial aggregate fees will be set to 0  |
| roleAccounts  | PoolRoleAccounts  | Addresses the Vault will allow to change certain pool settings  |
| poolHooksContract  | address  | Contract that implements the hooks for the pool  |
| liquidityManagement  | LiquidityManagement  | Liquidity management flags with implemented methods  |

### `isPoolRegistered`

```solidity
function isPoolRegistered(address pool) external view returns (bool);
```
This function checks whether a pool is registered.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the pool to check  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | bool  | True if the pool is registered, false otherwise  |

### `initialize`

```solidity
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

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the pool to initialize  |
| to  | address  | Address that will receive the output BPT  |
| tokens  | IERC20[]  | Tokens used to seed the pool (must match the registered tokens)  |
| exactAmountsIn  | uint256[]  | Exact amounts of input tokens  |
| minBptAmountOut  | uint256  | Minimum amount of output pool tokens  |
| userData  | bytes  | Additional (optional) data required for adding initial liquidity  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| bptAmountOut  | uint256  | Output pool token amount  |

## Pool information
### `isPoolInitialized`

```solidity
function isPoolInitialized(address pool) external view returns (bool);
```
This function checks whether a pool is initialized.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the pool to check  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | bool  | True if the pool is initialized, false otherwise  |

### `getPoolTokens`

```solidity
function getPoolTokens(address pool) external view returns (IERC20[] memory);
```
This function gets the tokens registered to a pool.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the pool  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| tokens  | IERC20[]  | List of tokens in the pool  |

### `getPoolTokenInfo`

```solidity
function getPoolTokenInfo(
    address pool
)
    external
    view
    returns (
        IERC20[] memory tokens,
        TokenInfo[] memory tokenInfo,
        uint256[] memory balancesRaw,
        uint256[] memory scalingFactors
    );
```
This function gets the raw data for a pool: tokens, raw balances, scaling factors.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the pool  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| tokens  | IERC20[]  | The pool tokens, in registration order  |
| tokenInfo  | TokenInfo[]  | Corresponding token info  |
| balancesRaw  | uint256[]  | Corresponding raw balances of the tokens  |
| scalingFactors  | uint256[]  | Corresponding scalingFactors of the tokens  |

### `getPoolConfig`

```solidity
function getPoolConfig(address pool) external view returns (PoolConfig memory);
```
This function gets the configuration parameters of a pool.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the pool  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | PoolConfig  | Pool configuration  |

### `getHooksConfig`

```solidity
function getHooksConfig(address pool) external view returns (HooksConfig memory);
```
This function gets the hooks configuration parameters of a pool.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the pool  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | HooksConfig  | Hooks configuration  |

### `getBptRate`

```solidity
function getBptRate(address pool) external view returns (uint256 rate);
```
This function gets the current bpt rate of a pool, by dividing the current invariant by the total supply of BPT.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the pool  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| rate  | uint256  | BPT rate  |

## Pool tokens
### `totalSupply`

```solidity
function totalSupply(address token) external view returns (uint256);
```
This function gets the total supply of a given ERC20 token.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| token  | address  | Token's address  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint256  | Total supply of the token  |

### `balanceOf`

```solidity
function balanceOf(address token, address account) external view returns (uint256);
```
This function gets the balance of an account for a given ERC20 token.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| token  | address  | Token's address  |
| account  | address  | Account's address  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint256  | Balance of the account for the token  |

### `allowance`

```solidity
function allowance(address token, address owner, address spender) external view returns (uint256);
```
This function gets the allowance of a spender for a given ERC20 token and owner.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| token  | address  | Token's address  |
| owner  | address  | Owner's address  |
| spender  | address  | Spender's address  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint256  | Amount of tokens the spender is allowed to spend  |

### `transfer`

```solidity
function transfer(address owner, address to, uint256 amount) external returns (bool);
```
This function transfers pool token from owner to a recipient.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| owner  | address  | Owner's address  |
| to  | address  | Recipient's address  |
| amount  | uint256  | Amount of tokens to transfer  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | bool  | True if successful, false otherwise  |

### `transferFrom`

```solidity
function transferFrom(address spender, address from, address to, uint256 amount) external returns (bool);
```
This function transfers pool token from a sender to a recipient using an allowance.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| spender  | address  | Address allowed to perform the transfer  |
| from  | address  | Sender's address  |
| to  | address  | Recipient's address  |
| amount  | uint256  | Amount of tokens to transfer  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | bool  | True if successful, false otherwise  |

### `approve`

```solidity
function approve(address owner, address spender, uint256 amount) external returns (bool);
```
This function approves a spender to spend pool tokens on behalf of sender.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| owner  | address  | Owner's address  |
| spender  | address  | Spender's address  |
| amount  | uint256  | Amount of tokens to approve  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | bool  | True if successful, false otherwise  |

## pool pausing
### `isPoolPaused`

```solidity
function isPoolPaused(address pool) external view returns (bool);
```
This function indicates whether a pool is paused.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool to be checked  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | bool  | True if the pool is paused  |

### `getPoolPausedState`

```solidity
function getPoolPausedState(address pool) external view returns (bool, uint32, uint32, address);
```
This function returns the paused status, and end times of the Pool's pause window and buffer period.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool whose data is requested  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| paused  | bool  | True if the Pool is paused  |
| poolPauseWindowEndTime  | uint32  | The timestamp of the end of the Pool's pause window  |
| poolBufferPeriodEndTime  | uint32  | The timestamp after which the Pool unpauses itself (if paused)  |
| pauseManager  | address  | The pause manager, or the zero address  |

## Fees
### `getAggregateSwapFeeAmount`

```solidity
function getAggregateSwapFeeAmount(address pool, IERC20 token) external view returns (uint256);
```
This function returns the accumulated swap fees (including aggregate fees) in `token` collected by the pool.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The address of the pool for which aggregate fees have been collected  |
| token  | IERC20  | The address of the token in which fees have been accumulated  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint256  | The total amount of fees accumulated in the specified token  |

### `getAggregateYieldFeeAmount`

```solidity
function getAggregateYieldFeeAmount(address pool, IERC20 token) external view returns (uint256);
```
This function returns the accumulated yield fees (including aggregate fees) in `token` collected by the pool.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The address of the pool for which aggregate fees have been collected  |
| token  | IERC20  | The address of the token in which fees have been accumulated  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint256  | The total amount of fees accumulated in the specified token  |

### `getStaticSwapFeePercentage`

```solidity
function getStaticSwapFeePercentage(address pool) external view returns (uint256);
```
This function fetches the static swap fee percentage for a given pool.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The address of the pool whose static swap fee percentage is being queried  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint256  | The current static swap fee percentage for the specified pool  |

### `getPoolRoleAccounts`

```solidity
function getPoolRoleAccounts(address pool) external view returns (PoolRoleAccounts memory);
```
This function fetches the role accounts for a given pool (pause manager, swap manager, pool creator).

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The address of the pool whose roles are being queried  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| roleAccounts  | PoolRoleAccounts  | A struct containing the role accounts for the pool (or 0 if unassigned)  |

### `computeDynamicSwapFee`

```solidity
function computeDynamicSwapFee(
    address pool,
    IBasePool.PoolSwapParams memory swapParams
) external view returns (bool, uint256);
```
This function queries the current dynamic swap fee of a pool, given a set of swap parameters.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool  |
| swapParams  | IBasePool.PoolSwapParams  | The swap parameters used to compute the fee  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| success  | bool  | True if the pool has a dynamic swap fee and it can be successfully computed  |
| dynamicSwapFee  | uint256  | The dynamic swap fee percentage  |

## Recovery mode
### `isPoolInRecoveryMode`

```solidity
function isPoolInRecoveryMode(address pool) external view returns (bool);
```
This function checks whether a pool is in recovery mode.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the pool to check  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | bool  | True if the pool is initialized, false otherwise  |

### `removeLiquidityRecovery`

```solidity
function removeLiquidityRecovery(
    address pool,
    address from,
    uint256 exactBptAmountIn
) external returns (uint256[] memory amountsOut);
```
This function removes liquidity from a pool specifying exact pool tokens in, with proportional token amounts out. The request is implemented by the Vault without any interaction with the pool, ensuring that it works the same for all pools, and cannot be disabled by a new pool type.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the pool  |
| from  | address  | Address of user to burn pool tokens from  |
| exactBptAmountIn  | uint256  | Input pool token amount  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| amountsOut  | uint256[]  | Actual calculated amounts of output tokens, sorted in token registration order  |

## Buffer operations
### `calculateBufferAmounts`

```solidity
function calculateBufferAmounts(
    SwapKind kind,
    IERC4626 wrappedToken,
    uint256 amountGiven
) external returns (uint256 amountCalculated, uint256 amountInUnderlying, uint256 amountOutWrapped);
```
This function calculates the buffer amounts for a given swap kind, wrapped token, and given amount.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| kind  | SwapKind  | The kind of swap (in or out)  |
| wrappedToken  | IERC4626  | The wrapped token involved in the swap  |
| amountGiven  | uint256  | The amount given for the swap  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| amountCalculated  | uint256  | The calculated amount for the swap  |
| amountInUnderlying  | uint256  | The amount in the underlying token  |
| amountOutWrapped  | uint256  | The amount in the wrapped token  |

## Queries
### `quote`

```solidity
function quote(bytes calldata data) external payable returns (bytes memory result);
```
This function performs a callback on `msg.sender` with arguments provided in `data`. It is used to query a set of operations on the Vault. Only off-chain `eth_call` are allowed, anything else will revert.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| data  | bytes  | Contains function signature and args to be passed to the `msg.sender`  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| result  | bytes  | Resulting data from the call  |

### `quoteAndRevert`

```solidity
function quoteAndRevert(bytes calldata data) external payable;
```
This function performs a callback on `msg.sender` with arguments provided in `data`. It is used to query a set of operations on the Vault. Only off-chain `eth_call` are allowed, anything else will revert. This call always reverts, returning the result in the revert reason.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| data  | bytes  | Contains function signature and args to be passed to the `msg.sender`  |

### `isQueryDisabled`

```solidity
function isQueryDisabled() external view returns (bool);
```
This function checks if the queries are enabled on the Vault.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | bool  | If true, then queries are disabled  |

## Constants
### `getPauseWindowEndTime`

```solidity
function getPauseWindowEndTime() external view returns (uint32);
```
This function returns Vault's pause window end time.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint32  | The end time of the Vault's pause window  |

### `getBufferPeriodDuration`

```solidity
function getBufferPeriodDuration() external view returns (uint32);
```
This function returns Vault's buffer period duration.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint32  | The duration of the Vault's buffer period  |

### `getBufferPeriodEndTime`

```solidity
function getBufferPeriodEndTime() external view returns (uint32);
```
This function returns Vault's buffer period end time.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint32  | The end time of the Vault's buffer period  |

### `getMinimumPoolTokens`

```solidity
function getMinimumPoolTokens() external pure returns (uint256);
```
This function gets the minimum number of tokens in a pool.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint256  | The token count of a minimal pool  |

### `getMaximumPoolTokens`

```solidity
function getMaximumPoolTokens() external pure returns (uint256);
```
This function gets the maximum number of tokens in a pool.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint256  | The token count of a maximal pool  |

### `vault`

```solidity
function vault() external view returns (IVault);
```
This function returns the main Vault address.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | IVault  | The main Vault address  |

## Pool information
### `getPoolTokenRates`

```solidity
function getPoolTokenRates(address pool) external view returns (uint256[] memory);
```
This function retrieves the scaling factors from a pool's rate providers. Tokens without rate providers will always return FixedPoint.ONE (1e18).

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The address of the pool  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint256[]  | The scaling factors from the pool's rate providers  |

## Vault pausing

### `isVaultPaused`

```solidity
function isVaultPaused() external view returns (bool);
```
This function indicates whether the Vault is paused.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | bool  | True if the Vault is paused  |

### `getVaultPausedState`

```solidity
function getVaultPausedState() external view returns (bool, uint32, uint32);
```
This function returns the paused status, and end times of the Vault's pause window and buffer period.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| paused  | bool  | True if the Vault is paused  |
| vaultPauseWindowEndTime  | uint32  | The timestamp of the end of the Vault's pause window  |
| vaultBufferPeriodEndTime  | uint32  | The timestamp of the end of the Vault's buffer period  |

### `pauseVault`

```solidity
function pauseVault() external;
```
This function pauses the Vault: an emergency action which disables all operational state-changing functions. This is a permissioned function that will only work during the Pause Window set during deployment.

### `unpauseVault`

```solidity
function unpauseVault() external;
```
This function reverses a `pause` operation, and restores the Vault to normal functionality. This is a permissioned function that will only work on a paused Vault within the Buffer Period set during deployment. Note that the Vault will automatically unpause after the Buffer Period expires.

## Pool pausing
### `pausePool`

```solidity
function pausePool(address pool) external;
```
This function pauses the Pool: an emergency action which disables all pool functions. This is a permissioned function that will only work during the Pause Window set during pool factory deployment.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The address of the pool  |

### `unpausePool`

```solidity
function unpausePool(address pool) external;
```
This function reverses a `pause` operation, and restores the Pool to normal functionality. This is a permissioned function that will only work on a paused Pool within the Buffer Period set during deployment. Note that the Pool will automatically unpause after the Buffer Period expires.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The address of the pool  |

## Fees
### `setStaticSwapFeePercentage`

```solidity
function setStaticSwapFeePercentage(address pool, uint256 swapFeePercentage) external;
```
This function assigns a new static swap fee percentage to the specified pool. This is a permissioned function, disabled if the pool is paused. The swap fee percentage must be within the bounds specified by the pool's implementation of `ISwapFeePercentageBounds`.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The address of the pool for which the static swap fee will be changed  |
| swapFeePercentage  | uint256  | The new swap fee percentage to apply to the pool  |

### `collectAggregateFees`

```solidity
function collectAggregateFees(address pool) external;
```
This function collects accumulated aggregate swap and yield fees for the specified pool. Fees are sent to the ProtocolFeeController address.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool on which all aggregate fees should be collected  |

### `updateAggregateSwapFeePercentage`

```solidity
function updateAggregateSwapFeePercentage(address pool, uint256 newAggregateSwapFeePercentage) external;
```
This function updates an aggregate swap fee percentage. Can only be called by the current protocol fee controller.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool whose fee will be updated  |
| newAggregateSwapFeePercentage  | uint256  | The new aggregate swap fee percentage  |

### `updateAggregateYieldFeePercentage`

```solidity
function updateAggregateYieldFeePercentage(address pool, uint256 newAggregateYieldFeePercentage) external;
```
This function updates an aggregate yield fee percentage. Can only be called by the current protocol fee controller.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool whose fee will be updated  |
| newAggregateYieldFeePercentage  | uint256  | The new aggregate yield fee percentage  |

### `setProtocolFeeController`

```solidity
function setProtocolFeeController(IProtocolFeeController newProtocolFeeController) external;
```
This function sets a new Protocol Fee Controller for the Vault. This is a permissioned call.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| newProtocolFeeController  | IProtocolFeeController  | The new Protocol Fee Controller for the Vault  |

## Recovery mode
### `enableRecoveryMode`

```solidity
function enableRecoveryMode(address pool) external;
```
This function enables recovery mode for a pool. This is a permissioned function.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool  |

### `disableRecoveryMode`

```solidity
function disableRecoveryMode(address pool) external;
```
This function disables recovery mode for a pool. This is a permissioned function.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool  |

## Queries
### `disableQuery`

```solidity
function disableQuery() external;
```
This function disables queries functionality on the Vault. It can only be called by governance.

## Buffers
### `unpauseVaultBuffers`

```solidity
function unpauseVaultBuffers() external;
```
This function unpauses native vault buffers globally. When buffers are paused, it's not possible to add liquidity or wrap/unwrap tokens using Vault's `erc4626BufferWrapOrUnwrap` primitive. However, it's still possible to remove liquidity. This is a permissioned call.

### `pauseVaultBuffers`

```solidity
function pauseVaultBuffers() external;
```
This function pauses native vault buffers globally. When buffers are paused, it's not possible to add liquidity or wrap/unwrap tokens using Vault's `erc4626BufferWrapOrUnwrap` primitive. However, it's still possible to remove liquidity. Currently it's not possible to pause vault buffers individually. This is a permissioned call.

### `addLiquidityToBuffer`

```solidity
function addLiquidityToBuffer(
    IERC4626 wrappedToken,
    uint256 amountUnderlyingRaw,
    uint256 amountWrappedRaw,
    address sharesOwner
) external returns (uint256 issuedShares);
```
This function adds liquidity to a yield-bearing token buffer (linear pool embedded in the vault).

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC4626  | Address of the wrapped token that implements IERC4626  |
| amountUnderlyingRaw  | uint256  | Amount of underlying tokens that will be deposited into the buffer  |
| amountWrappedRaw  | uint256  | Amount of wrapped tokens that will be deposited into the buffer  |
| sharesOwner  | address  | Address of contract that will own the deposited liquidity. Only this contract will be able to remove liquidity from the buffer  |

### `removeLiquidityFromBuffer`

```solidity
function removeLiquidityFromBuffer(
    IERC4626 wrappedToken,
    uint256 sharesToRemove,
    address sharesOwner
) external returns (uint256 removedUnderlyingBalanceRaw, uint256 removedWrappedBalanceRaw);
```
This function removes liquidity from a yield-bearing token buffer (linear pool embedded in the vault). Only proportional exits are supported.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC4626  | Address of the wrapped token that implements IERC4626  |
| sharesToRemove  | uint256  | Amount of shares to remove from the buffer. Cannot be greater than sharesOwner total shares  |
| sharesOwner  | address  | Address of contract that owns the deposited liquidity.  |

### `getBufferOwnerShares`

```solidity
function getBufferOwnerShares(
    IERC20 wrappedToken,
    address liquidityOwner
) external view returns (uint256 ownerShares);
```
This function returns the shares (internal buffer BPT) of a liquidity owner: a user that deposited assets in the buffer.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC20  | Address of the wrapped token that implements IERC4626  |
| liquidityOwner  | address  | Address of the user that owns liquidity in the wrapped token's buffer  |

### `getBufferTotalShares`

```solidity
function getBufferTotalShares(IERC20 wrappedToken) external view returns (uint256 bufferShares);
```
This function returns the supply shares (internal buffer BPT) of the ERC4626 buffer.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC20  | Address of the wrapped token that implements IERC4626  |

### `getBufferBalance`

```solidity
function getBufferBalance(
    IERC20 wrappedToken
) external view returns (uint256 underlyingBalanceRaw, uint256 wrappedBalanceRaw);
```
This function returns the amount of underlying and wrapped tokens deposited in the internal buffer of the vault.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC20  | Address of the wrapped token that implements IERC4626  |

## Authentication
### `setAuthorizer`

```solidity
function setAuthorizer(IAuthorizer newAuthorizer) external;
```
This function sets a new Authorizer for the Vault. This is a permissioned call. It emits an `AuthorizerChanged` event.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| newAuthorizer  | IAuthorizer  | The new Authorizer for the Vault  |

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

