---
order: 0
title: Router API
---

# Router API

The Router can be used to interact with Balancer onchain via state changing operations or used to query operations in an off-chain context.

## State-changing functions
The router's state-changing functions are used for interacting with Balancer onchain. They provide simple interfaces for the most common user actions performed against the Balancer Vault.

## Pool initialization

### `initialize`

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
This function initializes a liquidity pool. It adds the initial liquidity to the pool and mints the initial pool tokens.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the liquidity pool |
| tokens  | IERC20[]  | Array of token contracts to be added to the pool |
| exactAmountsIn  | uint256[]  | Exact amounts of tokens to be added, sorted in token registration order |
| minBptAmountOut  | uint256  | Minimum amount of pool tokens to be received |
| wethIsEth  | bool  | If true, incoming ETH will be wrapped to WETH; otherwise the Vault will pull WETH tokens |
| userData  | bytes  | Additional (optional) data required for adding initial liquidity |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| bptAmountOut  | uint256  | Actual amount of pool tokens minted in exchange for initial liquidity |

## Add liquidity

### `addLiquidityProportional`

```solidity
function addLiquidityProportional(
    address pool,
    uint256[] memory maxAmountsIn,
    uint256 exactBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256[] memory amountsIn);
```
Adds with proportional token amounts to a pool, receiving an exact amount of pool tokens.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the liquidity pool |
| maxAmountsIn  | uint256[]  | Maximum amounts of tokens to be added, sorted in token registration order |
| exactBptAmountOut  | uint256  | Exact amount of pool tokens to be received |
| wethIsEth  | bool  | If true, incoming ETH will be wrapped to WETH; otherwise the Vault will pull WETH tokens |
| userData  | bytes  | Additional (optional) data required for adding liquidity |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| amountsIn  | uint256[]  | Actual amounts of tokens added, sorted in token registration order |

### `addLiquidityUnbalanced`

```solidity
function addLiquidityUnbalanced(
    address pool,
    uint256[] memory exactAmountsIn,
    uint256 minBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256 bptAmountOut);
```
Adds with arbitrary token amounts in to a pool.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the liquidity pool |
| exactAmountsIn  | uint256[]  | Exact amounts of tokens to be added, sorted in token registration order |
| minBptAmountOut  | uint256  | Minimum amount of pool tokens to be received |
| wethIsEth  | bool  | If true, incoming ETH will be wrapped to WETH; otherwise the Vault will pull WETH tokens |
| userData  | bytes  | Additional (optional) data required for adding liquidity |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| bptAmountOut  | uint256  | Actual amount of pool tokens received |

### `addLiquiditySingleTokenExactOut`

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
Adds with a single token to a pool, receiving an exact amount of pool tokens.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the liquidity pool |
| tokenIn  | IERC20  | Token used to add liquidity |
| maxAmountIn  | uint256  | Maximum amount of tokens to be added |
| exactBptAmountOut  | uint256  | Exact amount of pool tokens to be received |
| wethIsEth  | bool  | If true, incoming ETH will be wrapped to WETH; otherwise the Vault will pull WETH tokens |
| userData  | bytes  | Additional (optional) data required for adding liquidity |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| amountIn  | uint256  | Actual amount of tokens added |

### `donate`

```solidity
function donate(
    address pool,
    uint256[] memory amountsIn,
    bool wethIsEth,
    bytes memory userData
) external payable;
```
Adds liquidity to a pool by donating the amounts in (no BPT out). To support donation, the pool config `enableDonation` flag must be set to true. This liquidity type is disabled by default, and is only useful in certain limited use cases (e.g., pools with exit fees). Pools that support donation have special security considerations. In particular, their rates are trivially manipulable, so they cannot be nested inside other pools. Use with care!

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the liquidity pool |
| amountsIn  | uint256[]  | Amounts of tokens to be donated, sorted in token registration order |
| wethIsEth  | bool  | If true, incoming ETH will be wrapped to WETH; otherwise the Vault will pull WETH tokens |
| userData  | bytes  | Additional (optional) data required for adding liquidity |

### `addLiquidityCustom`

```solidity
function addLiquidityCustom(
    address pool,
    uint256[] memory maxAmountsIn,
    uint256 minBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256[] memory amountsIn, uint256 bptAmountOut, bytes memory returnData);
```
Adds liquidity to a pool with a custom request.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the liquidity pool |
| maxAmountsIn  | uint256[]  | Maximum amounts of tokens to be added, sorted in token registration order |
| minBptAmountOut  | uint256  | Minimum amount of pool tokens to be received |
| wethIsEth  | bool  | If true, incoming ETH will be wrapped to WETH; otherwise the Vault will pull WETH tokens |
| userData  | bytes  | Additional (optional) data required for adding liquidity |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| amountsIn  | uint256[]  | Actual amounts of tokens added, sorted in token registration order |
| bptAmountOut  | uint256  | Actual amount of pool tokens received |
| returnData  | bytes  | Arbitrary (optional) data with encoded response from the pool |

## Remove liquidity

### `removeLiquidityProportional`

```solidity
function removeLiquidityProportional(
    address pool,
    uint256 exactBptAmountIn,
    uint256[] memory minAmountsOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256[] memory amountsOut);
```
Removes liquidity with proportional token amounts from a pool, burning an exact pool token amount. If the user both adds and removes liquidity to a pool in the same transaction, the system will charge the static fee percentage on all tokens as an "exit fee." This is not really a valid use case, and may be an attack. Use caution when removing liquidity through a Safe or other multisig / non-EOA address. Use "sign and execute," ideally through a private node (or at least not allowing public execution) to avoid front-running, and always set strict limits (i.e., `minAmountsOut`) so that it will revert if any unexpected fees are charged. (It is also possible to check whether the flag has been set before withdrawing, by calling `getAddLiquidityCalledFlag` on the Vault.)

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the liquidity pool |
| exactBptAmountIn  | uint256  | Exact amount of pool tokens provided |
| minAmountsOut  | uint256[]  | Minimum amounts of tokens to be received, sorted in token registration order |
| wethIsEth  | bool  | If true, outgoing WETH will be unwrapped to ETH; otherwise the Vault will send WETH tokens |
| userData  | bytes  | Additional (optional) data required for removing liquidity |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| amountsOut  | uint256[]  | Actual amounts of tokens received, sorted in token registration order |

### `removeLiquiditySingleTokenExactIn`

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
Removes liquidity from a pool via a single token, burning an exact pool token amount.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the liquidity pool |
| exactBptAmountIn  | uint256  | Exact amount of pool tokens provided |
| tokenOut  | IERC20  | Token used to remove liquidity |
| minAmountOut  | uint256  | Minimum amount of tokens to be received |
| wethIsEth  | bool  | If true, outgoing WETH will be unwrapped to ETH; otherwise the Vault will send WETH tokens |
| userData  | bytes  | Additional (optional) data required for removing liquidity |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| amountOut  | uint256  | Actual amount of tokens received |

### `removeLiquiditySingleTokenExactOut`

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
Removes liquidity from a pool via a single token, specifying the exact amount of tokens to receive.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the liquidity pool |
| maxBptAmountIn  | uint256  | Maximum amount of pool tokens provided |
| tokenOut  | IERC20  | Token used to remove liquidity |
| exactAmountOut  | uint256  | Exact amount of tokens to be received |
| wethIsEth  | bool  | If true, outgoing WETH will be unwrapped to ETH; otherwise the Vault will send WETH tokens |
| userData  | bytes  | Additional (optional) data required for removing liquidity |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| bptAmountIn  | uint256  | Actual amount of pool tokens burned |

### `removeLiquidityCustom`

```solidity
function removeLiquidityCustom(
    address pool,
    uint256 maxBptAmountIn,
    uint256[] memory minAmountsOut,
    bool wethIsEth,
    bytes memory userData
) external returns (uint256 bptAmountIn, uint256[] memory amountsOut, bytes memory returnData);
```
Removes liquidity from a pool with a custom request.

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the liquidity pool |
| maxBptAmountIn  | uint256  | Maximum amount of pool tokens provided |
| minAmountsOut  | uint256[]  | Minimum amounts of tokens to be received, sorted in token registration order |
| wethIsEth  | bool  | If true, outgoing WETH will be unwrapped to ETH; otherwise the Vault will send WETH tokens |
| userData  | bytes  | Additional (optional) data required for removing liquidity |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| bptAmountIn  | uint256  | Actual amount of pool tokens burned |
| amountsOut  | uint256[]  | Actual amounts of tokens received, sorted in token registration order |
| returnData  | bytes  | Arbitrary (optional) data with encoded response from the pool |

### `removeLiquidityRecovery`

```solidity
function removeLiquidityRecovery(
    address pool,
    uint256 exactBptAmountIn,
    uint256[] memory minAmountsOut
) external returns (uint256[] memory amountsOut);
```
Removes liquidity proportionally, burning an exact pool token amount. Only available in Recovery Mode. If the user both adds and removes liquidity to a pool in the same transaction, the system will charge the static fee percentage on all tokens as an "exit fee." This is not really a valid use case (and would be especially unusual in Recovery Mode), and may be an attack. Use caution when removing liquidity through a Safe or other multisig / non-EOA address. Use "sign and execute," ideally through a private node (or at least not allowing public execution) to avoid front-running, and always set strict limits (i.e., `minAmountsOut`) so that it will revert if any unexpected fees are charged. (It is also possible to check whether the flag has been set before withdrawing, by calling `getAddLiquidityCalledFlag` on the Vault.)

**Parameters:**

| Name  | Type  | Description  |
|---|---|---|
| pool  | address  | Address of the liquidity pool |
| exactBptAmountIn  | uint256  | Exact amount of pool tokens provided |
| minAmountsOut | uint256[] | Minimum amounts of tokens to be received, sorted in token registration order |

**Returns:**

| Name  | Type  | Description  |
|---|---|---|
| amountsOut  | uint256[]  | Actual amounts of tokens received, sorted in token registration order |

## Swaps

### `swapSingleTokenExactIn`

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
Executes a swap operation specifying an exact input token amount.

**Parameters:**

| Name           | Type        | Description                                                                 |
|----------------|-------------|-----------------------------------------------------------------------------|
| pool           | address     | Address of the liquidity pool                                               |
| tokenIn        | IERC20      | Token to be swapped from                                                    |
| tokenOut       | IERC20      | Token to be swapped to                                                      |
| exactAmountIn  | uint256     | Exact amount of input tokens to send                                        |
| minAmountOut   | uint256     | Minimum amount of tokens to be received                                     |
| deadline       | uint256     | Deadline for the swap                                                       |
| wethIsEth      | bool        | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH |
| userData       | bytes       | Additional (optional) data required for the swap                            |

**Returns:**

| Name        | Type      | Description                                         |
|-------------|-----------|-----------------------------------------------------|
| amountOut   | uint256   | Calculated amount of output tokens to be received in exchange for the given input tokens |

### `swapSingleTokenExactOut`

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
Executes a swap operation specifying an exact output token amount.

**Parameters:**

| Name           | Type        | Description                                                                 |
|----------------|-------------|-----------------------------------------------------------------------------|
| pool           | address     | Address of the liquidity pool                                               |
| tokenIn        | IERC20      | Token to be swapped from                                                    |
| tokenOut       | IERC20      | Token to be swapped to                                                      |
| exactAmountOut | uint256     | Exact amount of output tokens to receive                                    |
| maxAmountIn    | uint256     | Maximum amount of tokens to be sent                                         |
| deadline       | uint256     | Deadline for the swap                                                       |
| wethIsEth      | bool        | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH |
| userData       | bytes       | Additional (optional) data required for the swap                            |

**Returns:**

| Name        | Type      | Description                                         |
|-------------|-----------|-----------------------------------------------------|
| amountIn    | uint256   | Calculated amount of input tokens to be sent in exchange for the requested output tokens |

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

| Name              | Type        | Description                                                        |
|-------------------|-------------|--------------------------------------------------------------------|
| pool              | address     | Address of the liquidity pool                                      |
| exactBptAmountOut | uint256     | Exact amount of pool tokens to be received                         |
| sender | address | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData          | bytes       | Additional (optional) data required for the query                  |

**Returns:**

| Name        | Type        | Description                                             |
|-------------|-------------|---------------------------------------------------------|
| amountsIn   | uint256[]   | Expected amounts of tokens to add, sorted in token registration order |

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

| Name            | Type        | Description                                                    |
|-----------------|-------------|----------------------------------------------------------------|
| pool            | address     | Address of the liquidity pool                                  |
| exactAmountsIn  | uint256[]   | Exact amounts of tokens to be added, sorted in token registration order |
| sender | address | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData        | bytes       | Additional (optional) data required for the query              |

**Returns:**

| Name          | Type      | Description                                  |
|---------------|-----------|----------------------------------------------|
| bptAmountOut  | uint256   | Expected amount of pool tokens to receive    |

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

| Name              | Type        | Description                                             |
|-------------------|-------------|---------------------------------------------------------|
| pool              | address     | Address of the liquidity pool                           |
| tokenIn           | IERC20      | Token used to add liquidity                             |
| exactBptAmountOut | uint256     | Expected exact amount of pool tokens to receive         |
| sender | address | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData          | bytes       | Additional (optional) data required for the query       |

**Returns:**

| Name        | Type      | Description                           |
|-------------|-----------|---------------------------------------|
| amountIn    | uint256   | Expected amount of tokens to add      |

### `queryAddLiquidityCustom`

```solidity
function queryAddLiquidityCustom(
    address pool,
    uint256[] memory maxAmountsIn,
    uint256 minBptAmountOut,
    address sender,
    bytes memory userData
) external returns (uint256[] memory amountsIn, uint256 bptAmountOut, bytes memory returnData);
```
Queries an `addLiquidityCustom` operation without actually executing it.

**Parameters:**

| Name            | Type        | Description                                                        |
|-----------------|-------------|--------------------------------------------------------------------|
| pool            | address     | Address of the liquidity pool                                      |
| maxAmountsIn    | uint256[]   | Maximum amounts of tokens to be added, sorted in token registration order |
| minBptAmountOut | uint256     | Expected minimum amount of pool tokens to receive                  |
| sender | address | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData        | bytes       | Additional (optional) data required for the query                  |

**Returns:**

| Name            | Type        | Description                                                        |
|-----------------|-------------|--------------------------------------------------------------------|
| amountsIn       | uint256[]   | Expected amounts of tokens to add, sorted in token registration order |
| bptAmountOut    | uint256     | Expected amount of pool tokens to receive                         |
| returnData      | bytes       | Arbitrary (optional) data with encoded response from the pool      |

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

| Name              | Type        | Description                                            |
|-------------------|-------------|--------------------------------------------------------|
| pool              | address     | Address of the liquidity pool                          |
| exactBptAmountIn  | uint256     | Exact amount of pool tokens provided for the query     |
| sender | address | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData          | bytes       | Additional (optional) data required for the query      |

**Returns:**

| Name          | Type        | Description                                      |
|---------------|-------------|--------------------------------------------------|
| amountsOut    | uint256[]   | Expected amounts of tokens to receive, sorted in token registration order |

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

| Name              | Type        | Description                                            |
|-------------------|-------------|--------------------------------------------------------|
| pool              | address     | Address of the liquidity pool                          |
| exactBptAmountIn  | uint256     | Exact amount of pool tokens provided for the query     |
| tokenOut          | IERC20      | Token used to remove liquidity                         |
| sender | address | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData          | bytes       | Additional (optional) data required for the query      |

**Returns:**

| Name          | Type      | Description                        |
|---------------|-----------|------------------------------------|
| amountOut     | uint256   | Expected amount of tokens to receive |

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
Queries `a removeLiquiditySingleTokenExactOut` operation without actually executing it.

**Parameters:**

| Name              | Type        | Description                                            |
|-------------------|-------------|--------------------------------------------------------|
| pool              | address     | Address of the liquidity pool                          |
| tokenOut          | IERC20      | Token used to remove liquidity                         |
| exactAmountOut    | uint256     | Exact amount of tokens to receive                      |
| sender | address | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData          | bytes       | Additional (optional) data required for the query      |

**Returns:**

| Name          | Type      | Description                            |
|---------------|-----------|----------------------------------------|
| bptAmountIn   | uint256   | Expected amount of pool tokens to burn |

### `queryRemoveLiquidityCustom`

```solidity
function queryRemoveLiquidityCustom(
    address pool,
    uint256 maxBptAmountIn,
    uint256[] memory minAmountsOut,
    address sender,
    bytes memory userData
) external returns (uint256 bptAmountIn, uint256[] memory amountsOut, bytes memory returnData);
```
Queries a `removeLiquidityCustom` operation without actually executing it.

**Parameters:**

| Name              | Type           | Description                                            |
|-------------------|----------------|--------------------------------------------------------|
| pool              | address        | Address of the liquidity pool                          |
| maxBptAmountIn    | maxBptAmountIn | Maximum amount of pool tokens provided                 |
| minAmountsOut     | uint256[]      | Expected minimum amounts of tokens to receive, sorted in token registration order |
| sender | address | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData          | bytes          | Additional (optional) data required for the query      |

**Returns:**

| Name          | Type      | Description                            |
|---------------|-----------|----------------------------------------|
| bptAmountIn   | uint256   | Expected amount of pool tokens to burn |
| amountsOut    | uint256[] | Expected amounts of tokens to receive, sorted in token registration order |
| returnData    | bytes     | Arbitrary (optional) data with encoded response from the pool

### `queryRemoveLiquidityRecovery`

```solidity
function queryRemoveLiquidityRecovery(
    address pool,
    uint256 exactBptAmountIn,
) external returns (uint256[] memory amountsOut);
```
Queries a `removeLiquidityRecovery` operation without actually executing it.

**Parameters:**

| Name              | Type           | Description                                            |
|-------------------|----------------|--------------------------------------------------------|
| pool              | address        | Address of the liquidity pool                          |
| exactBptAmountIn  | uint256        | Exact amount of pool tokens provided for the query    |

**Returns:**

| Name          | Type      | Description                            |
|---------------|-----------|----------------------------------------|
| amountsOut    | uint256[] | Expected amounts of tokens to receive, sorted in token registration order |

### `querySwapSingleTokenExactIn`

```solidity
function querySwapSingleTokenExactIn(
    address pool,
    IERC20 tokenIn,
    IERC20 tokenOut,
    uint256 exactAmountIn,
    address sender,
    bytes calldata userData
) external returns (uint256 amountCalculated);
```
Queries an `swapSingleTokenExactIn` operation without actually executing it.

**Parameters:**

| Name              | Type        | Description                                       |
|-------------------|-------------|---------------------------------------------------|
| pool              | address     | Address of the liquidity pool                     |
| tokenIn           | IERC20      | Token to be swapped from                          |
| tokenOut          | IERC20      | Token to be swapped to                            |
| exactAmountIn     | uint256     | Exact amount of input tokens to send              |
| sender | address | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData          | bytes       | Additional (optional) data required for the query |

**Returns:**

| Name        | Type        | Description                                             |
|-------------|-------------|---------------------------------------------------------|
| amountOut   | uint256     | Calculated amount of output tokens to be received in exchange for the given input tokens |

### `querySwapSingleTokenExactOut`

```solidity
function querySwapSingleTokenExactOut(
    address pool,
    IERC20 tokenIn,
    IERC20 tokenOut,
    uint256 exactAmountOut,
    address sender,
    bytes calldata userData
) external returns (uint256 amountCalculated);
```
Queries an `swapSingleTokenExactOut` operation without actually executing it.

**Parameters:**

| Name              | Type        | Description                                       |
|-------------------|-------------|---------------------------------------------------|
| pool              | address     | Address of the liquidity pool                     |
| tokenIn           | IERC20      | Token to be swapped from                          |
| tokenOut          | IERC20      | Token to be swapped to                            |
| exactAmountIn     | uint256     | Exact amount of input tokens to receive           |
| sender | address | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData          | bytes       | Additional (optional) data required for the query |

**Returns:**

| Name        | Type        | Description                                             |
|-------------|-------------|---------------------------------------------------------|
| amountOut   | uint256     | Calculated amount of input tokens to be sent in exchange for the requested output tokens |

## Router common

These functions are shared between the `Router`, `BatchRouter`, `BufferRouter`, and `CompositeLiquidityRouter` (defined in `RouterCommon`).

### `permitBatchAndCall`

```solidity
function permitBatchAndCall(
    PermitApproval[] calldata permitBatch,
    bytes[] calldata permitSignatures,
    IAllowanceTransfer.PermitBatch calldata permit2Batch,
    bytes calldata permit2Signature,
    bytes[] calldata multicallData
) external returns (bytes[] memory results);
```
Permits multiple allowances and executes a batch of function calls on this contract.

**Parameters:**

| Name              | Type                            | Description                                                        |
|-------------------|---------------------------------|--------------------------------------------------------------------|
| permitBatch       | PermitApproval[] calldata       | An array of `PermitApproval` structs, each representing an ERC20 permit request |
| permitSignatures  | bytes[] calldata                | An array of bytes, corresponding to the permit request signature in `permitBatch` |
| permit2Batch      | IAllowanceTransfer.PermitBatch calldata | A batch of permit2 approvals                                      |
| permit2Signature  | bytes calldata                  | A permit2 signature for the batch approval                         |
| multicallData     | bytes[] calldata                | An array of bytes arrays, each representing an encoded function call on this contract |

**Returns:**

| Name      | Type               | Description                                              |
|-----------|--------------------|----------------------------------------------------------|
| results   | bytes[] memory     | Array of bytes arrays, each representing the return data from each function call executed |

### `multicall`

```solidity
function multicall(bytes[] calldata data) external returns (bytes[] memory results);
```
Executes a batch of function calls on this contract.

**Parameters:**

| Name    | Type             | Description                                            |
|---------|------------------|--------------------------------------------------------|
| data    | bytes[] calldata | Encoded function calls to be executed in the batch     |

**Returns:**

| Name      | Type             | Description                                              |
|-----------|------------------|----------------------------------------------------------|
| results   | bytes[] memory   | Array of bytes arrays, each representing the return data from each function call executed |

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>