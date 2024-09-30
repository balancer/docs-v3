---
title: Gauge Onboarding
order: 3
---

## Staking Gauge Onboarding FAQ

In simple terms, a ‘Gauge’ is a contract that allows for streaming BAL emissions to a Liquidity Pool. Pools do not automatically have a gauge, they must be approved via governance. This means that for any liquidity pool to receive BAL emissions, external protocols/DAOs must propose a gauge and Balancer Governance must approve.

### What is the process for getting a gauge approved on Balancer?
1. Set up your pool based on your business needs. Make sure all steps are correctly done (e.g. rate provider is vetted in and composable stable pool is correctly set up)
2. Apply for a Balancer gauge via a [forum post](https://forum.balancer.fi/c/vebal/13)
3. Allow for a preliminary discussion period on the forum
4. Balancer contributors will assist you in uploading your proposal to snapshot
5. Await veBAL governance approval. Votes start on Thursdays 8PM CET and end Mondays 8PM CET
6. Upon approval, veBAL voters can vote on the next voting cycle. E.g. approval by Monday will enable the gauge by Tuesday latest.

### What is the purpose of gauge votes?
The specific proportion that pools receive BAL incentives comes down to the Gauge Vote. The Gauge ‘Vote’ system has become an industry-wide standard for Decentralised Exchanges, allowing governance token holders of the protocol (veBAL for Balancer) to vote and dictate which LPs the DEX’s native token emissions flow to. The distribution and direction of BAL are decided on a weekly cadence by this vote. External DAOs have the ability to acquire a veBAL position and vote for their own pools, or they can participate in the Vote Markets to persuade other veBAL holders to vote for their pools and direct BAL incentives to their LP.

### What is the gauge cap and what cap should a project apply for?
In order to ensure Balancer DAO longevity and incentive efficiency is optimized, gauge caps were introduced that limit the maximum percentage of BAL emissions a particular LP can receive. The particular cap you should apply for is based on a few metrics. There are two phases of analysis - first using a “weight” factor with a “market cap” factor to derive an “overall” factor. All gauges scoring below a certain threshold would proceed to the second phase which would apply a “revenue” factor, helping those small pools which are generating significant revenue reach the threshold. If a pool remains below the threshold after phase 2 it will undergo a mandatory migration to a new gauge with a 2%, 6% or 10% maximum cap on the emissions it can receive.

**Market cap Factor**

`token mcap factor = mcap (in USD millions) / % weighting`

`mcapFactor = square root (min(token mcap factor))`

**Overall Factor**

`mcapFactor^weightFactor = overall factor`

**Revenue Factor**

An average of the percentage of total revenue a pool contributed during the most recent two protocol fee distribution periods. This factor is bounded by 1 to 100 and is multiplied by the overall factor.


### General guidelines/tips for gauge proposals
- Outlining why a gauge would benefit the Balancer and wider ecosystem is always welcomed
- Prevent provisioning of too many gauges, rather focus on a select set of core pools that shall receive a gauge
- Some proposals require input from contributors or DAO participants. Therefore, always make sure to screen our forums for updates
- The DAO "cleans up" old gauges that didn't receive any votes for a while in irregular time-frames. If your project will be flagged, the DAO will make sure to contact you to make sure the offboarding runs smoothly

## Resources
- [Gauge Setup Instructions](https://forum.balancer.fi/t/instructions-overview/2674)
- [Balancer Forum: Gauge Proposals](https://forum.balancer.fi/c/vebal/13)
- [Rate Provider Registry](https://github.com/balancer/code-review/tree/main/rate-providers)
