---
order: 0
title: Overview
---

# Governance

Balancer governance is conducted by **BAL token holders** voting on Snapshot. Voting power is denominated in BAL tokens across multiple production chains. On-chain operations are executed through a structured set of multisigs operated by Balancer Onchain Ltd through its service provider MAXYZ.

**Update:** Major restructuring ratified in Q2 2026
The governance model documented in this section was substantially restructured by three linked proposals in Q2 2026:

- [**BIP-918** — Operational Restructuring](https://forum.balancer.fi/t/bip-918-operational-restructuring-for-balancer/7000):  consolidated operations under Balancer OpCo Ltd post Balancer Labs wind-down, reducing the team and annual budget, transferred L2 Authorizer admin to the Omni multisig, and introduced a core team mandate for day-to-day operational decisions.
- [**BIP-919** — BAL Tokenomics Revamp](https://forum.balancer.fi/t/bip-919-bal-tokenomics-revamp/7001): halted all BAL emissions, reduced the V3 protocol swap fee share from 50% to 25%, routed 100% of protocol fees to the DAO Treasury, discontinued veBAL economic rights, and authorized a BAL buyback-and-burn program at NAV.
- [**BIP-921** — 1-BAL-1-Vote Reconfiguration](https://forum.balancer.fi/t/bip-921-1-bal-1-vote-reconfiguration-for-balancer-eth-snapshot-space/7052): replaced veBAL-based Snapshot strategies with a seven-strategy stack denominated in raw BAL, raised quorum to 10M BAL, and removed both the 200k veBAL proposal-submission threshold and the 45% delegation cap.

This Overview reflects the post-revamp state. References to veBAL fee share, BAL emissions, or veBAL-based voting power are no longer operative.


## Quick Start

### Want to participate in governance?

1. Acquire BAL on any supported chain.
2. Delegate your voting power per chain via Snapshot's Delegate Registry on each chain you hold BAL.
3. Vote on [Snapshot proposals](https://snapshot.org/#/balancer.eth).

No locking is required. On Ethereum, BAL underlying any 80/20 BAL/WETH BPT (held directly or still locked in veBAL) counts toward your voting power at face value.

### Want to create a proposal?

1. Draft an RFC on the [Balancer Forum](https://forum.balancer.fi/c/governance/7).
2. Engage with the community for feedback.
3. Work with the core team or open a PR on [Github](https://github.com/balancer/multisig-ops) to prepare a transaction payload.

**Update:** only *registered members of the `balancer.eth` space* can submit to Snapshot. The previous 200k veBAL submission threshold has been removed. As before, per [BIP-838](https://forum.balancer.fi/t/bip-838-balancer-dao-governance-process-guidelines/6542), proposals must first be discussed on the forum.

Quorum: **10M BAL**. See [Governance Process](./process.md) for detailed steps.

### What requires a BIP?

The SP mandate introduced by BIP-918 covers protocol fee parameter changes, vendor selection, chain deprecation, partner deal negotiations, and other day-to-day operations — these do not require a Snapshot vote. Major decisions (new pool factories, novel pool types, new chain deployments, BAL supply or minting changes) still require a BIP.

---

Various components of Balancer Governance are described below. Click on each heading for more detail.

## BAL Token

The BAL token is the protocol's governance token and the unit of voting power. BAL emissions have been halted.

## Voting

Snapshot voting in the `balancer.eth` space operates on raw BAL across seven production chains via a seven-strategy stack. The Ethereum strategy uses the singleton `BalVotingPower.sol` view contract to include BAL underlying 80/20 BAL/WETH BPT (held directly or locked in veBAL at face value). Other chains use Snapshot's `erc20-balance-of-delegation` strategy. 

## veBAL (Discontinued)

Existing veBAL locks remain on-chain until natural expiry. They no longer earn protocol fees and no longer direct emissions (there are no emissions). The veBAL escrow multiplier no longer confers any extra voting weight — under the new strategy stack only the underlying BAL is counted, at face value (see Voting above).

## Protocol Fee Operations

Protocol fees are collected from swaps and yield-bearing assets. Balancer V3 swap fees take 25% to the protocol, V2 swap fees remain at 50%, yield fees stay at 10%. **100% of all protocol fees route to the DAO Treasury** 

## Multisigs

Balancer operates through a hierarchical safe system with clear separation of responsibilities. Top-level safes handle governance and treasury management, while operational multisigs execute day-to-day operations. The multisigs do NOT have decision making power - their role is to enact on-chain the decisions BAL holders make via off-chain voting.

## Emergency subDAO

A 3-of-7 multisig (per [BIP-883](https://forum.balancer.fi/t/bip-883-emergency-safe-governance-improvements-q4-2025/6865)) with bounded authority to protect the protocol by killing gauges, pausing pools, and managing pool factories in emergency situations.

## Corporate structure

The DAO operates through a formal corporate structure: the **Balancer Foundation** (Cayman, agent of the DAO with no shareholders), **Balancer OpCo Ltd** (BVI, primary service provider holding all direct contractors), **Balancer Onchain Ltd** (BVI, on-chain operations). This structure provides legal clarity, operational efficiency, and proper risk management while maintaining alignment with decentralized governance.


