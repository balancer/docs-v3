---
order: 3
title: BalancerPoolToken (BPT)
---

# BalancerPoolToken

****** THIS SECTION IS A WORK IN PROGRESS *****

Balancer Pool Tokens (BPTs) are not implemented as standalone ERC20 Tokens but are part of the Vault's ERC20Multitoken contract. The ERC20Multitoken contract pairs well with the Balancer V3 Vault as it encapsulates BPT management within the Vault and does not have dependency on the Pool contract, moving complexity from the Pool contract to the Vault. This voids read-only-reentrancy concerns as there is no seperate Vault & pool state anymore. Also concepts such as preminted BPT/Phantom BPT have been removed and the Vault is now fully BPT aware as it is the contract managing BPTs. A detailed explanation on BalancerPoolTokens is provided [here]().

Inheriting from `BalancerPoolToken` allows the Pool to behave in compliance with the ERC20 standard while calls are delegated to the Vault's `ERC20Multitoken` contract. This means the BPT has all ERC20 features such as: `approve`, `transfer`, `transferFrom`, `totalSupply`, etc. but is "managed" by the vault. BPT's have the same composability features as regular ERC20 contracts. For example to transfer a BPT you have the possibility to either call `bpt.transfer(from, to)` or `vault.transfer(address(bpt), from, to)`.

::: info
Take a look at the [BalancerPoolToken contract](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/BalancerPoolToken.sol) or an explainer on [ERC20MultiToken](TODO: add link to in depth ERC20MultiToken explainer)
:::