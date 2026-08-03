---
title: userData
order: 6
---

# userData

## Overview

Every Vault operation (initialize, add liquidity, remove liquidity, and swap) carries an optional `bytes userData` field. The Vault passes it through untouched to the pool and to any hooks registered on it, so a custom pool or hook can accept arbitrary extra information beyond the operation's explicit parameters.

It exists to preserve flexibility without sacrificing usability. In V2 this flexibility was the only option: operations went through a generic interface, so a caller had to encode the entire request into a `userData` blob, which was awkward, error-prone, and impossible to drive by simply typing values into a block explorer. V3 instead exposes explicit, named parameters through its [routers](/concepts/router/overview.html) for the common operations, so the everyday path needs no encoding at all. `userData` remains only as an optional channel for special cases.

## Who uses it

Standard pool operations ignore `userData`. Weighted and Stable pools never read it, and a typical integrator leaves it empty (`0x`). It becomes meaningful only when a [hook](/build/build-a-hook/extend-existing-pool-type.html) or a [custom pool](/build/build-an-amm/create-custom-amm-with-novel-invariant.html) is written to interpret it. A hook receives `userData` in its callbacks (`onBeforeAddLiquidity`, `onAfterSwap`, and the rest), and a custom pool can read it inside its own logic; in both cases the contract author alone defines what the bytes mean.

## An example

The `NftLiquidityPositionExample` hook mints an NFT to each depositor and charges an exit fee that decays over time. When liquidity is withdrawn the hook needs to know which position is being closed, so its after-remove-liquidity callback reads a token id out of `userData`:

```solidity
uint256 tokenId = abi.decode(userData, (uint256));
```

The caller encodes that token id into `userData` when requesting the withdrawal, and the hook decodes it to look up the position and apply the correct decaying fee. Nothing else about the operation changes.

## Using it

When a pool or hook expects `userData`, build it with `abi.encode(...)` to match exactly what that contract decodes, and pass it in the operation's `userData` field. When the pool and its hooks do not use it (the common case), pass empty bytes.

In practice `userData` is rarely populated: most pools and integrations leave it empty. Treat it as an option for flexible custom designs, not part of the routine flow.
