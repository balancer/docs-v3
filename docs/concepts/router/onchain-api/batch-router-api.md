---
order: 1
title: Batch Router API
---

# Batch Router API

The Batch Router can be used to interact with Balancer onchain via [state changing](/concepts/router/onchain-api/batch-router-api.html#state-changing-functions) operations or used to [query operations](/concepts/router/onchain-api/batch-router-api.html#query-functions) in an offchain context.

## State-changing functions

### swapExactIn
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

| Name | Type | Description |
| --- | --- | --- |
| paths | `SwapPathExactAmountIn[]` | Swap paths from token in to token out, specifying exact amounts in. |
| deadline | `uint256` | Deadline for the swap. |
| wethIsEth | `bool` | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH. |
| userData | `bytes` | Additional (optional) data required for the swap. |
| pathAmountsOut | `uint256[]` | Calculated amounts of output tokens corresponding to the last step of each given path. |
| tokensOut | `address[]` | Calculated output token addresses. |
| amountsOut | `uint256[]` | Calculated amounts of output tokens, ordered by output token address. |

### swapExactOut
```solidity
function swapExactOut(
    SwapPathExactAmountOut[] memory paths,
    uint256 deadline,
    bool wethIsEth,
    bytes calldata userData
) external payable returns (uint256[] memory pathAmountsIn, address[] memory tokensIn, uint256[] memory amountsIn);
```

Executes a swap operation involving multiple paths (steps), specifying exact output token amounts.

| Name | Type | Description |
| --- | --- | --- |
| paths | `SwapPathExactAmountOut[]` | Swap paths from token in to token out, specifying exact amounts out. |
| deadline | `uint256` | Deadline for the swap. |
| wethIsEth | `bool` | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH. |
| userData | `bytes` | Additional (optional) data required for the swap. |
| pathAmountsIn | `uint256[]` | Calculated amounts of input tokens corresponding to the first step of each given path. |
| tokensIn | `address[]` | Calculated input token addresses. |
| amountsIn | `uint256[]` | Calculated amounts of input tokens, ordered by input token address. |


## Query functions

### querySwapExactIn
```solidity
function querySwapExactIn(
    SwapPathExactAmountIn[] memory paths,
    bytes calldata userData
) external returns (uint256[] memory pathAmountsOut, address[] memory tokensOut, uint256[] memory amountsOut);
```

Queries a swap operation involving multiple paths (steps), specifying exact input token amounts.

| Name | Type | Description |
| --- | --- | --- |
| paths | `SwapPathExactAmountIn[]` | Swap paths from token in to token out, specifying exact amounts in. |
| userData | `bytes` | Additional (optional) data required for the query. |
| pathAmountsOut | `uint256[]` | Calculated amounts of output tokens to be received corresponding to the last step of each given path. |
| tokensOut | `address[]` | Calculated output token addresses. |
| amountsOut | `uint256[]` | Calculated amounts of output tokens to be received, ordered by output token address. |

### querySwapExactOut
```solidity
function querySwapExactOut(
    SwapPathExactAmountOut[] memory paths,
    bytes calldata userData
) external returns (uint256[] memory pathAmountsIn, address[] memory tokensIn, uint256[] memory amountsIn);
```

Queries a swap operation involving multiple paths (steps), specifying exact output token amounts.

| Name | Type | Description |
| --- | --- | --- |
| paths | `SwapPathExactAmountOut[]` | Swap paths from token in to token out, specifying exact amounts out. |
| userData | `bytes` | Additional (optional) data required for the query. |
| pathAmountsIn | `uint256[]` | Calculated amounts of input tokens to be received corresponding to the last step of each given path. |
| tokensIn | `address[]` | Calculated input token addresses. |
| amountsIn | `uint256[]` | Calculated amounts of input tokens to be received, ordered by input token address. |
