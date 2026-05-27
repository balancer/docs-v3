---
order: 7
title: Aggregator Batch Router API
---

# Aggregator Batch Router API

The Aggregator Batch Router executes multi-hop swaps across multiple pools and tokens for contract callers such as aggregators, solvers, and smart wallets. It is the prepaid counterpart to the [Batch Router](./batch-router-api.md): instead of pulling input tokens through Permit2, the caller transfers them to the Vault before invoking the swap, and the router settles that payment. See [Token Approvals](/concepts/router/token-approvals.md#aggregator-routers-the-prepaid-model) for how the prepaid and Permit2 models compare.

::: info Paying the Vault
The caller transfers the input tokens to the Vault in the same transaction, before the router runs; the Vault's settlement accounting reverts the swap if the prepayment is insufficient. Unlike the retail Batch Router these functions take no `wethIsEth` flag, and the router does not use Permit2 (`getPermit2` returns the zero address). The `permitBatchAndCall` and `multicall` approval helpers inherited from the shared router base are not usable on this prepaid router.
:::

## State-changing functions

### `swapExactIn`

```solidity
function swapExactIn(
    SwapPathExactAmountIn[] memory paths,
    uint256 deadline,
    bytes calldata userData
)
    external
    payable
    returns (uint256[] memory pathAmountsOut, address[] memory tokensOut, uint256[] memory amountsOut);
```

Executes a swap involving multiple paths (steps), specifying exact input token amounts. Each path is independent and can have multiple hops. The caller must have transferred each path's input token to the Vault before this call.

**Example:** Swap USDC → DAI → WETH in one path, and USDC → USDT → WETH in another path, all in one transaction.

**Parameters:**

| Name     | Type                           | Description                                                       |
|----------|--------------------------------|-------------------------------------------------------------------|
| paths    | SwapPathExactAmountIn[] memory | Swap paths from token in to token out, specifying exact amounts in |
| deadline | uint256                        | Deadline for the swap, after which it will revert                 |
| userData | bytes calldata                 | Additional (optional) data required for the swap                  |

**Returns:**

| Name           | Type             | Description                                                                            |
|----------------|------------------|----------------------------------------------------------------------------------------|
| pathAmountsOut | uint256[] memory | Calculated amounts of output tokens corresponding to the last step of each given path  |
| tokensOut      | address[] memory | Output token addresses                                                                 |
| amountsOut     | uint256[] memory | Calculated amounts of output tokens, ordered by output token address                   |

### `swapExactOut`

```solidity
function swapExactOut(
    SwapPathExactAmountOut[] memory paths,
    uint256 deadline,
    bytes calldata userData
) external payable returns (uint256[] memory pathAmountsIn, address[] memory tokensIn, uint256[] memory amountsIn);
```

Executes a swap involving multiple paths (steps), specifying exact output token amounts. The caller funds the Vault with each path's input token, up to the path's `maxAmountIn`, before this call.

**Parameters:**

| Name     | Type                            | Description                                                        |
|----------|---------------------------------|--------------------------------------------------------------------|
| paths    | SwapPathExactAmountOut[] memory | Swap paths from token in to token out, specifying exact amounts out |
| deadline | uint256                         | Deadline for the swap, after which it will revert                  |
| userData | bytes calldata                  | Additional (optional) data required for the swap                   |

**Returns:**

| Name          | Type             | Description                                                                            |
|---------------|------------------|----------------------------------------------------------------------------------------|
| pathAmountsIn | uint256[] memory | Calculated amounts of input tokens corresponding to the first step of each given path  |
| tokensIn      | address[] memory | Input token addresses                                                                  |
| amountsIn     | uint256[] memory | Calculated amounts of input tokens, ordered by input token address                     |

## Queries

Query functions simulate a swap against current on-chain state without executing it or moving any tokens, so they require no prepayment and no approvals.

### `querySwapExactIn`

```solidity
function querySwapExactIn(
    SwapPathExactAmountIn[] memory paths,
    address sender,
    bytes calldata userData
) external returns (uint256[] memory pathAmountsOut, address[] memory tokensOut, uint256[] memory amountsOut);
```

Simulates `swapExactIn` without executing it.

**Parameters:**

| Name     | Type                           | Description                                                       |
|----------|--------------------------------|-------------------------------------------------------------------|
| paths    | SwapPathExactAmountIn[] memory | Swap paths from token in to token out, specifying exact amounts in |
| sender   | address                        | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData | bytes calldata                 | Additional (optional) data required for the query                 |

**Returns:**

| Name           | Type             | Description                                                                            |
|----------------|------------------|----------------------------------------------------------------------------------------|
| pathAmountsOut | uint256[] memory | Calculated amounts of output tokens corresponding to the last step of each given path  |
| tokensOut      | address[] memory | Calculated output token addresses                                                      |
| amountsOut     | uint256[] memory | Calculated amounts of output tokens, ordered by output token address                   |

### `querySwapExactOut`

```solidity
function querySwapExactOut(
    SwapPathExactAmountOut[] memory paths,
    address sender,
    bytes calldata userData
) external returns (uint256[] memory pathAmountsIn, address[] memory tokensIn, uint256[] memory amountsIn);
```

Simulates `swapExactOut` without executing it.

**Parameters:**

| Name     | Type                            | Description                                                        |
|----------|---------------------------------|--------------------------------------------------------------------|
| paths    | SwapPathExactAmountOut[] memory | Swap paths from token in to token out, specifying exact amounts out |
| sender   | address                         | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData | bytes calldata                  | Additional (optional) data required for the query                  |

**Returns:**

| Name          | Type             | Description                                                                            |
|---------------|------------------|----------------------------------------------------------------------------------------|
| pathAmountsIn | uint256[] memory | Calculated amounts of input tokens corresponding to the first step of each given path  |
| tokensIn      | address[] memory | Calculated input token addresses                                                       |
| amountsIn     | uint256[] memory | Calculated amounts of input tokens, ordered by input token address                     |

## Data Structures

These are the same path structures used by the [Batch Router](./batch-router-api.md).

### `SwapPathStep`

```solidity
struct SwapPathStep {
    address pool;        // Pool to swap through
    IERC20 tokenOut;     // Token to receive from this step
    bool isBuffer;       // If true, use ERC4626 buffer instead of pool
}
```

Defines a single step in a swap path.

**Fields:**

| Name     | Type    | Description                                                                |
|----------|---------|----------------------------------------------------------------------------|
| pool     | address | Address of the pool to swap through                                        |
| tokenOut | IERC20  | Token to receive from this step                                            |
| isBuffer | bool    | If true, the "pool" is an ERC4626 Buffer used to wrap/unwrap tokens if the pool doesn't have enough liquidity |

### `SwapPathExactAmountIn`

```solidity
struct SwapPathExactAmountIn {
    IERC20 tokenIn;             // Starting token
    SwapPathStep[] steps;       // Swap steps to execute
    uint256 exactAmountIn;      // Exact amount to send
    uint256 minAmountOut;       // Minimum amount to receive
}
```

Defines a swap path with an exact input amount.

**Fields:**

| Name          | Type           | Description                                                                                |
|---------------|----------------|--------------------------------------------------------------------------------------------|
| tokenIn       | IERC20         | Starting token for this path                                                               |
| steps         | SwapPathStep[] | Array of swap steps to execute                                                             |
| exactAmountIn | uint256        | Exact amount of tokenIn to send                                                            |
| minAmountOut  | uint256        | Minimum amount of final output token to receive (slippage protection)                      |

### `SwapPathExactAmountOut`

```solidity
struct SwapPathExactAmountOut {
    IERC20 tokenIn;             // Starting token
    SwapPathStep[] steps;       // Swap steps to execute
    uint256 maxAmountIn;        // Maximum amount to send
    uint256 exactAmountOut;     // Exact amount to receive
}
```

Defines a swap path with an exact output amount.

**Fields:**

| Name           | Type           | Description                                                                                |
|----------------|----------------|--------------------------------------------------------------------------------------------|
| tokenIn        | IERC20         | Starting token for this path                                                               |
| steps          | SwapPathStep[] | Array of swap steps to execute                                                             |
| maxAmountIn    | uint256        | Maximum amount of tokenIn to send (slippage protection)                                    |
| exactAmountOut | uint256        | Exact amount of final output token to receive                                              |

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>
