---
title: FAQ (Historical)
---

# veBAL FAQ (Historical)

:::danger Deprecated — veBAL economic and governance rights ended in Q2 2026
This FAQ describes the legacy veBAL system and is **no longer accurate**. Per [BIP-919](https://forum.balancer.fi/t/bip-919-bal-tokenomics-revamp/7001) and [BIP-921](https://forum.balancer.fi/t/bip-921-1-bal-1-vote-reconfiguration-for-balancer-eth-snapshot-space/7052), BAL emissions are halted, protocol fees route 100% to the DAO Treasury, and Snapshot voting is denominated in raw BAL (veBAL no longer earns fees, directs emissions, or confers an escrow voting multiplier).

Per [BIP-920 (veBAL Compensation Airdrop)](https://forum.balancer.fi/t/bip-920-vebal-compensation-airdrop/7025), veBAL holders received a **one-off compensation payment of 500,000 USDC**, distributed via direct CSV airdrop proportional to veBAL balance at the proposal snapshot. The bulk landed in major wrapper lockers (Aura, StakeDAO, Tetu); those wrappers will **unwind their veBAL positions and distribute the rewards to underlying users** (sdBAL, auraBAL, tetuBAL holders) accordingly.

See the [Governance Overview](../README.md), [Voting](../voting.md), and [veBAL (Historical)](./README.md) pages for the current state. Retained below for historical reference only.
:::

### How did users get veBAL?

When a user provided liquidity into a Balancer pool, they received an ERC-20 token called a "Balancer Pool Token", or BPT. For veBAL, the relevant BPT was from the B-80BAL-20WETH pool.

A user needed BAL or WETH to invest in the B-80BAL-20WETH pool. They could deposit a single asset (incurring price impact) or both assets at the correct weights. Once received, the BPT could be time-locked to receive veBAL.

The lock duration determined how much veBAL was received. veBAL was a function of time and asset: 1 veBAL equalled 1 BPT locked for 52 weeks; a 1-week lock of 1 BPT yielded 1/52 veBAL.

### Could BPTs or veBAL be transferred?

BPTs were transferable; rewards accrued in the wallet where they were held.

veBAL was a non-standard ERC-20 token and could not be transferred.


### Did veBAL holders receive a portion of the protocol fees?

Yes (historical). veBAL holders received a share of protocol fees in USDC. As of [BIP-919](https://forum.balancer.fi/t/bip-919-bal-tokenomics-revamp/7001), all protocol fees route 100% to the DAO Treasury and veBAL holders no longer receive fee distributions. See [Protocol Fee Operations](../protocol-fees.md) for the current model.

### How were the protocol fees paid?

veBAL holders received protocol fees distributed in **USDC**. The fee distribution varied depending on whether fees came from core pools or non-core pools — see the Protocol Fee Model (historical) for the distribution splits that applied at the time.

### When were incentives paid?

Incentives on mainnet accrued each block. Protocol fees were distributed on a weekly basis.

### Was there a way to view total veBAL?

The information was available on the [veBAL Dune Dashboard](https://dune.com/balancer/veBAL).

### How much BPT (B-80BAL-20WETH) was needed to maximize the multiplier? What amount needed to be staked at 1 year to hit the 2.5x boost for liquidity incentives?

The incentives boost was a function of a user's share of the pool and share of total veBAL — range-limited from 1x to 2.5x.

Community contributors built a [veBAL Boost Calculator](https://balancer.tools/veBAL) tool; the underlying math is explained in the historical boost-calculations reference (the page itself was retired alongside the gauge system).

### If veBAL was on mainnet, could it boost staking incentives on L2?

Yes. Balancer supported cross-chain gauges, and veBAL boosted staking incentives on L2 gauges. The boost depended on the user's share of the gauge's staked liquidity and their share of total veBAL.

### How did one extend their veBAL lock?

Via the veBAL UI: open the "Lock until" widget, click "+", choose the desired time, and confirm.

### Did voters decide how emissions were split across networks, or was that preset?

Voters determined the amount of emissions going to gauge-listed pools on Ethereum mainnet and on L2 chains. The voting happened on Ethereum mainnet.

### Was the veBAL gauge vote on-chain, and did it require gas?

Yes. Gauge votes were on-chain and cost gas. They were cast in the Balancer dApp. Other governance decisions (e.g., approving new gauges) happened via [Snapshot](https://snapshot.org/#/balancer.eth) and were gasless.

A weekly vote for veBAL holders ended at 00:00 UTC each Thursday. If the same pool allocation persisted across epochs, no new vote or gas was needed — veBAL holders voted once unless they wanted to change their allocation.

### Could votes be delegated?

veBAL gauge voting could not be delegated. Snapshot voting (covering general DAO governance and gauge approvals) could be delegated via the [Snapshot delegation page](https://snapshot.org/#/delegate/balancer.eth). A list of delegates and their vote rationales lived in the [Delegate Citadel](https://forum.balancer.fi/c/delegate-citadel/14) on the Balancer Forum. Note that the BIP-921 voting model now uses raw BAL across seven chains — see [Voting](../voting.md).

### How did one make a pool eligible for gauge voting?

A governance proposal was required. See the [Governance Process](../process.md). With BAL emissions halted by [BIP-919](https://forum.balancer.fi/t/bip-919-bal-tokenomics-revamp/7001), no new gauges are being added for BAL emissions.

### Did veBAL support Gnosis Safe?

Vote-escrowed (ve) systems typically did not allow arbitrary contracts to lock — otherwise the ve token would be trivial to tokenize, defeating the lock-up's purpose. Users could lock veBAL from an EOA and delegate it to a Gnosis Safe to receive the boost. Entities interested in locking a large veBAL position via a multisig could appeal to governance for whitelisting.

### Was there a repository of contract addresses for the staking and veBAL contracts?

The veBAL and gauge contracts remain deployed on-chain (locks persist until natural expiry) but are no longer used for fee distribution, voting weight, or BAL emissions.

| Contract                                                                                                        | Purpose                                              |
|:----------------------------------------------------------------------------------------------------------------|:-----------------------------------------------------|
| [veBAL](https://etherscan.io/tx/0xaa29cd251cdb024c415b0e13f67a0ca74fe5abc3de9a9fedd1ae26fd39be4025)             | Locked BPTs and reported veBAL balances              |
| [Gauge Controller](https://etherscan.io/address/0xC128468b7Ce63eA702C1f104D55A2566b13D3ABD)                     | Managed gauges and emissions                         |
| [Gauge Adder](https://etherscan.io/address/0x2fFB7B215Ae7F088eC2530C7aa8E1B24E398f26a)                          | Added new gauges approved by governance              |
| [Mainnet Uncapped Gauge Factory](https://etherscan.io/address/0x4e7bbd911cf1efa442bc1b2e9ea01ffe785412ec)       | Create gauges with no cap on Mainnet                 |
| [Mainnet Capped Gauge Factory](https://etherscan.io/address/0xf1665e19bc105be4edd3739f88315cc699cc5b65)         | Create gauges with possible cap on Mainnet           |
| [Polygon Capped Gauge Factory](https://etherscan.io/address/0xa98bce70c92ad2ef3288dbcd659bc0d6b62f8f13)         | Create gauges with a possible CAP on Polygon         |
| [Polygon Child Chain Gauge Factory](https://polygonscan.com/address/0x3b8ca519122cdd8efb272b0d3085453404b25bd0) | Create child gauge to hold LP tokens on Polygon      |
| [Arbitrum Capped Gauge Factory](https://etherscan.io/address/0x1c99324edc771c82a0dccb780cc7dda0045e50e7)        | Create gauges with a possible CAP on Arbitrum        |
| [Arbitrum Child Chain Gauge Factory](https://arbiscan.io/address/0xb08e16cfc07c684daa2f93c70323badb2a6cbfd)     | Create child gauge to hold LP tokens on Arbitrum     |
