---
order: 1
title: Batch Router API
---

# Batch Router API

The Batch Router can be used to interact with Balancer onchain via state changing operations or used to query operations in an off-chain context.

## State-changing functions

## Batch swaps

### `swapExactIn`

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
Executes a swap operation involving multiple paths (steps), specifying exact input token amounts.

**Parameters:**

| Name       | Type                               | Description                                                                                  |
|------------|------------------------------------|----------------------------------------------------------------------------------------------|
| paths      | SwapPathExactAmountIn[] memory     | Swap paths from token in to token out, specifying exact amounts in.                          |
| deadline   | uint256                            | Deadline for the swap, after which it will revert                                                                        |
| wethIsEth  | bool                               | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH     |
| userData   | bytes calldata                     | Additional (optional) data required for the swap                                             |

**Returns:**

| Name             | Type                   | Description                                                                                  |
|------------------|------------------------|----------------------------------------------------------------------------------------------|
| pathAmountsOut   | uint256[] memory       | Calculated amounts of output tokens corresponding to the last step of each given path        |
| tokensOut        | address[] memory       | Calculated output token addresses                                                            |
| amountsOut       | uint256[] memory       | Calculated amounts of output tokens, ordered by output token address                         |

### `swapExactOut`

```solidity
function swapExactOut(
    SwapPathExactAmountOut[] memory paths,
    uint256 deadline,
    bool wethIsEth,
    bytes calldata userData
) external payable returns (uint256[] memory pathAmountsIn, address[] memory tokensIn, uint256[] memory amountsIn);
```
Executes a swap operation involving multiple paths (steps), specifying exact output token amounts.

**Parameters:**

| Name       | Type                               | Description                                                                                  |
|------------|------------------------------------|----------------------------------------------------------------------------------------------|
| paths      | SwapPathExactAmountOut[] memory    | Swap paths from token in to token out, specifying exact amounts out.                         |
| deadline   | uint256                            | Deadline for the swap, after which it will revert                                                                        |
| wethIsEth  | bool                               | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH     |
| userData   | bytes calldata                     | Additional (optional) data required for the swap                                             |

**Returns:**

| Name             | Type                   | Description                                                                                  |
|------------------|------------------------|----------------------------------------------------------------------------------------------|
| pathAmountsIn    | uint256[] memory       | Calculated amounts of input tokens corresponding to the first step of each given path        |
| tokensIn         | address[] memory       | Calculated input token addresses                                                             |
| amountsIn        | uint256[] memory       | Calculated amounts of input tokens, ordered by input token address                           |

## Queries

### `querySwapExactIn`

```solidity
function querySwapExactIn(
    SwapPathExactAmountIn[] memory paths,
    bytes calldata userData
) external returns (uint256[] memory pathAmountsOut, address[] memory tokensOut, uint256[] memory amountsOut);
```
Queries a swap operation involving multiple paths (steps), specifying exact input token amounts.

**Parameters:**

| Name       | Type                               | Description                                                                                  |
|------------|------------------------------------|----------------------------------------------------------------------------------------------|
| paths      | SwapPathExactAmountIn[] memory     | Swap paths from token in to token out, specifying exact amounts in.                          |
| userData   | bytes calldata                     | Additional (optional) data required for the query                                            |

**Returns:**

| Name             | Type                   | Description                                                                                  |
|------------------|------------------------|----------------------------------------------------------------------------------------------|
| pathAmountsOut   | uint256[] memory       | Calculated amounts of output tokens to be received corresponding to the last step of each given path |
| tokensOut        | address[] memory       | Calculated output token addresses                                                            |
| amountsOut       | uint256[] memory       | Calculated amounts of output tokens to be received, ordered by output token address          |

### `querySwapExactOut`

```solidity
function querySwapExactOut(
    SwapPathExactAmountOut[] memory paths,
    bytes calldata userData
) external returns (uint256[] memory pathAmountsIn, address[] memory tokensIn, uint256[] memory amountsIn);
```
Queries a swap operation involving multiple paths (steps), specifying exact output token amounts.

**Parameters:**

| Name       | Type                               | Description                                                                                  |
|------------|------------------------------------|----------------------------------------------------------------------------------------------|
| paths      | SwapPathExactAmountOut[] memory    | Swap paths from token in to token out, specifying exact amounts out.                         |
| userData   | bytes calldata                     | Additional (optional) data required for the query                                            |

**Returns:**

| Name             | Type                   | Description                                                                                  |
|------------------|------------------------|----------------------------------------------------------------------------------------------|
| pathAmountsIn    | uint256[] memory       | Calculated amounts of input tokens to be received corresponding to the last step of each given path |
| tokensIn         | address[] memory       | Calculated input token addresses                                                             |
| amountsIn        | uint256[] memory       | Calculated amounts of input tokens to be received, ordered by input token address            |

## Router common

See the bottom of the [Router](./router-api.md#router-common) for functions common to both the `Router` and `BatchRouter`.