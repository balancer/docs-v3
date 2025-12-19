---
order: 3
title: Buffer Router API
---

# Buffer Router API

The Buffer Router can be used to interact with Balancer onchain for buffer operations.

## ERC4626 Buffers

### `initializeBuffer`

```solidity
function initializeBuffer(
    IERC4626 wrappedToken,
    uint256 exactAmountUnderlyingIn,
    uint256 exactAmountWrappedIn,
    uint256 minIssuedShares
) external returns (uint256 issuedShares);
```
Adds liquidity for the first time to one of the Vault's internal ERC4626 buffers. Buffer operations will revert until the buffer is initialized. To avoid unexpected behavior, always initialize buffers before creating or initializing any pools that contain the wrapped tokens to be used with them.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC4626  | Address of the wrapped token that implements IERC4626 |
| exactAmountUnderlyingIn  | uint256  | Amount of underlying tokens that will be deposited into the buffer |
| exactAmountWrappedIn  | uint256  | Amount of wrapped tokens that will be deposited into the buffer |
| minIssuedShares | uint256 | Minimum amount of shares to receive, in underlying token native decimals |
**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| issuedShares  | uint256  | The amount of tokens sharesOwner has in the buffer, denominated in underlying tokens (This is the BPT of an internal ERC4626 token buffer) |

### `addLiquidityToBuffer`

```solidity
function addLiquidityToBuffer(
    IERC4626 wrappedToken,
    uint256 maxAmountUnderlyingIn,
    uint256 maxAmountWrappedIn,
    uint256 exactSharesToIssue,
) external returns (uint256 amountUnderlyingRaw, uint256 amountWrappedRaw);
```
Adds liquidity proportionally to a yield-bearing buffer (one of the Vault's internal ERC4626 token buffers). This limitation is necessary to avoid having multiple "wrap/unwrap" paths.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC4626  | Address of the wrapped token that implements IERC4626 |
| maxAmountUnderlyingIn | uint256 | Maximum amount of underlying tokens to add to the buffer. It is expressed in underlying token native decimals |
| maxAmountWrappedIn | uint256 | Maximum amount of wrapped tokens to add to the buffer. It is expressed in wrapped token native decimals |
| exactSharesToIssue  | uint256  | The value in underlying tokens that `sharesOwner` wants to add to the buffer, in underlying token decimals |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| amountUnderlyingRaw  | uint256  | Amount of underlying tokens deposited into the buffer |
| amountWrappedRaw  | uint256  | Amount of wrapped tokens deposited into the buffer |

## Queries

### `queryInitializeBuffer`

```solidity
function initializeBuffer(
    IERC4626 wrappedToken,
    uint256 exactAmountUnderlyingIn,
    uint256 exactAmountWrappedIn
) external returns (uint256 issuedShares);
```
Query an `initializeBuffer` operation without actually executing it.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC4626  | Address of the wrapped token that implements IERC4626 |
| exactAmountUnderlyingIn  | uint256  | Amount of underlying tokens that will be deposited into the buffer |
| exactAmountWrappedIn  | uint256  | Amount of wrapped tokens that will be deposited into the buffer |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| issuedShares  | uint256  | The amount of tokens sharesOwner has in the buffer, denominated in underlying tokens (This is the BPT of an internal ERC4626 token buffer) |

### `queryAddLiquidityToBuffer`

```solidity
function addLiquidityToBuffer(
    IERC4626 wrappedToken,
    uint256 exactSharesToIssue,
) external returns (uint256 amountUnderlyingRaw, uint256 amountWrappedRaw);
```
Query an `addLiquidityToBuffer` operation without actually executing it.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC4626  | Address of the wrapped token that implements IERC4626 |
| maxAmountUnderlyingIn | uint256 | Maximum amount of underlying tokens to add to the buffer. It is expressed in underlying token native decimals |
| maxAmountWrappedIn | uint256 | Maximum amount of wrapped tokens to add to the buffer. It is expressed in wrapped token native decimals |
| exactSharesToIssue  | uint256  | The value in underlying tokens that `sharesOwner` wants to add to the buffer, in underlying token decimals |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| amountUnderlyingRaw  | uint256  | Amount of underlying tokens deposited into the buffer |
| amountWrappedRaw  | uint256  | Amount of wrapped tokens deposited into the buffer |

### `queryRemoveLiquidityFromBuffer`

```solidity
function queryRemoveLiquidityFromBuffer(
    IERC4626 wrappedToken,
    uint256 exactSharesToRemove,
) external returns (uint256 removedUnderlyingBalanceOut, uint256 removedWrappedBalanceOut);
```
Query an `removeLiquidityToBuffer` operation without actually executing it.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| wrappedToken  | IERC4626  | Address of the wrapped token that implements IERC4626 |
| exactSharesToRemove  | uint256  | The amount of shares that would be burned, in underlying token decimals |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| removedUnderlyingBalanceOut  | uint256  | Amount of underlying tokens that would be removed from the buffer |
| removedWrappedBalanceOut  | uint256  | Amount of wrapped tokens that would be removed from the buffer |

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>
