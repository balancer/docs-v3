---
title: Transient accounting
order: 1
---

# Transient accounting

Transient accounting shifts the validation of accurate token accounting to the start and conclusion of a Vault interaction. This is achieved by initiating a transient state that monitors the debt and credit associated with the handler. This transient state guarantees the atomic execution of operations within it and confirms the proper settlement of all debt and credit at the end of the execution, prior to exiting the transient state.

Upon activation of the transient state, the handler contract is given permissions to certain Vault functions. This is managed by the Vault maintaining a list of handlers authorized to call these functions. The Vault then returns execution control back to the handler through a callback. The handler is now authorized to call:

- `wire`: Sends tokens from the Vault to a recipient.
- `settle`: Balances the changes for a token.
- `retrieve`: Collects tokens from a sender.
- `swap`: Exchanges one type of token for another.
- `addLiquidity`: Adds one or more tokens to a liquidity pool.
- `removeLiquidity`: Removes one or more tokens from a liquidity pool.

## Key concepts

### 1. Enabling transient state
The transient state is activated when the `transient` modifier is used during the invocation of the Vault. Initially, the current caller is added to the `_handlers` list. As the transient state is enabled, the Vault hands back control to the caller through a callback, which allows all the previously mentioned functions to be called. 

After the operations within the callback are completed, the transient state is expected to be closed. This means all `handlers`, except for the last one, are removed from the `_handlers` list. The final `handler` can only be removed if all the credit and debt accumulated to each individual handler during the callback execution is settled, which is indicated by `_nonzeroDeltaCount` being zero.

```solidity
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

### 2. Debt or credit tracking

All of the functions listed above either accrue debt (`_takeDebt`) or supply credit (`_supplyCredit`) as part of their implementation. The amount of debt taken or credit supplied is stored in an internal mapping of `_tokenDeltas`. 

```solidity
/**
 * @notice Represents the token due/owed to each handler.
 * @dev Must all net to zero when the last handler is released.
*/
mapping(address => mapping(IERC20 => int256)) internal _tokenDeltas;
```

Each time debt is taken or credit is supplied for a given token, the `_tokenDeltas` mapping is updated to the net changes. If the net changes for a token & handler combination zero out the internal `_nonzeroDeltaCount` is decremented whereas a non zero net change increments the `_nonzeroDeltaCount`. 

```solidity
function _accountDelta(IERC20 token, int256 delta, address handler) internal {
    // If the delta is zero, there's nothing to account for.
    if (delta == 0) return;

    // Ensure that the handler specified is indeed the caller.
    if (handler != msg.sender) {
        revert WrongHandler(handler, msg.sender);
    }

    // Get the current recorded delta for this token and handler.
    int256 current = _tokenDeltas[handler][token];

    // Calculate the new delta after accounting for the change.
    int256 next = current + delta;

    unchecked {
        // If the resultant delta becomes zero after this operation,
        // decrease the count of non-zero deltas.
        if (next == 0) {
            _nonzeroDeltaCount--;
        }
        // If there was no previous delta (i.e., it was zero) and now we have one,
        // increase the count of non-zero deltas.
        else if (current == 0) {
            _nonzeroDeltaCount++;
        }
    }

    // Update the delta for this token and handler.
    _tokenDeltas[handler][token] = next;
}
```
This transient accounting approach starts tracking token balances at the beginning of an operation (when opening a tab) and stops at the end (when closing the tab), providing full flexibility for any token amount changes in between. This eliminates the need for additional balance management elsewhere, allowing for a clear separation between token accounting and execution logic. Before closing the temporary state, the only requirement is to ensure that `_nonzeroDeltaCount` equals 0.