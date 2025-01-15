---
title: Incentive Management
order: 1
---

# Introduction

# BAL Incentives

# Secondary Reward Token Incentives
The Balancer Maxis have built a sophisticated infrastructure to create and manage secondary reward campaigns for Balancer staking gauges. To make full use of this system, the Maxis provide tooling to facilitate the setup.
For secondary reward distributions on Balancer, following limitations apply (given Balancer's staking gauges are based on Curve's Vyper implementation):
1. A staking gauge can have up to 6 reward tokens. The Maxis recommend to use less than 3 to avoid issues if a gauge will receive BAL (and subsequently AURA) rewards.
2. A gauge distributes rewards in a 1 week schedule after receiving funds. Meaning if you deposit 100 Token A on Monday 00:00 UTC, then those 100 tokens will be distributed over 7 days at a rate of 14.285 tokens / day
3. Each reward token has its own 1 week distribution schedule based on the time of deposit

::: warning
Directly depositing reward tokens to the gauge contract will result in loss of funds!
:::

## Step-by-step Guide: Create a secondary Reward Token Program on Balancer
These sections will provide a step-by-step guide on how to enable, program and distribute secondary rewards based on the Maxis rewards injector infrastructure
::: info
The Balancer Maxis are at your service to setup and deploy rewards injectors. You can also manage injectors yourself if you please to do so and we are happy to help along the setup process
:::
### Token Whitelisting
Prerequisite for the reward token to be properly picked up by our infrastructure is that it is whitelisted in our tokenlist. Whitelist the reward token by doing a pull-request [here](https://github.com/balancer/tokenlists). Make sure you are providing a checksummed entry for the relevant network entry
### Gauge Creation
Depending on the network your pool is deployed on, the procedures slightly differ which is explained further below. This assumes that the pool is deployed and has at least a few dollars of liquidity in it. Make sure to check the main app. If the pool is explorable and shows basic stats, it means it has been indexed by our backend and you can proceed with creating a gauge.
#### Deploying a gauge on Ethereum Mainnet
1. Select Ethereum on the [gauge creator tool](https://balancer.defilytica.tools/gauge-creator)
2. Search your pool in the pool list
   ![Select Pool](/images/incentive-management/gauge_creation_1.png)
3. If a gauge has already been created, you can skip this step (UI will show a warning)
   
4. If no gauge entry was found for your pool, select it
5. Depending on your pool composition, select a voting cap above 2% (please refer to gauge caps [here](../balancer-v2/gauge-onboarding.md))
6. Execute the transaction by clicking "Create Mainnet Gauge" 

<img src="/images/incentive-management/gauge_creation_2.png" width="300" alt="asdf">

7. The gauge ID will show up under event logs and in the UI ([example tx logs](https://etherscan.io/tx/0x4f6057e257f17ed430d13b18bfd9648779369a964df71e1d0db248699c7f14ba#eventlog))
   ![Creation event](/images/incentive-management/gauge_creation_5.png)
#### Deploying a gauge on a Layer 2 network (Gnosis)
1. Go to [gauge creator tool](https://balancer.defilytica.tools/gauge-creator) and select a Layer 2 network (e.g.) Gnosis chain
2. Search for your target pool.
3. The tool will provide you with information if a gauge on the target network already exists
![Skip for Gauge](/images/incentive-management/gauge_creation_4.png)
4. Create the Child Chain Gauge and execute the transaction 
5. There is no need to create a root gauge - only do this if you plan on applying for a veBAL gauge to receive BAL rewards!

### Rewards Injector Creation
Depending on your use-case you want to create a rewards injector for your reward token.

### Gauge configuration
#### Whitelisting reward tokens on a target gauge

### Rewards Injector Configuration


::: tip
Deploying secondary incentives on Balancer is not fully permissionless. For a token to be added as reward token, an authorized multi-sig needs to whitelist that token. The Balancer Maxis control this infrastructure and will facilitate whitelisting.
::: 
