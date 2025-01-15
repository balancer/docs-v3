---
order: 1
title: Composite Liquidity Router API
---

# Composite Liquidity Router API

The Composite Liquidity Router can be used to interact with Balancer onchain via state changing operations or used to query operations in an off-chain context.

This is not the final version; more operations will likely be added.

## State-changing functions

## Composite Liquidity operations on ERC4626 pools

### `addLiquidityUnbalancedToERC4626Pool`

```solidity
function addLiquidityUnbalancedToERC4626Pool(
    address pool,
    uint256[] memory exactUnderlyingAmountsIn,
    uint256 minBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256 bptAmountOut);
```
Add arbitrary amounts of underlying tokens to an ERC4626 pool through the buffer. An "ERC4626 pool" contains IERC4626 yield-bearing tokens (e.g., waDAI). Ensure that any buffers associated with the wrapped tokens in the ERC4626 pool have been initialized before initializing or adding liquidity to the "parent" pool, and also make sure limits are set properly.

**Parameters:**

| Name       | Type                               | Description                                                                                  |
|------------|------------------------------------|----------------------------------------------------------------------------------------------|
| pool      | address     | Address of the liquidity pool                        |
| exactUnderlyingAmountsIn   | uint256[] memory                            | Exact amounts of underlying tokens in, sorted in token registration order of wrapped tokens in the pool |
| minBptAmountOut   | uint256                            | Minimum amount of pool tokens to be received |
| wethIsEth  | bool                               | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH     |
| userData   | bytes calldata                     | Additional (optional) data required for the operation                                             |

**Returns:**

| Name             | Type                   | Description                                                                                  |
|------------------|------------------------|----------------------------------------------------------------------------------------------|
| bptAmountOut   | uint256       | Actual amount of pool tokens received        |

### `addLiquidityProportionalToERC4626Pool`

```solidity
function addLiquidityProportionalToERC4626Pool(
    address pool,
    uint256[] memory maxUnderlyingAmountsIn,
    uint256 exactBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256[] memory underlyingAmountsIn);
```
Add proportional amounts of underlying tokens to an ERC4626 pool through the buffer. An "ERC4626 pool" contains IERC4626 yield-bearing tokens (e.g., waDAI). Ensure that any buffers associated with the wrapped tokens in the ERC4626 pool have been initialized before initializing or adding liquidity to the "parent" pool, and also make sure limits are set properly.

**Parameters:**

|------------|------------------------------------|----------------------------------------------------------------------------------------------|
| pool      | address     | Address of the liquidity pool                        |
| maxUnderlyingAmountsIn   | uint256[] memory      | Maximum amounts of underlying tokens in, sorted in token registration order of wrapped tokens in the pool |
| exactBptAmountOut   | uint256                            | Exact amount of pool tokens to be received |
| wethIsEth  | bool                               | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH     |
| userData   | bytes calldata                     | Additional (optional) data required for the operation                             |

**Returns:**

| Name             | Type                   | Description                                                                                  |
|------------------|------------------------|----------------------------------------------------------------------------------------------|
| underlyingAmountsIn    | uint256[] memory       | Calculated amounts of input tokens corresponding to the first step of each given path        |

### `removeLiquidityProportionalFromERC4626Pool`

```solidity
function removeLiquidityProportionalFromERC4626Pool(
    address pool,
    uint256 exactBptAmountIn,
    uint256[] memory minUnderlyingAmountsOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256[] memory underlyingAmountsOut);
```
Remove proportional amounts of underlying from an ERC4626 pool, burning an exact pool token amount. An "ERC4626 pool" contains IERC4626 yield-bearing tokens (e.g., waDAI).

**Parameters:**

|------------|------------------------------------|----------------------------------------------------------------------------------------------|
| pool      | address     | Address of the liquidity pool                        |
| exactBptAmountIn   | uint256                            | Exact amount of pool tokens provided |
| minUnderlyingAmountsOut   | uint256[] memory      | Minimum amounts of underlying tokens out, sorted in token registration order of wrapped tokens in the pool |
| wethIsEth  | bool                               | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH     |
| userData   | bytes calldata                     | Additional (optional) data required for the operation                                         |

**Returns:**

| Name             | Type                   | Description                                                                                  |
|------------------|------------------------|----------------------------------------------------------------------------------------------|
| underlyingAmountsOut    | uint256[] memory       | Actual amounts of tokens received, sorted in token registration order of wrapped wrapped tokens in the pool   |

## Composite Liquidity operations on nested pools

### `addLiquidityUnbalancedNestedPool`

```solidity
function addLiquidityUnbalancedNestedPool(
    address parentPool,
    address[] memory tokensIn,
    uint256[] memory exactAmountsIn,
    uint256 minBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external returns (uint256 bptAmountOut);
```
Adds liquidity unbalanced to a nested pool. A nested pool is one in which one or more tokens are BPTs from another pool (child pool). Since there are multiple pools involved, the token order is not given, so the user must specify the preferred order to inform the token in amounts.

**Parameters:**

| Name       | Type                               | Description                                                                                  |
|------------|------------------------------------|----------------------------------------------------------------------------------------------|
| parentPool      | address     | Address of the highest level pool (which contains BPTs of other pools) |
| tokensIn   | uint256[] memory | Input token addresses, sorted by user preference. `tokensIn` array must have all tokens from child pools and all tokens that are not BPTs from the nested pool (parent pool). |
| exactAmountsIn   | uint256[] memory  | Amount of each underlying token in, sorted according to tokensIn array |
| minBptAmountOut  | uint256                               | Expected minimum amount of parent pool tokens to receive    |
| wethIsEth  | bool                               | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH     |
| userData   | bytes calldata                     | Additional (optional) data required for the operation                                             |

**Returns:**

| Name             | Type                   | Description                                                                                  |
|------------------|------------------------|----------------------------------------------------------------------------------------------|
| bptAmountOut   | uint256       | Expected amount of parent pool tokens to receive  |

### `removeLiquidityProportionalNestedPool`

```solidity
function removeLiquidityProportionalNestedPool(
    address parentPool,
    uint256 exactBptAmountIn,
    address[] memory tokensOut,
    uint256[] memory minAmountsOut,
    bool wethIsEth,
    bytes memory userData
) external returns (uint256[] memory amountsOut);
```
Adds liquidity unbalanced to a nested pool. A nested pool is one in which one or more tokens are BPTs from another pool (child pool). Since there are multiple pools involved, the token order is not given, so the user must specify the preferred order to inform the token in amounts.

**Parameters:**

| Name       | Type                               | Description                                                                                  |
|------------|------------------------------------|----------------------------------------------------------------------------------------------|
| parentPool      | address     | Address of the highest level pool (which contains BPTs of other pools) |
| exactBptAmountIn  | uint256                               | Exact amount of `parentPool` tokens provided    |
| tokensOut   | uint256[] memory | Output token addresses, sorted by user preference. `tokensOut` array must have all tokens from child pools and all tokens that are not BPTs from the nested pool (parent pool). If not all tokens are informed, balances are not settled and the operation reverts. Tokens that repeat must be informed only once. |
| minAmountsOut   | uint256[] memory  | Amount of each underlying token in, sorted according to tokensIn array |
| wethIsEth  | bool                               | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH     |
| userData   | bytes calldata                     | Additional (optional) data required for the operation                                             |

**Returns:**

| Name             | Type                   | Description                                                                                  |
|------------------|------------------------|----------------------------------------------------------------------------------------------|
| amountsOut   | uint256[] memory       | Actual amounts of tokens received, parallel to `tokensOut`  |

## Queries

### `queryAddLiquidityUnbalancedToERC4626Pool`

```solidity
function queryAddLiquidityUnbalancedToERC4626Pool(
    address pool,
    uint256[] memory exactUnderlyingAmountsIn,
    address sender,
    bytes memory userData
) external returns (uint256 bptAmountOut);
```
Query an `addLiquidityUnbalancedToERC4626Pool` operation.

**Parameters:**

| Name       | Type                               | Description                                                                                  |
|------------|------------------------------------|----------------------------------------------------------------------------------------------|
| pool      | address     | Address of the liquidity pool                        |
| exactUnderlyingAmountsIn   | uint256[] memory                            | Exact amounts of underlying tokens in, sorted in token registration order of wrapped tokens in the pool |
| sender    | address      | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData   | bytes calldata                     | Additional (optional) data required for the operation                                             |

**Returns:**

| Name             | Type                   | Description                                                                                  |
|------------------|------------------------|----------------------------------------------------------------------------------------------|
| bptAmountOut   | uint256       | Actual amount of pool tokens received        |

### `queryAddLiquidityProportionalToERC4626Pool`

```solidity
function queryAddLiquidityProportionalToERC4626Pool(
    address pool,
    uint256 exactBptAmountOut,
    address sender,
    bytes memory userData
) external returns (uint256[] memory underlyingAmountsIn);
```
Query an `addLiquidityProportionalToERC4626Pool` operation.

**Parameters:**

|------------|------------------------------------|----------------------------------------------------------------------------------------------|
| pool      | address     | Address of the liquidity pool                        |
| exactBptAmountOut   | uint256                            | Exact amount of pool tokens to be received |
| sender    | address      | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData   | bytes calldata                     | Additional (optional) data required for the operation                             |

**Returns:**

| Name             | Type                   | Description                                                                                  |
|------------------|------------------------|----------------------------------------------------------------------------------------------|
| underlyingAmountsIn    | uint256[] memory       | Calculated amounts of input tokens corresponding to the first step of each given path        |

### `queryRemoveLiquidityProportionalFromERC4626Pool`

```solidity
function queryRemoveLiquidityProportionalFromERC4626Pool(
    address pool,
    uint256 exactBptAmountIn,
    address sender,
    bytes memory userData
) external returns (uint256[] memory underlyingAmountsOut);
```
Query a `removeLiquidityProportionalFromERC4626Pool` operation.

**Parameters:**

|------------|------------------------------------|----------------------------------------------------------------------------------------------|
| pool      | address     | Address of the liquidity pool                        |
| exactBptAmountIn   | uint256                            | Exact amount of pool tokens provided |
| sender    | address      | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData   | bytes calldata                     | Additional (optional) data required for the operation                                         |

**Returns:**

| Name             | Type                   | Description                                                                                  |
|------------------|------------------------|----------------------------------------------------------------------------------------------|
| underlyingAmountsOut    | uint256[] memory       | Actual amounts of tokens received, sorted in token registration order of wrapped wrapped tokens in the pool   |


### `queryAddLiquidityUnbalancedNestedPool`

```solidity
function queryAddLiquidityUnbalancedNestedPool(
    address pool,
    address[] memory tokensIn,
    uint256[] memory exactAmountsIn,
    address sender,
    bytes memory userData
) external returns (uint256 bptAmountOut);
```
Query an `addLiquidityUnbalancedNestedPool` operation.

**Parameters:**

| Name       | Type                               | Description                                                                                  |
|------------|------------------------------------|----------------------------------------------------------------------------------------------|
| pool      | address     | Address of the liquidity pool                        |
| tokensIn      | address[] memory     | Input token addresses, sorted by user preference. `tokensIn` array must have all tokens from child pools and all tokens that are not BPTs from the nested pool (parent pool). |
| exactAmountsIn   | uint256[] memory        | Amount of each underlying token in, sorted according to tokensIn array |
| sender    | address      | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData   | bytes calldata                     | Additional (optional) data required for the operation                                             |

**Returns:**

| Name             | Type                   | Description                                                                                  |
|------------------|------------------------|----------------------------------------------------------------------------------------------|
| bptAmountOut   | uint256       | Expected amount of parent pool tokens to receive        |

### `queryRemoveLiquidityProportionalNestedPool`

```solidity
function queryRemoveLiquidityProportionalNestedPool(
    address parentPool,
    uint256 exactBptAmountIn,
    address[] memory tokensOut,
    address sender,
    bytes memory userData
) external returns (uint256[] memory amountsOut);
```
Query a `removeLiquidityProportionalNestedPool` operation.

**Parameters:**

| Name       | Type                               | Description                                                                                  |
|------------|------------------------------------|----------------------------------------------------------------------------------------------|
| parentPool      | address     | Address of the highest level pool (which contains BPTs of other pools) |
| exactBptAmountIn      | uint256     | Exact amount of `parentPool` tokens provided |
| tokensOut   | address[] memory        | Output token addresses, sorted by user preference. `tokensOut` array must have all tokens from child pools and all tokens that are not BPTs from the nested pool (parent pool). If not all tokens are informed, balances are not settled and the operation reverts. Tokens that repeat must be informed only once. |
| sender    | address      | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData   | bytes calldata                     | Additional (optional) data required for the operation                                             |

**Returns:**

| Name             | Type                   | Description                                                                                  |
|------------------|------------------------|----------------------------------------------------------------------------------------------|
| amountsOut   | uint256[] memory       | Actual amounts of tokens received, parallel to `tokensOut` |


## Router common

See the bottom of the [Router](./router-api.md#router-common) for functions common to `Router`, `BatchRouter`, and `CompositeLiquidityRouter`.