---
order: 6
title: Add/Remove liquidity types
---

# Add/Remove liquidity types

Balancer protocol leverages the [Liquidity invariant approximation](concepts/vault/liquidity-invariant-approximation.html) to provide a generalized solution for add and remove liquidity operations.
This enables the Vault to implement complex `unbalanced` and `singleAsset` liquidity operations that all custom AMMs built on Balancer support by default.

## Add liquidity

- `AddLiquidityKind.UNBALANCED` - Add liquidity to a pool with exact amounts of any pool token, avoiding unnecessary dust in the user's wallet.
- `AddLiquidityKind.SINGLE_TOKEN_EXACT_OUT` - Add liquidity to a pool with a single token and receive an exact amount of BPT out.
- `AddLiquidityKind.CUSTOM` - For AMMs with a use case not covered by the built-in functions, custom allows the pool to implement an add liquidity operation whose requirements are defined by the pool.

## Remove liquidity

- `RemoveLiquidityKind.PROPORTIONAL` - Remove liquidity from a pool in proportional amounts, causing zero price impact and avoiding the swap fee charged when exiting non-proportional.
- `RemoveLiquidityKind.SINGLE_TOKEN_EXACT_IN` - Remove liquidity from a pool in a single token and burn an exact amount of BPT.
- `RemoveLiquidityKind.SINGLE_TOKEN_EXACT_OUT` - Remove liquidity from a pool and receive an exact amount of a single token.
- `RemoveLiquidityKind.CUSTOM` - For AMMs with a use case not covered by the built-in functions, custom allows the pool to implement a remove liquidity operation whose requirements are defined by the pool.
