---
order: 6
title: Vault API
---

# The Vault

:::info Use the Router for swap, add liquidity and remove liquidity operations 
The [Router](../router/overview.html) is the primary entry-point for the Balancer Protocol. It exposes developer friendly interfaces for complex protocol interactions.
:::

:::info Interacting with the Vault on-chain
The Ethereum Virtual Machine (EVM) imposes bytecode restrictions that limit the size of deployed contracts. In order to achieve the desired functionality, the Vault exceeds
the bytecode limit of 24.576 kb. To overcome this, the Vault inherits from OpenZeppelin's Proxy contract and leverages delegate calls,
allowing for the vault to utilize the functionality of more than one deployed smart contract.

When interacting with the Balancer Vault via solidity, it is recommended to cast the Vaults address to an `IVault`. You can find the interface [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IVault.sol).
:::

:::info Vault Explorer
Because of the constraints imposed by the Proxy pattern, the Vault contract itself doesn't expose much to blockchain explorers like Etherscan. You can see the extended functions by visiting the `VaultExtension` and `VaultAdmin` contracts, but any direct call on those contracts will revert.

To provide access to the Vault through Etherscan in a user-friendly manner, there is a Vault "wrapper" contract called the `VaultExplorer`. This contract allows calling all permissionless Vault functions (e.g., `getPoolTokens`) through Etherscan.
:::

## Transient accounting
### unlock

```solidity
function unlock(bytes calldata data) external returns (bytes memory result);
```
This `Vault` function creates a context for a sequence of operations, effectively "unlocking" the Vault. It performs a callback on `msg.sender` with arguments provided in `data`. The callback is `transient`, meaning all balances for the caller have to be settled at the end.

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
function settle(IERC20 token, uint256 amountHint) external returns (uint256 credit);
```
This `Vault` function settles deltas for a token. This operation must be successful for the current lock to be released. It returns the credit supplied by the Vault, which can be calculated as `min(reserveDifference, amountHint)`, where the reserve difference equals current balance of the token minus existing reserves of the token when the function is called.

The purpose of the hint is to protect against "donation DDoS attacks," where someone sends extra tokens to the Vault during the transaction (e.g., using reentrancy), which otherwise would cause settlement to fail. If the `reserveDifference` > `amountHint`, any "extra" tokens will simply be absorbed by the Vault (and reflected in the reserves), and not affect settlement. (The tokens will not be recoverable, as in V2.)

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| token  | IERC20  | Token's address  |
| amountHint  | uint256  | Amount the caller expects to be credited  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| credit  | uint256  | Amount credited to the caller for settlement  |

### sendTo

```solidity
function sendTo(IERC20 token, address to, uint256 amount) external;
```
This `Vault` function sends tokens to a recipient. There is no inverse operation for this function. To cancel debts, transfer funds to the Vault and call `settle`.

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
This `VaultExtension` function returns True if the Vault is unlocked, false otherwise.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | bool  | True if the Vault is unlocked, false otherwise  |

### `getNonzeroDeltaCount`

```solidity
function getNonzeroDeltaCount() external view returns (uint256);
```
This `VaultExtension` function returns the count of non-zero deltas.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint256  | The current value of _nonzeroDeltaCount  |

### `getTokenDelta`

```solidity
function getTokenDelta(IERC20 token) external view returns (int256);
```
This `VaultExtension` function retrieves the token delta for a specific user and token.

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
This `VaultExtension` function retrieves the reserve (i.e., total Vault balance) of a given token.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| token  | IERC20  | The token for which to retrieve the reserve  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint256  | The amount of reserves for the given token  |

## Swaps
### `swap`

```solidity
function swap(
    VaultSwapParams memory vaultSwapParams
) external returns (uint256 amountCalculatedRaw, uint256 amountInRaw, uint256 amountOutRaw);
```
This `Vault` function swaps tokens based on provided parameters. All parameters are given in raw token decimal encoding.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| params  | VaultSwapParams  | Parameters for the swap operation  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| amountCalculatedRaw  | uint256  | Calculated swap amount  |
| amountInRaw  | uint256  | Amount of input tokens for the swap  |
| amountOutRaw  | uint256  | Amount of output tokens from the swap  |

## Add Liquidity
### addLiquidity

```solidity
function addLiquidity(
    AddLiquidityParams memory params
) external returns (uint256[] memory amountsIn, uint256 bptAmountOut, bytes memory returnData);
```
This `Vault` function adds liquidity to a pool. Caution should be exercised when adding liquidity because the Vault has the capability to transfer tokens from any user, given that it holds all allowances. It returns the actual amounts of input tokens, the output pool token amount, and optional data with an encoded response from the pool.

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
This `Vault` function removes liquidity from a pool. Trusted routers can burn pool tokens belonging to any user and require no prior approval from the user. Untrusted routers require prior approval from the user. This is the only function allowed to call `_queryModeBalanceIncrease` (and only in a query context).

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

## Pool information
### `getPoolTokenCountAndIndexOfToken`

```solidity
function getPoolTokenCountAndIndexOfToken(address pool, IERC20 token) external view returns (uint256, uint256);
```
This `Vault` function gets the index of a token in a given pool. It reverts if the pool is not registered, or if the token does not belong to the pool.

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

### `isPoolInitialized`

```solidity
function isPoolInitialized(address pool) external view returns (bool);
```
This `VaultExtension` function checks whether a pool is initialized.

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
This `VaultExtension` function gets the tokens registered to a pool.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the pool  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| tokens  | IERC20[]  | List of tokens in the pool  |

### `getPoolTokenRates`

```solidity
function getPoolTokenRates(address pool) external view returns (uint256[] memory);
```
This `VaultExtension` function retrieves the scaling factors from a pool's rate providers. Tokens without rate providers will always return FixedPoint.ONE (1e18).

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The address of the pool  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint256[]  | The rate scaling factors from the pool's rate providers  |

### `getPoolData`

```solidity
function getPoolData(address pool) external view returns (PoolData memory);
```
This `VaultExtension` function retrieves a PoolData structure, containing comprehensive information about the pool, including the PoolConfig, tokens, tokenInfo, balances, rates and scaling factors.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The address of the pool  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | PoolData  | A struct with data describing the current state of the pool |

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
        uint256[] memory lastLiveBalances
    );
```
This `VaultExtension` function gets the raw data for a pool: tokens, raw and last live balances.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the pool  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| tokens  | IERC20[]  | The pool tokens, sorted in registration order |
| tokenInfo  | TokenInfo[]  | Token info, sorted in token registration order  |
| balancesRaw  | uint256[]  | Raw balances, sorted in token registration order  |
| lastLiveBalances  | uint256[]  | Last saved live balances, sorted in token registration order  |

### `getCurrentLiveBalances`

```solidity
function getCurrentLiveBalances(address pool) external view returns (uint256[] memory balancesLiveScaled18);
```
This `VaultExtension` function retrieves the current live balances: i.e., token balances after paying yield fees, applying decimal scaling and rates.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The address of the pool  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| balancesLiveScaled18 | uint256[]  | Current live balances, sorted in token registration order |

### `getPoolConfig`

```solidity
function getPoolConfig(address pool) external view returns (PoolConfig memory);
```
This `VaultExtension` function gets the configuration parameters of a pool.

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
This `VaultExtension` function gets the hooks configuration parameters of a pool.

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
This `VaultExtension` function gets the current bpt rate of a pool, by dividing the current invariant by the total supply of BPT.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the pool  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| rate  | uint256  | BPT rate  |

## ERC4626 Buffers

### `erc4626BufferWrapOrUnwrap`

```solidity
function erc4626BufferWrapOrUnwrap(
    BufferWrapOrUnwrapParams memory params
) external returns (uint256 amountCalculatedRaw, uint256 amountInRaw, uint256 amountOutRaw);
```
This `Vault` function wraps/unwraps tokens based on provided parameters, using the buffer of the wrapped token when it has enough liquidity to avoid external calls. All parameters are given in raw token decimal encoding.

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

### `pauseVaultBuffers`

```solidity
function pauseVaultBuffers() external;
```
This `VaultAdmin` function pauses native vault buffers globally. When buffers are paused, it's not possible to add liquidity or wrap/unwrap tokens using Vault's `erc4626BufferWrapOrUnwrap` primitive. However, it's still possible to remove liquidity. Currently it's not possible to pause vault buffers individually. This is a permissioned call.

### `unpauseVaultBuffers`

```solidity
function unpauseVaultBuffers() external;
```
This `VaultAdmin` function unpauses native vault buffers globally. When buffers are paused, it's not possible to add liquidity or wrap/unwrap tokens using Vault's `erc4626BufferWrapOrUnwrap` primitive. However, it's still possible to remove liquidity. This is a permissioned call.

### `initializeBuffer`

```solidity
function initializeBuffer(
    IERC4626 wrappedToken,
    uint256 amountUnderlyingRaw,
    uint256 amountWrappedRaw,
    address sharesOwner
) external returns (uint256 issuedShares);
```
This `VaultAdmin` function adds liquidity to an internal ERC4626 buffer in the Vault for the first time. And operations involving the buffer will revert until it is initialized.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC4626  | Address of the wrapped token that implements IERC4626  |
| amountUnderlyingRaw  | uint256  | Amount of underlying tokens that will be deposited into the buffer  |
| amountWrappedRaw  | uint256  | Amount of wrapped tokens that will be deposited into the buffer  |
| sharesOwner  | address  | Address of the contract that will own the liquidity. Only this contract will be able to remove liquidity from the buffer |

### `addLiquidityToBuffer`

```solidity
function addLiquidityToBuffer(
    IERC4626 wrappedToken,
    uint256 exactSharesToIssue,
    address sharesOwner
) external returns (uint256 amountUnderlyingRaw, uint256 amountWrappedRaw);
```
This `VaultAdmin` function adds liquidity proportionally to an internal ERC4626 buffer in the Vault. Reverts if the buffer has not been initialized.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC4626  | Address of the wrapped token that implements IERC4626  |
| amountUnderlyingRaw  | uint256  | Amount of underlying tokens that will be deposited into the buffer  |
| amountWrappedRaw  | uint256  | Amount of wrapped tokens that will be deposited into the buffer  |
| sharesOwner  | address  | Address of the contract that will own the liquidity. Only this contract will be able to remove liquidity from the buffer |

### `removeLiquidityFromBuffer`

```solidity
function removeLiquidityFromBuffer(
    IERC4626 wrappedToken,
    uint256 sharesToRemove
) external returns (uint256 removedUnderlyingBalanceRaw, uint256 removedWrappedBalanceRaw);
```
This `VaultAdmin` function removes liquidity from an internal ERC4626 buffer in the Vault. Only proportional exits are supported. Note that the `sharesOwner` here is the msg.sender; unlike initialize, add, and other buffer operations, the entrypoint for this function is the Vault itself.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC4626  | Address of the wrapped token that implements IERC4626  |
| sharesToRemove  | uint256  | Amount of shares to remove from the buffer. Cannot be greater than sharesOwner total shares  |

### `getBufferOwnerShares`

```solidity
function getBufferOwnerShares(
    IERC20 wrappedToken,
    address liquidityOwner
) external view returns (uint256 ownerShares);
```
This `VaultAdmin` function returns the shares (internal buffer BPT) of a liquidity owner: a user that deposited assets in the buffer.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC20  | Address of the wrapped token that implements IERC4626  |
| liquidityOwner  | address  | Address of the user that owns liquidity in the wrapped token's buffer  |

### `getBufferTotalShares`

```solidity
function getBufferTotalShares(IERC20 wrappedToken) external view returns (uint256 bufferShares);
```
This `VaultAdmin` function returns the supply shares (internal buffer BPT) of the ERC4626 buffer.

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
This `VaultAdmin` function returns the amount of underlying and wrapped tokens deposited in the internal buffer of the vault.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC20  | Address of the wrapped token that implements IERC4626  |

## Authentication
### `getAuthorizer`

```solidity
function getAuthorizer() external view returns (IAuthorizer);
```
This `Vault` function returns the Vault's Authorizer. It is in the main Vault for performance reasons.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | IAuthorizer  | Address of the authorizer  |

### `setAuthorizer`

```solidity
function setAuthorizer(IAuthorizer newAuthorizer) external;
```
This `VaultAdmin` function sets a new Authorizer for the Vault. This is a permissioned call. It emits an `AuthorizerChanged` event.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| newAuthorizer  | IAuthorizer  | The new Authorizer for the Vault  |

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
This `VaultExtension` function registers a pool, associating it with its factory and the tokens it manages.

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
This `VaultExtension` function checks whether a pool is registered.

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
This `VaultExtension` function initializes a registered pool by adding liquidity; mints BPT tokens for the first time in exchange.

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

## Balancer Pool tokens
### `totalSupply`

```solidity
function totalSupply(address token) external view returns (uint256);
```
This `VaultExtension` function gets the total supply of a given ERC20 token.

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
This `VaultExtension` function gets the balance of an account for a given ERC20 token.

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
This `VaultExtension` function gets the allowance of a spender for a given ERC20 token and owner.

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

### `approve`

```solidity
function approve(address owner, address spender, uint256 amount) external returns (bool);
```
This `VaultExtension` function approves a spender to spend pool tokens on behalf of sender.

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

### `transfer`

```solidity
function transfer(address owner, address to, uint256 amount) external returns (bool);
```
This `VaultExtension` function transfers pool token from owner to a recipient.

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
This `VaultExtension` function transfers pool token from a sender to a recipient using an allowance.

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

## pool pausing
### `isPoolPaused`

```solidity
function isPoolPaused(address pool) external view returns (bool);
```
This `VaultExtension` function indicates whether a pool is paused.

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
This `VaultExtension` function returns the paused status, and end times of the Pool's pause window and buffer period.

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

## ERC4626 Buffers

### `isERC4626BufferInitialized`

```solidity
function isERC4626BufferInitialized(IERC4626 wrappedToken) external view returns (bool isBufferInitialized);
```
This `VaultExtension` function checks whether `initializeBuffer` has been called on the given `wrappedToken`. Buffers must be initialized before use.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC4626  | Address of the wrapped token that implements IERC4626  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| isBufferInitialized  | bool  | True if the ERC4626 buffer is initialized  |

## Fees
### `getAggregateSwapFeeAmount`

```solidity
function getAggregateSwapFeeAmount(address pool, IERC20 token) external view returns (uint256);
```
This `VaultExtension` function returns the accumulated swap fees (including aggregate fees) in `token` collected by the pool.

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
This `VaultExtension` function returns the accumulated yield fees (including aggregate fees) in `token` collected by the pool.

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
This `VaultExtension` function fetches the static swap fee percentage for a given pool.

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
This `VaultExtension` function fetches the role accounts for a given pool (pause manager, swap manager, pool creator).

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The address of the pool whose roles are being queried  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| roleAccounts  | PoolRoleAccounts  | A struct containing the role accounts for the pool (or 0 if unassigned)  |

### `computeDynamicSwapFeePercentage`

```solidity
function computeDynamicSwapFee(
    address pool,
    PoolSwapParams memory swapParams
) external view returns (uint256);
```
This `VaultExtension` function queries the current dynamic swap fee of a pool, given a set of swap parameters.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool  |
| swapParams  | PoolSwapParams  | The swap parameters used to compute the fee  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| dynamicSwapFeePercentage  | uint256  | The dynamic swap fee percentage  |

### `getProtocolFeeController`

```solidity
function getProtocolFeeController() external view returns (IProtocolFeeController);
```
This `VaultExtension` function returns the Protocol Fee Controller address.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | IProtocolFeeController  | Address of the ProtocolFeeController  |

### `setStaticSwapFeePercentage`

```solidity
function setStaticSwapFeePercentage(address pool, uint256 swapFeePercentage) external;
```
This `VaultAdmin` function assigns a new static swap fee percentage to the specified pool. This is a permissioned function, disabled if the pool is paused. The swap fee percentage must be within the bounds specified by the pool's implementation of `ISwapFeePercentageBounds`.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The address of the pool for which the static swap fee will be changed  |
| swapFeePercentage  | uint256  | The new swap fee percentage to apply to the pool  |

### `collectAggregateFees`

```solidity
function collectAggregateFees(address pool) public returns (uint256[] memory totalSwapFees, uint256[] memory totalYieldFees);
```
This function collects accumulated aggregate swap and yield fees for the specified pool. It can only be called from the `ProtocolFeeController`, which unlocks the Vault, acting as a Router. In the Vault, it clears the `aggregateFeeAmounts` storage, supplying credit for each amount which must be settled at the end of the fee controller action.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool on which all aggregate fees should be collected  |


### `updateAggregateSwapFeePercentage`

```solidity
function updateAggregateSwapFeePercentage(address pool, uint256 newAggregateSwapFeePercentage) external;
```
This `VaultAdmin` function updates an aggregate swap fee percentage. Can only be called by the current protocol fee controller.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool whose fee will be updated  |
| newAggregateSwapFeePercentage  | uint256  | The new aggregate swap fee percentage  |

### `updateAggregateYieldFeePercentage`

```solidity
function updateAggregateYieldFeePercentage(address pool, uint256 newAggregateYieldFeePercentage) external;
```
This `VaultAdmin` function updates an aggregate yield fee percentage. Can only be called by the current protocol fee controller.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool whose fee will be updated  |
| newAggregateYieldFeePercentage  | uint256  | The new aggregate yield fee percentage  |

### `setProtocolFeeController`

```solidity
function setProtocolFeeController(IProtocolFeeController newProtocolFeeController) external;
```
This `VaultAdmin` function sets a new Protocol Fee Controller for the Vault. This is a permissioned call.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| newProtocolFeeController  | IProtocolFeeController  | The new Protocol Fee Controller for the Vault  |

## Recovery mode
### `isPoolInRecoveryMode`

```solidity
function isPoolInRecoveryMode(address pool) external view returns (bool);
```
This `VaultExtension` function checks whether a pool is in recovery mode.

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
This `VaultExtension` function removes liquidity from a pool specifying exact pool tokens in, with proportional token amounts out. The request is implemented by the Vault without any interaction with the pool, ensuring that it works the same for all pools, and cannot be disabled by a new pool type.

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

### `enableRecoveryMode`

```solidity
function enableRecoveryMode(address pool) external;
```
This `VaultAdmin` function enables recovery mode for a pool. This is a permissioned function.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool  |

### `disableRecoveryMode`

```solidity
function disableRecoveryMode(address pool) external;
```
This `VaultAdmin` function disables recovery mode for a pool. This is a permissioned function.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool  |

## Queries
### `quote`

```solidity
function quote(bytes calldata data) external returns (bytes memory result);
```
This `VaultExtension` function performs a callback on `msg.sender` with arguments provided in `data`. It is used to query a set of operations on the Vault. Only off-chain `eth_call` are allowed, anything else will revert. Also note that it is non-payable, as the Vault does not allow ETH.

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
function quoteAndRevert(bytes calldata data) external;
```
This `VaultExtension` function performs a callback on `msg.sender` with arguments provided in `data`. It is used to query a set of operations on the Vault. Only off-chain `eth_call` are allowed, anything else will revert. This call always reverts, returning the result in the revert reason. Also note that it is non-payable, as the Vault does not allow ETH.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| data  | bytes  | Contains function signature and args to be passed to the `msg.sender`  |

### `isQueryDisabled`

```solidity
function isQueryDisabled() external view returns (bool);
```
This `VaultExtension` function checks if the queries are enabled on the Vault.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | bool  | If true, then queries are disabled  |

### `disableQuery`

```solidity
function disableQuery() external;
```
This `VaultAdmin` function disables queries functionality on the Vault. It can only be called by governance.

## Constants
### `getPauseWindowEndTime`

```solidity
function getPauseWindowEndTime() external view returns (uint32);
```
This `VaultAdmin` function returns Vault's pause window end time.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint32  | The end time of the Vault's pause window  |

### `getBufferPeriodDuration`

```solidity
function getBufferPeriodDuration() external view returns (uint32);
```
This `VaultAdmin` function returns Vault's buffer period duration.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint32  | The duration of the Vault's buffer period  |

### `getBufferPeriodEndTime`

```solidity
function getBufferPeriodEndTime() external view returns (uint32);
```
This `VaultAdmin` function returns Vault's buffer period end time.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint32  | The end time of the Vault's buffer period  |

### `getMinimumPoolTokens`

```solidity
function getMinimumPoolTokens() external pure returns (uint256);
```
This `VaultAdmin` function gets the minimum number of tokens in a pool.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint256  | The minimum token count of a pool  |

### `getMaximumPoolTokens`

```solidity
function getMaximumPoolTokens() external pure returns (uint256);
```
This `VaultAdmin` function gets the maximum number of tokens in a pool.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint256  | The maximum token count of a pool  |

### `getPoolMinimumTotalSupply`

```solidity
function getPoolMinimumTotalSupply() external pure returns (uint256);
```
This `VaultAdmin` function gets the minimum total supply of pool tokens (BPT) for an initialized pool. This prevents pools from being completely drained. When the pool is initialized, this minimum amount of BPT is minted to the zero address. This is an 18-decimal floating point number; BPT are always 18 decimals.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint256  | The minimum total supply a pool can have after initialization  |

### `getBufferMinimumTotalSupply`

```solidity
function getBufferMinimumTotalSupply() external pure returns (uint256);
```
This `VaultAdmin` function gets the minimum total supply of an ERC4626 wrapped token buffer in the Vault. This prevents buffers from being completely drained. When the buffer is initialized, this minimum number of shares is added to the shares resulting from the initial deposit. Buffer total supply accounting is internal to the Vault, as buffers are not tokenized.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint256  | The minimum total supply a buffer can have after initialization |

### `getMinimumTradeAmount`

```solidity
function getMinimumTradeAmount() external view returns (uint256);
```
This `VaultAdmin` function gets the minimum trade amount in a pool operation. This limit is applied to the 18-decimal "upscaled" amount in any operation (swap, add/remove liquidity).

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint256  | The minimum trade amount as an 18-decimal floating point number |

### `getMinimumWrapAmount`

```solidity
function getMinimumWrapAmount() external view returns (uint256);
```
This `VaultAdmin` function gets the minimum wrap amount in a buffer operation. This limit is applied to the wrap operation amount, in native underlying token decimals.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | uint256  | The minimum wrap amount in native underlying token decimals |

### `vault`

```solidity
function vault() external view returns (IVault);
```
This function (defined on both `VaultExtension` and `VaultAdmin`) returns the main Vault address.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | IVault  | The main Vault address  |

## Vault pausing

### `isVaultPaused`

```solidity
function isVaultPaused() external view returns (bool);
```
This `VaultAdmin` function indicates whether the Vault is paused.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | bool  | True if the Vault is paused  |

### `getVaultPausedState`

```solidity
function getVaultPausedState() external view returns (bool, uint32, uint32);
```
This `VaultAdmin` function returns the paused status, and end times of the Vault's pause window and buffer period.

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
This `VaultAdmin` function pauses the Vault: an emergency action which disables all operational state-changing functions. This is a permissioned function that will only work during the Pause Window set during deployment.

### `unpauseVault`

```solidity
function unpauseVault() external;
```
This `VaultAdmin` function reverses a `pause` operation, and restores the Vault to normal functionality. This is a permissioned function that will only work on a paused Vault within the Buffer Period set during deployment. Note that the Vault will automatically unpause after the Buffer Period expires.

## Pool pausing
### `pausePool`

```solidity
function pausePool(address pool) external;
```
This `VaultAdmin` function pauses the Pool: an emergency action which disables all pool functions. This is a permissioned function that will only work during the Pause Window set during pool factory deployment.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The address of the pool  |

### `unpausePool`

```solidity
function unpausePool(address pool) external;
```
This `VaultAdmin` function reverses a `pause` operation, and restores the Pool to normal functionality. This is a permissioned function that will only work on a paused Pool within the Buffer Period set during deployment. Note that the Pool will automatically unpause after the Buffer Period expires.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The address of the pool  |

## Miscellaneous
### `getVaultExtension`

```solidity
function getVaultExtension() external view returns (address);
```
This `Vault` function returns the Vault Extension address.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | address  | Address of the VaultExtension  |

### `getVaultAdmin`

```solidity
function getVaultAdmin() external view returns (address);
```
This `VaultExtension` function returns the Vault Admin contract address.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | address  | The address of the Vault Admin contract  |

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

