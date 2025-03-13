---
order: 0
title: Overview

features:
  - title: Remove Liqudity with Typescript
    icon: /images/build.svg
    iconDark: /images/build-dark.svg
    details: Walkthrough a simple proportional remove using the SDK
    link: /integration-guides/remove-liquidity/sdk-tutorial.md
  - title: Remove Liquidity with Solidity
    icon: /images/build.svg
    iconDark: /images/build-dark.svg
    details: Walkthrough a simple proportional remove using a Foundry script
    link: /integration-guides/remove-liquidity/solidity-tutorial.md
---

# Remove Liquidity Guide

Balancer v3 supports several different [types of remove liquidity operations](https://docs.balancer.fi/concepts/vault/add-remove-liquidity-types.html#remove-liquidity)

## Core Concepts

The core concepts of removing liquidity are the same for any programming language or framework:

- When removing liquidity the user sends [Balancer Pool Tokens](../../concepts/core-concepts/balancer-pool-tokens.md) (BPTs), and will receive pool tokens
- Use a `permit` signature to approve the Router to spend BPT
- Token amount inputs/outputs are always in the raw token scale, e.g. `1 USDC` should be sent as `1000000` because it has 6 decimals
- If a pool's tokens include an ERC4626 with an intialized buffer, you have the option to receive the `asset()` of the ERC4626 when removing liquidity.
- Transactions are always sent to a [Router](../../concepts/router/overview.md)
  - Use the standard `Router` to receive standard pool tokens
  - Use the `CompositeLiquidityRouter` to receive a pool's underlying tokens

## Example Scripts

:::tip  
Run example scripts against a local fork using our [typescript SDK](https://github.com/balancer/balancer-v3-sdk-examples/tree/main) and [foundry starter](https://github.com/balancer/pool-operation-examples-v3) repos
:::

#### TypeScript SDK

- [removeLiquidityProportional.ts](https://github.com/balancer/balancer-v3-sdk-examples/blob/main/scripts/remove-liquidity/removeLiquidityProportional.ts)
- [removeLiquidityProportionalFromERC4626Pool.ts](https://github.com/balancer/balancer-v3-sdk-examples/blob/main/scripts/remove-liquidity/removeLiquidityProportionalFromERC4626Pool.ts)
- [removeLiquiditySingleTokenExactIn.ts](https://github.com/balancer/balancer-v3-sdk-examples/blob/main/scripts/remove-liquidity/removeLiquiditySingleTokenExactIn.ts)
- [removeLiquiditySingleTokenExactOut.ts](https://github.com/balancer/balancer-v3-sdk-examples/blob/main/scripts/remove-liquidity/removeLiquiditySingleTokenExactOut.ts)

#### Solidity

- [RemoveLiquidityProportional.s.sol](https://github.com/balancer/pool-operation-examples-v3/blob/main/scripts/foundry/remove-liquidity/RemoveLiquidityProportional.s.sol)
- [RemoveLiquidityProportionalFromERC4626Pool.s.sol](https://github.com/balancer/pool-operation-examples-v3/blob/main/scripts/foundry/remove-liquidity/RemoveLiquidityProportionalFromERC4626Pool.s.sol)
- [RemoveLiquiditySingleTokenExactIn.s.sol](https://github.com/balancer/pool-operation-examples-v3/blob/main/scripts/foundry/remove-liquidity/RemoveLiquiditySingleTokenExactIn.s.sol)
- [RemoveLiquiditySingleTokenExactOut.s.sol](https://github.com/balancer/pool-operation-examples-v3/blob/main/scripts/foundry/remove-liquidity/RemoveLiquiditySingleTokenExactOut.s.sol)

## Beginner Tutorials

<br>
<br>
