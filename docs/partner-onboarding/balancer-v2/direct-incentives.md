---
title: Direct Incentives
order: 6
---

# Overview
Apart from receiving BAL incentives, a pool can also configure direct incentives for their desired token. Prerequisites for this feature are a functional staking gauge for a given pool where reward tokens can be streamed to. Incentives can either be placed directly through Reward injectors created by community contributors or by utilizing secondary protocol infrastructure like direct reward injection on AURA gauges.

## Direct Incentives on Balancer: Reward Injectors
The Balancer Maxis created Reward injector contracts as a means to time and manage reward injections into a gauge contract. Depending on the deployment, infrastructure can be set up to either create a single gauge injection schedule or a more complex set of injection schedules for secondary rewards.

### Direct incentives on L2 deployments
Given rewards shall be streamed to a gauge on L2 (e.g. Arbitrum), contributors can assist in setting up a rewards injection schedule based on our [injector infrastructure](https://github.com/BalancerMaxis/ChildChainGaugeInjectoooor). Following conditions apply when setting up an injector
- Rewards can only be set up for weekly emission schedules on a pre-defined time
- Programs need to be funded to be triggered
- Secondary reward injectors are not maintained by Balancer labs but are a service of the Balancer Maxis Service Provider.

## Direct Incentives on Aura Finance
Aura Finance is a yield aggregator protocol built on top of Balancer. It allows to configure and stream rewards to their staking contracts (gauges) through their UI. Consult [their docs](https://docs.aura.finance/developers/how-to-___/add-extra-incentives-to-aura-pools) on how to set up direct incentives. Note that incentives placed on the AURA UI will only be streamed to AURA staking gauges and not Balancer gauges!
