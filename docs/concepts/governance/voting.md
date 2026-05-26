---
title: Voting
order: 3
---

# Voting

Balancer governance votes take place on the [`balancer.eth` Snapshot space](https://snapshot.org/#/balancer.eth). Per [BIP-921 (1-BAL-1-Vote Reconfiguration)](https://forum.balancer.fi/t/bip-921-1-bal-1-vote-reconfiguration-for-balancer-eth-snapshot-space/7052), voting power is denominated in **raw BAL** across all production chains where BAL is deployed. The previous veBAL-based strategies have been retired.

## Strategy Stack

The space uses a **seven-strategy stack**, one strategy per production chain where BAL is deployed. A voter's total voting power is the sum across all seven chains. There is no single named strategy — the Ethereum strategy is a composite, and the six L2 strategies use Snapshot's standard `erc20-balance-of-delegation`.

| Chain             | Snapshot Strategy                              | Contract                                                                                                                                                  |
|:------------------|:-----------------------------------------------|:----------------------------------------------------------------------------------------------------------------------------------------------------------|
| Ethereum          | `delegation(contract-call(BalVotingPower))`    | <span class="address-link">[`0x411e723E6652347FF3Dd31749913A834e3D43DB4`](https://etherscan.io/address/0x411e723E6652347FF3Dd31749913A834e3D43DB4)</span> (BalVotingPower) |
| Gnosis            | `erc20-balance-of-delegation`                  | <span class="address-link">[`0x7eF541E2a22058048904fE5744f9c7E4C57AF717`](https://gnosisscan.io/address/0x7eF541E2a22058048904fE5744f9c7E4C57AF717)</span> (BAL)           |
| Arbitrum One      | `erc20-balance-of-delegation`                  | <span class="address-link">[`0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a56B8`](https://arbiscan.io/address/0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a56B8)</span> (BAL)             |
| Base              | `erc20-balance-of-delegation`                  | <span class="address-link">[`0x4158734D47Fc9692176B5085E0F52ee0Da5d47F1`](https://basescan.org/address/0x4158734D47Fc9692176B5085E0F52ee0Da5d47F1)</span> (BAL)            |
| Polygon (PoS)     | `erc20-balance-of-delegation`                  | <span class="address-link">[`0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3`](https://polygonscan.com/address/0x9a71012B13CA4d3D0Cdc72A177DF3ef03b0E76A3)</span> (BAL)         |
| Optimism          | `erc20-balance-of-delegation`                  | <span class="address-link">[`0xFE8B128bA8C78aabC59d4c64cEE7fF28e9379921`](https://optimistic.etherscan.io/address/0xFE8B128bA8C78aabC59d4c64cEE7fF28e9379921)</span> (BAL)  |
| Avalanche (C-Chain) | `erc20-balance-of-delegation`                | <span class="address-link">[`0xE15bCB9E0EA69e6aB9FA080c4c4A5632896298C3`](https://snowtrace.io/address/0xE15bCB9E0EA69e6aB9FA080c4c4A5632896298C3)</span> (BAL)             |

The six L2 strategies count raw BAL balance plus any BAL delegated to the voter on that chain. The Ethereum strategy nests a Snapshot `delegation` wrapper around a `contract-call` strategy that invokes `BalVotingPower.votingPower(voter)`.

## BalVotingPower Contract

The Ethereum strategy reads voting power from `BalVotingPower.sol` — a singleton, stateless view contract ([source](https://github.com/balancer/bal-voting-power/blob/main/src/BalVotingPower.sol), deployed at [`0x411e723E6652347FF3Dd31749913A834e3D43DB4`](https://etherscan.io/address/0x411e723E6652347FF3Dd31749913A834e3D43DB4)) — exposing a single function:

```solidity
function votingPower(address user) external view returns (uint256);
```

For the given voter, the contract returns `raw + fromBpt`, where:

1. **`raw`** — the voter's raw BAL balance: `BAL.balanceOf(user)`.
2. **`fromBpt`** — the BAL portion of all BPT attributable to the voter, computed by summing:
   - the voter's directly-held 80/20 BAL/WETH BPT balance, plus
   - the BPT amount **still locked inside veBAL** for the voter, read as `veBAL.locked(user).amount` (face value, not the decay-adjusted `balanceOf`),
   - then converting the combined BPT amount to its underlying BAL equivalent via the pool's current BAL/total-supply ratio.

Hardcoded references in the contract:

| Component             | Address                                                                       |
|:----------------------|:------------------------------------------------------------------------------|
| BAL token             | `0xba100000625a3754423978a60c9317c58a424e3D`                                  |
| 80/20 BAL/WETH BPT    | `0x5c6Ee304399DBdB9C8Ef030aB642B10820DB8F56`                                  |
| Vault                 | `0xBA12222222228d8Ba445958a75a0704d566BF2C8`                                  |
| veBAL                 | `0xC128a9954e6c874eA3d62ce62B468bA073093F25`                                  |
| 80/20 Pool ID         | `0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014`          |

The veBAL escrow multiplier no longer confers any extra weight — only the underlying BAL inside the lock is counted, at its face value. Delegation is **not** handled by the contract itself; it is layered on by the outer Snapshot `delegation` strategy (see below).

## Delegation

Voters delegate voting power **per chain** through Snapshot's [Delegate Registry](https://docs.snapshot.org/user-guides/delegation) at the same deterministic contract address across all seven networks. To use the same delegate everywhere, register your delegate on each chain where you hold BAL.

The **45% individual delegation cap** introduced by [BIP-521](https://forum.balancer.fi/t/bip-521-cap-individual-voter-weight-on-snapshot/5413) has been **removed**.

## Quorum

| Parameter | Value |
|:----------|:------|
| Quorum    | **10,000,000 BAL** (converted from the previous 2M veBAL) |
| Voting window | Friday 20:00 CET → Tuesday 20:00 CET (4 days) |
| Voting type | Basic Voting (Yes / No / Abstain), barring clear community consensus otherwise |

## Proposal Submission

The previous 200,000 veBAL submission threshold has been removed. Only **registered members of the `balancer.eth` Snapshot space** can submit proposals. Per [BIP-838](https://forum.balancer.fi/t/bip-838-balancer-dao-governance-process-guidelines/6542), proposals must first be discussed on the [Balancer Forum](https://forum.balancer.fi/c/governance/7) as an RFC.

See the [Governance Process](./process.md) for the full proposal lifecycle.

## What Requires a BIP?

Following [BIP-918](https://forum.balancer.fi/t/bip-918-operational-restructuring-for-balancer/7000), the core team holds an operational mandate over day-to-day decisions — protocol fee parameter changes, vendor selection, chain deprecation, partner deal negotiations — which do **not** require a Snapshot vote. The following still require a Snapshot vote:

- New pool factories
- Novel pool types
- New chain deployments
- Changes to BAL supply or minting parameters
- Treasury actions beyond routine operations

## Related Documentation

- [Governance Overview](./README.md)
- [Governance Process](./process.md)
- [Snapshot](./snapshot.md) — Snapshot platform basics
- [BAL Token](./bal-token.md)
- [BIP-921 (1-BAL-1-Vote)](https://forum.balancer.fi/t/bip-921-1-bal-1-vote-reconfiguration-for-balancer-eth-snapshot-space/7052)
