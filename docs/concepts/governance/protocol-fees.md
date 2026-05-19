# Protocol Fee Operations

This page describes how protocol fees are collected and processed through Balancer's safe infrastructure. 

## Fee Structure Overview

| Fee Type | Balancer v2 | Balancer v3 |
|----------|-------------|-------------|
| Yield Fees | 50% | 10% |
| Swap Fees | 50% | 25% |

::: info Key Changes in v3
- Reduced yield fees from 50% to 10% to increase adoption
- Universal 25% swap fees across all pools
- Simplified fee distribution model
- Introduction of boosted pools technology
  :::

### Swap Fees

Balancer collects a percentage of swap fees paid by traders. From the swapper's perspective, there is no price increase: the protocol fee is taken as a fraction of the fee already being collected for liquidity providers.

### Yield Fees

Protocol fees are applied to yield earned by yield-bearing assets with rate providers. The percentage differs between V2 (50%) and V3 (10%), with V3's reduced rate designed to drive adoption of boosted pools technology.

::: tip Boosted Pools
V3 introduces boosted pools that deploy underlying liquidity into yield-generating markets, allowing any token with an external yield market to be transformed into a yield-bearing asset.
:::

### Flash Loan Fees

[Flash loans](/concepts/vault/flash-loans.md) allow users to borrow assets without collateral, as long as the borrowed amount is repaid within the same transaction. In Balancer V2, governance had the ability to set flash loan fees, but they were always set to zero to encourage developers to build on Balancer. In V3, flash loans operate through the Vault's transient unlock mechanism and remain fee-free by design.

## Fee Collection Infrastructure

Protocol fees are collected differently for Balancer V2 and V3, but both ultimately flow through the Protocol Fees Multisig (also known as the Fee Collector Safe) on Ethereum mainnet for distribution.

![Fee Collection Infrastructure](./images/fee_collection_infra.png)

### Balancer V3 Collection

V3 fees are swept from pools using burner contracts to the [Omni-sig](./multisig.md) on each chain, then bridged to Ethereum mainnet and transferred to the Protocol Fees Multisig.

### Balancer V2 Collection

V2 fees are processed by [Mimic](https://mimic.fi/) infrastructure, which handles swapping collected tokens to USDC, bridging from L2s to mainnet, and transferring to the Protocol Fees Multisig.

## Fee Distribution Flow

**Updated by BIP-919*** The protocol fee rates and routing were materially restructured by [BIP-919 (BAL Tokenomics Revamp)](https://forum.balancer.fi/t/bip-919-bal-tokenomics-revamp/7001). 100% of all protocol fees now route to the DAO Treasury via the corporate entities. The prior fee-sharing splits to veBAL holders, core pool incentives, partners, and the Alliance program have all been terminated.

### Corporate Structure Flow

From the Balancer Onchain Ltd Safe, the DAO's share flows up the [corporate structure](./corporate-structure.md):

1. **Balancer Onchain Ltd Safe** receives the DAO portion
2. **Dividends** flow to Balancer OpCo Ltd Safe
3. **Dividends** flow to Treasury Safe for ecosystem reserves

## Governance Controls

### Protocol Fees Multisig

The Protocol Fees Multisig (`0x7c68c42De679ffB0f16216154C996C354cF1161B`) controls fee collection and initial distribution. It operates under the [1/2 operational multisig configuration](./multisig.md#operational-multisigs) with Balancer Onchain Ltd Safe and Operator Safe as signers.

### Fee Parameter Changes

Routine protocol fee parameter changes fall under the core team's operational mandate (per [BIP-918](https://forum.balancer.fi/t/bip-918-operational-restructuring-for-balancer/7000)) and do not require a Snapshot vote; the DAO Multisig or appropriate chain-specific multisig executes them. Major changes — such as BAL supply or minting parameters — still require a [governance vote](./process.md).

## Related Documentation

- [Core Pools](../../partner-onboarding/onboarding-overview/core-pools.md) - Core pool requirements and benefits
- [Multisig](./multisig.md) - Safe infrastructure and signer groups
- [Corporate Structure](./corporate-structure.md) - Legal entity hierarchy
