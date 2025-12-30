---
order: 5
title: Unbalanced Add Via Swap Router API
---

### UnbalancedAddViaSwapRouter ([IUnbalancedAddViaSwapRouter](https://github.com/balancer/balancer-v3-monorepo/blob/cdb5d86cf458362538ada1ba24ff33506c74ed94/pkg/interfaces/contracts/vault/IUnbalancedAddViaSwapRouter.sol))

Specialized router for adding unbalanced liquidity to two-token pools by combining a proportional add with a swap.

**Use Case:** You want to add liquidity with an exact amount of one token and an approximate amount of another, but regular unbalanced adds might be inefficient or unavailable.

#### Add Liquidity Unbalanced via Swap

```solidity
struct AddLiquidityAndSwapParams {
    uint256 exactBptAmountOut;      // Exact BPT to receive
    IERC20 exactToken;              // Token with exact amount
    uint256 exactAmount;            // Exact amount of exactToken
    uint256 maxAdjustableAmount;    // Max amount of other token
    bytes addLiquidityUserData;     // Data for add operation
    bytes swapUserData;             // Data for swap operation
}

function addLiquidityUnbalanced(
    address pool,
    uint256 deadline,
    bool wethIsEth,
    AddLiquidityAndSwapParams calldata params
) external payable returns (uint256[] memory amountsIn);
```

Adds liquidity to a two-token pool with one exact amount and one adjustable amount.

**How it works:**
1. Performs a proportional add with calculated amounts
2. Swaps the difference in the pool to achieve the exact desired amount
3. Results in exact `exactAmount` of `exactToken` and up to `maxAdjustableAmount` of the other token

**Parameters:**
- `exactBptAmountOut`: Exact amount of BPT to receive
- `exactToken`: Token that must have exactly `exactAmount` spent
- `exactAmount`: Exact amount of `exactToken` to use
- `maxAdjustableAmount`: Maximum amount of the other token to use

**Restrictions:**
- Only works with two-token pools
- Final `exactToken` amount must exactly match `exactAmount`
- Final other token amount must not exceed `maxAdjustableAmount`

**Query equivalent:**
```solidity
function queryAddLiquidityUnbalanced(
    address pool,
    address sender,
    AddLiquidityAndSwapParams calldata params
) external returns (uint256[] memory amountsIn);
```

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>
