---
order: 2
title: Batch Router API
---

# Batch Router API

The Batch Router can be used to interact with Balancer onchain via state changing operations or used to query operations in an off-chain context.

The Batch Router enables multi-hop swaps across multiple pools and tokens. Each path can have multiple steps, and you can execute multiple paths in a single transaction.

## State-changing functions

### Batch swaps

#### `swapExactIn`

```solidity
function swapExactIn(
    SwapPathExactAmountIn[] memory paths,
    uint256 deadline,
    bool wethIsEth,
    bytes calldata userData
)
    external
    payable
    returns (uint256[] memory pathAmountsOut, address[] memory tokensOut, uint256[] memory amountsOut);
```

Executes a swap operation involving multiple paths (steps), specifying exact input token amounts. Each path is independent and can have multiple hops.

**Example:** Swap USDC → DAI → WETH in one path, and USDC → USDT → WETH in another path, all in one transaction.

**Parameters:**

| Name       | Type                          | Description                                                                                  |
|------------|-------------------------------|----------------------------------------------------------------------------------------------|
| paths      | SwapPathExactAmountIn[] memory | Swap paths from token in to token out, specifying exact amounts in                          |
| deadline   | uint256                       | Deadline for the swap, after which it will revert                                            |
| wethIsEth  | bool                          | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH     |
| userData   | bytes calldata                | Additional (optional) data required for the swap                                             |

**Returns:**

| Name             | Type             | Description                                                                                  |
|------------------|------------------|----------------------------------------------------------------------------------------------|
| pathAmountsOut   | uint256[] memory | Calculated amounts of output tokens corresponding to the last step of each given path        |
| tokensOut        | address[] memory | Output token addresses                                                                       |
| amountsOut       | uint256[] memory | Calculated amounts of output tokens, ordered by output token address                         |

#### `swapExactOut`

```solidity
function swapExactOut(
    SwapPathExactAmountOut[] memory paths,
    uint256 deadline,
    bool wethIsEth,
    bytes calldata userData
) external payable returns (uint256[] memory pathAmountsIn, address[] memory tokensIn, uint256[] memory amountsIn);
```

Executes a swap operation involving multiple paths (steps), specifying exact output token amounts. You specify exactly how much you want to receive.

**Parameters:**

| Name       | Type                           | Description                                                                                  |
|------------|--------------------------------|----------------------------------------------------------------------------------------------|
| paths      | SwapPathExactAmountOut[] memory | Swap paths from token in to token out, specifying exact amounts out                         |
| deadline   | uint256                        | Deadline for the swap, after which it will revert                                            |
| wethIsEth  | bool                           | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH     |
| userData   | bytes calldata                 | Additional (optional) data required for the swap                                             |

**Returns:**

| Name             | Type             | Description                                                                                  |
|------------------|------------------|----------------------------------------------------------------------------------------------|
| pathAmountsIn    | uint256[] memory | Calculated amounts of input tokens corresponding to the first step of each given path        |
| tokensIn         | address[] memory | Input token addresses                                                                        |
| amountsIn        | uint256[] memory | Calculated amounts of input tokens, ordered by input token address                           |

## Queries

### `querySwapExactIn`

```solidity
function querySwapExactIn(
    SwapPathExactAmountIn[] memory paths,
    address sender,
    bytes calldata userData
) external returns (uint256[] memory pathAmountsOut, address[] memory tokensOut, uint256[] memory amountsOut);
```

Queries a swap operation involving multiple paths (steps), specifying exact input token amounts, without actually executing it.

**Parameters:**

| Name       | Type                          | Description                                                                                  |
|------------|-------------------------------|----------------------------------------------------------------------------------------------|
| paths      | SwapPathExactAmountIn[] memory | Swap paths from token in to token out, specifying exact amounts in                          |
| sender     | address                       | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData   | bytes calldata                | Additional (optional) data required for the query                                            |

**Returns:**

| Name             | Type             | Description                                                                                  |
|------------------|------------------|----------------------------------------------------------------------------------------------|
| pathAmountsOut   | uint256[] memory | Calculated amounts of output tokens to be received corresponding to the last step of each given path |
| tokensOut        | address[] memory | Calculated output token addresses                                                            |
| amountsOut       | uint256[] memory | Calculated amounts of output tokens to be received, ordered by output token address          |

### `querySwapExactOut`

```solidity
function querySwapExactOut(
    SwapPathExactAmountOut[] memory paths,
    address sender,
    bytes calldata userData
) external returns (uint256[] memory pathAmountsIn, address[] memory tokensIn, uint256[] memory amountsIn);
```

Queries a swap operation involving multiple paths (steps), specifying exact output token amounts, without actually executing it.

**Parameters:**

| Name       | Type                           | Description                                                                                  |
|------------|--------------------------------|----------------------------------------------------------------------------------------------|
| paths      | SwapPathExactAmountOut[] memory | Swap paths from token in to token out, specifying exact amounts out                         |
| sender     | address                        | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| userData   | bytes calldata                 | Additional (optional) data required for the query                                            |

**Returns:**

| Name             | Type             | Description                                                                                  |
|------------------|------------------|----------------------------------------------------------------------------------------------|
| pathAmountsIn    | uint256[] memory | Calculated amounts of input tokens to be sent corresponding to the first step of each given path |
| tokensIn         | address[] memory | Calculated input token addresses                                                             |
| amountsIn        | uint256[] memory | Calculated amounts of input tokens to be sent, ordered by input token address                |

## Data Structures

### `SwapPathStep`

```solidity
struct SwapPathStep {
    address pool;           // Pool to swap through
    IERC20 tokenOut;       // Token to receive from this step
    bool isBuffer;         // If true, use ERC4626 buffer instead of pool
}
```

Defines a single step in a swap path.

**Fields:**

| Name      | Type    | Description                                                                |
|-----------|---------|----------------------------------------------------------------------------|
| pool      | address | Address of the pool to swap through                                        |
| tokenOut  | IERC20  | Token to receive from this step                                            |
| isBuffer  | bool    | If true, the "pool" is an ERC4626 Buffer used to wrap/unwrap tokens if pool doesn't have enough liquidity |

### `SwapPathExactAmountIn`

```solidity
struct SwapPathExactAmountIn {
    IERC20 tokenIn;                // Starting token
    SwapPathStep[] steps;          // Swap steps to execute
    uint256 exactAmountIn;         // Exact amount to send
    uint256 minAmountOut;          // Minimum amount to receive
}
```

Defines a swap path with an exact input amount.

**Fields:**

| Name          | Type            | Description                                                                                |
|---------------|-----------------|--------------------------------------------------------------------------------------------|
| tokenIn       | IERC20          | Starting token for this path                                                               |
| steps         | SwapPathStep[]  | Array of swap steps to execute. For each step: If tokenIn == pool, use removeLiquidity SINGLE_TOKEN_EXACT_IN. If tokenOut == pool, use addLiquidity UNBALANCED |
| exactAmountIn | uint256         | Exact amount of tokenIn to send                                                            |
| minAmountOut  | uint256         | Minimum amount of final output token to receive (slippage protection)                      |

### `SwapPathExactAmountOut`

```solidity
struct SwapPathExactAmountOut {
    IERC20 tokenIn;                // Starting token
    SwapPathStep[] steps;          // Swap steps to execute
    uint256 maxAmountIn;           // Maximum amount to send
    uint256 exactAmountOut;        // Exact amount to receive
}
```

Defines a swap path with an exact output amount.

**Fields:**

| Name           | Type            | Description                                                                                |
|----------------|-----------------|--------------------------------------------------------------------------------------------|
| tokenIn        | IERC20          | Starting token for this path                                                               |
| steps          | SwapPathStep[]  | Array of swap steps to execute. For each step: If tokenIn == pool, use removeLiquidity SINGLE_TOKEN_EXACT_OUT. If tokenOut == pool, use addLiquidity SINGLE_TOKEN_EXACT_OUT |
| maxAmountIn    | uint256         | Maximum amount of tokenIn to send (slippage protection)                                    |
| exactAmountOut | uint256         | Exact amount of final output token to receive                                              |

## Use Cases

- **Arbitrage**: Execute multiple profitable paths simultaneously
- **Route optimization**: Split trades across multiple pools for better pricing
- **Token bridging**: Swap through intermediate tokens (e.g., Token A → USDC → Token B)
- **Complex strategies**: Combine swaps through multiple pools in one transaction

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>
