---
order: 0
title: Overview
---

# Governance

Various components of Balancer Governance are described in brief below. Click on the headings for more details on each topic.

## [Corporate Structure](./corporate-structure)

As of [BIP-882](https://forum.balancer.fi/t/bip-882-transitioning-onchain-operations-of-the-balancer-dao-to-balancer-onchain-limited/6859), Balancer operates through a formal corporate structure with Balancer Onchain Limited serving as the central hub for all on-chain operations. This structure provides legal clarity, operational efficiency, and proper risk management while maintaining alignment with decentralized governance.

## [Treasury Council](./corporate-structure#treasury-council)

The Treasury Council oversees the Treasury Safe and administers the self-insurance fund. Established by BIP-882, it ensures ecosystem interests are protected by overseeing distributions, reviewing corporate resolutions, and ensuring alignment with Balancer governance decisions.

## [veBAL](veBAL)

[veBAL](https://app.balancer.fi/#/ethereum/vebal) is a time-locked, non transferable derivative of the [80/20 BAL/ETH BPT on Mainnet](https://app.balancer.fi/#/ethereum/pool/0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014). veBAL holders, also called Balancer Governors, vote on proposals relevant to the protocol. These proposals are wide, ranging from which pools to enable BAL incentivize for to how treasury funds are allocated and managed.

## [BAL Token](./bal-token)

The BAL token is the primary component of veBAL. Due to the fact that veBAL allows for swapping between BAL and ETH, BAL liquidity scales with Governance. Due to the fact that veBAL liquidity is locked, the market can easily understand how BAL liquidity depth will scale over time by analyzing the unlock schedule of veBAL.

## [Protocol Fee Operations](./protocol-fees)

Protocol fees are collected from swaps, yield-bearing assets, and flash loans. This page describes how fees flow through Balancer's safe infrastructure—from collection via burners (V3) or Mimic (V2), through the Protocol Fees Multisig, to distribution among veBAL holders, core pool incentives, and the DAO. For fee percentages and distribution splits, see the [Protocol Fee Model](../protocol-fee-model/protocol-fee-model.md).

## [Governance Process](process.md)

Changes to the Balancer Protocol and allocations of community funds are made through a governance process, which includes: A proposal, a prepared transaction payload for on-chain execution via Safe, and a snapshot vote validating the proposal with a quorum that currently stands at least 2 million veBAL voting.


## [Snapshot](./snapshot)

Snapshot, a spinoff of Balancer, is an off-chain gasless multi-governance client with easy to verify and hard to contest results. Balancer Governance Votes take place on Snapshot.

## [Multisig](./multisig)

Balancer operates through a hierarchical safe system with clear separation of responsibilities. Top-level safes handle governance and treasury management, while operational multisigs execute day-to-day operations. The multisigs do NOT have decision making power - their role is to enact on-chain the decisions BAL holders make via off-chain voting.

## [Emergency subDAO](./emergency)

In order to protect veBAL from bad actors by killing gauges and pool factories, the emergency subdao was established with bounded authority to manage the protocol.
