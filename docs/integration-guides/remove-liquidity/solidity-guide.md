---
order: 2
title: Solidity Guide
---

## Solidity Guide

The following code snippet shows how to remove liquidity from a smart contract.

::: warning Queries should not be used onchain to set minAmountOut due to possible manipulation via frontrunning.
:::

<GithubCode url="https://raw.githubusercontent.com/MattPereira/v3-pool-operation-examples/refs/heads/main/scripts/foundry/remove-liquidity/RemoveLiquidityProportional.s.sol" language="solidity" />
