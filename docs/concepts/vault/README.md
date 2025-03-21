---
title: Overview
order: 0
---

::: info
Retail users should not interact directly with the Vault. [Routers](../router/overview.md) serve as the entry point for all user actions.
:::

# The Vault

The Vault is the core of the Balancer protocol; it is a smart contract that holds and manages all tokens in each Balancer pool.
First introduced in Balancer v2, the vault architecture separates token accounting from pool logic, allowing for simplified pool contracts that focus
on the implementation of their swap, add liquidity and remove liquidity logic.

This architecture brings different pool designs under the same umbrella; the Vault is agnostic to pool math and can accommodate any system that satisfies a few requirements. Anyone who comes up with a novel idea can develop a custom pool plugged directly into Balancer's existing liquidity instead of needing to build their own Decentralized Exchange.

In v3, the vault more formally defines the requirements of a pool contract, shifting core design patterns out of the pool and into the vault.
The result is pool contracts that are compact and much easier to reason about. The Vault works with standard ERC20 tokens and is incompatible with rebasing or double entry point tokens.

- [On-chain API](/developer-reference/contracts/vault-api.html)
- [Configuration](/developer-reference/contracts/vault-config.html)
- Features
  - [Transient accounting](/concepts/vault/transient-accounting.html)
  - [ERC20MultiToken](/concepts/vault/erc20-multi-token.html)
  - [Liquidity Buffers](/concepts/vault/buffer.html)
  - [Token types](/concepts/vault/token-types.html)
  - [Decimal scaling](/concepts/vault/token-scaling.html#decimal-scaling)
  - [Rate scaling](/concepts/vault/token-scaling.html#rate-scaling)
  - [Yield fee](/concepts/vault/yield-fee.html)
  - [Swap fee](/concepts/vault/swap-fee.html)
  - [Live balances](/concepts/vault/token-scaling.html#live-balances)
  - [Liquidity invariant approximation](./features/liquidity-invariant-approximation.html)
  - [Flash Loans](/concepts/vault/flash-loans.html)
