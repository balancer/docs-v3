---
title: Overview
order: 0
---

# The Vault


The Balancer Vault is the fundamental component of the Balancer protocol. It comprises three on-chain contracts that store tokens and facilitate liquidity operations. The Vault uses a `lock` mechanism to support batch operations with guaranteed settlement. 

The Vault is designed to be reentrant and secure, achieved through a tight coupling between the Vault and Router. It is responsible for:

- Token accounting, including minting and burning of Balancer Pool Tokens (BPT).
- Transaction settlement, ensuring all "lockers" are fully processed and all deltas are zero at the end.
- Storing pool configuration, including tokens, balances, supported hooks, and pool pause & initialization state.
- TODO: review Enforcing minimum / maximum trade sizes and BPT minting/burning operations via fudge factors. (Note: This point needs further review for accuracy)
- Managing the pausing of the Vault itself and pools, and handling the recovery mode.
- Handling token scaling factors to account for token prices & yield fees.


The Vault is composed of three deployed contracts. All interactions with Balancer are enforced to always go through the `Vault.sol` deployed contract. This architecture is necessary due to the bytecode size limit enforced by the Ethereum Virtual Machine (EVM). The Vault inherits from OpenZeppelin's Proxy contract and uses delegate calls to the `VaultExtension.sol`. Similarly, `VaultExtension.sol` also inherits from OpenZeppelin's Proxy and delegate calls into the `VaultAdmin.sol`. This setup allows the inclusion of all functions required to interact with the Vault.

:::info
When interacting with the Balancer Vault via solidity, it is recommended to cast the Vaults address to an `IVault`. This `IVault` interface includes all functions which are callable on the Vault, even the ones defined in `VaultExtension.sol` and `VaultAdmin.sol`. You can find the interface [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IVault.sol) or as part of [this]() npm package.
:::