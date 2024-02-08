---
order: 0
title: Overview
---
# Router
The v3 Router is the entrypoint for user operations. It exposes the Vault's primitives and allows query operations. Clearer function naming and less function inputs compared to the Vault allow to better match a user intend and respective Router call.

## Liquidity operations
Liquidity operations are transactions that change pool balances.

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

Once a deployed pool contract has been registered in the Vault, it can have liquidity added to it. The first liquidity addition is done by pool initialization. Afterwards the pools initialization state is changed to `true` in the `PoolConfig.isPoolInitialized`. Pool initialization mints BPT in exchange for tokens.

| Name          | Type          | Description   |
| ------------- | ------------- | ------------  |
| pool          |  `address`    | Address of the liquidity pool|
| tokens        |  `IERC20[]`   | Pool tokens                                                                                      |
| exactAmountsIn|  `uint256[]`  | Exact amounts of tokens to be added, sorted in token registration order                          |
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

The most flexible way to add tokens to a liquidity pool. An unbalanced add liquidity allows arbitrary token amounts to be added to a pool. Depending on the ratio of tokens in the pool and tokens to be added this operation can cause price impact. To avoid price impact, add liquidity according to the pools token balance ratio. The Vault should already have approved allowances for at least `exactAmountsIn` for the pools tokens.

| Name          | Type          | Description   |
| ------------- | ------------- | ------------  |
| pool          |  `address`    | Address of the liquidity pool                                                                 |
| exactAmountsIn|  `uint256[]`  | Exact amounts of tokens to be added, sorted in token registration order                       |
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

Adding Liquidity to a pool with one single token receiving an exact amount of BPT out. This operation causes price impact. The Vault should already have approved allowances for at least `maxAmountIn` for `tokenIn`.

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
    uint256[] memory amountsInScaled18,
    uint256 minBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256[] memory amountsIn, uint256 bptAmountOut, bytes memory returnData);
```

This type of adding liquidity is possible if the `pool` has implemented [`onAddLiquidityCustom`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IPoolLiquidity.sol#L22-L28). It can be used for [custom built AMMs](/concepts/pools/custom-pools/create-custom-amm-with-novel-invariant.md). Compared to `addLiquidityUnbalanced` the amount of input tokens is flexible to allow custom pool implementations and the actual `amountsIn` are returned additionally. The custom request usually is encoded as part of the `userData`. 

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                                 |
| amountsInScaled18  |  `uint256[]`  | Amounts of tokens to be added, sorted in token registration order and scaled to 18 decimals   |
| minBptAmountOut    |  `uint256`    | Minimum amount of pool tokens to be received                                                  |
| wethIsEth          |  `bool`       | If true, incoming ETH will be wrapped to WETH; otherwise the Vault will pull WETH tokens      |
| userData           |  `bytes`      | Additional (optional) data required for adding liquidity                                      |
|                    |               |                                                                                               |
| amountsIn          |  `uint256[]`  | Actual amounts of tokens added, sorted in token registration order                            |
| bptAmountOut       |  `uint256`    | Actual amount of pool tokens received                                                         |
| returnData         |  `bytes`      | Arbitrary (optional) data with encoded response from the pool                                 |

::: info What does Scaled18 mean?
Internally, Balancer protocol scales all tokens to 18 decimals to minimize the potential for errors that can occur when
comparing tokens with different decimals numbers (ie: WETH/USDC). `Scaled18` is a suffix used to signify values has already been scaled.
**By default, ALL values provided to the pool will always be `Scaled18`.** Refer to [Decimal scaling](/concepts/vault/decimalscaling.html) for more information.
:::

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

This remove liquidity operation removes tokens from the pool in proportional amounts without causing price impact as `amountsOut` ratio received will be in the same pool token balances proportions. The Vault should already have approved allowances for at least `exactBptAmountIn` for `pool`.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                                |
| exactBptAmountIn   |  `uint256`    | Exact amount of pool tokens provided                                                         |
| minAmountsOut      |  `uint256[]`  | Minimum amounts of tokens to be received, sorted in token registration order                 |
| wethIsEth          |  `bool`       | If true, outgoing WETH will be unwrapped to ETH; otherwise the Vault will send WETH tokens   |
| userData           |  `bytes`      | Additional (optional) data required for removing liquidity                                   |
|                    |               |                                                                                              |
| amountsOut         |  `uint256[]`  | Actual amounts of tokens received, sorted in token registration order                        |

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

This remove liquidity operation removes liquidity from a pool by getting a single token out. An exact `exactBptAmountIn` of pool token is burned. This operation causes price impact due to pool token balance ratios changing. The Vault should already have approved allowances for at least `exactBptAmountIn` for `pool`.

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

Removes liquidity from a pool via a single token, specifying the exact amount of tokens to receive. This operation causes price impact due to pool token balance ratios changing. The Vault should already have approved allowances for at least `maxBptAmountIn` for `pool`.

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

This type of removing liquidity is possible if the `pool` has implemented [`onRemoveLiquidityCustom`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IPoolLiquidity.sol#L41-L47). It can be used for [custom built AMMs](/concepts/pools/custom-pools/create-custom-amm-with-novel-invariant.md). The custom request usually is encoded as part of the `userData`. The Vault should already have approved allowances for at least `bptAmountIn` for `pool`.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                               |
| maxBptAmountIn     |  `uint256`    | Maximum amount of pool tokens provided                                                      |
| minAmountsOut      |  `uint256[]`  | Minimum amounts of tokens to be received, sorted in token registration order                |
| wethIsEth          |  `bool`       | If true, outgoing WETH will be unwrapped to ETH; otherwise the Vault will send WETH tokens  |
| userData           |  `bytes`      | Additional (optional) data required for removing liquidity                                  |
|                    |               |                                                                                             |
| bptAmountIn        |  `uint256`    | Actual amount of pool tokens burned                                                         |
| amountsOut         |  `uint256[]`  | Actual amounts of tokens received, sorted in token registration order                       |
| userData           |  `bytes`      | Arbitrary (optional) data with encoded response from the pool                               |

### swapExactIn
```solidity
function swapExactIn(
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

Swap `exactAmountIn` of `tokenIn` for as much as possible amount of `tokenOut` with a given liquidity `pool`. The Vault should already have approved allowances for at least `exactAmountIn` for `tokenIn`.

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


### swapExactOut
```solidity
function swapExactOut(
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

Swap the least amount of `tokenIn` for an `exactAmountOut` of `tokenOut`. The Vault should already have approved allowances for at least `amountIn` for `tokenIn`. 

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


## Query operations
Query operations allow simulation of various operations on Balancer. The queries are expected to be used in an offchain and done by an `eth_call`. 

### queryAddLiquidityUnbalanced
```solidity
function queryAddLiquidityUnbalanced(
    address pool,
    uint256[] memory exactAmountsIn,
    uint256 minBptAmountOut,
    bytes memory userData
) external returns (uint256 bptAmountOut);
```

Queries an `addLiquidityUnbalanced` operation without actually executing it.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                                 |
| exactAmountsIn     |  `uint256[]`  | Exact amounts of tokens to be added, sorted in token registration order                       |
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

Queries an `addLiquiditySingleTokenExactOut` operation without actually executing it.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool|
| tokenIn            |  `IERC20`     | Exact amounts of tokens to be added, sorted in token registration order |
| maxAmountIn        |  `uint256`    | Expected minimum amount of pool tokens to receive                       |
| exactBptAmountOut  |  `uint256`    | Additional (optional) data required for the query                       |
| userData           |  `bytes`      |                                                                         |
|                    |               |                                                                         |
| amountIn           |  `uint256`    | Expected amount of pool tokens to receive                               | 

### queryAddLiquidityCustom
```solidity
function queryAddLiquidityCustom(
    address pool,
    uint256[] memory amountsInScaled18,
    uint256 minBptAmountOut,
    bytes memory userData
) external returns (uint256[] memory amountsIn, uint256 bptAmountOut, bytes memory returnData);
```

Queries adding liquidity to a pool with a custom request.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool|
| amountsInScaled18  |  `uint256[]`  | Upscaled Amounts of tokens to be added, sorted in token registration order |
| minBptAmountOut    |  `uint256`    | Expected minimum amount of pool tokens to receive                          |
| userData           |  `bytes`      | Additional (optional) data required for the query                          |
|                    |               |                                                                            |
| amountsIn          |  `uint256[]`  | Expected amounts of tokens to add, sorted in token registration order      | 
| bptAmountOut       |  `uint256`    | Expected amount of pool tokens to receive                                  | 
| returnData         |  `bytes`      | Arbitrary (optional) data with encoded response from the pool              |

### queryRemoveLiquidityProportional
```solidity
function queryRemoveLiquidityProportional(
    address pool,
    uint256 exactBptAmountIn,
    uint256[] memory minAmountsOut,
    bytes memory userData
) external returns (uint256[] memory amountsOut);
```

Queries `removeLiquidityProportional` operation without actually executing it.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                                       |
| exactBptAmountIn   |  `uint256`    | Exact amount of pool tokens provided for the query                                                  |
| minAmountsOut      |  `uint256[]`  | Expected minimum amounts of tokens to receive, sorted in token registration order                   |
| userData           |  `bytes`      | Additional (optional) data required for the query                                                   |
|                    |               |                                                                                                     |
| amountsOut         |  `uint256[]`  | Expected amounts of tokens to receive, sorted in token registration order                           |

### queryRemoveLiquiditySingleTokenExactIn
```solidity
function queryRemoveLiquiditySingleTokenExactIn(
    address pool,
    uint256 exactBptAmountIn,
    IERC20 tokenOut,
    uint256 minAmountOut,
    bytes memory userData
) external returns (uint256 amountOut);
```

Queries `removeLiquiditySingleTokenExactIn` operation without actually executing it.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                                      |
| exactBptAmountIn   |  `uint256`    | Exact amount of pool tokens provided for the query                                                 |
| tokenOut           |  `IERC20`     | Token used to remove liquidity                                                                     |
| minAmountOut       |  `uint256`    | Expected minimum amount of tokens to receive                                                       |
| userData           |  `bytes`      | Additional (optional) data required for the query                                                  |
|                    |               |                                                                                                    |
| amountOut          |  `uint256`    | Expected amount of tokens to receive                                                               |

### queryRemoveLiquiditySingleTokenExactOut
```solidity
function queryRemoveLiquiditySingleTokenExactOut(
    address pool,
    uint256 maxBptAmountIn,
    IERC20 tokenOut,
    uint256 exactAmountOut,
    bytes memory userData
) external returns (uint256 bptAmountIn);
```

Queries `removeLiquiditySingleTokenExactOut` operation without actually executing it.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                                      |
| maxBptAmountIn     |  `uint256`    | Maximum amount of pool tokens provided                                                             |
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

Queries `removeLiquidityCustom` operation without actually executing it.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool|
| maxBptAmountIn     |  `uint256`    | Maximum amount of pool tokens provided                                                             |
| minAmountsOut      |  `uint256[]`  | Expected minimum amounts of tokens to receive, sorted in token registration order                  |
| userData           |  `bytes`      | Additional (optional) data required for the query                                                  |
|                    |               |                                                                                                    |
| bptAmountIn        |  `uint256`    | Expected amount of pool tokens to burn                                                             |
| amountsOut         |  `uint256[]`  | Expected amounts of tokens to receive, sorted in token registration order                          |
| returnData         |  `bytes`      | Arbitrary (optional) data with encoded response from the pool                                      |

### querySwapExactIn
```solidity
function querySwapExactIn(
    address pool,
    IERC20 tokenIn,
    IERC20 tokenOut,
    uint256 exactAmountIn,
    bytes calldata userData
) external returns (uint256 amountOut);
```

Queries a swap operation specifying an exact input token amount without actually executing it.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                                      |
| tokenIn            |  `IERC20`     | Token to be swapped from                                                                           |
| tokenOut           |  `IERC20`     | Token to be swapped to                                                                             |
| exactAmountIn      |  `uint256`    | Exact amounts of input tokens to send                                                              |
| userData           |  `bytes`      | Additional (optional) data required for the query                                                  |
|                    |               |                                                                                                    |
|                    |               | Calculated amount of output tokens to be received in exchange for the given input tokens           |


### querySwapExactOut
```solidity
function querySwapExactOut(
    address pool,
    IERC20 tokenIn,
    IERC20 tokenOut,
    uint256 exactAmountOut,
    bytes calldata userData
) external returns (uint256 amountIn);
```

Queries a swap operation specifying an exact output token amount without actually executing it.

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool                                                                      |
| tokenIn            |  `IERC20`     | tokenIn Token to be swapped from                                                                   |
| tokenOut           |  `IERC20`     | tokenOut Token to be swapped to                                                                    |
| exactAmountOut     |  `uint256`    | exactAmountOut Exact amounts of input tokens to receive                                            |
| userData           |  `bytes`      | userData Additional (optional) data required for the query                                         |
|                    |               |                                                                                                    |
| amountIn           |               | amountIn Calculated amount of input tokens to be sent in exchange for the requested output tokens  |











| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool               |  `address`    | Address of the liquidity pool|
|                    |               |                              |
|                    |               |                              |
|                    |               |                              |
|                    |               |                              |
|                    |               |                              |
|                    |               |                              |
|                    |               |                              |
|                    |               |                              |
|                    |               |                              |
|                    |               |                              |