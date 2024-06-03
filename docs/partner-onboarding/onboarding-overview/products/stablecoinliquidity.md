---
order: 3
title: Stablecoin Liquidity
heroImage: /images/balancerv3Banner.png
---

## TODO: Add Gyroscope as an example!

## Overview
The simplistic beauty of the Vault’s architecture is that it supercharges the ability to build a fully functioning and integrated AMM. Unlike every DEX that internalises accounting separately within each pool, the Vault manages all DEX’s liquidity and accounting in a unified, battle-tested contract.


What makes Balancer Technology unique when dealing with crypto assets? Balancer provides key innovation in following areas:
1. Vault Architecture
2. Transient Accounting
3. Hooks
4. Boosted Pools

### Vault Architecture
With the launch of V2, Balancer solidified its position as an innovation hub. Notable technological advancements, such as the Vault, separated the fundamental components of a DEX from the more intricate aspects, such as the AMM design itself. This move not only positioned Balancer as a forward-thinking and pioneering DEX but also as the foundational technology for nurturing future DeFi innovations.

The simplistic beauty of the Vault’s architecture is that it supercharges the ability to build a fully functioning and integrated AMM. Unlike every DEX that internalizes accounting separately within each pool, the Vault manages all DEX’s liquidity and accounting in a unified, battle-tested contract. When assets trade, balance changes are managed by the vault, which then plugs into external contracts that define the specific AMM logic utilized (such as weighted math, boosted pools, and stableswap).

This unique design means that all of Balancer’s liquidity is stored in one interconnected hub, providing developers with instant access to DEX liquidity, incentive structures, swap routes, and aggregator integrations. Put simply, Balancer streamlines and simplifies custom pool development.

If you are interested in a more technical overview, please consult the [vault architecture](../../../concepts/core-concepts/architecture.md) docs

#### Case Study
Composable stable pools aren’t the only pools that harness rate provider technology to accurately account for YB liquidity, this tech also serves as a powerful mechanism for external developers who are developing their own invariants. One prominent example is [Gyroscopes E-CLP invariant.](https://twitter.com/GyroStable/status/1727366719097000060)  In addition to asymmetric concentrated liquidity, E-CLPs leverage rate provider technology.

Rate providers make yield-bearing asset pools more efficient by:

- Automating liquidity management
- Mitigating LVR

### Transient Accounting
What happens when you combine the dominant and rapidly growing DeFi asset class with a unique revenue generation mechanism? A focalized liquidity growth strategy around YB assets. Core pools are exactly that - Yield-bearing pools in which a portion of all fees are redirected back into the pool as incentives. Combining this with a unique fee structure means that incentives effectively scale in direct correlation with TVL. However, rather than directing these fees as direct liquidity mining incentives they are deposited as bribes on vote markets. The reason for this is that there are often vote market discrepancies due to incentivization token volatility, total votes, and total bribes. It is these constant fluctuations that result in bribe ROIs averaging higher second-order incentives relative to direct incentives. Put simply, on average, $1 bribe returns more than $1 in BAL incentives.

:::info
[Go here](../../balancer-v2/v2-overview.md#balancer-v2s-core-pool-framework) if you want to learn more about our core pool framework
:::
#### How can you apply for core pool status?
- To qualify as a core pool, the LP must contain at least 50% of the liquidity as Yield-bearing.
- Create a proposal on Balancer forums using the following [template](https://forum.balancer.fi/t/instructions-overview/2674)
- Put forward your pool for  core pool status.
- After voting has concluded your pool will start receiving USDC bounties on hidden hand in proportions to the fees your pool generates.
- BAL incentives will then flow to the pool on the Thursday following your vote.
- Note that rewards on L2 chains are delayed by 1 week

### Custom Pool Logic with Hooks
Hooks are a novel approach to introduce additional execution logic on top of the already flexible Balancer pool architecture.
:::info
Consult the [Hooks](../../../concepts/core-concepts/hooks.md) documentation for an in-depth overview. 
:::

