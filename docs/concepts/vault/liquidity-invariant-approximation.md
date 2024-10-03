---
title: Liquidity invariant approximation
order: 10
---

# Liquidity Invariant Approximation

Adding and removing liquidity are considered liquidity operations in the context of this page. A Balancer pool allows adding and removing liquidity not only proportionally, but also in non-proportional or "unbalanced" ways. An unbalanced add or remove liquidity can be considered a combination of a proportional add or remove plus a swap. The vault must handle both scenarios with the same outcome for users and LPs, in order to ensure a fair settlement system.

## Theory

Liquidity operations that are disproportionate allow for indirect swaps. This scenario must have the same outcome as swaps and proportional liquidity operations combined. This means:

- Swap fees for indirect swaps must not be lower than those for direct swaps
- BPT amounts are properly minted in both cases (an indirect swap, and a proportional liquidity operation plus a swap)
- Both users must have the same net token balances after each operation

## Examples

Alice starts with balances of [100, 0]. She executes addLiquidityUnbalanced([100, 0]) and then removes liquidity proportionally, resulting in balances of [66, 33]. Bob, starting with the same balances [100, 0], performs a swapExactIn(34). We determine the amount Alice indirectly traded as 34 (100 - 66 = 34), allowing us to compare the swap fees incurred on the trades. This comparison ensures that the fees for a direct swap remain higher than those for an indirect swap. Finally, we assess the final balances of Alice and Bob. Two criteria must be satisfied:

1. The initial token balances for the trade should be identical, meaning Alice's [66, ...] should correspond to Bob's [66, ...].
2. The resulting balances from the trade should ensure that Bob always has an equal or greater amount than Alice. However, the difference should not be excessive, i.e., we aim not to disadvantage users in liquidity operations. This implies that Alice's balance [..., 33] should be less than or at most equal to Bob's [..., 34].

## Implications

This methodology and evaluation criteria apply to all disproportionate liquidity operations and pool types. Moreover, this approach confirms the correct amount of BPT (Balancer Pool Tokens) minted or burned for liquidity operations. If more BPT were minted or fewer BPT were burned than required, it would result in Alice having more assets at the end than Bob.

::: info Custom pool implication
As a custom pool developer, you are faced with the choice of allowing these combinations in your pool. If you chose to do so, you must verify
the liquidity-invariant approximation approach in your tests to ensure fair and even settlement across various operations.
:::

## Verification

For reference, see the [`LiquidityApproximation.t.sol`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/test/foundry/LiquidityApproximation.t.sol) test file where the required assertions are verified in `assertLiquidityOperationNoSwapFee()` and `assertLiquidityOperation()`. 
