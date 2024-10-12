---
order: 11
title: Add/Remove liquidity types
---

# Add/Remove liquidity types

Balancer protocol leverages the [Liquidity invariant approximation](/concepts/vault/liquidity-invariant-approximation.html) to provide a generalized solution for add and remove liquidity operations.
This enables the Vault to implement complex `unbalanced` and `singleAsset` liquidity operations that all custom AMMs built on Balancer support by default.

The Vault's [`addLiquidity`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IVaultMain.sol#L93-L95) and [`removeLiquidity`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IVaultMain.sol#L112-L114) functions accept a `kind` argument that identifies the type of operation to be performed. As each `kind` has slightly different requirements, the argument impacts
how the other function arguments are interpreted.

If you're an integrator looking to implement add or remove liquidity for an existing pool, see the [Router Onchain API](/concepts/router/overview.html).

## Add liquidity

```solidity
enum AddLiquidityKind {
    PROPORTIONAL,
    UNBALANCED,
    SINGLE_TOKEN_EXACT_OUT,
    DONATION,
    CUSTOM
}
```

- `AddLiquidityKind.PROPORTIONAL` - Add liquidity in proportional amounts and receive exact amount of BPT out.
- `AddLiquidityKind.UNBALANCED` - Add liquidity to a pool with exact amounts of any pool token, avoiding unnecessary dust in the user's wallet.
- `AddLiquidityKind.SINGLE_TOKEN_EXACT_OUT` - Add liquidity to a pool with a single token and receive an exact amount of BPT out.
- `AddLiquidityKind.DONATION` - Add liquidity without receiving any BPT.
- `AddLiquidityKind.CUSTOM` - For AMMs with a use case not covered by the built-in functions, custom allows the pool to implement an add liquidity operation whose requirements are defined by the pool.

Note that DONATION is only useful for narrow use cases, such as LVR reduction, and must be explicitly enabled on pool registration. It also precludes nesting the pool (i.e., using the BPT in other Balancer pools, or relying on the rate for anything external), as the BPT rates of pools that allow donation can be trivially manipulated. It is supported on standard Balancer pools (Weighted and Stable), but if you use it, be aware of the security implications, and make sure you know what you're doing!

## Remove liquidity

```solidity
enum RemoveLiquidityKind {
    PROPORTIONAL,
    SINGLE_TOKEN_EXACT_IN,
    SINGLE_TOKEN_EXACT_OUT,
    CUSTOM
}
```

- `RemoveLiquidityKind.PROPORTIONAL` - Remove liquidity from a pool in proportional amounts, causing zero price impact and avoiding the swap fee charged when exiting non-proportional.
- `RemoveLiquidityKind.SINGLE_TOKEN_EXACT_IN` - Remove liquidity from a pool in a single token and burn an exact amount of BPT.
- `RemoveLiquidityKind.SINGLE_TOKEN_EXACT_OUT` - Remove liquidity from a pool and receive an exact amount of a single token.
- `RemoveLiquidityKind.CUSTOM` - For AMMs with a use case not covered by the built-in functions, custom allows the pool to implement a remove liquidity operation whose requirements are defined by the pool.
