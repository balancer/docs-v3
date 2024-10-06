---
title: Interacting With The Vault
---

# Interacting With The Vault Using Hooks

The [Balancer Router](../../concepts/router/overview.md#balancer-routers) is typically the interface Externally Owned Accounts (EOAs) use to interact with the V3 Vault. While the Router uses Permit2 for token permissions, Hooks—being separate smart contracts—cannot sign these permissions. Instead, Hooks interact directly with the Vault. This section covers some common scenarios and usage patterns for Hooks.

## Making A Swap

It is possible for a Hook to make a [swap](/developer-reference/contracts/vault-api.html#swaps) by following the following steps:

1. Send the tokens you are swapping to the Vault:
```solidity
token.transfer(_vault, amount)
```

2. Inform the Vault you have sent it tokens. This will update the Vaults transient accounting with the correct balances:
```solidity
_vault.settle(token, amount)
```

3. Perform the swap:
```solidity
(amountCalculated, amountIn, amountOut) = _vault.swap(
    VaultSwapParams({
        kind: kind,
        pool: pool,
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        amountGivenRaw: amount,
        limitRaw: limit,
        userData: userData
    })
);
```

## AddingLiquidity - Donating To Pool LPs 

Hooks can [add](/developer-reference/contracts/vault-api.html#add-liquidity)/[remove](/developer-reference/contracts/vault-api.html#remove-liquidity) liquidity to pools. The following snippet shows how the [`DONATION`](/concepts/vault/add-remove-liquidity-types.html#add-liquidity) kind can be used to add collected fees to a pool. This effectively donates the fees to the pool LPs and can be seen in action in the [ExitFeeHookExample](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-hooks/contracts/ExitFeeHookExample.sol#L160-L169).

```solidity
_vault.addLiquidity(
    AddLiquidityParams({
        pool: pool,
        to: msg.sender, // It would mint BPTs to router, but it's a donation so no BPT is minted
        maxAmountsIn: accruedFees, // Donate all accrued fees back to the pool (i.e. to the LPs)
        minBptAmountOut: 0, // Donation does not return BPTs, any number above 0 will revert
        kind: AddLiquidityKind.DONATION,
        userData: bytes("") // User data is not used by donation, so we can set it to an empty string
    })
);
```

## Collecting Fees

The Vault [`sendTo`](/developer-reference/contracts/vault-api.html#sendto) function can be used to collect fees to a hook.
```solidity
_vault.sendTo(feeToken, address(this), hookFee);
```
where `address(this)` would be the hook itself.

This is used in the [FeeTakingHookExample](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-hooks/contracts/FeeTakingHookExample.sol) and the [LotteryHookExample](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-hooks/contracts/LotteryHookExample.sol) to collect a fee after swapping.