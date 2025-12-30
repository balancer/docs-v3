---
order: 1
title: Router API
---

# Router API

The Router can be used to interact with Balancer onchain via state changing operations or used to query operations in an off-chain context.

The main router provides user-friendly interfaces for basic Vault operations: initialization, adding/removing liquidity, and single-pool swaps.

## State-changing functions

### Pool Initialization

#### `initialize`

```solidity
function initialize(
    address pool,
    IERC20[] memory tokens,
    uint256[] memory exactAmountsIn,
    uint256 minBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256 bptAmountOut);
```

Initializes a new liquidity pool with exact token amounts. This is the first liquidity operation that must be performed on any pool. V3 pools have a separate initialization step, which changes pool metadata in the Vault to guarantee that it is only done once. This eliminates any attacks based on 're-initialization' of pools.

**Parameters:**

| Name            | Type             | Description                                                                      |
|-----------------|------------------|----------------------------------------------------------------------------------|
| pool            | address          | Address of the liquidity pool to initialize                                      |
| tokens          | IERC20[] memory  | Pool tokens in token registration order                                          |
| exactAmountsIn  | uint256[] memory | Exact amounts of tokens to deposit, sorted in token registration order           |
| minBptAmountOut | uint256          | Minimum BPT tokens to receive (slippage protection)                              |
| wethIsEth       | bool             | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH |
| userData        | bytes memory     | Additional (optional) data passed to the pool                                    |

**Returns:**

| Name          | Type    | Description                            |
|---------------|---------|----------------------------------------|
| bptAmountOut  | uint256 | Actual amount of pool tokens minted    |

### Add Liquidity Operations

#### `addLiquidityProportional`

```solidity
function addLiquidityProportional(
    address pool,
    uint256[] memory maxAmountsIn,
    uint256 exactBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256[] memory amountsIn);
```

Adds liquidity proportionally to receive an exact amount of BPT. The ratio of tokens added matches the current pool composition.

**Parameters:**

| Name              | Type             | Description                                                                      |
|-------------------|------------------|----------------------------------------------------------------------------------|
| pool              | address          | Address of the liquidity pool                                                    |
| maxAmountsIn      | uint256[] memory | Maximum amounts of tokens to be added, sorted in token registration order        |
| exactBptAmountOut | uint256          | Exact amount of pool tokens to be received                                       |
| wethIsEth         | bool             | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH |
| userData          | bytes memory     | Additional (optional) data sent with the request to add liquidity                |

**Returns:**

| Name      | Type             | Description                                                    |
|-----------|------------------|----------------------------------------------------------------|
| amountsIn | uint256[] memory | Actual amounts of tokens added, sorted in token registration order |

#### `addLiquidityUnbalanced`

```solidity
function addLiquidityUnbalanced(
    address pool,
    uint256[] memory exactAmountsIn,
    uint256 minBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256 bptAmountOut);
```

Adds liquidity with arbitrary token amounts (not necessarily proportional). The pool calculates the appropriate BPT to mint.

**Parameters:**

| Name            | Type             | Description                                                                      |
|-----------------|------------------|----------------------------------------------------------------------------------|
| pool            | address          | Address of the liquidity pool                                                    |
| exactAmountsIn  | uint256[] memory | Exact amounts of tokens to be added, sorted in token registration order          |
| minBptAmountOut | uint256          | Minimum amount of pool tokens to be received                                     |
| wethIsEth       | bool             | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH |
| userData        | bytes memory     | Additional (optional) data sent with the request to add liquidity                |

**Returns:**

| Name         | Type    | Description                             |
|--------------|---------|-----------------------------------------|
| bptAmountOut | uint256 | Actual amount of pool tokens received   |

#### `addLiquiditySingleTokenExactOut`

```solidity
function addLiquiditySingleTokenExactOut(
    address pool,
    IERC20 tokenIn,
    uint256 maxAmountIn,
    uint256 exactBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256 amountIn);
```

Adds liquidity using only one token to receive an exact amount of BPT. Useful for adding liquidity when you only have one of the pool's tokens.

**Parameters:**

| Name              | Type         | Description                                                                      |
|-------------------|--------------|----------------------------------------------------------------------------------|
| pool              | address      | Address of the liquidity pool                                                    |
| tokenIn           | IERC20       | Token used to add liquidity                                                      |
| maxAmountIn       | uint256      | Maximum amount of tokens to be added                                             |
| exactBptAmountOut | uint256      | Exact amount of pool tokens to be received                                       |
| wethIsEth         | bool         | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH |
| userData          | bytes memory | Additional (optional) data sent with the request to add liquidity                |

**Returns:**

| Name     | Type    | Description                    |
|----------|---------|--------------------------------|
| amountIn | uint256 | Actual amount of tokens added  |

#### `donate`

```solidity
function donate(
    address pool,
    uint256[] memory amountsIn,
    bool wethIsEth,
    bytes memory userData
) external payable;
```

Donates tokens to a pool without receiving BPT. This increases the value of existing BPT tokens. The pool must have the `enableDonation` flag set to true.

**Parameters:**

| Name      | Type             | Description                                                                      |
|-----------|------------------|----------------------------------------------------------------------------------|
| pool      | address          | Address of the liquidity pool                                                    |
| amountsIn | uint256[] memory | Amounts of tokens to be donated, sorted in token registration order              |
| wethIsEth | bool             | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH |
| userData  | bytes memory     | Additional (optional) data sent with the request to donate liquidity             |

#### `addLiquidityCustom`

```solidity
function addLiquidityCustom(
    address pool,
    uint256[] memory maxAmountsIn,
    uint256 minBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (
    uint256[] memory amountsIn,
    uint256 bptAmountOut,
    bytes memory returnData
);
```

Adds liquidity with a custom operation defined by the pool. The interpretation of max/min amounts depends on the pool type and userData.

**Parameters:**

| Name            | Type             | Description                                                                      |
|-----------------|------------------|----------------------------------------------------------------------------------|
| pool            | address          | Address of the liquidity pool                                                    |
| maxAmountsIn    | uint256[] memory | Maximum amounts of tokens to be added, sorted in token registration order        |
| minBptAmountOut | uint256          | Minimum amount of pool tokens to be received                                     |
| wethIsEth       | bool             | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH |
| userData        | bytes memory     | Additional (optional) data sent with the request to add liquidity                |

**Returns:**

| Name         | Type             | Description                                                            |
|--------------|------------------|------------------------------------------------------------------------|
| amountsIn    | uint256[] memory | Actual amounts of tokens added, sorted in token registration order     |
| bptAmountOut | uint256          | Actual amount of pool tokens received                                  |
| returnData   | bytes memory     | Arbitrary (optional) data with an encoded response from the pool       |

### Remove Liquidity Operations

#### `removeLiquidityProportional`

```solidity
function removeLiquidityProportional(
    address pool,
    uint256 exactBptAmountIn,
    uint256[] memory minAmountsOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256[] memory amountsOut);
```

Removes liquidity proportionally by burning an exact amount of BPT. Receives all pool tokens in proportion to current pool composition.

**Parameters:**

| Name             | Type             | Description                                                                      |
|------------------|------------------|----------------------------------------------------------------------------------|
| pool             | address          | Address of the liquidity pool                                                    |
| exactBptAmountIn | uint256          | Exact amount of pool tokens provided                                             |
| minAmountsOut    | uint256[] memory | Minimum amounts of tokens to be received, sorted in token registration order     |
| wethIsEth        | bool             | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH |
| userData         | bytes memory     | Additional (optional) data sent with the request to remove liquidity             |

**Returns:**

| Name       | Type             | Description                                                         |
|------------|------------------|---------------------------------------------------------------------|
| amountsOut | uint256[] memory | Actual amounts of tokens received, sorted in token registration order |

#### `removeLiquiditySingleTokenExactIn`

```solidity
function removeLiquiditySingleTokenExactIn(
    address pool,
    uint256 exactBptAmountIn,
    IERC20 tokenOut,
    uint256 minAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256 amountOut);
```

Burns an exact amount of BPT to receive a single token. Useful for exiting positions into one specific token.

**Parameters:**

| Name             | Type         | Description                                                                      |
|------------------|--------------|----------------------------------------------------------------------------------|
| pool             | address      | Address of the liquidity pool                                                    |
| exactBptAmountIn | uint256      | Exact amount of pool tokens provided                                             |
| tokenOut         | IERC20       | Token to be received                                                             |
| minAmountOut     | uint256      | Minimum amount of tokens to be received                                          |
| wethIsEth        | bool         | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH |
| userData         | bytes memory | Additional (optional) data sent with the request to remove liquidity             |

**Returns:**

| Name      | Type    | Description                      |
|-----------|---------|----------------------------------|
| amountOut | uint256 | Actual amount of tokens received |

#### `removeLiquiditySingleTokenExactOut`

```solidity
function removeLiquiditySingleTokenExactOut(
    address pool,
    uint256 maxBptAmountIn,
    IERC20 tokenOut,
    uint256 exactAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256 bptAmountIn);
```

Burns BPT to receive an exact amount of a single token. You specify how much of the output token you want.

**Parameters:**

| Name           | Type         | Description                                                                      |
|----------------|--------------|----------------------------------------------------------------------------------|
| pool           | address      | Address of the liquidity pool                                                    |
| maxBptAmountIn | uint256      | Maximum amount of pool tokens provided                                           |
| tokenOut       | IERC20       | Token to be received                                                             |
| exactAmountOut | uint256      | Exact amount of tokens to be received                                            |
| wethIsEth      | bool         | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH |
| userData       | bytes memory | Additional (optional) data sent with the request to remove liquidity             |

**Returns:**

| Name        | Type    | Description                          |
|-------------|---------|--------------------------------------|
| bptAmountIn | uint256 | Actual amount of pool tokens burned  |

#### `removeLiquidityCustom`

```solidity
function removeLiquidityCustom(
    address pool,
    uint256 maxBptAmountIn,
    uint256[] memory minAmountsOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (
    uint256 bptAmountIn,
    uint256[] memory amountsOut,
    bytes memory returnData
);
```

Removes liquidity with a custom operation defined by the pool.

**Parameters:**

| Name           | Type             | Description                                                                      |
|----------------|------------------|----------------------------------------------------------------------------------|
| pool           | address          | Address of the liquidity pool                                                    |
| maxBptAmountIn | uint256          | Maximum amount of pool tokens provided                                           |
| minAmountsOut  | uint256[] memory | Minimum amounts of tokens to be received, sorted in token registration order     |
| wethIsEth      | bool             | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH |
| userData       | bytes memory     | Additional (optional) data sent with the request to remove liquidity             |

**Returns:**

| Name        | Type             | Description                                                            |
|-------------|------------------|------------------------------------------------------------------------|
| bptAmountIn | uint256          | Actual amount of pool tokens burned                                    |
| amountsOut  | uint256[] memory | Actual amounts of tokens received, sorted in token registration order  |
| returnData  | bytes memory     | Arbitrary (optional) data with an encoded response from the pool       |

#### `removeLiquidityRecovery`

```solidity
function removeLiquidityRecovery(
    address pool,
    uint256 exactBptAmountIn,
    uint256[] memory minAmountsOut
) external payable returns (uint256[] memory amountsOut);
```

Emergency exit function available only when a pool is in Recovery Mode. Allows proportional exits even if the pool is in a bad state.

**Parameters:**

| Name             | Type             | Description                                                          |
|------------------|------------------|----------------------------------------------------------------------|
| pool             | address          | Address of the liquidity pool                                        |
| exactBptAmountIn | uint256          | Exact amount of pool tokens provided                                 |
| minAmountsOut    | uint256[] memory | Minimum amounts of tokens to be received, sorted in token registration order |

**Returns:**

| Name       | Type             | Description                                                         |
|------------|------------------|---------------------------------------------------------------------|
| amountsOut | uint256[] memory | Actual amounts of tokens received, sorted in token registration order |

### Swap Operations

#### `swapSingleTokenExactIn`

```solidity
function swapSingleTokenExactIn(
    address pool,
    IERC20 tokenIn,
    IERC20 tokenOut,
    uint256 exactAmountIn,
    uint256 minAmountOut,
    uint256 deadline,
    bool wethIsEth,
    bytes calldata userData
) external payable returns (uint256 amountOut);
```

Swaps an exact amount of one token for another within a single pool. You specify the input amount.

**Parameters:**

| Name          | Type           | Description                                                                      |
|---------------|----------------|----------------------------------------------------------------------------------|
| pool          | address        | Address of the liquidity pool                                                    |
| tokenIn       | IERC20         | Token to be swapped from                                                         |
| tokenOut      | IERC20         | Token to be swapped to                                                           |
| exactAmountIn | uint256        | Exact amount of input tokens to send                                             |
| minAmountOut  | uint256        | Minimum amount of tokens to be received                                          |
| deadline      | uint256        | Deadline for the swap, after which it will revert                                |
| wethIsEth     | bool           | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH |
| userData      | bytes calldata | Additional (optional) data sent with the swap request                            |

**Returns:**

| Name      | Type    | Description                                                                              |
|-----------|---------|------------------------------------------------------------------------------------------|
| amountOut | uint256 | Calculated amount of output tokens to be received in exchange for the given input tokens |

#### `swapSingleTokenExactOut`

```solidity
function swapSingleTokenExactOut(
    address pool,
    IERC20 tokenIn,
    IERC20 tokenOut,
    uint256 exactAmountOut,
    uint256 maxAmountIn,
    uint256 deadline,
    bool wethIsEth,
    bytes calldata userData
) external payable returns (uint256 amountIn);
```

Swaps tokens to receive an exact amount of the output token. You specify the output amount you want.

**Parameters:**

| Name           | Type           | Description                                                                      |
|----------------|----------------|----------------------------------------------------------------------------------|
| pool           | address        | Address of the liquidity pool                                                    |
| tokenIn        | IERC20         | Token to be swapped from                                                         |
| tokenOut       | IERC20         | Token to be swapped to                                                           |
| exactAmountOut | uint256        | Exact amount of output tokens to receive                                         |
| maxAmountIn    | uint256        | Maximum amount of tokens to be sent                                              |
| deadline       | uint256        | Deadline for the swap, after which it will revert                                |
| wethIsEth      | bool           | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH |
| userData       | bytes calldata | Additional (optional) data sent with the swap request                            |

**Returns:**

| Name     | Type    | Description                                                                                   |
|----------|---------|-----------------------------------------------------------------------------------------------|
| amountIn | uint256 | Calculated amount of input tokens to be sent in exchange for the requested output tokens      |

## Queries

### `queryAddLiquidityProportional`

```solidity
function queryAddLiquidityProportional(
    address pool,
    uint256 exactBptAmountOut,
    address sender,
    bytes memory userData
) external returns (uint256[] memory amountsIn);
```

Queries an `addLiquidityProportional` operation without actually executing it.

**Parameters:**

| Name              | Type         | Description                                                                             |
|-------------------|--------------|-----------------------------------------------------------------------------------------|
| pool              | address      | Address of the liquidity pool                                                           |
| exactBptAmountOut | uint256      | Exact amount of pool tokens to be received                                              |
| sender            | address      | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData          | bytes memory | Additional (optional) data sent with the query request                                  |

**Returns:**

| Name      | Type             | Description                                                          |
|-----------|------------------|----------------------------------------------------------------------|
| amountsIn | uint256[] memory | Expected amounts of tokens to add, sorted in token registration order |

### `queryAddLiquidityUnbalanced`

```solidity
function queryAddLiquidityUnbalanced(
    address pool,
    uint256[] memory exactAmountsIn,
    address sender,
    bytes memory userData
) external returns (uint256 bptAmountOut);
```

Queries an `addLiquidityUnbalanced` operation without actually executing it.

**Parameters:**

| Name           | Type             | Description                                                                             |
|----------------|------------------|-----------------------------------------------------------------------------------------|
| pool           | address          | Address of the liquidity pool                                                           |
| exactAmountsIn | uint256[] memory | Exact amounts of tokens to be added, sorted in token registration order                 |
| sender         | address          | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData       | bytes memory     | Additional (optional) data sent with the query request                                  |

**Returns:**

| Name         | Type    | Description                              |
|--------------|---------|------------------------------------------|
| bptAmountOut | uint256 | Expected amount of pool tokens to receive |

### `queryAddLiquiditySingleTokenExactOut`

```solidity
function queryAddLiquiditySingleTokenExactOut(
    address pool,
    IERC20 tokenIn,
    uint256 exactBptAmountOut,
    address sender,
    bytes memory userData
) external returns (uint256 amountIn);
```

Queries an `addLiquiditySingleTokenExactOut` operation without actually executing it.

**Parameters:**

| Name              | Type         | Description                                                                             |
|-------------------|--------------|-----------------------------------------------------------------------------------------|
| pool              | address      | Address of the liquidity pool                                                           |
| tokenIn           | IERC20       | Token used to add liquidity                                                             |
| exactBptAmountOut | uint256      | Expected exact amount of pool tokens to receive                                         |
| sender            | address      | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData          | bytes memory | Additional (optional) data sent with the query request                                  |

**Returns:**

| Name     | Type    | Description                      |
|----------|---------|----------------------------------|
| amountIn | uint256 | Expected amount of tokens to add |

### `queryAddLiquidityCustom`

```solidity
function queryAddLiquidityCustom(
    address pool,
    uint256[] memory maxAmountsIn,
    uint256 minBptAmountOut,
    address sender,
    bytes memory userData
) external returns (
    uint256[] memory amountsIn,
    uint256 bptAmountOut,
    bytes memory returnData
);
```

Queries an `addLiquidityCustom` operation without actually executing it.

**Parameters:**

| Name            | Type             | Description                                                                             |
|-----------------|------------------|-----------------------------------------------------------------------------------------|
| pool            | address          | Address of the liquidity pool                                                           |
| maxAmountsIn    | uint256[] memory | Expected maximum amounts of tokens to add, sorted in token registration order           |
| minBptAmountOut | uint256          | Expected minimum amount of pool tokens to receive                                       |
| sender          | address          | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData        | bytes memory     | Additional (optional) data sent with the query request                                  |

**Returns:**

| Name         | Type             | Description                                                        |
|--------------|------------------|--------------------------------------------------------------------|
| amountsIn    | uint256[] memory | Expected amounts of tokens to add, sorted in token registration order |
| bptAmountOut | uint256          | Expected amount of pool tokens to receive                          |
| returnData   | bytes memory     | Arbitrary (optional) data with an encoded response from the pool   |

### `queryRemoveLiquidityProportional`

```solidity
function queryRemoveLiquidityProportional(
    address pool,
    uint256 exactBptAmountIn,
    address sender,
    bytes memory userData
) external returns (uint256[] memory amountsOut);
```

Queries a `removeLiquidityProportional` operation without actually executing it.

**Parameters:**

| Name             | Type         | Description                                                                             |
|------------------|--------------|-----------------------------------------------------------------------------------------|
| pool             | address      | Address of the liquidity pool                                                           |
| exactBptAmountIn | uint256      | Exact amount of pool tokens provided                                                    |
| sender           | address      | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData         | bytes memory | Additional (optional) data sent with the query request                                  |

**Returns:**

| Name       | Type             | Description                                                             |
|------------|------------------|-------------------------------------------------------------------------|
| amountsOut | uint256[] memory | Expected amounts of tokens to receive, sorted in token registration order |

### `queryRemoveLiquiditySingleTokenExactIn`

```solidity
function queryRemoveLiquiditySingleTokenExactIn(
    address pool,
    uint256 exactBptAmountIn,
    IERC20 tokenOut,
    address sender,
    bytes memory userData
) external returns (uint256 amountOut);
```

Queries a `removeLiquiditySingleTokenExactIn` operation without actually executing it.

**Parameters:**

| Name             | Type         | Description                                                                             |
|------------------|--------------|-----------------------------------------------------------------------------------------|
| pool             | address      | Address of the liquidity pool                                                           |
| exactBptAmountIn | uint256      | Exact amount of pool tokens provided                                                    |
| tokenOut         | IERC20       | Token to be received                                                                    |
| sender           | address      | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData         | bytes memory | Additional (optional) data sent with the query request                                  |

**Returns:**

| Name      | Type    | Description                          |
|-----------|---------|--------------------------------------|
| amountOut | uint256 | Expected amount of tokens to receive |

### `queryRemoveLiquiditySingleTokenExactOut`

```solidity
function queryRemoveLiquiditySingleTokenExactOut(
    address pool,
    IERC20 tokenOut,
    uint256 exactAmountOut,
    address sender,
    bytes memory userData
) external returns (uint256 bptAmountIn);
```

Queries a `removeLiquiditySingleTokenExactOut` operation without actually executing it.

**Parameters:**

| Name           | Type         | Description                                                                             |
|----------------|--------------|-----------------------------------------------------------------------------------------|
| pool           | address      | Address of the liquidity pool                                                           |
| tokenOut       | IERC20       | Token to be received                                                                    |
| exactAmountOut | uint256      | Exact amount of tokens to be received                                                   |
| sender         | address      | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData       | bytes memory | Additional (optional) data sent with the query request                                  |

**Returns:**

| Name        | Type    | Description                              |
|-------------|---------|------------------------------------------|
| bptAmountIn | uint256 | Expected amount of pool tokens to burn   |

### `queryRemoveLiquidityCustom`

```solidity
function queryRemoveLiquidityCustom(
    address pool,
    uint256 maxBptAmountIn,
    uint256[] memory minAmountsOut,
    address sender,
    bytes memory userData
) external returns (
    uint256 bptAmountIn,
    uint256[] memory amountsOut,
    bytes memory returnData
);
```

Queries a `removeLiquidityCustom` operation without actually executing it.

**Parameters:**

| Name           | Type             | Description                                                                             |
|----------------|------------------|-----------------------------------------------------------------------------------------|
| pool           | address          | Address of the liquidity pool                                                           |
| maxBptAmountIn | uint256          | Maximum amount of pool tokens provided                                                  |
| minAmountsOut  | uint256[] memory | Expected minimum amounts of tokens to receive, sorted in token registration order       |
| sender         | address          | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData       | bytes memory     | Additional (optional) data sent with the query request                                  |

**Returns:**

| Name        | Type             | Description                                                                |
|-------------|------------------|----------------------------------------------------------------------------|
| bptAmountIn | uint256          | Expected amount of pool tokens to burn                                     |
| amountsOut  | uint256[] memory | Expected amounts of tokens to receive, sorted in token registration order  |
| returnData  | bytes memory     | Arbitrary (optional) data with an encoded response from the pool           |

### `queryRemoveLiquidityRecovery`

```solidity
function queryRemoveLiquidityRecovery(
    address pool,
    uint256 exactBptAmountIn
) external returns (uint256[] memory amountsOut);
```

Queries a `removeLiquidityRecovery` operation without actually executing it.

**Parameters:**

| Name             | Type    | Description                              |
|------------------|---------|------------------------------------------|
| pool             | address | Address of the liquidity pool            |
| exactBptAmountIn | uint256 | Exact amount of pool tokens provided for the query |

**Returns:**

| Name       | Type             | Description                                                             |
|------------|------------------|-------------------------------------------------------------------------|
| amountsOut | uint256[] memory | Expected amounts of tokens to receive, sorted in token registration order |

### `querySwapSingleTokenExactIn`

```solidity
function querySwapSingleTokenExactIn(
    address pool,
    IERC20 tokenIn,
    IERC20 tokenOut,
    uint256 exactAmountIn,
    address sender,
    bytes calldata userData
) external returns (uint256 amountOut);
```

Queries a swap operation specifying an exact input token amount without actually executing it.

**Parameters:**

| Name          | Type           | Description                                                                             |
|---------------|----------------|-----------------------------------------------------------------------------------------|
| pool          | address        | Address of the liquidity pool                                                           |
| tokenIn       | IERC20         | Token to be swapped from                                                                |
| tokenOut      | IERC20         | Token to be swapped to                                                                  |
| exactAmountIn | uint256        | Exact amount of input tokens to send                                                    |
| sender        | address        | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData      | bytes calldata | Additional (optional) data sent with the query request                                  |

**Returns:**

| Name      | Type    | Description                                                                                  |
|-----------|---------|----------------------------------------------------------------------------------------------|
| amountOut | uint256 | Calculated amount of output tokens to be received in exchange for the given input tokens     |

### `querySwapSingleTokenExactOut`

```solidity
function querySwapSingleTokenExactOut(
    address pool,
    IERC20 tokenIn,
    IERC20 tokenOut,
    uint256 exactAmountOut,
    address sender,
    bytes calldata userData
) external returns (uint256 amountIn);
```

Queries a swap operation specifying an exact output token amount without actually executing it.

**Parameters:**

| Name           | Type           | Description                                                                             |
|----------------|----------------|-----------------------------------------------------------------------------------------|
| pool           | address        | Address of the liquidity pool                                                           |
| tokenIn        | IERC20         | Token to be swapped from                                                                |
| tokenOut       | IERC20         | Token to be swapped to                                                                  |
| exactAmountOut | uint256        | Exact amount of output tokens to receive                                                |
| sender         | address        | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData       | bytes calldata | Additional (optional) data sent with the query request                                  |

**Returns:**

| Name     | Type    | Description                                                                                       |
|----------|---------|---------------------------------------------------------------------------------------------------|
| amountIn | uint256 | Calculated amount of input tokens to be sent in exchange for the requested output tokens          |

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>
