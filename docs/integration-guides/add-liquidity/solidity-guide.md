---
order: 2
title: Solidity Guide
---

## Add Liquidity with Solidity

The following code snippet shows how to add liquidity from a smart contract.

::: warning Queries should not be used onchain to set minAmountOut due to possible manipulation via frontrunning.
:::

<GithubCode url="https://raw.githubusercontent.com/MattPereira/v3-pool-operation-examples/refs/heads/main/scripts/foundry/add-liquidity/AddLiquidityUnbalanced.s.sol" language="solidity" />

