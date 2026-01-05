---
order: 4
title: Buffer Router API
---

# Buffer Router API

The Buffer Router can be used to interact with Balancer onchain via state changing operations or used to query operations in an off-chain context.

The Buffer Router manages liquidity for internal ERC4626 buffers in the Vault. Buffers enable efficient wrapping/unwrapping of yield-bearing tokens by maintaining liquidity pools of both underlying and wrapped tokens.

## State-changing functions

### ERC4626 Buffers

#### `initializeBuffer`

```solidity
function initializeBuffer(
    IERC4626 wrappedToken,
    uint256 exactAmountUnderlyingIn,
    uint256 exactAmountWrappedIn,
    uint256 minIssuedShares
) external returns (uint256 issuedShares);
```

Adds liquidity for the first time to an internal ERC4626 buffer in the Vault. This binds the wrapped token to its underlying asset permanently.

**Important:** Calling this method binds the wrapped token to its underlying asset internally; the asset in the wrapper cannot change afterwards, or every other operation on that wrapper (add / remove / wrap / unwrap) will fail. To avoid unexpected behavior, always initialize buffers before creating or initializing any pools that contain the wrapped tokens to be used with them.

**Parameters:**

| Name                     | Type     | Description                                                                                  |
|--------------------------|----------|----------------------------------------------------------------------------------------------|
| wrappedToken             | IERC4626 | Address of the wrapped token that implements IERC4626                                        |
| exactAmountUnderlyingIn  | uint256  | Amount of underlying tokens that will be deposited into the buffer                           |
| exactAmountWrappedIn     | uint256  | Amount of wrapped tokens that will be deposited into the buffer                              |
| minIssuedShares          | uint256  | Minimum amount of shares to receive from the buffer, expressed in underlying token native decimals |

**Returns:**

| Name         | Type    | Description                                                                                                 |
|--------------|---------|-------------------------------------------------------------------------------------------------------------|
| issuedShares | uint256 | The amount of tokens sharesOwner has in the buffer, denominated in underlying tokens (This is the BPT of the Vault's internal ERC4626 buffer) |

#### `addLiquidityToBuffer`

```solidity
function addLiquidityToBuffer(
    IERC4626 wrappedToken,
    uint256 maxAmountUnderlyingIn,
    uint256 maxAmountWrappedIn,
    uint256 exactSharesToIssue
) external returns (
    uint256 amountUnderlyingIn,
    uint256 amountWrappedIn
);
```

Adds liquidity proportionally to an existing internal ERC4626 buffer in the Vault.

**Note:** Requires the buffer to be initialized beforehand. Restricting adds to proportional simplifies the Vault code, avoiding rounding issues and minimum amount checks. It is possible to add unbalanced by interacting with the wrapper contract directly.

**Parameters:**

| Name                 | Type     | Description                                                                                  |
|----------------------|----------|----------------------------------------------------------------------------------------------|
| wrappedToken         | IERC4626 | Address of the wrapped token that implements IERC4626                                        |
| maxAmountUnderlyingIn | uint256 | Maximum amount of underlying tokens to add to the buffer. It is expressed in underlying token native decimals |
| maxAmountWrappedIn   | uint256  | Maximum amount of wrapped tokens to add to the buffer. It is expressed in wrapped token native decimals |
| exactSharesToIssue   | uint256  | The amount of shares that `sharesOwner` wants to add to the buffer, in underlying token decimals |

**Returns:**

| Name                | Type    | Description                                          |
|---------------------|---------|------------------------------------------------------|
| amountUnderlyingIn  | uint256 | Amount of underlying tokens deposited into the buffer |
| amountWrappedIn     | uint256 | Amount of wrapped tokens deposited into the buffer    |

## Queries

### `queryInitializeBuffer`

```solidity
function queryInitializeBuffer(
    IERC4626 wrappedToken,
    uint256 exactAmountUnderlyingIn,
    uint256 exactAmountWrappedIn
) external returns (uint256 issuedShares);
```

Queries an `initializeBuffer` operation without actually executing it.

**Parameters:**

| Name                    | Type     | Description                                                                     |
|-------------------------|----------|---------------------------------------------------------------------------------|
| wrappedToken            | IERC4626 | Address of the wrapped token that implements IERC4626                           |
| exactAmountUnderlyingIn | uint256  | Amount of underlying tokens that the sender wishes to deposit into the buffer   |
| exactAmountWrappedIn    | uint256  | Amount of wrapped tokens that the sender wishes to deposit into the buffer      |

**Returns:**

| Name         | Type    | Description                                                  |
|--------------|---------|--------------------------------------------------------------|
| issuedShares | uint256 | The amount of shares that would be minted, in underlying token decimals |

### `queryAddLiquidityToBuffer`

```solidity
function queryAddLiquidityToBuffer(
    IERC4626 wrappedToken,
    uint256 exactSharesToIssue
) external returns (
    uint256 amountUnderlyingIn,
    uint256 amountWrappedIn
);
```

Queries an `addLiquidityToBuffer` operation without actually executing it.

**Parameters:**

| Name               | Type     | Description                                                         |
|--------------------|----------|---------------------------------------------------------------------|
| wrappedToken       | IERC4626 | Address of the wrapped token that implements IERC4626               |
| exactSharesToIssue | uint256  | The amount of shares that would be minted, in underlying token decimals |

**Returns:**

| Name               | Type    | Description                                                  |
|--------------------|---------|--------------------------------------------------------------|
| amountUnderlyingIn | uint256 | Amount of underlying tokens that would be deposited into the buffer |
| amountWrappedIn    | uint256 | Amount of wrapped tokens that would be deposited into the buffer    |

### `queryRemoveLiquidityFromBuffer`

```solidity
function queryRemoveLiquidityFromBuffer(
    IERC4626 wrappedToken,
    uint256 exactSharesToRemove
) external returns (
    uint256 removedUnderlyingBalanceOut,
    uint256 removedWrappedBalanceOut
);
```

Queries a `removeLiquidityFromBuffer` operation without actually executing it.

**Note:** The execution function `removeLiquidityFromBuffer` exists on the Vault, not the router.

**Parameters:**

| Name                | Type     | Description                                                          |
|---------------------|----------|----------------------------------------------------------------------|
| wrappedToken        | IERC4626 | Address of the wrapped token that implements IERC4626                |
| exactSharesToRemove | uint256  | The amount of shares that would be burned, in underlying token decimals |

**Returns:**

| Name                         | Type    | Description                                                    |
|------------------------------|---------|----------------------------------------------------------------|
| removedUnderlyingBalanceOut  | uint256 | Amount of underlying tokens that would be removed from the buffer |
| removedWrappedBalanceOut     | uint256 | Amount of wrapped tokens that would be removed from the buffer    |

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>
