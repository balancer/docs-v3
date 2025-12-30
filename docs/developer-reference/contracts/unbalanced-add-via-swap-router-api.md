---
order: 5
title: Unbalanced Add Via Swap Router API
---

# Unbalanced Add Via Swap Router API

The Unbalanced Add Via Swap Router can be used to interact with Balancer onchain via state changing operations or used to query operations in an off-chain context.

Specialized router for adding unbalanced liquidity to two-token pools by combining a proportional add with a swap.

**Use Case:** You want to add liquidity with an exact amount of one token and an approximate amount of another, but regular unbalanced adds might be inefficient or unavailable.

## State-changing functions

### `addLiquidityUnbalanced`

```solidity
function addLiquidityUnbalanced(
    address pool,
    uint256 deadline,
    bool wethIsEth,
    AddLiquidityAndSwapParams calldata params
) external payable returns (uint256[] memory amountsIn);
```

Adds liquidity to a two-token pool with one exact amount and one adjustable amount by combining a proportional add with a swap in the same transaction.

**How it works:**
1. Performs a proportional add with calculated amounts
2. Swaps the difference in the pool to achieve the exact desired amount
3. Results in exact `exactAmount` of `exactToken` and up to `maxAdjustableAmount` of the other token

**Restrictions:**
- Only works with two-token pools
- Final `exactToken` amount must exactly match `exactAmount`
- Final other token amount must not exceed `maxAdjustableAmount`

**Parameters:**

| Name      | Type                       | Description                                                                      |
|-----------|----------------------------|----------------------------------------------------------------------------------|
| pool      | address                    | Address of the liquidity pool                                                    |
| deadline  | uint256                    | Timestamp after which the transaction will revert                                |
| wethIsEth | bool                       | If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH |
| params    | AddLiquidityAndSwapParams  | Parameters for the add liquidity and swap operation                              |

**Returns:**

| Name      | Type             | Description                                                                    |
|-----------|------------------|--------------------------------------------------------------------------------|
| amountsIn | uint256[] memory | Array of amounts in for each token added to the pool, sorted in token registration order |

## Queries

### `queryAddLiquidityUnbalanced`

```solidity
function queryAddLiquidityUnbalanced(
    address pool,
    address sender,
    AddLiquidityAndSwapParams calldata params
) external returns (uint256[] memory amountsIn);
```

Queries an `addUnbalancedLiquidityViaSwap` operation without actually executing it.

**Parameters:**

| Name   | Type                      | Description                                                                             |
|--------|---------------------------|-----------------------------------------------------------------------------------------|
| pool   | address                   | Address of the liquidity pool                                                           |
| sender | address                   | The sender passed to the operation. It can influence results (e.g., with user-dependent hooks) |
| params | AddLiquidityAndSwapParams | Parameters for the add liquidity and swap operation                                     |

**Returns:**

| Name      | Type             | Description                                                                    |
|-----------|------------------|--------------------------------------------------------------------------------|
| amountsIn | uint256[] memory | Array of amounts in for each token added to the pool, sorted in token registration order |

## Data Structures

### `AddLiquidityAndSwapParams`

```solidity
struct AddLiquidityAndSwapParams {
    uint256 exactBptAmountOut;      // Exact BPT to receive
    IERC20 exactToken;              // Token with exact amount
    uint256 exactAmount;            // Exact amount of exactToken
    uint256 maxAdjustableAmount;    // Max amount of other token
    bytes addLiquidityUserData;     // Data for add operation
    bytes swapUserData;             // Data for swap operation
}
```

Parameters for adding liquidity via a combination of proportional add and swap.

**Fields:**

| Name                | Type         | Description                                                     |
|---------------------|--------------|-----------------------------------------------------------------|
| exactBptAmountOut   | uint256      | Exact amount of BPT tokens to receive                           |
| exactToken          | IERC20       | Token that must have exactly `exactAmount` spent                |
| exactAmount         | uint256      | Exact amount of `exactToken` to use                             |
| maxAdjustableAmount | uint256      | Maximum amount of the other token to use                        |
| addLiquidityUserData | bytes       | Additional (optional) data for the add liquidity operation      |
| swapUserData        | bytes        | Additional (optional) data for the swap operation               |

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>
