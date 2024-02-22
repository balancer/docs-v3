---
title: Transient accounting
order: 7
---

# Transient accounting
When a Router invokes the Vault, the transaction is wrapped within a vault context to verify correct token accounting. This call opens a transient state. Every operation that modifies internal accounting is registered in transient accounting, accruing either debt or credit to the caller. Any contract invoking the Vault is registered as a `handler` and pushed to an internal list of current handlers. When a transient state is about to be closed, the current `handler` is removed from the internal list. If the current `handler` is the only one remaining the Vault checks that no credit or debt is outstanding on any of the used `handlers`. Once the transient state has been opened, the following operations are possible on the Vault.

- `wire` (sends tokens from the Vault to a recipient)
- `settle` (settles deltas for a token)
- `retrieve` (Retrieves tokens from a sender)
- `swap` (swaps tokenA for TokenB)
- `addLiquidity` (adds token/tokens to a liquidity pool)
- `removeLiquidity` (remove token/tokens from a liquidity pool)

## Key concepts

### 1. Enabling transient state
The transient state is enabled when the `transient` modifier is executed as part of the Vault being invoked. First the current caller is pushed to the `_handlers` list. Next as part of the transient state being enabled, the Vault passes execution back to the caller as part of a callback allowing all functions above to be called. Once the operations which are part of the callback are finished, the transient state is to be netted out meaning all `handlers` except the last one are removed the `_handlers` list. The last `handler` can only be cleared if all credit & debt accrued as part of the callback execution is cleared meaning `_nonzeroDeltaCount` must be zero.
```
modifier transient() {
    // Add the current handler to the list
    _handlers.push(msg.sender);

    // The caller does everything here and has to settle all outstanding balances
    _;

    // Check if it's the last handler
    if (_handlers.length == 1) {
        // Ensure all balances are settled
        if (_nonzeroDeltaCount != 0) revert BalanceNotSettled();

        // Reset the handlers list
        delete _handlers;

        // Reset the counter
        delete _nonzeroDeltaCount;
    } else {
        // If it's not the last handler, simply remove it from the list
        _handlers.pop();
    }
}
```

### 2. Accruing debt or credit
