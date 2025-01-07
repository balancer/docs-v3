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

### `getAddLiquidityCalledFlag`

```solidity
function getAddLiquidityCalledFlag(address pool) external view returns (bool);
```
This `VaultExtension` function retrieves the value of the flag used to detect and tax "round trip" transactions (adding and removing liquidity in the same pool).

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | The pool on which to check the flag  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | bool  | True if addLiquidity has been called on this pool in the current transaction  |

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

[VaultSwapParams](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L277:L295) is defined as:
```solidity
/**
 * @notice Data passed into primary Vault `swap` operations.
 * @param kind Type of swap (Exact In or Exact Out)
 * @param pool The pool with the tokens being swapped
 * @param tokenIn The token entering the Vault (balance increases)
 * @param tokenOut The token leaving the Vault (balance decreases)
 * @param amountGivenRaw Amount specified for tokenIn or tokenOut (depending on the type of swap)
 * @param limitRaw Minimum or maximum value of the calculated amount (depending on the type of swap)
 * @param userData Additional (optional) user data
 */
struct VaultSwapParams {
    SwapKind kind;
    address pool;
    IERC20 tokenIn;
    IERC20 tokenOut;
    uint256 amountGivenRaw;
    uint256 limitRaw;
    bytes userData;
}

enum SwapKind {
    EXACT_IN,
    EXACT_OUT
}
```

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

[AddLiquidityParams](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L368-L375) is defined as: 
```solidity
/**
 * @notice Data for an add liquidity operation.
 * @param pool Address of the pool
 * @param to Address of user to mint to
 * @param maxAmountsIn Maximum amounts of input tokens
 * @param minBptAmountOut Minimum amount of output pool tokens
 * @param kind Add liquidity kind
 * @param userData Optional user data
 */
struct AddLiquidityParams {
    address pool;
    address to;
    uint256[] maxAmountsIn;
    uint256 minBptAmountOut;
    AddLiquidityKind kind;
    bytes userData;
}

enum AddLiquidityKind {
    PROPORTIONAL,
    UNBALANCED,
    SINGLE_TOKEN_EXACT_OUT,
    DONATION,
    CUSTOM
}

```

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

[RemoveLiquidityParams](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L397-L404) is defined as:
```solidity
/**
 * @notice Data for an remove liquidity operation.
 * @param pool Address of the pool
 * @param from Address of user to burn from
 * @param maxBptAmountIn Maximum amount of input pool tokens
 * @param minAmountsOut Minimum amounts of output tokens
 * @param kind Remove liquidity kind
 * @param userData Optional user data
 */
struct RemoveLiquidityParams {
    address pool;
    address from;
    uint256 maxBptAmountIn;
    uint256[] minAmountsOut;
    RemoveLiquidityKind kind;
    bytes userData;
}

enum RemoveLiquidityKind {
    PROPORTIONAL,
    SINGLE_TOKEN_EXACT_IN,
    SINGLE_TOKEN_EXACT_OUT,
    CUSTOM
}

```

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

[PoolData](https://github.com/balancer/balancer-v3-monorepo/blob/2d6ae6a3d0082cafcdb9a963421bcd31858a106c/pkg/interfaces/contracts/vault/VaultTypes.sol#L244-L252) is defined as:
```solidity
/**
 * @notice Data structure used to represent the current pool state in memory
 * @param poolConfigBits Custom type to store the entire configuration of the pool.
 * @param tokens Pool tokens, sorted in token registration order
 * @param tokenInfo Configuration data for each token, sorted in token registration order
 * @param balancesRaw Token balances in native decimals
 * @param balancesLiveScaled18 Token balances after paying yield fees, applying decimal scaling and rates
 * @param tokenRates 18-decimal FP values for rate tokens (e.g., yield-bearing), or FP(1) for standard tokens
 * @param decimalScalingFactors Conversion factor used to adjust for token decimals for uniform precision in
 * calculations. It is 1e18 (FP 1) for 18-decimal tokens
 */
struct PoolData {
    PoolConfigBits poolConfigBits;
    IERC20[] tokens;
    TokenInfo[] tokenInfo;
    uint256[] balancesRaw;
    uint256[] balancesLiveScaled18;
    uint256[] tokenRates;
    uint256[] decimalScalingFactors;
}
```

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

[TokenInfo](https://github.com/balancer/balancer-v3-monorepo/blob/2d6ae6a3d0082cafcdb9a963421bcd31858a106c/pkg/interfaces/contracts/vault/VaultTypes.sol#L227-L231) is defined as:
```solidity
/**
 * @notice This data structure is stored in `_poolTokenInfo`, a nested mapping from pool -> (token -> TokenInfo).
 * @dev Since the token is already the key of the nested mapping, it would be redundant (and an extra SLOAD) to store
 * it again in the struct. When we construct PoolData, the tokens are separated into their own array.
 *
 * @param tokenType The token type (see the enum for supported types)
 * @param rateProvider The rate provider for a token (see further documentation above)
 * @param paysYieldFees Flag indicating whether yield fees should be charged on this token
 */
struct TokenInfo {
    TokenType tokenType;
    IRateProvider rateProvider;
    bool paysYieldFees;
}

enum TokenType {
    STANDARD,
    WITH_RATE
}

```

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

[PoolConfig](https://github.com/balancer/balancer-v3-monorepo/blob/2d6ae6a3d0082cafcdb9a963421bcd31858a106c/pkg/interfaces/contracts/vault/VaultTypes.sol#L40-L51) is defined as:
```solidity
/**
 * @notice Represents a pool's configuration (hooks configuration are separated in another struct).
 * @param liquidityManagement Flags related to adding/removing liquidity
 * @param staticSwapFeePercentage The pool's native swap fee
 * @param aggregateSwapFeePercentage The total swap fee charged, including protocol and pool creator components
 * @param aggregateYieldFeePercentage The total swap fee charged, including protocol and pool creator components
 * @param tokenDecimalDiffs Compressed storage of the token decimals of each pool token
 * @param pauseWindowEndTime Timestamp after which the pool cannot be paused
 * @param isPoolRegistered If true, the pool has been registered with the Vault
 * @param isPoolInitialized If true, the pool has been initialized with liquidity, and is available for trading
 * @param isPoolPaused If true, the pool has been paused (by governance or the pauseManager)
 * @param isPoolInRecoveryMode If true, the pool has been placed in recovery mode, enabling recovery mode withdrawals
 */
struct PoolConfig {
    LiquidityManagement liquidityManagement;
    uint256 staticSwapFeePercentage;
    uint256 aggregateSwapFeePercentage;
    uint256 aggregateYieldFeePercentage;
    uint40 tokenDecimalDiffs;
    uint32 pauseWindowEndTime;
    bool isPoolRegistered;
    bool isPoolInitialized;
    bool isPoolPaused;
    bool isPoolInRecoveryMode;
}
```

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

[HooksConfig](https://github.com/balancer/balancer-v3-monorepo/blob/2d6ae6a3d0082cafcdb9a963421bcd31858a106c/pkg/interfaces/contracts/vault/VaultTypes.sol#L73-L85) is defined as:
```solidity
/// @notice Represents a hook contract configuration for a pool (HookFlags + hooksContract address).
struct HooksConfig {
    bool enableHookAdjustedAmounts;
    bool shouldCallBeforeInitialize;
    bool shouldCallAfterInitialize;
    bool shouldCallComputeDynamicSwapFee;
    bool shouldCallBeforeSwap;
    bool shouldCallAfterSwap;
    bool shouldCallBeforeAddLiquidity;
    bool shouldCallAfterAddLiquidity;
    bool shouldCallBeforeRemoveLiquidity;
    bool shouldCallAfterRemoveLiquidity;
    address hooksContract;
}
```

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

### `areBuffersPaused`

```solidity
function areBuffersPaused() external view returns (bool);
```
This `VaultAdmin` function indicates whether ERC4626 buffers are paused. When buffers are paused, all buffer operations (i.e., calls on the Router with `isBuffer` true) will revert. Pausing buffers is reversible. Note that ERC4626 buffers and the Vault have separate and independent pausing mechanisms. Pausing the Vault does not also pause buffers (though we anticipate they would likely be paused and unpaused together). Call `isVaultPaused` to check the pause state of the Vault.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| buffersPaused  | bool  | True if ERC4626 buffers are paused  |

### `pauseVaultBuffers`

```solidity
function pauseVaultBuffers() external;
```
This `VaultAdmin` function pauses native vault buffers globally. When buffers are paused, it's not possible to add liquidity or wrap/unwrap tokens using Vault's `erc4626BufferWrapOrUnwrap` primitive. However, it's still possible to remove liquidity. Currently it's not possible to pause vault buffers individually. This is a permissioned call, and is reversible (see `unpauseVaultBuffers`). Note that the Vault has a separate and independent pausing mechanism. It is possible to pause the Vault (i.e. pool operations), without affecting buffers, and vice versa.

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
    uint256 minIssuedShares,
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
| minIssuedShares | uint256 | Minimum amount of shares to receive from the buffer, expressed in underlying token native decimals |
| sharesOwner  | address  | Address of the contract that will own the liquidity. Only this contract will be able to remove liquidity from the buffer |

### `addLiquidityToBuffer`

```solidity
function addLiquidityToBuffer(
    IERC4626 wrappedToken,
    uint256 maxAmountUnderlyingInRaw,
    uint256 maxAmountWrappedInRaw,
    uint256 exactSharesToIssue,
    address sharesOwner
) external returns (uint256 amountUnderlyingRaw, uint256 amountWrappedRaw);
```
This `VaultAdmin` function adds liquidity proportionally to an internal ERC4626 buffer in the Vault. Reverts if the buffer has not been initialized.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC4626  | Address of the wrapped token that implements IERC4626  |
| maxAmountUnderlyingInRaw  | uint256  | Amount of underlying tokens that will be deposited into the buffer  |
| maxAmountWrappedInRaw  | uint256  | Amount of wrapped tokens that will be deposited into the buffer  |
| exactSharesToIssue | uint256 | The value in underlying tokens that `sharesOwner` wants to add to the buffer in underlying token decimals |
| sharesOwner  | address  | Address of the contract that will own the liquidity. Only this contract will be able to remove liquidity from the buffer |

### `removeLiquidityFromBuffer`

```solidity
function removeLiquidityFromBuffer(
    IERC4626 wrappedToken,
    uint256 sharesToRemove,
    uint256 minAmountUnderlyingOutRaw,
    uint256 minAmountWrappedOutRaw
) external returns (uint256 removedUnderlyingBalanceRaw, uint256 removedWrappedBalanceRaw);
```
This `VaultAdmin` function removes liquidity from an internal ERC4626 buffer in the Vault. Only proportional exits are supported. Note that the `sharesOwner` here is the msg.sender; unlike initialize, add, and other buffer operations, the entrypoint for this function is the Vault itself.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC4626  | Address of the wrapped token that implements IERC4626  |
| sharesToRemove  | uint256  | Amount of shares to remove from the buffer. Cannot be greater than sharesOwner total shares  |
| minAmountUnderlyingOutRaw | uint256 | Minimum amount of underlying tokens to receive from the buffer. It is expressed in underlying token native decimals |
| minAmountWrappedOutRaw | uint256 | Minimum amount of wrapped tokens to receive from the buffer. It is expressed in wrapped token native decimals |

### `getBufferOwnerShares`

```solidity
function getBufferOwnerShares(
    IERC4626 wrappedToken,
    address liquidityOwner
) external view returns (uint256 ownerShares);
```
This `VaultAdmin` function returns the shares (internal buffer BPT) of a liquidity owner: a user that deposited assets in the buffer.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC20  | Address of the wrapped token that implements IERC4626  |
| liquidityOwner  | address  | Address of the user that owns liquidity in the wrapped token's buffer  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| ownerShares  | uint256  | Amount of shares allocated to the liquidity owner, in native underlying token decimals |

### `getBufferAsset`

```solidity
function getBufferAsset(
    IERC4626 wrappedToken
) external view returns (address underlyingToken);
```
This `VaultAdmin` function returns the shares (internal buffer BPT) of a liquidity owner: a user that deposited assets in the buffer.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC4626  | Address of the wrapped token that implements IERC4626  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| underlyingToken  | address  | Address of the underlying token for the buffer |

### `getBufferTotalShares`

```solidity
function getBufferTotalShares(IERC4626 wrappedToken) external view returns (uint256 bufferShares);
```
This `VaultAdmin` function returns the supply shares (internal buffer BPT) of the ERC4626 buffer.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC4626  | Address of the wrapped token that implements IERC4626  |

### `getBufferBalance`

```solidity
function getBufferBalance(
    IERC4626 wrappedToken
) external view returns (uint256 underlyingBalanceRaw, uint256 wrappedBalanceRaw);
```
This `VaultAdmin` function returns the amount of underlying and wrapped tokens deposited in the internal buffer of the vault.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC4626  | Address of the wrapped token that implements IERC4626  |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| underlyingBalanceRaw  | uint256  | Amount of underlying tokens deposited into the buffer, in native token decimals |
| wrappedBalanceRaw  | uint256  | Amount of wrapped tokens deposited into the buffer, in native token decimals |

## Authentication
### `getAuthorizer`

```solidity
function getAuthorizer() external view returns (IAuthorizer);
```
This `VaultExtension` function returns the Vault's Authorizer.

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

[TokenConfig](https://github.com/balancer/balancer-v3-monorepo/blob/2d6ae6a3d0082cafcdb9a963421bcd31858a106c/pkg/interfaces/contracts/vault/VaultTypes.sol#L211-L216), [PoolRoleAccounts](https://github.com/balancer/balancer-v3-monorepo/blob/2d6ae6a3d0082cafcdb9a963421bcd31858a106c/pkg/interfaces/contracts/vault/VaultTypes.sol#L119-L123) and [LiquidityManagement](https://github.com/balancer/balancer-v3-monorepo/blob/2d6ae6a3d0082cafcdb9a963421bcd31858a106c/pkg/interfaces/contracts/vault/VaultTypes.sol#L17-L22) is defined as:
```solidity
/**
 * @notice Encapsulate the data required for the Vault to support a token of the given type.
 * @dev For STANDARD tokens, the rate provider address must be 0, and paysYieldFees must be false. All WITH_RATE tokens
 * need a rate provider, and may or may not be yield-bearing.
 *
 * At registration time, it is useful to include the token address along with the token parameters in the structure
 * passed to `registerPool`, as the alternative would be parallel arrays, which would be error prone and require
 * validation checks. `TokenConfig` is only used for registration, and is never put into storage (see `TokenInfo`).
 *
 * @param token The token address
 * @param tokenType The token type (see the enum for supported types)
 * @param rateProvider The rate provider for a token (see further documentation above)
 * @param paysYieldFees Flag indicating whether yield fees should be charged on this token
 */
struct TokenConfig {
    IERC20 token;
    TokenType tokenType;
    IRateProvider rateProvider;
    bool paysYieldFees;
}

/**
 * @notice Represents the accounts holding certain roles for a given pool. This is passed in on pool registration.
 * @param pauseManager Account empowered to pause/unpause the pool (note that governance can always pause a pool)
 * @param swapFeeManager Account empowered to set static swap fees for a pool (or 0 to delegate to governance)
 * @param poolCreator Account empowered to set the pool creator fee (or 0 if all fees go to the protocol and LPs)
 */
struct PoolRoleAccounts {
    address pauseManager;
    address swapFeeManager;
    address poolCreator;
}

/**
 * @notice Represents a pool's liquidity management configuration.
 * @param disableUnbalancedLiquidity If set, liquidity can only be added or removed proportionally
 * @param enableAddLiquidityCustom If set, the pool has implemented `onAddLiquidityCustom`
 * @param enableRemoveLiquidityCustom If set, the pool has implemented `onRemoveLiquidityCustom`
 * @param enableDonation If set, the pool will not revert if liquidity is added with AddLiquidityKind.DONATION
 */
struct LiquidityManagement {
    bool disableUnbalancedLiquidity;
    bool enableAddLiquidityCustom;
    bool enableRemoveLiquidityCustom;
    bool enableDonation;
}
```

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
This `Vault` function transfers pool token from owner to a recipient.

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
This `Vault` function transfers pool token from a sender to a recipient using an allowance.

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

The [PoolSwapParams](https://github.com/balancer/balancer-v3-monorepo/blob/2d6ae6a3d0082cafcdb9a963421bcd31858a106c/pkg/interfaces/contracts/vault/VaultTypes.sol#L307-L315) is defined as:

```solidity
/**
 * @notice Data for a swap operation, used by contracts implementing `IBasePool`.
 * @param kind Type of swap (exact in or exact out)
 * @param amountGivenScaled18 Amount given based on kind of the swap (e.g., tokenIn for EXACT_IN)
 * @param balancesScaled18 Current pool balances
 * @param indexIn Index of tokenIn
 * @param indexOut Index of tokenOut
 * @param router The address (usually a router contract) that initiated a swap operation on the Vault
 * @param userData Additional (optional) data required for the swap
 */
struct PoolSwapParams {
    SwapKind kind;
    uint256 amountGivenScaled18;
    uint256[] balancesScaled18;
    uint256 indexIn;
    uint256 indexOut;
    address router;
    bytes userData;
}
```

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
    uint256 exactBptAmountIn,
    uint256[] memory minAmountsOut
) external returns (uint256[] memory amountsOut);
```
This `VaultExtension` function removes liquidity from a pool specifying exact pool tokens in, with proportional token amounts out. The request is implemented by the Vault without any interaction with the pool, ensuring that it works the same for all pools, and cannot be disabled by a new pool type.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the pool  |
| from  | address  | Address of user to burn pool tokens from  |
| exactBptAmountIn  | uint256  | Input pool token amount  |
| minAmountsOut | uint256[] | Minimum amounts of tokens to be received, sorted in token registration order |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| amountsOut  | uint256[]  | Actual calculated amounts of output tokens, sorted in token registration order  |

### `enableRecoveryMode`

```solidity
function enableRecoveryMode(address pool) external;
```
This `VaultAdmin` function enables recovery mode for a pool. This is a permissioned function, but becomes permissionless if the Vault or pool is paused.

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
This `VaultExtension` function checks if the queries reversibly disabled on the Vault.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | bool  | If true, then queries are disabled  |

### `isQueryDisabledPermanently`

```solidity
function isQueryDisabledPermanently() external view returns (bool);
```
This `VaultExtension` function checks if the queries are permanently disabled on the Vault.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | bool  | If true, then queries are disabled  |

### `emitAuxiliaryEvent`

```solidity
function emitAuxiliaryEvent(string calldata eventKey, bytes calldata eventData) external;
```
This `VaultExtension` function checks if the queries are permanently disabled on the Vault.

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
|  | bool  | If true, then queries are disabled  |

### `disableQuery`

```solidity
function disableQuery() external;
```
This `VaultAdmin` function reversibly disables query functionality on the Vault. It can only be called by governance.

### `disableQueryPermanently`

```solidity
function disableQueryPermanently() external;
```
This `VaultAdmin` function permanently disables query functionality on the Vault. It can only be called by governance.

### `enableQuery`

```solidity
function enableQuery() external;
```
This `VaultAdmin` function re-enables reversibly disabled query functionality on the Vault. It can only be called by governance.

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
This `VaultAdmin` function indicates whether the Vault is paused. Note that ERC4626 buffers and the Vault have separate and independent pausing mechanisms. Pausing the Vault does not also pause buffers (though we anticipate they would likely be paused and unpaused together). Call `areBuffersPaused` to check the pause state of the buffers.

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
This `VaultAdmin` function pauses the Vault: an emergency action which disables all operational state-changing functions on pools. This is a permissioned function that will only work during the Pause Window set during deployment. Note that ERC4626 buffer operations have an independent pause mechanism, which is not affected by pausing the Vault. Custom routers could still wrap/unwrap using buffers while the Vault is paused, unless buffers are also paused (with `pauseVaultBuffers`).

### `unpauseVault`

```solidity
function unpauseVault() external;
```
This `VaultAdmin` function reverses a `pause` operation, and restores Vault pool operations to normal functionality. This is a permissioned function that will only work on a paused Vault within the Buffer Period set during deployment. Note that the Vault will automatically unpause after the Buffer Period expires. And as noted above, ERC4626 buffers and Vault operations on pools are independent. Unpausing the Vault does not reverse `pauseVaultBuffers`. If buffers were also paused, they will remain in that state until explicitly unpaused.

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

