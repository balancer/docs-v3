---
order: 0
title: Overview

features:
  - title: SDK Tutorial
    icon: /images/build.svg
    iconDark: /images/build-dark.svg
    details: Step by step walkthrough for using our Typescript SDK
    link: /integration-guides/remove-liquidity/sdk-tutorial.md
  - title: Solidity Tutorial
    icon: /images/build.svg
    iconDark: /images/build-dark.svg
    details: Step by step walkthrough for using a Foundry script
    link: /integration-guides/remove-liquidity/solidity-tutorial.md
---

# Remove Liquidity Guide

This guide demonstrates how to remove liquidity from a pool. We will use the preferred function for removing liquidity, `removeLiquidityProportional`. Tokens are removed from the pool in proportional amounts, causing zero price impact and avoiding the swap fee charged when exiting non-proportional. Specifying an exactBptAmountIn ensures that the user will not be left with any dust. See the [Router API](../router/overview.html) for other supported remove methods.

## Core Concepts

The core concepts of removing liquidity are the same for any programming language or framework:

- When removing liquidity the user sends [Balancer Pool Tokens](../../concepts/core-concepts/balancer-pool-tokens.md) (BPTs), and will receive pool tokens
- Unlike standard ERC20s, the vault has control over the supply of BPT, so there is no need for the sender to make approvals when sending BPTs. For more info see: [Balancer Pool Token](../../concepts/core-concepts/balancer-pool-tokens.md)
- Token amount inputs/outputs are always in the raw token scale, e.g. `1 USDC` should be sent as `1000000` because it has 6 decimals
- Transactions are always sent to the [Router](../../concepts/router/overview.md)

## Example Scripts

#### TypeScript SDK

- <a href="https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/hardhat/remove-liquidity/removeLiquidityProportional.ts">removeLiquidityProportional.ts</a>
- <a href="https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/hardhat/remove-liquidity/removeLiquidityProportionalFromERC4626Pool.ts">removeLiquidityProportionalFromERC4626Pool.ts</a>
- <a href="https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/hardhat/remove-liquidity/removeLiquiditySingleTokenExactIn.ts">removeLiquiditySingleTokenExactIn.ts</a>
- <a href="https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/hardhat/remove-liquidity/removeLiquiditySingleTokenExactOut.ts">removeLiquiditySingleTokenExactOut.ts</a>

#### Solidity

- <a href="https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/foundry/remove-liquidity/RemoveLiquidityProportional.s.sol">RemoveLiquidityProportional.s.sol</a>
- <a href="https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/foundry/remove-liquidity/RemoveLiquidityProportionalFromERC4626Pool.s.sol">RemoveLiquidityProportionalFromERC4626Pool.s.sol</a>
- <a href="https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/foundry/remove-liquidity/RemoveLiquiditySingleTokenExactIn.s.sol">RemoveLiquiditySingleTokenExactIn.s.sol</a>
- <a href="https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/foundry/remove-liquidity/RemoveLiquiditySingleTokenExactOut.s.sol">RemoveLiquiditySingleTokenExactOut.s.sol</a>

## Beginner Tutorials

<br>
<br>
