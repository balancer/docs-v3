---
order: 5
title: Existing Routers
---

# Balancer Routers

One of the major architectural changes from V2 to V3 is the introduction of Routers. In V2, the Vault was the "user interface" -- all swaps and liquidity operations were contract calls on the Vault itself. This design proved limiting when users wanted to, for instance, combine swaps and liquidity operations in a single call. Since the Vault is immutable, adding "new" operations required the use of relayers, or extensions to the already-complex pool designs.

Furthermore, the Vault only exposed a few simple primitives (e.g., join, exit, batchSwap), requiring users to "encode" the details as non-human-readable userData.

In V3, these concerns are entirely separated. Users never call the Vault directly; instead, the user interface is implemented using Router contracts. There are several standard routers for different purposes, each of which exposes a clear and transparent set of functions. No computation is required; all can be used easily, directly from Etherscan.

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

---

## Inheritance Diagram

![Balancer Routers](/images/router-diagram.png)

---

## Common Patterns

### ETH Handling

Most routers support native ETH through the `wethIsEth` parameter:
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
| Nested pool operations | `CompositeLiquidityRouter` (V3+) | `addLiquidityUnbalancedNestedPool` |
| Buffer management | `BufferRouter` | `initializeBuffer`, `addLiquidityToBuffer` |
| Two-token unbalanced add | `UnbalancedAddViaSwapRouter` | `addLiquidityUnbalanced` |

---

## Creating Custom Routers

The router architecture is designed to be extensible. To create a custom router:

1. **Inherit from RouterCommon**: Provides base functionality and utilities
2. **Implement RouterHooks**: Handle token transfers and Vault callbacks
3. **Add your custom functions**: Expose user-friendly interfaces for your specific use case
4. **Follow the hooks pattern**: Your functions should call the Vault, which calls back your hooks
5. **Handle token transfers and ETH wrapping**: Use `_takeTokenIn` and `_sendTokenOut` utilities, and `wethIsEth`
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
- Routers configured for retail use Permit2 to transfer tokens
- Routers configured for programmatic use (i.e., "prepaid"), assume transfers are done externally (no transfers needed, so no approvals)
- Revoke unused approvals

### Query Safety

Query functions are read-only and safe to call, but:
- Results may change between query and execution due to other transactions
- Always use appropriate slippage protection for state-changing calls
- Be aware of front-running risks on public mempools

### Hook Validation

The Vault validates that hooks are called correctly:
- Only the Vault can call hook functions (enforced by the `onlyVault` modifier)
- Routers cannot bypass Vault security
- Hook execution is atomic with the main operation

---

## Additional Resources

- **Balancer V3 Vault Documentation**: Core protocol concepts
- **Router Implementation Examples**: See `balancer-v3-monorepo/pkg/vault/contracts/`
- **Router Tests**: See `balancer-v3-monorepo/pkg/vault/test/foundry/` for usage examples
- **SDK Integration**: The Balancer SDK wraps router calls for easier integration
