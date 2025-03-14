---
order: 0
title: Overview

features:
  - title: Add Liquidity with Typescript
    icon: /images/build.svg
    iconDark: /images/build-dark.svg
    details: Walkthrough a simple unbalanced add using the SDK
    link: /integration-guides/add-liquidity/sdk-tutorial.md
  - title: Add Liquidity with Solidity
    icon: /images/build.svg
    iconDark: /images/build-dark.svg
    details: Walkthrough a simple unbalanced add using a Foundry script
    link: /integration-guides/add-liquidity/solidity-tutorial.md
---

# Add Liquidity Guide

Balancer v3 supports several different [types of add liquidity operations](https://docs.balancer.fi/concepts/vault/add-remove-liquidity-types.html#add-remove-liquidity-types)

## Core Concepts

The core concepts of adding liquidity are the same for any programming language or framework:

- The sender must do a permit2 approval with the Router as the spender for each token
- Token amount inputs/outputs are always in the raw token scale, e.g. `1 USDC` should be sent as `1000000` because it has 6 decimals
- If a pool's tokens include an ERC4626 with an initialized buffer, you have the option to add liquidity using the `asset()` of the ERC4626, which we refer to as the "underlying" token.
- Transactions are always sent to the appropriate [Router](../../concepts/router/overview.md)
  - Use the standard `Router` to add liquidity with pool tokens
  - Use the `CompositeLiquidityRouter` to add liquidity with a pool's underlying tokens
- In exchange for providing liquidity the sender will receive [Balancer Pool Tokens](../../concepts/core-concepts/balancer-pool-tokens.md) (BPTs) which represents their share of the pool and can be used to remove liquidity at any time

## Example Scripts

Run any of the scripts listed below against a local fork of Ethereum mainnet using the [v3 pool operation examples repo](https://github.com/MattPereira/v3-pool-operation-examples/tree/main?tab=readme-ov-file#balancer-v3-pool-operation-examples)

#### TypeScript SDK

- [addLiquidityUnbalanced.ts](https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/hardhat/add-liquidity/addLiquidityUnbalanced.ts)
- [addLiquidityProportional.ts](https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/hardhat/add-liquidity/addLiquidityProportional.ts)
- [addLiquidityUnbalancedToERC4626.ts](https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/hardhat/add-liquidity/addLiquidityUnbalancedToERC4626Pool.ts)
- [addLiquidityProportionalToERC4626.ts](https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/hardhat/add-liquidity/addLiquidityProportionalToERC4626Pool.ts)

#### Solidity

- [AddLiquidityUnbalanced.s.sol](https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/foundry/add-liquidity/AddLiquidityUnbalanced.s.sol)
- [AddLiquidityProportional.s.sol](https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/foundry/add-liquidity/AddLiquidityProportional.s.sol)
- [AddLiquidityUnbalancedToERC4626.s.sol](https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/foundry/add-liquidity/AddLiquidityUnbalancedToERC4626Pool.s.sol)
- [AddLiquidityProportionalToERC4626.s.sol](https://github.com/MattPereira/v3-pool-operation-examples/blob/main/scripts/foundry/add-liquidity/AddLiquidityProportionalToERC4626Pool.s.sol)

## Beginner Tutorials

<br>
<br>
