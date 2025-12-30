---
order: 1
title: Router API
---

### Router ([IRouter](https://github.com/balancer/balancer-v3-monorepo/blob/cdb5d86cf458362538ada1ba24ff33506c74ed94/pkg/interfaces/contracts/vault/IRouter.sol))

The main router providing user-friendly interfaces for basic Vault operations: initialization, adding/removing liquidity, and single-pool swaps.

#### Pool Initialization

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

Initializes a new liquidity pool with exact token amounts. This is the first liquidity operation that must be performed on any pool. V3 pools have a separate initialization step, which changes pool metadata in the Vault to guarantee that it is only done once. This eliminates any attacks based on 're-initialization' of pools.

**Parameters:**
- `pool`: Address of the liquidity pool to initialize
- `tokens`: Pool tokens in token registration order
- `exactAmountsIn`: Exact amounts of tokens to deposit
- `minBptAmountOut`: Minimum BPT tokens to receive (slippage protection)
- `wethIsEth`: If true, automatically wraps/unwraps ETH ↔ WETH
- `userData`: Additional optional data passed to the pool

**Returns:** `bptAmountOut` - Actual amount of pool tokens minted

#### Add Liquidity Operations

##### Proportional Add

```solidity
function addLiquidityProportional(
    address pool,
    uint256[] memory maxAmountsIn,
    uint256 exactBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256[] memory amountsIn);
```

Adds liquidity proportionally to receive an exact amount of BPT. The ratio of tokens added matches the current pool composition.

**Query equivalent:**
```solidity
function queryAddLiquidityProportional(
    address pool,
    uint256 exactBptAmountOut,
    address sender,
    bytes memory userData
) external returns (uint256[] memory amountsIn);
```

##### Unbalanced Add

```solidity
function addLiquidityUnbalanced(
    address pool,
    uint256[] memory exactAmountsIn,
    uint256 minBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256 bptAmountOut);
```

Adds liquidity with arbitrary token amounts (not necessarily proportional). The pool calculates the appropriate BPT to mint.

**Query equivalent:**
```solidity
function queryAddLiquidityUnbalanced(
    address pool,
    uint256[] memory exactAmountsIn,
    address sender,
    bytes memory userData
) external returns (uint256 bptAmountOut);
```

##### Single Token Add (Exact Out)

```solidity
function addLiquiditySingleTokenExactOut(
    address pool,
    IERC20 tokenIn,
    uint256 maxAmountIn,
    uint256 exactBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256 amountIn);
```

Adds liquidity using only one token to receive an exact amount of BPT. Useful for adding liquidity when you only have one of the pool's tokens.

**Query equivalent:**
```solidity
function queryAddLiquiditySingleTokenExactOut(
    address pool,
    IERC20 tokenIn,
    uint256 exactBptAmountOut,
    address sender,
    bytes memory userData
) external returns (uint256 amountIn);
```

##### Donation

```solidity
function donate(
    address pool,
    uint256[] memory amountsIn,
    bool wethIsEth,
    bytes memory userData
) external payable;
```

Donates tokens to a pool without receiving BPT. This increases the value of existing BPT tokens. The pool must have the `enableDonation` flag set to true.

##### Custom Add

```solidity
function addLiquidityCustom(
    address pool,
    uint256[] memory maxAmountsIn,
    uint256 minBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (
    uint256[] memory amountsIn,
    uint256 bptAmountOut,
    bytes memory returnData
);
```

Adds liquidity with a custom operation defined by the pool. The interpretation of max/min amounts depends on the pool type and userData.

**Query equivalent:**
```solidity
function queryAddLiquidityCustom(
    address pool,
    uint256[] memory maxAmountsIn,
    uint256 minBptAmountOut,
    address sender,
    bytes memory userData
) external returns (
    uint256[] memory amountsIn,
    uint256 bptAmountOut,
    bytes memory returnData
);
```

#### Remove Liquidity Operations

##### Proportional Remove

```solidity
function removeLiquidityProportional(
    address pool,
    uint256 exactBptAmountIn,
    uint256[] memory minAmountsOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256[] memory amountsOut);
```

Removes liquidity proportionally by burning an exact amount of BPT. Receives all pool tokens in proportion to current pool composition.

**Query equivalent:**
```solidity
function queryRemoveLiquidityProportional(
    address pool,
    uint256 exactBptAmountIn,
    address sender,
    bytes memory userData
) external returns (uint256[] memory amountsOut);
```

##### Single Token Remove (Exact In)

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

Burns an exact amount of BPT to receive a single token. Useful for exiting positions into one specific token.

**Query equivalent:**
```solidity
function queryRemoveLiquiditySingleTokenExactIn(
    address pool,
    uint256 exactBptAmountIn,
    IERC20 tokenOut,
    address sender,
    bytes memory userData
) external returns (uint256 amountOut);
```

##### Single Token Remove (Exact Out)

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

Burns BPT to receive an exact amount of a single token. You specify how much of the output token you want.

**Query equivalent:**
```solidity
function queryRemoveLiquiditySingleTokenExactOut(
    address pool,
    IERC20 tokenOut,
    uint256 exactAmountOut,
    address sender,
    bytes memory userData
) external returns (uint256 bptAmountIn);
```

##### Custom Remove

```solidity
function removeLiquidityCustom(
    address pool,
    uint256 maxBptAmountIn,
    uint256[] memory minAmountsOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (
    uint256 bptAmountIn,
    uint256[] memory amountsOut,
    bytes memory returnData
);
```

Removes liquidity with a custom operation defined by the pool.

**Query equivalent:**
```solidity
function queryRemoveLiquidityCustom(
    address pool,
    uint256 maxBptAmountIn,
    uint256[] memory minAmountsOut,
    address sender,
    bytes memory userData
) external returns (
    uint256 bptAmountIn,
    uint256[] memory amountsOut,
    bytes memory returnData
);
```

##### Recovery Mode Remove

```solidity
function removeLiquidityRecovery(
    address pool,
    uint256 exactBptAmountIn,
    uint256[] memory minAmountsOut
) external payable returns (uint256[] memory amountsOut);
```

Emergency exit function available only when a pool is in Recovery Mode. Allows proportional exits even if the pool is in a bad state.

**Query equivalent:**
```solidity
function queryRemoveLiquidityRecovery(
    address pool,
    uint256 exactBptAmountIn
) external returns (uint256[] memory amountsOut);
```

#### Swap Operations

##### Swap Exact In

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
) external payable returns (uint256 amountOut);
```

Swaps an exact amount of one token for another within a single pool. You specify the input amount.

**Parameters:**
- `deadline`: Timestamp after which the transaction will revert (prevents transactions from executing at unfavorable prices if they sit in the mempool too long)

**Query equivalent:**
```solidity
function querySwapSingleTokenExactIn(
    address pool,
    IERC20 tokenIn,
    IERC20 tokenOut,
    uint256 exactAmountIn,
    address sender,
    bytes calldata userData
) external returns (uint256 amountOut);
```

##### Swap Exact Out

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

Swaps tokens to receive an exact amount of the output token. You specify the output amount you want.

**Query equivalent:**
```solidity
function querySwapSingleTokenExactOut(
    address pool,
    IERC20 tokenIn,
    IERC20 tokenOut,
    uint256 exactAmountOut,
    address sender,
    bytes calldata userData
) external returns (uint256 amountIn);
```

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>