---
title: Pool Token Compatibility
order: 6
---

# Pool Token Compatibility

This page documents the token compatibility requirements for any pool deployed on Balancer, and provides historical context on the now-sunset Core Pool framework.

:::danger Core Pool framework sunset
The Core Pool framework — including the "core pool flywheel" that recycled a share of pool revenue into voting incentives — has been **sunset**. Per [BIP-919 (BAL Tokenomics Revamp)](https://forum.balancer.fi/t/bip-919-bal-tokenomics-revamp/7001), BAL emissions are halted, vote markets are terminated, and **100% of protocol fees route directly to the DAO Treasury**. The 70% / 12.5% / 17.5% core/veBAL/DAO split no longer exists. Earlier reference proposals such as [BIP-19](https://forum.balancer.fi/t/bip-19-incentivize-core-pools-l2-usage/3329) and [BIP-457](https://forum.balancer.fi/t/bip-457-core-pool-incentive-program-automation/5254) are retained as historical context only.

The token-compatibility requirements below are not affected and still apply to any pool deployed on Balancer.
:::

## Token Requirements

All pool tokens must have verified smart contracts. The following token features are **unsupported by the Vault**. This list is not exhaustive but covers many common types of tokens that will not work with the Vault architecture (see [weird-erc20](https://github.com/d-xo/weird-erc20) for further examples).

- **Rebasing tokens** (e.g., aDAI). The Vault keeps track of token balances in its internal accounting; any token whose balance changes asynchronously (outside a swap or liquidity operation) would get out-of-sync with this internal accounting. This category also includes "airdrop" tokens, whose balances can change unexpectedly.

- **Double entrypoint tokens** (e.g., old Synthetix tokens, now fixed). These could bypass internal accounting by registering the token under one address, then accessing it through another. This is especially troublesome in v3, with the introduction of ERC4626 buffers and transient accounting.

- **Fee-on-transfer tokens** (e.g., PAXG). The Vault issues credits and debits according to given and calculated token amounts, and settlement assumes that the send/receive transfer functions transfer exactly the given number of tokens. If the token itself imposes a "tax" on transfers, transactions will not settle. Unlike with the other types — which are fundamentally incompatible — a Router could in principle be designed to handle this, but no such Router exists.

- **Tokens with more than 18 decimals** (e.g., YAM-V2). The Vault handles token scaling — I/O for amounts in native token decimals, calculations with full 18-decimal precision — and reads/stores decimals per token. Since virtually all tokens are 18 or fewer decimals, 18 is the maximum. This is enforced: attempting to register such tokens reverts with `InvalidTokenDecimals`. The Vault also requires tokens to implement `IERC20Metadata.decimals` and return a value ≤ 18.

Token decimals are checked and stored only once, on registration. Valid tokens store their decimals as immutable variables or constants. Malicious tokens that don't respect this basic property would not work anywhere in DeFi.

### Technically supported but discouraged

- **Very low-decimal tokens** (e.g., GUSD). The Vault has been extensively tested with 6-decimal tokens (e.g., USDC), but going much below that may lead to unanticipated effects due to precision loss, especially with smaller trade values.

- **Revert on zero-value approval / transfer.** The Vault has been tested against these, but peripheral contracts (such as hooks) might not have been designed with this in mind.

- **Other "weird-erc20" patterns** — upgradeable, pausable, or tokens with blocklists. A token upgrade that fails can "brick" the token, and many operations on pools containing that token. Any sort of "permissioned" token that can make transfers fail can cause operations on pools containing them to revert. Even Recovery Mode cannot help, as it does a proportional withdrawal of all tokens — if one is bricked, the whole operation reverts. v3 does not have v2's "internal balances", so there is no recourse.

## Additional Resources

- [V2 Core Pools Analytics Dashboard](https://balancer.defilytica.com/#/corePools) (historical)
- [V3 Core Pools Analytics Dashboard](https://ops.balancer.fi/core-pools) (historical)
- [Fee Model Documentation](/concepts/governance/protocol-fees)
