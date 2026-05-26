---
title: Gauge Onboarding
order: 3
---

# Gauge Onboarding

A gauge is a staking contract that enables token rewards to flow to liquidity providers of a pool. Pools do not automatically have gauges — they must be created first.

:::warning BAL emissions halted
Per [BIP-919 (BAL Tokenomics Revamp)](https://forum.balancer.fi/t/bip-919-bal-tokenomics-revamp/7001), **BAL emissions to gauges are halted** and all voting-incentive markets have been terminated. This page covers gauge creation for **third-party (non-BAL) reward routing only** — for example, LST/LRT yield streams or partner reward tokens.

Gauge infrastructure is maintained on a best-effort basis; the core team may migrate routing to alternative systems (e.g. MERKL) in the future. There is no longer a Snapshot vote, gauge controller weight, or veBAL gauge category for new gauges.
:::

## When You Need a Gauge

You need a gauge if you want to **stream your own reward tokens** to LPs through Balancer's on-chain reward infrastructure (via the `claimable_rewards` flow). If you don't intend to distribute secondary rewards, you do **not** need a gauge — pool fees flow to LPs directly through the Vault.

## Prerequisites

Before creating a gauge:

1. Your pool is deployed and indexed (visible on the [Balancer App](https://balancer.fi))
2. Rate providers are vetted (if applicable) — see [Rate Provider Registry](https://github.com/balancer/code-review/tree/main/rate-providers)
3. Your reward token is whitelisted in the [Balancer tokenlist](https://github.com/balancer/tokenlists)

## Create the Gauge

Use the [Gauge Creator Tool](https://ops.balancer.fi/gauge-creator) to deploy your gauge contracts.

### Ethereum Mainnet Pools

1. Select "Ethereum" on the gauge creator
2. Search and select your pool from the pool list
   ![Select Pool](/images/incentive-management/gauge_creation_1.png)
3. If a gauge has already been created for your pool, the UI will display a warning — you can skip this step
   ![Gauge Already Exists](/images/incentive-management/gauge_creation_4.png)
4. Execute the transaction by clicking "Create Mainnet Gauge"
5. **Note down the gauge address** — it will appear in the event logs and in the UI after a successful transaction
   ![Creation Event](/images/incentive-management/gauge_creation_5.png)

For mainnet, only the root gauge is needed.

### L2 / Sidechain Pools

For pools on Arbitrum, Polygon, Gnosis, Base, Optimism, Avalanche, and other supported L2 networks:

1. **Create the Child Chain Gauge first:**
   - Select the target network on the gauge creator
   - Search and select your pool from the pool list
   - The tool will indicate if a child-chain gauge already exists for this pool
   - Execute the child-chain gauge creation transaction

2. **(Optional) Create the Root Gauge on Ethereum:**
   - Historically a root gauge was required to route BAL emissions across chains. With emissions halted, a root gauge is no longer necessary for secondary-reward use cases — LPs interact directly with the child-chain gauge.

## Next Steps

Once your gauge is deployed, follow the [Incentive Management Guide](./incentive-management.md) to:

- Whitelist your reward token on the gauge
- Configure a rewards injector for automated distribution
- Fund the program

## Security Notes

- Balancer's [Emergency subDAO](../../concepts/governance/emergency.md) may disable pools or gauges in case of malicious activity.
- The stale-gauge removal framework defined by [BIP-795](https://forum.balancer.fi/t/bip-795-kill-stale-gauges-q1-2025/6410) is **no longer operationally meaningful** post-[BIP-919](https://forum.balancer.fi/t/bip-919-bal-tokenomics-revamp/7001): with BAL emissions halted there is nothing to reclaim by killing a gauge, so routine gauge kills are no longer performed. The framework is retained for historical reference, and the Emergency subDAO can still kill a gauge if needed for protocol-safety reasons.

## Resources

- [Gauge Creator Tool](https://ops.balancer.fi/gauge-creator)
- [Incentive Management Guide](./incentive-management.md)
- [Rate Provider Registry](https://github.com/balancer/code-review/tree/main/rate-providers)
- [BIP-919: BAL Tokenomics Revamp](https://forum.balancer.fi/t/bip-919-bal-tokenomics-revamp/7001)
