---
title: Voting Incentive Marketplaces
order: 7
---

# Voting Incentive Marketplaces
There exist several voting markets to encourage voting for Balancer gauges on Balancer v2. The most prominent voting markets are

- [HiddenHand](https://hiddenhand.finance/balancer)
- [Paladin Quests](https://quest.paladin.vote/#/bal)
- [StakeDAOs Votemarket](https://votemarket.stakedao.org/?market=bal&solution=All)

Balancer DAO does not endorse any voting market and encourages protocol participants to explore available options independently.

## Voting Markets and the Core Pool Framework
A fraction of core pool revenue is recycled back into voting markets as voting incentives to align BAL token emissions with pool performance as part of our [fee model](../../concepts/protocol-fee-model). The [core pool framework](core-pools.md) allows participants to benefit from Balancer's success and attract more liquidity through attractive emissions. The configuration of the emission ratio is decided by Balancer governance and is subject to change. The Balancer DAO currently places voting incentives in USDC on Ethereum mainnet.

## Voting Market Emission Efficiency and Core Pools
A topic that comes up frequently when interacting with voting markets is the analysis of emission efficiency. The emission efficiency is a ratio of the $ value of placed voting incentives vs emissions received for votes placed. Ideally, for an entity placing voting incentives, emission efficiency should stay above 1, so that more token rewards are emitted to a gauge than invested in $ value terms. Note that the voting marketplace landscape is a dynamic system and depends on many factors like overall incentive allocation, token prices and market dynamics. The core pool framework dictates placing of voting incentives independent of emission efficiency as per current [voted in governance](https://forum.balancer.fi/t/bip-19-incentivize-core-pools-l2-usage/3329). Therefore, it is crucial for parties interested in placing voting incentives to understand these implications and act accordingly. 

### Estimating voting efficiency
The community has provisioned several tools to evaluate voting incentive efficiency. One such tool can be consulted for the [AURA marketplace](https://aura.defilytica.com/#/incentiveSimulator) and the [Balancer marketplace.](https://defilytica.tools/#/balancer/incentiveSimulator) Note that these tools do not guarantee correct outcomes as the voting incentive market is a dynamic system that reacts to token prices, incentive volume and voter participation.
