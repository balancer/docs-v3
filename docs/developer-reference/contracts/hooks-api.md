---
order: 7
title: Hooks API
---

# Hooks
Hooks have access to different data shared from the Vault. These allow a developer to build powerful execution logic when additionally utilizing the shared data.

### onBeforeInitialize
```solidity
/**
 * @notice Optional hook to be executed before pool initialization.
 * @param exactAmountsIn Exact amounts of input tokens
 * @param userData Optional, arbitrary data with the encoded request
 * @return success True if the pool wishes to proceed with initialization
 */
function onBeforeInitialize(uint256[] memory exactAmountsIn, bytes memory userData) external returns (bool success);
```

This function is an optional hook that is executed before pool initialization.

| Name                  | Type                  | Description   |
| --------------------- | --------------------- | ------------- |
| exactAmountsIn        | `uint256[]`           | Exact amounts of input tokens. |
| userData              | `bytes`               | Optional, arbitrary data with the encoded request. |
| success               | `bool`                | True if the pool wishes to proceed with initialization. |


### onAfterInitialize
```solidity
/**
 * @notice Optional hook to be executed after pool initialization.
 * @param exactAmountsIn Exact amounts of input tokens
 * @param bptAmountOut Amount of pool tokens minted during initialization
 * @param userData Optional, arbitrary data with the encoded request
 * @return success True if the pool wishes to proceed with initialization
 */
function onAfterInitialize(
    uint256[] memory exactAmountsIn,
    uint256 bptAmountOut,
    bytes memory userData
) external returns (bool success);
```

This function is an optional hook that is executed after pool initialization.

| Name                  | Type                  | Description   |
| --------------------- | --------------------- | ------------- |
| exactAmountsIn        | `uint256[]`           | Exact amounts of input tokens. |
| bptAmountOut          | `uint256`             | Amount of pool tokens minted during initialization. |
| userData              | `bytes`               | Optional, arbitrary data with the encoded request. |
| success               | `bool`                | True if the pool wishes to proceed with initialization. |

### onBeforeAddLiquidity

```solidity
/**
 * @notice Optional hook to be executed before adding liquidity.
 * @param sender Address of the sender
 * @param kind The type of add liquidity operation (e.g., proportional, custom)
 * @param maxAmountsInScaled18 Maximum amounts of input tokens
 * @param minBptAmountOut Minimum amount of output pool tokens
 * @param balancesScaled18 Current pool balances, in the same order as the tokens registered in the pool
 * @param userData Optional, arbitrary data with the encoded request
 * @return success True if the pool wishes to proceed with settlement
 */
function onBeforeAddLiquidity(
    address sender,
    AddLiquidityKind kind,
    uint256[] memory maxAmountsInScaled18,
    uint256 minBptAmountOut,
    uint256[] memory balancesScaled18,
    bytes memory userData
) external returns (bool success);
```

This function is an optional hook that is executed before adding liquidity.

| Name                  | Type                  | Description   |
| --------------------- | --------------------- | ------------- |
| sender                | `address`             | Address of the sender. |
| kind                  | `AddLiquidityKind`    | The type of add liquidity operation (e.g., proportional, custom). |
| maxAmountsInScaled18  | `uint256[]`           | Maximum amounts of input tokens. |
| minBptAmountOut       | `uint256`             | Minimum amount of output pool tokens. |
| balancesScaled18      | `uint256[]`           | Current pool balances, in the same order as the tokens registered in the pool. |
| userData              | `bytes`               | Optional, arbitrary data with the encoded request. |
| success               | `bool`                | True if the pool wishes to proceed with settlement. |

### onAfterAddLiquidity
```solidity
/**
 * @notice Optional hook to be executed after adding liquidity.
 * @param sender Address of the sender
 * @param amountsInScaled18 Actual amounts of tokens added, in the same order as the tokens registered in the pool
 * @param bptAmountOut Amount of pool tokens minted
 * @param balancesScaled18 Current pool balances, in the same order as the tokens registered in the pool
 * @param userData Additional (optional) data provided by the user
 * @return success True if the pool wishes to proceed with settlement
 */
function onAfterAddLiquidity(
    address sender,
    uint256[] memory amountsInScaled18,
    uint256 bptAmountOut,
    uint256[] memory balancesScaled18,
    bytes memory userData
) external returns (bool success);
```

This function is an optional hook that is executed after adding liquidity.

| Name                  | Type                  | Description   |
| --------------------- | --------------------- | ------------- |
| sender                | `address`             | Address of the sender. |
| amountsInScaled18     | `uint256[]`           | Actual amounts of tokens added, in the same order as the tokens registered in the pool. |
| bptAmountOut          | `uint256`             | Amount of pool tokens minted. |
| balancesScaled18      | `uint256[]`           | Current pool balances, in the same order as the tokens registered in the pool. |
| userData              | `bytes`               | Additional (optional) data provided by the user. |
| success               | `bool`                | True if the pool wishes to proceed with settlement. |


### onBeforeRemoveLiquidity

```solidity
/**
 * @notice Optional hook to be executed before removing liquidity.
 * @param sender Address of the sender
 * @param kind The type of remove liquidity operation (e.g., proportional, custom)
 * @param maxBptAmountIn Maximum amount of input pool tokens
 * @param minAmountsOutScaled18 Minimum output amounts, in the same order as the tokens registered in the pool
 * @param balancesScaled18 Current pool balances, in the same order as the tokens registered in the pool
 * @param userData Optional, arbitrary data with the encoded request
 * @return success True if the pool wishes to proceed with settlement
 */
function onBeforeRemoveLiquidity(
    address sender,
    RemoveLiquidityKind kind,
    uint256 maxBptAmountIn,
    uint256[] memory minAmountsOutScaled18,
    uint256[] memory balancesScaled18,
    bytes memory userData
) external returns (bool success);
```

This function is an optional hook that is executed before removing liquidity.

| Name                  | Type                  | Description   |
| --------------------- | --------------------- | ------------- |
| sender                | `address`             | Address of the sender. |
| kind                  | `RemoveLiquidityKind` | The type of remove liquidity operation (e.g., proportional, custom). |
| maxBptAmountIn        | `uint256`             | Maximum amount of input pool tokens. |
| minAmountsOutScaled18 | `uint256[]`           | Minimum output amounts, in the same order as the tokens registered in the pool. |
| balancesScaled18      | `uint256[]`           | Current pool balances, in the same order as the tokens registered in the pool. |
| userData              | `bytes`               | Optional, arbitrary data with the encoded request. |
| success               | `bool`                | True if the pool wishes to proceed with settlement. |

### onAfterRemoveLiquidity

```solidity
/**
 * @notice Optional hook to be executed after removing liquidity.
 * @param sender Address of the sender
 * @param bptAmountIn Amount of pool tokens to burn
 * @param amountsOutScaled18 Amount of tokens to receive, in the same order as the tokens registered in the pool
 * @param balancesScaled18 Current pool balances, in the same order as the tokens registered in the pool
 * @param userData Additional (optional) data provided by the user
 * @return success True if the pool wishes to proceed with settlement
 */
function onAfterRemoveLiquidity(
    address sender,
    uint256 bptAmountIn,
    uint256[] memory amountsOutScaled18,
    uint256[] memory balancesScaled18,
    bytes memory userData
) external returns (bool success);
```

This function is an optional hook that is executed after removing liquidity.

| Name                  | Type                  | Description   |
| --------------------- | --------------------- | ------------- |
| sender                | `address`             | Address of the sender. |
| bptAmountIn           | `uint256`             | Amount of pool tokens to burn. |
| amountsOutScaled18    | `uint256[]`           | Amount of tokens to receive, in the same order as the tokens registered in the pool. |
| balancesScaled18      | `uint256[]`           | Current pool balances, in the same order as the tokens registered in the pool. |
| userData              | `bytes`               | Additional (optional) data provided by the user. |
| success               | `bool`                | True if the pool wishes to proceed with settlement. |

### onBeforeSwap
```solidity
/**
 * @notice Called before a swap to give the Pool an opportunity to perform actions.
 *
 * @param params Swap parameters (see IBasePool.PoolSwapParams for struct definition)
 * @return success True if the pool wishes to proceed with settlement
 */
function onBeforeSwap(IBasePool.PoolSwapParams calldata params) external returns (bool success);
```

This function is called before a swap to give the Pool an opportunity to perform actions.

The `params` parameter is a struct of type `PoolSwapParams` defined as follows:

```solidity
/**
 * @dev Data for a swap operation.
 * @param kind Type of swap (exact in or exact out)
 * @param amountGivenScaled18 Amount given based on kind of the swap (e.g., tokenIn for exact in)
 * @param balancesScaled18 Current pool balances
 * @param indexIn Index of tokenIn
 * @param indexOut Index of tokenOut
 * @param sender Originator of the swap transaction
 * @param userData Additional (optional) data required for the swap
 */
struct PoolSwapParams {
    SwapKind kind;
    uint256 amountGivenScaled18;
    uint256[] balancesScaled18;
    uint256 indexIn;
    uint256 indexOut;
    address sender;
    bytes userData;
}
```

| Name                  | Type                  | Description   |
| --------------------- | --------------------- | ------------- |
| params                | `PoolSwapParams`      | Swap parameters. |
| success               | `bool`                | True if the pool wishes to proceed with settlement. |

### onAfterSwap

```solidity
/**
 * @notice Called after a swap to give the Pool an opportunity to perform actions.
 * once the balances have been updated by the swap.
 *
 * @param params Swap parameters (see above for struct definition)
 * @param amountCalculatedScaled18 Token amount calculated by the swap
 * @return success True if the pool wishes to proceed with settlement
 */
function onAfterSwap(
    AfterSwapParams calldata params,
    uint256 amountCalculatedScaled18
) external returns (bool success);
```

This function is called after a swap to give the Pool an opportunity to perform actions.

The `params` parameter is a struct of type `AfterSwapParams` defined as follows:

```solidity
/**
 * @dev Data for the hook after a swap operation.
 * @param kind Type of swap (exact in or exact out)
 * @param tokenIn Token to be swapped from
 * @param tokenOut Token to be swapped to
 * @param amountInScaled18 Amount of tokenIn (entering the Vault)
 * @param amountOutScaled18 Amount of tokenOut (leaving the Vault)
 * @param tokenInBalanceScaled18 Updated (after swap) balance of tokenIn
 * @param tokenOutBalanceScaled18 Updated (after swap) balance of tokenOut
 * @param sender Account originating the swap operation
 * @param userData Additional (optional) data required for the swap
 */
struct AfterSwapParams {
    SwapKind kind;
    IERC20 tokenIn;
    IERC20 tokenOut;
    uint256 amountInScaled18;
    uint256 amountOutScaled18;
    uint256 tokenInBalanceScaled18;
    uint256 tokenOutBalanceScaled18;
    address sender;
    bytes userData;
}
```

| Name                      | Type                  | Description   |
| ------------------------- | --------------------- | ------------- |
| params                    | `AfterSwapParams`     | Swap parameters. |
| amountCalculatedScaled18  | `uint256`             | Token amount calculated by the swap. |
| success                   | `bool`                | True if the pool wishes to proceed with settlement. |


### compute Fee

```solidity
/**
 * @notice Computes the fee for a swap operation.
 *
 * @param poolData Encapsulates the data required for the Vault to support a token of the given type.
 * @param vars Local variables used in the swap operation.
 * @return The computed fee for the swap operation.
 */
function computeFee(PoolData memory poolData, SwapLocals memory vars) external view returns (uint256);
```

This function computes the fee for a swap operation.

The `poolData` parameter is a struct of type `PoolData` defined as follows:

```solidity
struct PoolData {
    PoolConfig poolConfig;
    TokenConfig[] tokenConfig;
    uint256[] balancesRaw;
    uint256[] balancesLiveScaled18;
    uint256[] tokenRates;
    uint256[] decimalScalingFactors;
}
```

The `vars` parameter is a struct of type `SwapLocals` defined as follows:

```solidity
struct SwapLocals {
    uint256 indexIn;
    uint256 indexOut;
    uint256 amountGivenScaled18;
    uint256 amountCalculatedScaled18;
    uint256 swapFeeAmountScaled18;
    uint256 swapFeePercentage;
    uint256 protocolSwapFeeAmountRaw;
    uint256 creatorSwapFeeAmountRaw;
}
```

| Name      | Type          | Description   |
| --------- | ------------- | ------------- |
| poolData  | `PoolData`    | Encapsulates the data required for the Vault to support a token of the given type. |
| vars      | `SwapLocals`  | Local variables used in the swap operation. |