---
order: 2
title: Batch Router API
---

### BatchRouter ([IBatchRouter](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IBatchRouter.sol))

Enables multi-hop swaps across multiple pools and tokens. Each path can have multiple steps, and you can execute multiple paths in a single transaction.

#### Data Structures

```solidity
struct SwapPathStep {
    address pool;           // Pool to swap through
    IERC20 tokenOut;       // Token to receive from this step
    bool isBuffer;         // If true, use ERC4626 buffer instead of pool
}

struct SwapPathExactAmountIn {
    IERC20 tokenIn;                // Starting token
    SwapPathStep[] steps;          // Swap steps to execute
    uint256 exactAmountIn;         // Exact amount to send
    uint256 minAmountOut;          // Minimum amount to receive
}

struct SwapPathExactAmountOut {
    IERC20 tokenIn;                // Starting token
    SwapPathStep[] steps;          // Swap steps to execute
    uint256 maxAmountIn;           // Maximum amount to send
    uint256 exactAmountOut;        // Exact amount to receive
}
```

#### Multi-Hop Swap (Exact In)

```solidity
function swapExactIn(
    SwapPathExactAmountIn[] memory paths,
    uint256 deadline,
    bool wethIsEth,
    bytes calldata userData
) external payable returns (
    uint256[] memory pathAmountsOut,
    address[] memory tokensOut,
    uint256[] memory amountsOut
);
```

Executes multiple swap paths with exact input amounts. Each path is independent and can have multiple hops.

**Example:** Swap USDC → DAI → WETH in one path, and USDC → USDT → WETH in another path, all in one transaction.

**Returns:**
- `pathAmountsOut`: Output amount for each path
- `tokensOut`: All unique output tokens
- `amountsOut`: Total amount received for each output token

**Query equivalent:**
```solidity
function querySwapExactIn(
    SwapPathExactAmountIn[] memory paths,
    address sender,
    bytes calldata userData
) external returns (
    uint256[] memory pathAmountsOut,
    address[] memory tokensOut,
    uint256[] memory amountsOut
);
```

#### Multi-Hop Swap (Exact Out)

```solidity
function swapExactOut(
    SwapPathExactAmountOut[] memory paths,
    uint256 deadline,
    bool wethIsEth,
    bytes calldata userData
) external payable returns (
    uint256[] memory pathAmountsIn,
    address[] memory tokensIn,
    uint256[] memory amountsIn
);
```

Executes multiple swap paths with exact output amounts. You specify exactly how much you want to receive.

**Returns:**
- `pathAmountsIn`: Input amount for each path
- `tokensIn`: All unique input tokens
- `amountsIn`: Total amount sent for each input token

**Query equivalent:**
```solidity
function querySwapExactOut(
    SwapPathExactAmountOut[] memory paths,
    address sender,
    bytes calldata userData
) external returns (
    uint256[] memory pathAmountsIn,
    address[] memory tokensIn,
    uint256[] memory amountsIn
);
```

#### Use Cases

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