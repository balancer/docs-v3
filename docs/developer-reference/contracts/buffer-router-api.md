---
order: 4
title: Buffer Router API
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

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>
