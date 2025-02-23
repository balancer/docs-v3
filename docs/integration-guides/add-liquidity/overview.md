---
order: 0
title: Overivew

features:
  - title: SDK Tutorial
    icon: /images/build.svg
    iconDark: /images/build-dark.svg
    details: Step by step walkthrough for using our Typescript SDK
    link: /integration-guides/add-liquidity/sdk-tutorial.md
  - title: Solidity Tutorial
    icon: /images/build.svg
    iconDark: /images/build-dark.svg
    details: Step by step walkthrough for using a Foundry script
    link: /integration-guides/add-liquidity/solidity-tutorial.md
---

# Add Liquidity Guide

The following guides and examples illustrate how easy it is to perform different [types of add liquidity](/concepts/vault/add-remove-liquidity-types.html#add-remove-liquidity-types) operations on Balancer V3.

## Core Concepts

The core concepts of adding liquidity are the same for any programming language or framework:

- The sender must approve the Vault (not the Router) for each token they wish to add to the pool
- Token amount inputs/outputs are always in the raw token scale, e.g. `1 USDC` should be sent as `1000000` because it has 6 decimals
- Transactions are always sent to the appropriate [Router](../../concepts/router/overview.md)
  - Use the standard `Router` to add liquidity with pool tokens
  - Use the `CompositeLiquidityRouter` to add liqudity with a pool's underlying tokens
- In exchange for providing liquidity the sender will receive [Balancer Pool Tokens](../../concepts/core-concepts/balancer-pool-tokens.md) (BPTs) which represents their share of the pool and can be used to remove liquidity at any time

## Example Scripts

#### TypeScript SDK

- <a href="https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/hardhat/add-liquidity/addLiquidityUnbalanced.ts">addLiquidityUnbalanced.ts</a>
- <a href="https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/hardhat/add-liquidity/addLiquidityProportional.ts">addLiquidityProportional.ts</a>
- <a href="https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/hardhat/add-liquidity/addLiquidityUnbalancedToERC4626Pool.ts">addLiquidityUnbalancedToERC4626.ts</a>
- <a href="https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/hardhat/add-liquidity/addLiquidityProportionalToERC4626Pool.ts">addLiquidityProportionalToERC4626.ts</a>

#### Solidity

- <a href="https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/foundry/add-liquidity/AddLiquidityUnbalanced.s.sol">AddLiquidityUnbalanced.s.sol</a>
- <a href="https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/foundry/add-liquidity/AddLiquidityProportional.s.sol">AddLiquidityProportional.s.sol</a>
- <a href="https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/foundry/add-liquidity/AddLiquidityUnbalancedToERC4626Pool.s.sol">AddLiquidityUnbalancedToERC4626.s.sol</a>
- <a href="https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/foundry/add-liquidity/AddLiquidityProportionalToERC4626Pool.s.sol">AddLiquidityProportionalToERC4626.s.sol</a>

## Beginner Tutorials

<br>
<br>
