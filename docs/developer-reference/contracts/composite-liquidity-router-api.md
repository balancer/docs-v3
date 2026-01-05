---
order: 3
title: Composite Liquidity Router API
---

# Composite Liquidity Router API

The Composite Liquidity Router can be used to interact with Balancer onchain via state changing operations or used to query operations in an off-chain context.

Specialized router for two complex scenarios:
1. **ERC4626 Pools**: Pools containing yield-bearing tokens (e.g., waDAI, waUSDC)
2. **Nested Pools**: Pools where one or more tokens are BPTs from other pools

## State-changing functions

### ERC4626 Pool Operations

ERC4626 pools contain wrapped yield-bearing tokens. This router allows you to interact with them using only underlying tokens, automatically handling wrapping/unwrapping through Vault buffers.

#### `addLiquidityUnbalancedToERC4626Pool`

```solidity
function addLiquidityUnbalancedToERC4626Pool(
    address pool,
    bool[] memory wrapUnderlying,
    uint256[] memory exactAmountsIn,
    uint256 minBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256 bptAmountOut);
```

Adds liquidity to an ERC4626 pool using underlying or wrapped tokens.

**Example:** Add liquidity to a [waDAI, waUSDC] pool using only DAI and USDC. The router automatically:
1. Swaps DAI for waDAI through the Vault buffer
2. Swaps USDC for waUSDC through the Vault buffer  
3. Adds liquidity to the pool

**Note:** Ensure that any buffers associated with the wrapped tokens in the ERC4626 pool have been initialized before initializing or adding liquidity to the "parent" pool, and also make sure limits are set properly.

**Parameters:**

| Name            | Type             | Description                                                                      |
|-----------------|------------------|----------------------------------------------------------------------------------|
| pool            | address          | Address of the liquidity pool                                                    |
| wrapUnderlying  | bool[] memory    | For each token, true = use underlying (e.g., DAI), false = use wrapped (e.g., waDAI) |
| exactAmountsIn  | uint256[] memory | Exact amounts of underlying/wrapped tokens in, sorted in token registration order |
| minBptAmountOut | uint256          | Minimum amount of pool tokens to be received                                     |
| wethIsEth       | bool             | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH |
| userData        | bytes memory     | Additional (optional) data required for adding liquidity                         |

**Returns:**

| Name         | Type    | Description                             |
|--------------|---------|-----------------------------------------|
| bptAmountOut | uint256 | Actual amount of pool tokens received   |

#### `addLiquidityProportionalToERC4626Pool`

```solidity
function addLiquidityProportionalToERC4626Pool(
    address pool,
    bool[] memory wrapUnderlying,
    uint256[] memory maxAmountsIn,
    uint256 exactBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256[] memory amountsIn);
```

Adds liquidity proportionally to an ERC4626 pool using underlying or wrapped tokens.

**Note:** Ensure that any buffers associated with the wrapped tokens in the ERC4626 pool have been initialized before initializing or adding liquidity to the "parent" pool, and also make sure limits are set properly.

**Parameters:**

| Name              | Type             | Description                                                                      |
|-------------------|------------------|----------------------------------------------------------------------------------|
| pool              | address          | Address of the liquidity pool                                                    |
| wrapUnderlying    | bool[] memory    | For each token, true = use underlying (e.g., DAI), false = use wrapped (e.g., waDAI) |
| maxAmountsIn      | uint256[] memory | Maximum amounts of underlying/wrapped tokens in, sorted in token registration order |
| exactBptAmountOut | uint256          | Exact amount of pool tokens to be received                                       |
| wethIsEth         | bool             | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH |
| userData          | bytes memory     | Additional (optional) data required for adding liquidity                         |

**Returns:**

| Name      | Type             | Description                                   |
|-----------|------------------|-----------------------------------------------|
| amountsIn | uint256[] memory | Actual amounts of tokens added to the pool    |

#### `removeLiquidityProportionalFromERC4626Pool`

```solidity
function removeLiquidityProportionalFromERC4626Pool(
    address pool,
    bool[] memory unwrapWrapped,
    uint256 exactBptAmountIn,
    uint256[] memory minAmountsOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256[] memory amountsOut);
```

Removes liquidity proportionally from an ERC4626 pool, receiving underlying or wrapped tokens.

**Parameters:**

| Name             | Type             | Description                                                                      |
|------------------|------------------|----------------------------------------------------------------------------------|
| pool             | address          | Address of the liquidity pool                                                    |
| unwrapWrapped    | bool[] memory    | For each token, true = receive underlying, false = receive wrapped               |
| exactBptAmountIn | uint256          | Exact amount of pool tokens provided                                             |
| minAmountsOut    | uint256[] memory | Minimum amounts of each token, sorted in token registration order                |
| wethIsEth        | bool             | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH |
| userData         | bytes memory     | Additional (optional) data required for removing liquidity                       |

**Returns:**

| Name       | Type             | Description                        |
|------------|------------------|------------------------------------|
| amountsOut | uint256[] memory | Actual amounts of tokens received  |

### Nested Pool Operations

Nested pools contain BPTs from other pools as tokens. This router handles the complexity of traversing multiple pool levels.

**Important:** Pools with "overlapping" tokens (where both parent and child pools contain the same token) are not supported.

#### `addLiquidityUnbalancedNestedPool`

```solidity
function addLiquidityUnbalancedNestedPool(
    address parentPool,
    address[] memory tokensIn,
    uint256[] memory exactAmountsIn,
    address[] memory tokensToWrap,
    uint256 minBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256 bptAmountOut);
```

Adds liquidity to a nested pool using only the leaf tokens (tokens from child pools).

**Example:** 
- Parent pool: [BPT_A, BPT_B, USDC]
- Child pool A: [DAI, USDT]
- Child pool B: [WETH, WBTC]
- `tokensIn` could be: [DAI, USDT, WETH, WBTC, USDC]

The router:
1. Adds DAI and USDT to pool A to get BPT_A
2. Adds WETH and WBTC to pool B to get BPT_B
3. Adds BPT_A, BPT_B, and USDC to parent pool

**Note:** A nested pool is one in which one or more tokens are BPTs from another pool (child pool). Since there are multiple pools involved, the token order is not well-defined, and must be specified by the caller. If the parent or nested pools contain ERC4626 tokens that appear in the `tokensToWrap` list, they will be wrapped and their underlying tokens pulled as input, and expected to appear in `tokensIn`. Otherwise, they will be treated as regular tokens.

**Parameters:**

| Name            | Type             | Description                                                                      |
|-----------------|------------------|----------------------------------------------------------------------------------|
| parentPool      | address          | The address of the parent pool (which contains BPTs of other pools)             |
| tokensIn        | address[] memory | An array with all tokens from the child pools, and all non-BPT parent tokens, in arbitrary order |
| exactAmountsIn  | uint256[] memory | An array with the amountIn of each token, sorted in the same order as tokensIn  |
| tokensToWrap    | address[] memory | A list of ERC4626 tokens which should be wrapped if encountered during pool traversal |
| minBptAmountOut | uint256          | Expected minimum amount of parent pool tokens to receive                         |
| wethIsEth       | bool             | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH |
| userData        | bytes memory     | Additional (optional) data required for the operation                            |

**Returns:**

| Name         | Type    | Description                                    |
|--------------|---------|------------------------------------------------|
| bptAmountOut | uint256 | The actual amount of parent pool tokens received |

#### `removeLiquidityProportionalNestedPool`

```solidity
function removeLiquidityProportionalNestedPool(
    address parentPool,
    uint256 exactBptAmountIn,
    address[] memory tokensOut,
    uint256[] memory minAmountsOut,
    address[] memory tokensToUnwrap,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256[] memory amountsOut);
```

Removes liquidity from a nested pool, receiving the leaf tokens.

The router automatically:
1. Exits the parent pool to get child BPTs
2. Exits each child pool to get leaf tokens
3. Unwraps ERC4626 tokens if requested

**Note:** A nested pool is one in which one or more tokens are BPTs from another pool (child pool). Since there are multiple pools involved, the token order is not well-defined, and must be specified by the caller. If the parent or nested pools contain ERC4626 tokens that appear in the `tokensToUnwrap` list, they will be unwrapped and their underlying tokens sent to the output. Otherwise, they will be treated as regular tokens.

**Parameters:**

| Name             | Type             | Description                                                                      |
|------------------|------------------|----------------------------------------------------------------------------------|
| parentPool       | address          | The address of the parent pool (which contains BPTs of other pools)             |
| exactBptAmountIn | uint256          | The exact amount of `parentPool` tokens provided                                 |
| tokensOut        | address[] memory | An array with all tokens from the child pools, and all non-BPT parent tokens, in arbitrary order |
| minAmountsOut    | uint256[] memory | An array with the minimum amountOut of each token, sorted in the same order as tokensOut |
| tokensToUnwrap   | address[] memory | A list of ERC4626 tokens which should be unwrapped if encountered during pool traversal |
| wethIsEth        | bool             | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH |
| userData         | bytes memory     | Additional (optional) data required for the operation                            |

**Returns:**

| Name       | Type             | Description                                                                    |
|------------|------------------|--------------------------------------------------------------------------------|
| amountsOut | uint256[] memory | An array with the actual amountOut of each token, sorted in the same order as tokensOut |

## Queries

### `queryAddLiquidityUnbalancedToERC4626Pool`

```solidity
function queryAddLiquidityUnbalancedToERC4626Pool(
    address pool,
    bool[] memory wrapUnderlying,
    uint256[] memory exactAmountsIn,
    address sender,
    bytes memory userData
) external returns (uint256 bptAmountOut);
```

Queries an `addLiquidityUnbalancedToERC4626Pool` operation without actually executing it.

**Parameters:**

| Name           | Type             | Description                                                                             |
|----------------|------------------|-----------------------------------------------------------------------------------------|
| pool           | address          | Address of the liquidity pool                                                           |
| wrapUnderlying | bool[] memory    | Flags indicating whether the corresponding token should be wrapped or used as an ERC20  |
| exactAmountsIn | uint256[] memory | Exact amounts of underlying/wrapped tokens in, sorted in token registration order       |
| sender         | address          | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData       | bytes memory     | Additional (optional) data required for the query                                       |

**Returns:**

| Name         | Type    | Description                              |
|--------------|---------|------------------------------------------|
| bptAmountOut | uint256 | Expected amount of pool tokens to receive |

### `queryAddLiquidityProportionalToERC4626Pool`

```solidity
function queryAddLiquidityProportionalToERC4626Pool(
    address pool,
    bool[] memory wrapUnderlying,
    uint256 exactBptAmountOut,
    address sender,
    bytes memory userData
) external returns (uint256[] memory amountsIn);
```

Queries an `addLiquidityProportionalToERC4626Pool` operation without actually executing it.

**Parameters:**

| Name              | Type          | Description                                                                             |
|-------------------|---------------|-----------------------------------------------------------------------------------------|
| pool              | address       | Address of the liquidity pool                                                           |
| wrapUnderlying    | bool[] memory | Flags indicating whether the corresponding token should be wrapped or used as an ERC20  |
| exactBptAmountOut | uint256       | Exact amount of pool tokens to be received                                              |
| sender            | address       | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData          | bytes memory  | Additional (optional) data required for the query                                       |

**Returns:**

| Name      | Type             | Description                                |
|-----------|------------------|--------------------------------------------|
| amountsIn | uint256[] memory | Expected amounts of tokens added to the pool |

### `queryRemoveLiquidityProportionalFromERC4626Pool`

```solidity
function queryRemoveLiquidityProportionalFromERC4626Pool(
    address pool,
    bool[] memory unwrapWrapped,
    uint256 exactBptAmountIn,
    address sender,
    bytes memory userData
) external returns (uint256[] memory amountsOut);
```

Queries a `removeLiquidityProportionalFromERC4626Pool` operation without actually executing it.

**Parameters:**

| Name             | Type          | Description                                                                             |
|------------------|---------------|-----------------------------------------------------------------------------------------|
| pool             | address       | Address of the liquidity pool                                                           |
| unwrapWrapped    | bool[] memory | Flags indicating whether the corresponding token should be unwrapped or used as an ERC20 |
| exactBptAmountIn | uint256       | Exact amount of pool tokens provided for the query                                      |
| sender           | address       | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData         | bytes memory  | Additional (optional) data required for the query                                       |

**Returns:**

| Name       | Type             | Description                         |
|------------|------------------|-------------------------------------|
| amountsOut | uint256[] memory | Expected amounts of tokens to receive |

### `queryAddLiquidityUnbalancedNestedPool`

```solidity
function queryAddLiquidityUnbalancedNestedPool(
    address parentPool,
    address[] memory tokensIn,
    uint256[] memory exactAmountsIn,
    address[] memory tokensToWrap,
    address sender,
    bytes memory userData
) external returns (uint256 bptAmountOut);
```

Queries an `addLiquidityUnbalancedNestedPool` operation without actually executing it.

**Parameters:**

| Name           | Type             | Description                                                                             |
|----------------|------------------|-----------------------------------------------------------------------------------------|
| parentPool     | address          | The address of the parent pool (which contains BPTs of other pools)                     |
| tokensIn       | address[] memory | An array with all tokens from the child pools, and all non-BPT parent tokens, in arbitrary order |
| exactAmountsIn | uint256[] memory | An array with the amountIn of each token, sorted in the same order as tokensIn          |
| tokensToWrap   | address[] memory | A list of ERC4626 tokens which should be wrapped if encountered during pool traversal   |
| sender         | address          | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData       | bytes memory     | Additional (optional) data required for the operation                                   |

**Returns:**

| Name         | Type    | Description                                    |
|--------------|---------|------------------------------------------------|
| bptAmountOut | uint256 | The expected amount of parent pool tokens to receive |

### `queryRemoveLiquidityProportionalNestedPool`

```solidity
function queryRemoveLiquidityProportionalNestedPool(
    address parentPool,
    uint256 exactBptAmountIn,
    address[] memory tokensOut,
    address[] memory tokensToUnwrap,
    address sender,
    bytes memory userData
) external returns (uint256[] memory amountsOut);
```

Queries a `removeLiquidityProportionalNestedPool` operation without actually executing it.

**Parameters:**

| Name             | Type             | Description                                                                             |
|------------------|------------------|-----------------------------------------------------------------------------------------|
| parentPool       | address          | The address of the parent pool (which contains BPTs of other pools)                     |
| exactBptAmountIn | uint256          | The exact amount of `parentPool` tokens provided                                        |
| tokensOut        | address[] memory | An array with all tokens from the child pools, and all non-BPT parent tokens, in arbitrary order |
| tokensToUnwrap   | address[] memory | A list of ERC4626 tokens which should be unwrapped if encountered during pool traversal |
| sender           | address          | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData         | bytes memory     | Additional (optional) data required for the operation                                   |

**Returns:**

| Name       | Type             | Description                                                                              |
|------------|------------------|------------------------------------------------------------------------------------------|
| amountsOut | uint256[] memory | An array with the expected amountOut of each token, sorted in the same order as tokensOut |

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>
