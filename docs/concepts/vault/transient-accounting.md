---
title: Transient accounting
order: 1
---

# Transient accounting

Transient accounting shifts the validation of accurate token accounting to the start and conclusion of a Vault interaction. This is achieved by initiating a transient state that monitors the debt and credit created during vault interactions. This transient state guarantees the atomic execution of operations within it and confirms the proper settlement of all debt and credit at the end of the execution, prior to exiting the transient state.

Upon activation of the transient state, the vault is unlocked and permissions to certain Vault functions are opened up. The Vault then returns execution control back to the Router through a hook. Anyone is now authorized to call:

- `sendTo`: Sends tokens from the Vault to a recipient.
- `settle`: Balances the changes for a token.
- `takeFrom`: Collects tokens from a sender.
- `swap`: Exchanges one type of token for another.
- `addLiquidity`: Adds one or more tokens to a liquidity pool.
- `removeLiquidity`: Removes one or more tokens from a liquidity pool.
- `erc4626BufferWrapOrUnwrap`: Wraps/unwraps tokens based on provided parameters.
- `initializeBuffer`: Initializes an ERC4626 buffer. This sets the underlying asset token, and is necessary to enable use of the buffer.
- `addLiquidityToBuffer`: Adds liquidity to an ERC4626 buffer.
- `removeLiquidityFromBuffer`: Removes liquidity from an ERC4626 buffer.
- `initialize`: Initialize a liquidity pool.
- `removeLiquidityRecovery`: Removes liquidity proportionally, burning an exact pool token amount (only in Recovery Mode).

## Key concepts

### 1. Enabling transient state
The transient state is activated when the `transient` modifier is used during the unlocking of the Vault. As the transient state is enabled, the Vault hands back control to the caller through a hook, which allows all the previously mentioned functions to be called. 

After the operations within the hook are completed, the transient state is expected to be closed. The transaction can only succeed if all the credit and debt accumulated during the hook execution is settled, which is indicated by `_nonZeroDeltaCount()` being zero.

```solidity
modifier transient() {
    bool isUnlockedBefore = _isUnlocked().tload();

    if (isUnlockedBefore == false) {
        _isUnlocked().tstore(true);
    }

    // The caller does everything here and has to settle all outstanding balances
    _;

    if (isUnlockedBefore == false) {
        if (_nonZeroDeltaCount().tload() != 0) {
            revert BalanceNotSettled();
        }

        _isUnlocked().tstore(false);
    }
}
```

### 2. Debt or credit tracking

The majority of functions listed above either accrue debt (`_takeDebt`) or supply credit (`_supplyCredit`) as part of their implementation. The amount of debt taken or credit supplied is stored in an internal `TokenDeltaMappingSlotType` type. 

```solidity
/**
 * @notice Retrieves the token delta for a specific token.
 * @dev This function allows reading the value from the `_tokenDeltas` mapping.
 * @param token The token for which the delta is being fetched
 * @return The delta of the specified token
 */
function getTokenDelta(IERC20 token) external view returns (int256);
```

Each time debt is taken or credit is supplied for a given token, the token delta is updated to reflect the net change. If the net change for a token zero out, the internal `_nonZeroDeltaCount()` is decremented; a non-zero net change increments the `_nonZeroDeltaCount()`. 

```solidity
function _accountDelta(IERC20 token, int256 delta) internal {
    // If the delta is zero, there's nothing to account for.
    if (delta == 0) return;

    // Get the current recorded delta for this token.
    int256 current = _tokenDeltas().tGet(token);

    // Calculate the new delta after accounting for the change.
    int256 next = current + delta;

    // If the resultant delta becomes zero after this operation,
    // decrease the count of non-zero deltas.
    if (next == 0) {
        _nonZeroDeltaCount().tDecrement();
    }
    // If there was no previous delta (i.e., it was zero) and now we have one,
    // increase the count of non-zero deltas.
    else if (current == 0) {
        _nonZeroDeltaCount().tIncrement();
    }

    // Update the delta for this token.
    _tokenDeltas().tSet(token, next);
}
```
This transient accounting approach starts tracking token balances at the beginning of an operation (when opening a tab) and stops at the end (when closing the tab), providing full flexibility for any token amount changes in between. This eliminates the need for additional balance management elsewhere, allowing for a clear separation between token accounting and execution logic. Before closing the temporary state, the only requirement is to ensure that `_nonZeroDeltaCount()` equals 0.
