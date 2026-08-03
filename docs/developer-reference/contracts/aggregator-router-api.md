---
order: 6
title: Aggregator Router API
---

# Aggregator Router API

The Aggregator Router executes single-pool swaps for contract callers such as aggregators, solvers, and smart wallets. It is the prepaid counterpart to the [Balancer Router](./router-api.md): instead of pulling the input token through Permit2, the caller transfers the input token to the Vault before invoking the swap, and the router settles that payment. There are no token approvals and no Permit2 signatures, and the swap functions do not take a `wethIsEth` flag or accept ETH. See [Token Approvals](/concepts/router/token-approvals.md#aggregator-routers-the-prepaid-model) for how the prepaid and Permit2 models compare.

::: info Paying the Vault
The caller must transfer the input token to the Vault in the same transaction, before the router runs. The Vault's settlement accounting reverts the swap if the prepayment does not cover the input the swap requires.
:::

## State-changing functions

### `swapSingleTokenExactIn`

```solidity
function swapSingleTokenExactIn(
    address pool,
    IERC20 tokenIn,
    IERC20 tokenOut,
    uint256 exactAmountIn,
    uint256 minAmountOut,
    uint256 deadline,
    bytes calldata userData
) external returns (uint256 amountOut);
```

Swaps an exact amount of `tokenIn` for `tokenOut` through a single pool. The caller must have transferred `exactAmountIn` of `tokenIn` to the Vault before this call.

**Parameters:**

| Name          | Type           | Description                                                              |
|---------------|----------------|--------------------------------------------------------------------------|
| pool          | address        | Address of the liquidity pool                                            |
| tokenIn       | IERC20         | Token being sent to the pool                                             |
| tokenOut      | IERC20         | Token being received from the pool                                       |
| exactAmountIn | uint256        | Exact amount of `tokenIn` (raw token decimals) the caller has pre-sent to the Vault |
| minAmountOut  | uint256        | Minimum amount of `tokenOut` to receive (slippage protection)            |
| deadline      | uint256        | Timestamp after which the transaction will revert                        |
| userData      | bytes calldata | Additional (optional) data required for the swap                         |

**Returns:**

| Name      | Type    | Description                            |
|-----------|---------|----------------------------------------|
| amountOut | uint256 | Calculated amount of `tokenOut` received |

### `swapSingleTokenExactOut`

```solidity
function swapSingleTokenExactOut(
    address pool,
    IERC20 tokenIn,
    IERC20 tokenOut,
    uint256 exactAmountOut,
    uint256 maxAmountIn,
    uint256 deadline,
    bytes calldata userData
) external returns (uint256 amountIn);
```

Swaps `tokenIn` for an exact amount of `tokenOut` through a single pool. The caller funds the Vault with `tokenIn` up to `maxAmountIn` before this call.

**Parameters:**

| Name           | Type           | Description                                                              |
|----------------|----------------|--------------------------------------------------------------------------|
| pool           | address        | Address of the liquidity pool                                            |
| tokenIn        | IERC20         | Token being sent to the pool                                             |
| tokenOut       | IERC20         | Token being received from the pool                                       |
| exactAmountOut | uint256        | Exact amount of `tokenOut` to receive                                    |
| maxAmountIn    | uint256        | Maximum amount of `tokenIn` to spend (slippage protection)               |
| deadline       | uint256        | Timestamp after which the transaction will revert                        |
| userData       | bytes calldata | Additional (optional) data required for the swap                         |

**Returns:**

| Name     | Type    | Description                          |
|----------|---------|--------------------------------------|
| amountIn | uint256 | Calculated amount of `tokenIn` spent |

## Queries

Query functions simulate a swap against current on-chain state without executing it or moving any tokens, so they require no prepayment and no approvals.

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

Simulates `swapSingleTokenExactIn` and returns the calculated output amount.

**Parameters:**

| Name          | Type           | Description                                                              |
|---------------|----------------|--------------------------------------------------------------------------|
| pool          | address        | Address of the liquidity pool                                            |
| tokenIn       | IERC20         | Token being sent to the pool                                             |
| tokenOut      | IERC20         | Token being received from the pool                                       |
| exactAmountIn | uint256        | Exact amount of `tokenIn` to swap                                        |
| sender        | address        | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData      | bytes calldata | Additional (optional) data required for the query                        |

**Returns:**

| Name      | Type    | Description                            |
|-----------|---------|----------------------------------------|
| amountOut | uint256 | Calculated amount of `tokenOut` received |

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

Simulates `swapSingleTokenExactOut` and returns the calculated input amount.

**Parameters:**

| Name           | Type           | Description                                                              |
|----------------|----------------|--------------------------------------------------------------------------|
| pool           | address        | Address of the liquidity pool                                            |
| tokenIn        | IERC20         | Token being sent to the pool                                             |
| tokenOut       | IERC20         | Token being received from the pool                                       |
| exactAmountOut | uint256        | Exact amount of `tokenOut` to receive                                    |
| sender         | address        | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData       | bytes calldata | Additional (optional) data required for the query                        |

**Returns:**

| Name     | Type    | Description                          |
|----------|---------|--------------------------------------|
| amountIn | uint256 | Calculated amount of `tokenIn` spent |

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>
