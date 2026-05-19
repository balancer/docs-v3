---
order: 2
title: BAL Token
---

# BAL Token

Balancer Governance Token (BAL) is the core token behind the Balancer protocol. Alignment between governance token holders and protocol stakeholders is crucial for successful decentralized governance, and BAL tokens are the vehicle to drive this alignment.

**Update:** Major changes ratified in Q2 2026
The BAL token's economic and governance model was substantially restructured by [BIP-919 (BAL Tokenomics Revamp)](https://forum.balancer.fi/t/bip-919-bal-tokenomics-revamp/7001) and [BIP-921 (1-BAL-1-Vote)](https://forum.balancer.fi/t/bip-921-1-bal-1-vote-reconfiguration-for-balancer-eth-snapshot-space/7052). BAL emissions have been halted, veBAL has been discontinued, 100% of protocol fees route to the DAO Treasury, and Snapshot voting now operates on raw BAL across multiple chains. This page reflects the post-revamp state.

## Contract Address

| Network       | BAL Token Address                                                                                                                                                   |
| :------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Ethereum      | <span class="address-link">[0xba100000625a3754423978a60c9317c58a424e3d](https://etherscan.io/address/0xba100000625a3754423978a60c9317c58a424e3d)</span>             |
| Polygon PoS   | <span class="address-link">[0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3](https://polygonscan.com/address/0x9a71012b13ca4d3d0cdc72a177df3ef03b0e76a3)</span>          |
| Polygon zkEVM | <span class="address-link">[0x120eF59b80774F02211563834d8E3b72cb1649d6](https://zkevm.polygonscan.com//address/0x120ef59b80774f02211563834d8e3b72cb1649d6)</span>   |
| Arbitrum      | <span class="address-link">[0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a56B8](https://arbiscan.io/address/0x040d1EdC9569d4Bab2D15287Dc5A4F10F56a56B8)</span>              |
| Optimism      | <span class="address-link">[0xFE8B128bA8C78aabC59d4c64cEE7fF28e9379921](https://optimistic.etherscan.io/token/0xfe8b128ba8c78aabc59d4c64cee7ff28e9379921)</span>    |
| Base          | <span class="address-link">[0x4158734D47Fc9692176B5085E0F52ee0Da5d47F1](https://basescan.org/address/0x4158734d47fc9692176b5085e0f52ee0da5d47f1)</span>             |
| Avalanche     | <span class="address-link">[0xE15bCB9E0EA69e6aB9FA080c4c4A5632896298C3](https://snowtrace.io/token/0xE15bCB9E0EA69e6aB9FA080c4c4A5632896298C3?chainId=43114)</span> |
| Gnosis        | <span class="address-link">[0x7eF541E2a22058048904fE5744f9c7E4C57AF717](https://gnosisscan.io/address/0x7ef541e2a22058048904fe5744f9c7e4c57af717)</span>            |


## Supply

The maximum total supply of BAL enforced at the smart contract level remains **100M tokens**. BAL holders retain the authority to decide what (if anything) happens with the remaining unallocated supply through future governance.

### Post BIP-919 Supply

As of the BIP-919 snapshot in Q2 2026, **all BAL emissions have been halted**. The payload set every non-killed gauge type weight to zero via `GaugeController.change_type_weight`, effectively turning off ongoing inflation. 

The previous emission schedule (≈3.78M BAL/year, halving every 4 years, projected to run until ~2050) is no longer operative and is preserved here only as historical context. The decision to halt rather than phase down was deliberate: a gradual reduction was judged to add complexity without measurable benefits and would prolong uncertainty.

### Historical inflation schedule (pre-BIP-919)

At the start of BAL token incentives in 2020, 145,000 BAL were minted every week. In Q1 2022, [veBAL was introduced](https://forum.balancer.fi/t/introducing-vebal-tokenomics/2512) to replace fixed weekly emissions with a gauge-voted schedule, with an annual reduction in the emission rate. This schedule was retired by BIP-919.

## Governance Voting

BAL holders participate in protocol governance through the Snapshot space `balancer.eth`. Per BIP-921, voting power is now denominated in **raw BAL across all production chains where BAL is deployed**, replacing the prior veBAL-based strategies.

See the [Governance Overview](./README.md) and [Snapshot](./snapshot.md) pages for the strategy stack, quorum, and per-chain delegation mechanics.

The core team via Balancer Foundation holds an operational mandate (per [BIP-918](https://forum.balancer.fi/t/bip-918-operational-restructuring-for-balancer/7000)) for day-to-day decisions such as fee parameter changes, vendor selection, and partner negotiations. Major decisions — new pool factories, novel pool types, new chain deployments, BAL supply or minting parameter changes — still flow through a Snapshot vote.

## BAL Buyback and Burn Program

BIP-919 authorizes a voluntary buyback offer to provide exit liquidity for BAL holders at the protocol's net asset value.

| Parameter | Value |
|---|---|
| Total cap | 35% of Treasury holdings at the BIP-919 snapshot, earmarked in stablecoins |
| Buyback price | NAV (Treasury USD excluding BAL ÷ circulating supply, using the definition above) |
| Snapshot estimates | ~$3.6M allocation, ~$0.16/BAL NAV, up to ~22.7M BAL retired if fully exercised |
| Disposition of purchased BAL | Burned |
| Claim window | 12 months post-snapshot, 12-week window |

The specific claim mechanism (smart contract design, eligibility verification) will be implemented prior to the window opening. If the buyback is not fully exercised, remaining stablecoins reintegrate into the Treasury when the window closes.

## Treasury and Operational Addresses

Per [BIP-882](https://forum.balancer.fi/t/bip-882-transitioning-onchain-operations-of-the-balancer-dao-to-balancer-onchain-limited/6859) and the signer rotations executed in BIP-918, the main treasury is held in the Treasury Safe, managed by the Treasury Council (5/7).

- **Treasury Safe**: [`0x0EFcCBb9E2C09Ea29551879bd9Da32362b32fc89`](https://etherscan.io/address/0x0EFcCBb9E2C09Ea29551879bd9Da32362b32fc89)
- **DAO Multisig** (retains BAL minting and other elevated mainnet permissions): [`0x10A19e7eE7d7F8a52822f6817de8ea18204F2e4f`](https://etherscan.io/address/0x10A19e7eE7d7F8a52822f6817de8ea18204F2e4f)

See [Multisig](./multisig.md) for the full signer set and the L2 Authorizer admin transfer to the Omni multisig.

## Original Allocation (Historical)

The original 100M BAL allocation:

- **65M Community** — distributed via liquidity mining (now halted by BIP-919)
- **25M Founders, Options, Advisors, Investors** — subject to vesting periods
- **5M Ecosystem Fund** — originally deployed to attract and incentivize strategic partners; transferred into the DAO multisig as part of the veBAL conversion
- **5M Balancer Labs Fundraising Fund** — 1.9M transferred to the DAO Multisig during the Q2 2022 Operating Framework transition to supplement community-controlled supply
