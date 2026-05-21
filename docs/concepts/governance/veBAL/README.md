---
title: Overview (Historical)
---

# veBAL (Historical)

:::danger Deprecated — veBAL economic and governance rights ended in Q2 2026
This page describes the legacy veBAL system and is **no longer accurate**. It is retained as a historical record.

**What changed:**

- Per [BIP-919 (BAL Tokenomics Revamp)](https://forum.balancer.fi/t/bip-919-bal-tokenomics-revamp/7001), BAL emissions are halted, all protocol fees route 100% to the DAO Treasury, and veBAL no longer earns fees or directs emissions.
- Per [BIP-920 (veBAL Compensation Airdrop)](https://forum.balancer.fi/t/bip-920-vebal-compensation-airdrop/7025), veBAL holders received a **one-off payment of 500,000 USDC** as compensation for forgoing future fee streams, distributed by direct CSV airdrop proportional to veBAL balance at the proposal snapshot (no claiming required). The bulk of this airdrop landed in the major locker contracts (Aura BAL locker, StakeDAO BAL locker, Tetu BAL locker); those wrappers are expected to **unwind their veBAL positions and distribute the received rewards to their underlying users** (sdBAL, auraBAL, tetuBAL holders) accordingly. Reach out to each wrapper protocol for their specific distribution timeline.
- Per [BIP-921 (1-BAL-1-Vote)](https://forum.balancer.fi/t/bip-921-1-bal-1-vote-reconfiguration-for-balancer-eth-snapshot-space/7052), Snapshot voting is now denominated in raw BAL across seven chains; the veBAL escrow multiplier no longer confers extra voting weight (only the underlying BAL is counted, at face value).

Existing locks remain on-chain until natural expiry but no longer accrue fees or carry escrow-multiplied voting weight. See the [Governance Overview](../README.md), [BAL Token](../bal-token.md), and [Voting](../voting.md) pages for the current state.
:::

## Overview

veBAL (vote-escrow BAL) was a vesting system based on [Curve's veCRV mechanism](https://curve.readthedocs.io/dao-vecrv.html) which locked 80/20 BAL/WETH Balancer Pool Tokens for up to 1 year. The veBAL and Gauge system was designed to promote long-term token-holder alignment and facilitate fair protocol fee distribution.

By locking the BAL/WETH 80/20 BPT, holders received veBAL, entitling them to governance rights and protocol fee collection. A user's veBAL balance was directly proportional to the amount of BAL/WETH 80/20 BPT locked and the duration of time left in the lock period. In short, a user who locked 1 BPT for 52 weeks received the same amount of "vote-escrowed" strength as someone who locked 2 BPT for 26 weeks.

Implications (historical):

- veBAL conferred boosted liquidity-mining emissions across gauges. A user's share of a given staked pool and the lock multiplier were both factors in the amount they were entitled to in liquidity-mining emissions.

- veBAL holders received a share of protocol fees. The distribution varied by pool type (see Protocol Fee Model (historical) for details):

  - **Non-core pools**: 82.5% of protocol fees flowed directly to veBAL holders as USDC payments.
  - **Core pools**: 12.5% flowed directly to veBAL holders, with an additional 70% distributed as voting incentives on core pools (requiring veBAL holders to vote for revenue-generating pools to capture this portion).

- veBAL was the governance token of Balancer, used in Snapshot voting to authorize changes to the DAO including the management (adding/removing) of gauges and funding of service providers.
  - veBAL had a gauge that could direct emissions back to veBAL holders. This option was capped at 10% of total BAL emissions at any given point in the inflation schedule; any overflow above 10% flowed to the DAO treasury.
  - As demonstrated by BIP-161, the handling and amount of protocol fees were subject to change based on the [Balancer Governance Process](../process.md).

This gave veBAL holders the option to direct emissions toward pools where they held liquidity positions, and opened the door to "bribing" markets. [BIP-903](https://forum.balancer.fi/t/bip-903-transition-core-pool-incentive-program-to-stake-dao-s-votemarket-v2/6928) introduced StakeDAO's [Votemarket](https://votemarket.stakedao.org/balancer) as the default voting-incentive marketplace, allowing projects to incentivize veBAL voters to allocate their gauge votes in a preferred direction — hence the term "bribe".

The BAL emission schedule was originally defined as permanent: before veBAL, 145,000 BAL were emitted per week, which was unsustainable without a ceiling. The veBAL-era schedule halved the inflation rate every 4 years and capped total BAL supply at ~94,000,000. This schedule was retired by [BIP-919](https://forum.balancer.fi/t/bip-919-bal-tokenomics-revamp/7001), which halted emissions entirely.

### How was veBAL different from veCRV?

A few modifications set veBAL apart from veCRV:

- Instead of locking pure BAL, users obtained veBAL by locking 80/20 BAL/WETH Balancer Pool Tokens (BPTs). This ensured that even if a large portion of BAL tokens were locked, there was deep liquidity available for trading.

- veBAL's maximum locking period was 1 year, a decrease from veCRV's 4-year period. The minimum locking period was 1 week. DeFi moves quickly, and a shorter — but still sufficiently long — lock duration allowed for a faster transition path if governance ever decided to migrate to a new voting system (which is what BIP-921 ultimately did).
