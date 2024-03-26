---
title: Overview
order: 0
---

# The Vault

The Vault is the core of the Balancer protocol; it is a smart contract that holds and manages all tokens in each Balancer pool.
First introduced in Balancer v2, the vault architecture separates token accounting from pool logic, allowing for simplified pool contracts that focus
on the implementation of their swap, add liquidity and remove liquidity logic.

This architecture brings different pool designs under the same umbrella; the Vault is agnostic to pool math and can accommodate any system that satisfies a few requirements. Anyone who comes up with a novel idea can develop a custom pool
plugged directly into Balancer's existing liquidity instead of needing to build their own Decentralized Exchange.

In v3, the vault more formally defines the requirements of a pool contract, shifting core design patterns out of the pool and into the vault.
The result is pool contracts that are compact and much easier to reason about.

`TODO: add short descriptions for each section`

`TODO: maybe add some visuals here`

- [On-chain API](./onchain-api.html)
- Features
  - [Transient accounting](./features/transient.html) - 
  - [ERC20MultiToken](./features/erc20-multi-token.html)
  - [Token types](./features/token-types.html)
  - [Decimal scaling](./features/decimal-scaling.html) -
  - [Rate scaling](./features/rate-scaling.html)
  - [Yield fee](./features/yield-fee.html)
  - [Swap fee](./features/swap-fee.html)
  - [Live balances](./features/live-balances.html)
  - [Liquidity invariant approximation](./features/liquidity-invariant-approximation.html)
