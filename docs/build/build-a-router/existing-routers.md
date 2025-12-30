---
order: 5
title: Existing Routers
---

# Balancer Routers

One of the major architectural changes from V2 to V3 is the introduction of Routers. In V2, the Vault was the "user interface" -- all swaps and liquidity operations were contract calls on the Vault itself. This design proved limiting when users, for instance, wanted to combine swaps and liquidity operations in a single call. Since the Vault is immutable, adding "new" operations required the use of relayers, or extensions to the already-complex pool design.

Furthermore, the Vault only exposed a few simple primitives (e.g., join, exit, batchSwap), requiring users to "encode" the details as non-human-readable userData.

In V3, these concerns are entirely separated. Users never call the Vault directly; instead, the user interface is implemented using Router contracts. There are several standard routers for different purposes, each of which exposes a clear and transparent set of functions. No computation is required; all can be used easily directly from Etherscan.

---

## Router Architecture Overview

### The Hooks Pattern

All V3 routers follow a "hooks" architecture. Each router implements hooks that are called by the Vault during operations. This pattern allows:

1. **Separation of concerns**: The Vault handles core protocol logic, while routers handle user interaction and token transfers
2. **Extensibility**: New routers can be created without modifying the Vault
3. **Composability**: Operations can be chained together within a single transaction
4. **Gas efficiency**: The Vault can batch operations and settle only net token transfers

When a user calls a router function (e.g., `addLiquidityUnbalanced`), the router:
1. Validates parameters and handles ETH wrapping if needed
2. Calls the Vault with operation parameters
3. The Vault calls back into the router's hook function
4. The router hook transfers tokens from the user to the Vault
5. The Vault validates (settles) the operation and returns results

### Query Functions

All routers provide query functions (prefixed with `query`) that simulate operations without executing them. These are useful for:
- Estimating amounts before executing transactions
- Building UIs that show expected results
- Testing operation parameters

Query functions use the same underlying logic as their execution counterparts, but don't transfer tokens or modify state. They can only be called in a static context.

---
## Standard Routers

### Router ([IRouter](https://github.com/balancer/balancer-v3-monorepo/blob/cdb5d86cf458362538ada1ba24ff33506c74ed94/pkg/interfaces/contracts/vault/IRouter.sol))
### BatchRouter ([IBatchRouter](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IBatchRouter.sol))
### CompositeLiquidityRouter ([ICompositeLiquidityRouter](https://github.com/balancer/balancer-v3-monorepo/blob/cdb5d86cf458362538ada1ba24ff33506c74ed94/pkg/interfaces/contracts/vault/ICompositeLiquidityRouter.sol))
### BufferRouter ([IBufferRouter](https://github.com/balancer/balancer-v3-monorepo/blob/cdb5d86cf458362538ada1ba24ff33506c74ed94/pkg/interfaces/contracts/vault/IBufferRouter.sol))
### UnbalancedAddViaSwapRouter ([IUnbalancedAddViaSwapRouter](https://github.com/balancer/balancer-v3-monorepo/blob/cdb5d86cf458362538ada1ba24ff33506c74ed94/pkg/interfaces/contracts/vault/IUnbalancedAddViaSwapRouter.sol))

## Special purpose Routers

### LBPMigrationRouter ([ILBPMigrationRouter](https://github.com/balancer/balancer-v3-monorepo/blob/cdb5d86cf458362538ada1ba24ff33506c74ed94/pkg/interfaces/contracts/pool-weighted/ILBPMigrationRouter.sol))

---

## Standard Routers

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

---

### BufferRouter ([IBufferRouter](https://github.com/balancer/balancer-v3-monorepo/blob/cdb5d86cf458362538ada1ba24ff33506c74ed94/pkg/interfaces/contracts/vault/IBufferRouter.sol))

Manages liquidity for internal ERC4626 buffers in the Vault. Buffers enable efficient wrapping/unwrapping of yield-bearing tokens by maintaining liquidity pools of both underlying and wrapped tokens.

#### Initialize Buffer

```solidity
function initializeBuffer(
    IERC4626 wrappedToken,
    uint256 exactAmountUnderlyingIn,
    uint256 exactAmountWrappedIn,
    uint256 minIssuedShares
) external returns (uint256 issuedShares);
```

Initializes a buffer for the first time. This binds the wrapped token to its underlying asset permanently.

**Important:** Always initialize buffers before creating or initializing pools that contain the wrapped tokens.

**Parameters:**
- `wrappedToken`: ERC4626 wrapped token address (e.g., waDAI)
- `exactAmountUnderlyingIn`: Amount of underlying token to deposit (e.g., DAI)
- `exactAmountWrappedIn`: Amount of wrapped token to deposit (e.g., waDAI)
- `minIssuedShares`: Minimum buffer shares to receive (in underlying decimals)

**Returns:** `issuedShares` - Buffer shares minted (denominated in underlying token decimals)

**Query equivalent:**
```solidity
function queryInitializeBuffer(
    IERC4626 wrappedToken,
    uint256 exactAmountUnderlyingIn,
    uint256 exactAmountWrappedIn
) external returns (uint256 issuedShares);
```

#### Add Liquidity to Buffer

```solidity
function addLiquidityToBuffer(
    IERC4626 wrappedToken,
    uint256 maxAmountUnderlyingIn,
    uint256 maxAmountWrappedIn,
    uint256 exactSharesToIssue
) external returns (
    uint256 amountUnderlyingIn,
    uint256 amountWrappedIn
);
```

Adds liquidity proportionally to an existing buffer.

**Note:** Buffer additions must be proportional (matching current buffer composition). For unbalanced additions, interact with the wrapper contract directly.

**Parameters:**
- `exactSharesToIssue`: Exact buffer shares to mint (in underlying decimals)

**Returns:**
- `amountUnderlyingIn`: Underlying tokens deposited
- `amountWrappedIn`: Wrapped tokens deposited

**Query equivalent:**
```solidity
function queryAddLiquidityToBuffer(
    IERC4626 wrappedToken,
    uint256 exactSharesToIssue
) external returns (
    uint256 amountUnderlyingIn,
    uint256 amountWrappedIn
);
```

#### Remove Liquidity from Buffer

```solidity
// Query only - no execution function for buffer removal
function queryRemoveLiquidityFromBuffer(
    IERC4626 wrappedToken,
    uint256 exactSharesToRemove
) external returns (
    uint256 removedUnderlyingBalanceOut,
    uint256 removedWrappedBalanceOut
);
```

Simulates removing liquidity from a buffer.

**Note:** The execution function `removeLiquidityFromBuffer` exists on the Vault, not the router.

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

---

### LBPMigrationRouter ([ILBPMigrationRouter](https://github.com/balancer/balancer-v3-monorepo/blob/cdb5d86cf458362538ada1ba24ff33506c74ed94/pkg/interfaces/contracts/pool-weighted/ILBPMigrationRouter.sol))

Specialized router for migrating liquidity from a Liquidity Bootstrapping Pool (LBP) to a new Weighted Pool with custom parameters. Note that migration is optional, and unsupported for some LBP types (e.g., FixedPrice).

**Use Case:** After an LBP concludes, the pool owner can migrate remaining liquidity to a standard weighted pool with the desired final weights and configuration.

#### Migrate Liquidity

```solidity
struct WeightedPoolParams {
    string name;
    string symbol;
    PoolRoleAccounts roleAccounts;     // Pool admin roles
    uint256 swapFeePercentage;
    address poolHooksContract;
    bool enableDonation;
    bool disableUnbalancedLiquidity;
    bytes32 salt;                      // For deterministic address
}

function migrateLiquidity(
    ILBPool lbp,
    address excessReceiver,
    WeightedPoolParams memory params
) external returns (
    IWeightedPool weightedPool,
    uint256[] memory exactAmountsIn,
    uint256 bptAmountOut
);
```

Migrates liquidity from an LBP to a newly created weighted pool.

**Requirements:**
- Caller must be the LBP owner
- LBP must have specified this router address on deployment

**Process:**
1. Validates caller is LBP owner
2. Creates new weighted pool with specified parameters
3. Exits all liquidity from the LBP
4. Initializes the new weighted pool with the exited tokens
5. Sends any excess tokens to `excessReceiver`
6. Returns new pool address and migration details

**Parameters:**
- `lbp`: Address of the Liquidity Bootstrapping Pool to migrate
- `excessReceiver`: Address to receive any excess tokens after migration
- `params`: Configuration for the new weighted pool

**Returns:**
- `weightedPool`: Address of the newly created weighted pool
- `exactAmountsIn`: Amounts used to initialize the new pool
- `bptAmountOut`: BPT received from the new pool

**Events:**
```solidity
event PoolMigrated(
    ILBPool indexed lbp,
    IWeightedPool weightedPool,
    uint256[] exactAmountsIn,
    uint256 bptAmountOut
);
```

**Query equivalent:**
```solidity
function queryMigrateLiquidity(
    ILBPool lbp,
    address sender,
    address excessReceiver,
    WeightedPoolParams memory params
) external returns (
    uint256[] memory exactAmountsIn,
    uint256 bptAmountOut
);
```

---

## Inheritance Diagram

![Balancer Routers](/images/router-diagram.png)

---

## Common Patterns

### ETH Handling

All routers support native ETH through the `wethIsEth` parameter:
- When `true`: Automatically wraps incoming ETH to WETH and unwraps outgoing WETH to ETH
- When `false`: Treats WETH as a regular ERC20 token

**Example:**
```solidity
// Add liquidity with ETH
router.addLiquidityUnbalanced{value: 1 ether}(
    pool,
    exactAmountsIn,
    minBptAmountOut,
    true, // wethIsEth = true, so ETH is automatically wrapped
    userData
);
```

### Slippage Protection

Most operations have min/max amount parameters for slippage protection:
- **Adding liquidity**: `minBptAmountOut` ensures you receive enough BPT
- **Removing liquidity**: `minAmountsOut` ensures you receive enough tokens
- **Swaps**: `minAmountOut` (exact in) or `maxAmountIn` (exact out) protects against unfavorable prices

### Deadlines

Swap operations include a `deadline` parameter to prevent transactions from executing at stale prices if they sit in the mempool too long.

### User Data

The `userData` parameter allows passing additional data to pools or hooks. Use cases:
- Custom pool logic requiring extra parameters
- Hook-specific configuration
- Protocol-specific metadata

Most operations can use empty bytes (`""`) for userData if not needed.

### Token Ordering

Token arrays must always be in **token registration order** (the order the pool registered them with the Vault). This is typically ascending by token address.

**Exception:** Nested pool operations allow arbitrary token ordering since the order is ambiguous across multiple pools.

---

## Router Selection Guide

| Use Case | Router | Key Functions |
|----------|--------|---------------|
| Basic swaps | `Router` | `swapSingleTokenExactIn`, `swapSingleTokenExactOut` |
| Add/remove liquidity (standard pools) | `Router` | `addLiquidityUnbalanced`, `removeLiquidityProportional` |
| Initialize new pool | `Router` | `initialize` |
| Multi-hop swaps | `BatchRouter` | `swapExactIn`, `swapExactOut` |
| ERC4626 pool operations | `CompositeLiquidityRouter` | `addLiquidityUnbalancedToERC4626Pool` |
| Nested pool operations | `CompositeLiquidityRouter` | `addLiquidityUnbalancedNestedPool` |
| Buffer management | `BufferRouter` | `initializeBuffer`, `addLiquidityToBuffer` |
| Two-token unbalanced add | `UnbalancedAddViaSwapRouter` | `addLiquidityUnbalanced` |
| LBP → Weighted Pool migration | `LBPMigrationRouter` | `migrateLiquidity` |

---

## Creating Custom Routers

The router architecture is designed to be extensible. To create a custom router:

1. **Inherit from RouterCommon**: Provides base functionality and utilities
2. **Implement RouterHooks**: Handle token transfers and Vault callbacks
3. **Add your custom functions**: Expose user-friendly interfaces for your specific use case
4. **Follow the hooks pattern**: Your functions should call the Vault, which calls back your hooks
5. **Handle ETH wrapping**: Use `_takeTokenIn` and `_sendTokenOut` utilities
6. **Implement query equivalents**: Allow users to simulate operations

### Example Custom Router Structure

```solidity
import { RouterCommon } from "./RouterCommon.sol";
import { RouterHooks } from "./RouterHooks.sol";

contract MyCustomRouter is RouterHooks {
    constructor(
        IVault vault,
        IWETH weth,
        IPermit2 permit2
    ) RouterHooks(vault, weth, permit2, "MyRouter v1.0") {}

    function myCustomOperation(
        address pool,
        // ... parameters
    ) external payable returns (/* ... return values */) {
        // 1. Validate parameters
        // 2. Call Vault (which calls back into hooks)
        // 3. Return results
    }

    function queryMyCustomOperation(
        address pool,
        address sender,
        // ... parameters
    ) external returns (/* ... return values */) {
        // Query version of operation
    }
}
```

See the [Create a Custom Router](./create-custom-router.md) guide for detailed instructions.

---

## Security Considerations

### Router Approvals

Routers require token approvals to transfer tokens on your behalf. Best practices:
- Only approve the specific router you're using
- Consider using Permit2 for more granular approval control
- Revoke unused approvals

### Query Safety

Query functions are read-only and safe to call, but:
- Results may change between query and execution due to other transactions
- Always use appropriate slippage protection
- Be aware of front-running risks on public mempools

### Hook Validation

The Vault validates that hooks are called correctly:
- Only the Vault can call hook functions (enforced by `onlyVault` modifier)
- Routers cannot bypass Vault security
- Hook execution is atomic with the main operation

---

## Additional Resources

- **Balancer V3 Vault Documentation**: Core protocol concepts
- **Router Implementation Examples**: See `balancer-v3-monorepo/pkg/vault/contracts/`
- **Router Tests**: See `balancer-v3-monorepo/pkg/vault/test/foundry/` for usage examples
- **SDK Integration**: The Balancer SDK wraps router calls for easier integration
