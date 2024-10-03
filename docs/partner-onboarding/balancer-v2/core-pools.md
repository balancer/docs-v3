---
title: Core Pool Framework
order: 1
---

# Balancer v2's Core Pool Framework
The core pool framework was designed by Balancer contributors to align token emissions with pool performance in terms of fees collected. At Balancer, fees are collected for swaps and for yield on yield bearing tokens (see [here](https://docs.balancer.fi/concepts/governance/protocol-fees.html#governable-protocol-fees)). Core Pools are pools that have all protocols fees redirected back into the same pool that generated them to initiate a sustainable incentive flywheel.

A pool can become a core pool if the following condition is met:

- The pool contains at least 50% yield bearing tokens that Balancer earns protocol fees on
- The pool meets all technical requirements as described [here](./onboard-yb-token.md)
- The pool has been voted in by governance as such and has a gauge rewards can be streamed to


Fees collected by a core pool are tracked and processed every 2 weeks. All tokens are swapped to USDC and then distributed. The reasons for this bi-weekly schedule are two-fold:

- Cooldown of 10 days after veBAL votes have been placed
- Bi-weekly voting schedule on the yield aggregator Aura which directs incentives through locked veBAL in their protocol via votes from vlAURA holders

The collected fees are then split up in the following way:

- 50% are distributed as core pool incentives, meaning fees earned are placed as voting incentives on secondary voting markets. The goal is that pools with lots of fees earned shall receive more BAL (and AURA) emissions by encouraging stakeholders to vote for those gauges
- 32.5% of all these fees are distributed to veBAL and vlAURA holders as part of our revenue share model
- 17.5% of fees collected are paid out to the DAO. These funds are mostly used to fund service providers to advance the protocol


::: info
Swap fees that have been collected from non-core pools will be recycled and distributed to core pools providing an additional boost in voting incentive sizing and therefore BAL emissions.
:::

To summarize: core pools participate in the ecosystem flywheel by being entitled to more token emissions and participating in the success of the protocol in a unique way.
![Core Pool Framework](/images/corePoolFramework.png)

## Helpful Resources to Learn More
- [BIP-19: Incentivize Core Pools and L2 Usage](https://forum.balancer.fi/t/bip-19-incentivize-core-pools-l2-usage/3329)
- [Core Pools Dashboard](https://balancer.defilytica.com/#/corePools)
- [Protocol Fee Dune Dashboard](https://dune.com/balancer/protocol-fees)
