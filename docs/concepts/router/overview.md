---
order: 0
title: Onchain API
---
# Router Onchain API
The Router is the recommended entrypoint for user operations. It provides functions to both query and execute `swap`, `add` and `remove` operations against the Balancer vault.
[Transient Accounting](/concepts/vault/transient.html) enables a simple query system that ensures query functions will always return the exact same outcome as their state-changing counterpart.

Because routers are stateless and do not hold token balances, they can be replaced safely and trustlessly, if necessary. These docs will always reference the latest version of the Balancer Router. 

::: info User token approvals should always be for the Balancer Vault, never the router contract
The Balancer Router router is a [Trusted Router](./technical.html#trusted-routers), so it will inherit vault token approvals once `approved` by both the user AND governance. In a scenario where an issue is discovered in a Trusted Router,
governance has the ability to revoke the **Trusted** designation, disabling vault approval access globally.
:::


## Code

[Router.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Router.sol)

## Deployments

BalancerV3Router01 is deployed at 0x..... on the Ethereum mainnet, ...... It was built from commit #####.

## State-changing functions
The router's state-changing functions are used for interacting with Balancer onchain. They provide simple interfaces for the most common user actions performed against the Balancer Vault.
### initialize

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
Once a pool has been [registered](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IVaultExtension.sol#L93-L121), a call to `initialize` is required to perform setup actions and seed the pool with initial liquidity.
Until a pool is `initialized`, it will not support normal `swap`, `add` and `remove` operations. A pool can only be initialized once in its life-time, enforced by the vault. 

| Name          | Type          | Description   |
| ------------- | ------------- | ------------  |
| pool          |  `address`    | Address of the liquidity pool|
| tokens        |  `IERC20[]`   | Pool tokens                                                                                      |
| exactAmountsIn|  `uint256[]`  | Exact amounts of tokens to be added, sorted in token alphanumeric order                          |
|minBptAmountOut|  `uint256`    | Minimum amount of pool tokens to be received                                                     |
| wethIsEth     |  `bool`       | If true, incoming ETH will be wrapped to WETH; otherwise the Vault will pull WETH tokens         |
| userData      |  `bytes`      | Additional (optional) data required for adding initial liquidity                                 |
|               |               |                                                                                                  |
|  bptAmountOut |  `uint256`    | Actual amount of pool tokens minted in exchange for initial liquidity                            |

### addLiquidityUnbalanced

```solidity
function addLiquidityUnbalanced(
    address pool,
    uint256[] memory exactAmountsIn,
    uint256 minBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256 bptAmountOut);
```

The preferred function for adding liquidity to a pool. `addLiquidityUnbalanced` allows exact amounts of any pool token to be added to the pool, avoiding unnecessary dust in the user's wallet.

The un-proportional amounts will be charged the pool's `swapFeePercentage` to ensure that the user cannot circumvent the swap fee by using add/remove operations.

| Name          | Type          | Description   |
| ------------- | ------------- | ------------  |
| pool          |  `address`    | Address of the liquidity pool                                                                 |
| exactAmountsIn|  `uint256[]`  | Exact amounts of tokens to be added, sorted in token alphanumeric order                       |
|minBptAmountOut|  `uint256`    | Minimum amount of pool tokens to be received                                                  |
| wethIsEth     |  `bool`       | If true, incoming ETH will be wrapped to WETH; otherwise the Vault will pull WETH tokens      |
| userData      |  `bytes`      | Additional (optional) data required for adding liquidity                                      |
|               |               |                                                                                               |
| bptAmountOut  |  `uint256`    | Actual amount of pool tokens received                                                         |

### addLiquiditySingleTokenExactOut
```solidity
function addLiquiditySingleTokenExactOut(
    address pool,
    IERC20 tokenIn,
    uint256 maxAmountIn,
    uint256 exactBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256 amountIn)
```

Add liquidity to a pool with a single token and receive an exact amount of BPT out. This function is useful for `EXACT_OUT` operations. 

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                              |
| tokenIn            |  `IERC20`     | Token used to add liquidity                                                                |
| maxAmountIn        |  `uint256`    | Maximum amount of tokens to be added                                                       |
| exactBptAmountOut  |  `uint256`    | Exact amount of pool tokens to be received                                                 | 
| wethIsEth          |  `bool`       | If true, incoming ETH will be wrapped to WETH; otherwise the Vault will pull WETH tokens   |
| userData           |  `bytes`      | Additional (optional) data required for adding liquidity                                   |
|                    |               |                                                                                            |
| amountIn           |  `uint256`    | amountIn Actual amount of tokens added                                                     |

### addLiquidityCustom

```solidity
function addLiquidityCustom(
    address pool,
    uint256[] memory inputAmountsIn,
    uint256 minBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256[] memory amountsIn, uint256 bptAmountOut, bytes memory returnData);
```

Available if the pool has implemented [`onAddLiquidityCustom`](/concepts/pools/custom-pools/create-custom-amm-with-novel-invariant.html#add-liquidity-custom).
[Custom AMMs](../developer-guides/create-custom-amm-with-novel-invariant.md) that require a non-standard strategy for adding liquidity will implement this function to solve a specific use case.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                                 |
| inputAmountsIn     |  `uint256[]`  | Amounts of tokens to be added, sorted in token alphanumeric order and scaled to 18 decimals   |
| minBptAmountOut    |  `uint256`    | Minimum amount of pool tokens to be received                                                  |
| wethIsEth          |  `bool`       | If true, incoming ETH will be wrapped to WETH; otherwise the Vault will pull WETH tokens      |
| userData           |  `bytes`      | Additional (optional) data required for adding liquidity                                      |
|                    |               |                                                                                               |
| amountsIn          |  `uint256[]`  | Actual amounts of tokens added, sorted in token alphanumeric order                            |
| bptAmountOut       |  `uint256`    | Actual amount of pool tokens received                                                         |
| returnData         |  `bytes`      | Arbitrary (optional) data with encoded response from the pool                                 |

### removeLiquidityProportional

```solidity
function removeLiquidityProportional(
    address pool,
    uint256 exactBptAmountIn,
    uint256[] memory minAmountsOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256[] memory amountsOut);
```

The preferred function for removing liquidity from a pool. Tokens are removed from the pool in proportional amounts, causing zero price impact and avoiding the swap fee charged when exiting non-proportional.
Specifying an `exactBptAmountIn` ensures that the user will not be left with any dust.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                                |
| exactBptAmountIn   |  `uint256`    | Exact amount of pool tokens provided                                                         |
| minAmountsOut      |  `uint256[]`  | Minimum amounts of tokens to be received, sorted in token alphanumeric order                 |
| wethIsEth          |  `bool`       | If true, outgoing WETH will be unwrapped to ETH; otherwise the Vault will send WETH tokens   |
| userData           |  `bytes`      | Additional (optional) data required for removing liquidity                                   |
|                    |               |                                                                                              |
| amountsOut         |  `uint256[]`  | Actual amounts of tokens received, sorted in token alphanumeric order                        |

### removeLiquiditySingleTokenExactIn

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
Remove liquidity from the pool in a single token specifying `exactBptAmountIn` and `minAmountOut`. This function causes price impact. The pool's `swapFeePercentage` will be charged on the non-proportional exit amount.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                                |
| exactBptAmountIn   |  `uint256`    | Exact amount of pool tokens provided                                                         |
| tokenOut           |  `IERC20`     | Token used to remove liquidity                                                               |
| minAmountOut       |  `uint256`    | Minimum amount of tokens to be received                                                      |
| wethIsEth          |  `bool`       | If true, outgoing WETH will be unwrapped to ETH; otherwise the Vault will send WETH tokens   |
| userData           |  `bytes`      | Additional (optional) data required for removing liquidity                                   |
|                    |               |                                                                                              |
| amountOut          |  `uint256`    | Actual amount of tokens received                                                             |


### removeLiquiditySingleTokenExactOut
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
Remove liquidity from the pool in a single token specifying `maxBptAmountIn` and `exactAmountOut`. This function causes price impact. The pool's `swapFeePercentage` will be charged on the non-proportional exit amount.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                                |
| maxBptAmountIn     |  `uint256`    | Maximum amount of pool tokens provided                                                       |
| tokenOut           |  `IERC20`     | Token used to remove liquidity                                                               |
| exactAmountOut     |  `uint256`    | Exact amount of tokens to be received                                                        |
| wethIsEth          |  `bool`       | If true, outgoing WETH will be unwrapped to ETH; otherwise the Vault will send WETH tokens   |
| userData           |  `bytes`      | Additional (optional) data required for removing liquidity                                   |
|                    |               |                                                                                              |
| bptAmountIn        |  `uint256`    | Actual amount of pool tokens burned                                                          |


### removeLiquidityCustom

```solidity
function removeLiquidityCustom(
    address pool,
    uint256 maxBptAmountIn,
    uint256[] memory minAmountsOut,
    bool wethIsEth,
    bytes memory userData
) external returns (uint256 bptAmountIn, uint256[] memory amountsOut, bytes memory returnData);
```

Available if the pool has implemented [`onRemoveLiquidityCustom`](/concepts/pools/custom-pools/create-custom-amm-with-novel-invariant.html#remove-liquidity-custom).
[Custom AMMs](../developer-guides/create-custom-amm-with-novel-invariant.md) that require a non-standard strategy for removing liquidity will implement this function to solve a specific use case.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                               |
| maxBptAmountIn     |  `uint256`    | Maximum amount of pool tokens provided                                                      |
| minAmountsOut      |  `uint256[]`  | Minimum amounts of tokens to be received, sorted in token alphanumeric order                |
| wethIsEth          |  `bool`       | If true, outgoing WETH will be unwrapped to ETH; otherwise the Vault will send WETH tokens  |
| userData           |  `bytes`      | Additional (optional) data required for removing liquidity                                  |
|                    |               |                                                                                             |
| bptAmountIn        |  `uint256`    | Actual amount of pool tokens burned                                                         |
| amountsOut         |  `uint256[]`  | Actual amounts of tokens received, sorted in token alphanumeric order                       |
| userData           |  `bytes`      | Arbitrary (optional) data with encoded response from the pool                               |

### swapSingleTokenExactIn
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
) external payable returns (uint256 amountOut)
```

Swap `exactAmountIn` of `tokenIn` for at least `minAmountOut` of `tokenOut` with a given liquidity `pool`.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool|
| tokenIn            |  `IERC20`     | Token to be swapped from                                                                      |
| tokenOut           |  `IERC20`     | Token to be swapped to                                                                        |
| exactAmountIn      |  `uint256`    | Exact amounts of input tokens to send                                                         |
| minAmountOut       |  `uint256`    | Minimum amount of tokens to be received                                                       |
| deadline           |  `uint256`    | Deadline for the swap in UNIX time after which the transaction will revert                    |
| wethIsEth          |  `bool`       | If true, incoming ETH will be wrapped to WETH; otherwise the Vault will pull WETH tokens      |
| userData           |  `bytes`      | Additional (optional) data required for the swap                                              |
|                    |               |                                                                                               |
| amountOut          |  `uint256`    | Calculated amount of output tokens to be received in exchange for the given input tokens      |


### swapSingleTokenExactOut
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

Swap up to `maxAmountIn` of `tokenIn` for an `exactAmountOut` of `tokenOut`.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                                 |
| tokenIn            |  `IERC20`     | Token to be swapped from                                                                      |
| tokenOut           |  `IERC20`     | Token to be swapped to                                                                        |
| exactAmountOut     |  `uint256`    | Exact amounts of input tokens to receive                                                      |
| maxAmountIn        |  `uint256`    | Max amount tokens to be sent                                                                  |
| deadline           |  `uint256`    | Deadline for the swap in UNIX time after which the transaction will revert                    |
| wethIsEth          |  `bool`       | If true, incoming ETH will be wrapped to WETH; otherwise the Vault will pull WETH tokens      |
| userData           |  `bytes`      | Additional (optional) data required for the swap                                              |
|                    |               |                                                                                               |
| amountOut          |  `uint256`    | Calculated amount of output tokens to be received in exchange for the given input tokens      |

### swapExactIn
```solidity
function swapExactIn(
    SwapPathExactAmountIn[] memory paths,
    uint256 deadline,
    bool wethIsEth,
    bytes calldata userData
) external payable returns (uint256[] memory pathAmountsOut, address[] memory tokensOut, uint256[] memory amountsOut);
```

Executes a swap operation involving multiple `paths` specifying exact input token amounts.

| Name              | Type                     | Description                                                                         |
|-------------------|--------------------------|-------------------------------------------------------------------------------------|
| paths             | `SwapPathExactAmountIn[]`| Swap paths from token in to token out, specifying exact amounts in                  |
| deadline          | `uint256`                | Deadline for the swap in UNIX time after which the transaction will revert          |
| wethIsEth         | `bool`                   | If true, incoming ETH will be wrapped to WETH; otherwise the Vault will pull WETH tokens |
| userData          | `bytes`                  | Additional (optional) data required for the swap                                    |
|                   |                          |                                                                                     |
| pathAmountsOut    | `uint256[]`              | Calculated amounts of output tokens corresponding to the last step of each given path |
| tokensOut         | `address[]`              | Calculated output token addresses                                                   |
| amountsOut        | `uint256[]`              | Calculated amounts of output tokens, ordered by output token address                |

### swapExactOut
```solidity
function swapExactOut(
    SwapPathExactAmountOut[] memory paths,
    uint256 deadline,
    bool wethIsEth,
    bytes calldata userData
) external payable returns (uint256[] memory pathAmountsIn, address[] memory tokensIn, uint256[] memory amountsIn);
```

Executes a swap operation involving multiple `paths` specifying exact output token amounts.

| Name              | Type                     | Description                                                                         |
|-------------------|--------------------------|-------------------------------------------------------------------------------------|
| paths             | `SwapPathExactAmountOut[]`| Swap paths from token in to token out, specifying exact amounts out                 |
| deadline          | `uint256`                | Deadline for the swap in UNIX time after which the transaction will revert          |
| wethIsEth         | `bool`                   | If true, incoming ETH will be wrapped to WETH; otherwise the Vault will pull WETH tokens |
| userData          | `bytes`                  | Additional (optional) data required for the swap                                    |
|                   |                          |                                                                                     |
| pathAmountsIn     | `uint256[]`              | Calculated amounts of input tokens corresponding to the last step of each given path |
| tokensIn          | `address[]`              | Calculated input token addresses                                                   |
| amountsIn         | `uint256[]`              | Calculated amounts of input tokens, ordered by input token address                 |

## Query functions
All state-changing functions have a query counterpart. Queries are expected to be used in an offchain context and done with an `eth_call`. [Transient Accounting](/concepts/vault/transient.html) enables query functions to execute the same accounting logic as state-changing functions, returning the outcome without settling the operation.

### queryAddLiquidityUnbalanced
```solidity
function queryAddLiquidityUnbalanced(
    address pool,
    uint256[] memory exactAmountsIn,
    uint256 minBptAmountOut,
    bytes memory userData
) external returns (uint256 bptAmountOut);
```

Queries an [`addLiquidityUnbalanced`](#addliquidityunbalanced) operation without executing it.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                                 |
| exactAmountsIn     |  `uint256[]`  | Exact amounts of tokens to be added, sorted in token alphanumeric order                       |
| minBptAmountOut    |  `uint256`    | Expected minimum amount of pool tokens to receive                                             |
| userData           |  `bytes`      | Additional (optional) data required for the query                                             |
|                    |               |                                                                                               |
| bptAmountOut       |  `uint256`    | Expected amount of pool tokens to receive                                                     |

### queryAddLiquiditySingleTokenExactOut
```solidity
function queryAddLiquiditySingleTokenExactOut(
    address pool,
    IERC20 tokenIn,
    uint256 maxAmountIn,
    uint256 exactBptAmountOut,
    bytes memory userData
) external returns (uint256 amountIn);
```

Queries an [`addLiquiditySingleTokenExactOut`](#addliquiditysingletokenexactout) operation without executing it.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool|
| tokenIn            |  `IERC20`     | Exact amounts of tokens to be added, sorted in token alphanumeric order |
| maxAmountIn        |  `uint256`    | Expected minimum amount of pool tokens to receive                       |
| exactBptAmountOut  |  `uint256`    | Additional (optional) data required for the query                       |
| userData           |  `bytes`      |                                                                         |
|                    |               |                                                                         |
| amountIn           |  `uint256`    | Expected amount of pool tokens to receive                               | 

### queryAddLiquidityCustom
```solidity
function queryAddLiquidityCustom(
    address pool,
    uint256[] memory inputAmountsIn,
    uint256 minBptAmountOut,
    bytes memory userData
) external returns (uint256[] memory amountsIn, uint256 bptAmountOut, bytes memory returnData);
```

Queries an [`addLiquidityCustom`](#addliquiditycustom) operation without executing it.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool|
| inputAmountsIn     |  `uint256[]`  | Upscaled Amounts of tokens to be added, sorted in token alphanumeric order |
| minBptAmountOut    |  `uint256`    | Expected minimum amount of pool tokens to receive                          |
| userData           |  `bytes`      | Additional (optional) data required for the query                          |
|                    |               |                                                                            |
| amountsIn          |  `uint256[]`  | Expected amounts of tokens to add, sorted in token alphanumeric order      | 
| bptAmountOut       |  `uint256`    | Expected amount of pool tokens to receive                                  | 
| returnData         |  `bytes`      | Arbitrary (optional) data with encoded response from the pool              |

### queryRemoveLiquidityProportional
```solidity
function queryRemoveLiquidityProportional(
    address pool,
    uint256 exactBptAmountIn,
    bytes memory userData
) external returns (uint256[] memory amountsOut);
```

Queries a [`removeLiquidityProportional`](#removeliquidityproportional) operation without executing it.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                                       |
| exactBptAmountIn   |  `uint256`    | Exact amount of pool tokens provided for the query                                                  |
| userData           |  `bytes`      | Additional (optional) data required for the query                                                   |
|                    |               |                                                                                                     |
| amountsOut         |  `uint256[]`  | Expected amounts of tokens to receive, sorted in token alphanumeric order                           |

### queryRemoveLiquiditySingleTokenExactIn
```solidity
function queryRemoveLiquiditySingleTokenExactIn(
    address pool,
    uint256 exactBptAmountIn,
    IERC20 tokenOut,
    bytes memory userData
) external returns (uint256 amountOut);
```

Queries a [`removeLiquiditySingleTokenExactIn`](#removeliquiditysingletokenexactin) operation without executing it.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                                      |
| exactBptAmountIn   |  `uint256`    | Exact amount of pool tokens provided for the query                                                 |
| tokenOut           |  `IERC20`     | Token used to remove liquidity                                                                     |
| userData           |  `bytes`      | Additional (optional) data required for the query                                                  |
|                    |               |                                                                                                    |
| amountOut          |  `uint256`    | Expected amount of tokens to receive                                                               |

### queryRemoveLiquiditySingleTokenExactOut
```solidity
function queryRemoveLiquiditySingleTokenExactOut(
    address pool,
    IERC20 tokenOut,
    uint256 exactAmountOut,
    bytes memory userData
) external returns (uint256 bptAmountIn);
```

Queries a [`removeLiquiditySingleTokenExactOut`](#removeliquiditysingletokenexactout) operation without executing it.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                                      |
| tokenOut           |  `IERC20`     | Token used to remove liquidity                                                                     |
| exactAmountOut     |  `uint256`    | ExactAmountOut Expected exact amount of tokens to receive                                          |
| userData           |  `bytes`      | userData Additional (optional) data required for the query                                         |
|                    |               |                                                                                                    |
| bptAmountIn        |   `uint256`   | bptAmountIn Expected amount of pool tokens to burn                                                 |

### queryRemoveLiquidityCustom
```solidity
function queryRemoveLiquidityCustom(
    address pool,
    uint256 maxBptAmountIn,
    uint256[] memory minAmountsOut,
    bytes memory userData
) external returns (uint256 bptAmountIn, uint256[] memory amountsOut, bytes memory returnData);
```

Queries a [`removeLiquidityCustom`](#removeliquiditycustom) operation without executing it.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool|
| maxBptAmountIn     |  `uint256`    | Maximum amount of pool tokens provided                                                             |
| minAmountsOut      |  `uint256[]`  | Expected minimum amounts of tokens to receive, sorted in token alphanumeric order                  |
| userData           |  `bytes`      | Additional (optional) data required for the query                                                  |
|                    |               |                                                                                                    |
| bptAmountIn        |  `uint256`    | Expected amount of pool tokens to burn                                                             |
| amountsOut         |  `uint256[]`  | Expected amounts of tokens to receive, sorted in token alphanumeric order                          |
| returnData         |  `bytes`      | Arbitrary (optional) data with encoded response from the pool                                      |

### querySwapSingleTokenExactIn
```solidity
function querySwapSingleTokenExactIn(
    address pool,
    IERC20 tokenIn,
    IERC20 tokenOut,
    uint256 exactAmountIn,
    bytes calldata userData
) external returns (uint256 amountOut);
```

Queries a [`swapSingleTokenExactIn`](#swapsingletokenexactin) operation without executing it.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                        |
| tokenIn            |  `IERC20`     | Token to be swapped from                                 |
| tokenOut           |  `IERC20`     | Token to be swapped to                                 |
| exactAmountIn      |  `uint256`    | Exact amounts of input tokens to send               
| userData           |  `bytes`      | Additional (optional) data required for the query     
|                    |               |                                                 |
| amountOut          |  `uint256`    | Calculated amount of output tokens to be received in exchange for the given input tokens|


### querySwapSingleTokenExactOut
```solidity
function querySwapSingleTokenExactOut(
    address pool,
    IERC20 tokenIn,
    IERC20 tokenOut,
    uint256 exactAmountOut,
    bytes calldata userData
) external returns (uint256 amountIn);
```

Queries a [`swapSingleTokenExactOut`](#swapsingletokenexactout) operation without executing it.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                                      |
| tokenIn            |  `IERC20`     | tokenIn Token to be swapped from                                                                   |
| tokenOut           |  `IERC20`     | tokenOut Token to be swapped to                                                                    |
| exactAmountOut     |  `uint256`    | exactAmountOut Exact amounts of input tokens to receive                                            |
| userData           |  `bytes`      | userData Additional (optional) data required for the query                                         |
|                    |               |                                                                                                    |
| amountIn           |  `uint256`    | amountIn Calculated amount of input tokens to be sent in exchange for the requested output tokens  |

### querySwapExactIn
```solidity
function querySwapExactIn(
    SwapPathExactAmountIn[] memory paths,
    bytes calldata userData
) external returns (uint256[] memory pathAmountsOut, address[] memory tokensOut, uint256[] memory amountsOut);
```

Queries a [`swapExactIn`](#swapexactin) operation without executing it.

| Name              | Type                     | Description                                                                         |
|-------------------|--------------------------|-------------------------------------------------------------------------------------|
| paths             | `SwapPathExactAmountIn[]`| Swap paths from token in to token out, specifying exact amounts in                  |
| userData          | `bytes`                  | Additional (optional) data required for the swap                                    |
|                   |                          |                                                                                     |
| pathAmountsOut    | `uint256[]`              | Calculated amounts of output tokens corresponding to the last step of each given path |
| tokensOut         | `address[]`              | Calculated output token addresses                                                   |
| amountsOut        | `uint256[]`              | Calculated amounts of output tokens, ordered by output token address                |

### querySwapExactOut
```solidity
function querySwapExactOut(
    SwapPathExactAmountOut[] memory paths,
    bytes calldata userData
) external returns (uint256[] memory pathAmountsIn, address[] memory tokensIn, uint256[] memory amountsIn);
```

Queries a [`swapExactOut`](#swapexactout) operation without executing it.

| Name              | Type                     | Description                                                                         |
|-------------------|--------------------------|-------------------------------------------------------------------------------------|
| paths             | `SwapPathExactAmountOut[]`| Swap paths from token in to token out, specifying exact amounts out                 |
| userData          | `bytes`                  | Additional (optional) data required for the swap                                    |
|                   |                          |                                                                                     |
| pathAmountsIn     | `uint256[]`              | Calculated amounts of input tokens corresponding to the last step of each given path |
| tokensIn          | `address[]`              | Calculated input token addresses                                                   |
| amountsIn         | `uint256[]`              | Calculated amounts of input tokens, ordered by input token address                 |