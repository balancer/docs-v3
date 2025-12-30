---
order: 3
title: Composite Liquidity Router API
---

### CompositeLiquidityRouter ([ICompositeLiquidityRouter](https://github.com/balancer/balancer-v3-monorepo/blob/cdb5d86cf458362538ada1ba24ff33506c74ed94/pkg/interfaces/contracts/vault/ICompositeLiquidityRouter.sol))

Specialized router for two complex scenarios:
1. **ERC4626 Pools**: Pools containing yield-bearing tokens (e.g., waDAI, waUSDC)
2. **Nested Pools**: Pools where one or more tokens are BPTs from other pools

#### ERC4626 Pool Operations

ERC4626 pools contain wrapped yield-bearing tokens. This router allows you to interact with them using only underlying tokens, automatically handling wrapping/unwrapping through Vault buffers.

##### Add Liquidity Unbalanced to ERC4626 Pool

```solidity
function addLiquidityUnbalancedToERC4626Pool(
    address pool,
    bool[] memory wrapUnderlying,
    uint256[] memory exactAmountsIn,
    uint256 minBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256 bptAmountOut);
```

Adds liquidity to an ERC4626 pool using underlying or wrapped tokens.

**Parameters:**
- `wrapUnderlying`: For each token, true = use underlying (e.g., DAI), false = use wrapped (e.g., waDAI)
- `exactAmountsIn`: Amounts of underlying/wrapped tokens sorted in registration order

**Example:** Add liquidity to a [waDAI, waUSDC] pool using only DAI and USDC. The router automatically:
1. Swaps DAI for waDAI through the Vault buffer
2. Swaps USDC for waUSDC through the Vault buffer  
3. Adds liquidity to the pool

**Query equivalent:**
```solidity
function queryAddLiquidityUnbalancedToERC4626Pool(
    address pool,
    bool[] memory wrapUnderlying,
    uint256[] memory exactAmountsIn,
    address sender,
    bytes memory userData
) external returns (uint256 bptAmountOut);
```

##### Add Liquidity Proportional to ERC4626 Pool

```solidity
function addLiquidityProportionalToERC4626Pool(
    address pool,
    bool[] memory wrapUnderlying,
    uint256[] memory maxAmountsIn,
    uint256 exactBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256[] memory amountsIn);
```

Adds liquidity proportionally to an ERC4626 pool using underlying or wrapped tokens.

**Query equivalent:**
```solidity
function queryAddLiquidityProportionalToERC4626Pool(
    address pool,
    bool[] memory wrapUnderlying,
    uint256 exactBptAmountOut,
    address sender,
    bytes memory userData
) external returns (uint256[] memory amountsIn);
```

##### Remove Liquidity Proportional from ERC4626 Pool

```solidity
function removeLiquidityProportionalFromERC4626Pool(
    address pool,
    bool[] memory unwrapWrapped,
    uint256 exactBptAmountIn,
    uint256[] memory minAmountsOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256[] memory amountsOut);
```

Removes liquidity from an ERC4626 pool, receiving underlying or wrapped tokens.

**Parameters:**
- `unwrapWrapped`: For each token, true = receive underlying, false = receive wrapped

**Query equivalent:**
```solidity
function queryRemoveLiquidityProportionalFromERC4626Pool(
    address pool,
    bool[] memory unwrapWrapped,
    uint256 exactBptAmountIn,
    address sender,
    bytes memory userData
) external returns (uint256[] memory amountsOut);
```

#### Nested Pool Operations

Nested pools contain BPTs from other pools as tokens. This router handles the complexity of traversing multiple pool levels.

**Important:** Pools with "overlapping" tokens (where both parent and child pools contain the same token) are not supported.

##### Add Liquidity Unbalanced to Nested Pool

```solidity
function addLiquidityUnbalancedNestedPool(
    address parentPool,
    address[] memory tokensIn,
    uint256[] memory exactAmountsIn,
    address[] memory tokensToWrap,
    uint256 minBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256 bptAmountOut);
```

Adds liquidity to a nested pool using only the leaf tokens (tokens from child pools).

**Parameters:**
- `parentPool`: The top-level pool address
- `tokensIn`: All tokens from child pools plus non-BPT parent tokens (arbitrary order)
- `exactAmountsIn`: Amounts for each token in `tokensIn` (same order)
- `tokensToWrap`: List of ERC4626 tokens to wrap during pool traversal

**Example:** 
- Parent pool: [BPT_A, BPT_B, USDC]
- Child pool A: [DAI, USDT]
- Child pool B: [WETH, WBTC]
- `tokensIn` could be: [DAI, USDT, WETH, WBTC, USDC]

The router:
1. Adds DAI and USDT to pool A to get BPT_A
2. Adds WETH and WBTC to pool B to get BPT_B
3. Adds BPT_A, BPT_B, and USDC to parent pool

**Query equivalent:**
```solidity
function queryAddLiquidityUnbalancedNestedPool(
    address parentPool,
    address[] memory tokensIn,
    uint256[] memory exactAmountsIn,
    address[] memory tokensToWrap,
    address sender,
    bytes memory userData
) external returns (uint256 bptAmountOut);
```

##### Remove Liquidity Proportional from Nested Pool

```solidity
function removeLiquidityProportionalNestedPool(
    address parentPool,
    uint256 exactBptAmountIn,
    address[] memory tokensOut,
    uint256[] memory minAmountsOut,
    address[] memory tokensToUnwrap,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256[] memory amountsOut);
```

Removes liquidity from a nested pool, receiving the leaf tokens.

**Parameters:**
- `tokensOut`: All leaf tokens to receive (arbitrary order)
- `tokensToUnwrap`: List of ERC4626 tokens to unwrap during pool traversal

The router automatically:
1. Exits the parent pool to get child BPTs
2. Exits each child pool to get leaf tokens
3. Unwraps ERC4626 tokens if requested

**Query equivalent:**
```solidity
function queryRemoveLiquidityProportionalNestedPool(
    address parentPool,
    uint256 exactBptAmountIn,
    address[] memory tokensOut,
    address[] memory tokensToUnwrap,
    address sender,
    bytes memory userData
) external returns (uint256[] memory amountsOut);
```

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>