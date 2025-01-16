---
title: Incentive Management
order: 1
---

# Introduction
The Balancer ecosystem is utilizing a modified version of Curve's vyper gauge infrastructure. Here, we outline how you can utilize our staking gauge system. We cover both how you can apply for a veBAL gauge to receive BAL rewards and how secondary reward programs can be set up.

## BAL Incentives through veBAL Gauges
BAL is emitted to whitelisted staking gauges in our veBAL system. For a pool to be eligible for BAL rewards, it needs to be voted in by governance. The process on how to apply for a BAL staking gauge can be found [here](../balancer-v2/gauge-onboarding.md). A guide on how to set up a gauge can be found in the gauge creation [section](incentive-management.md#gauge-creation)

## Secondary Reward Token Incentives
The Balancer Maxis have built a sophisticated infrastructure to create and manage secondary reward campaigns for Balancer staking gauges. To make full use of this system, the Maxis provide tooling to facilitate the setup.
For secondary reward distributions on Balancer, following limitations apply (given Balancer's staking gauges are based on Curve's Vyper implementation):
1. A staking gauge can have up to 6 reward tokens. The Maxis recommend to use less than 3 to avoid issues if a gauge will receive BAL (and subsequently AURA) rewards.
2. A gauge distributes rewards in a 1 week schedule after receiving funds. Meaning if you deposit 100 Token A on Monday 00:00 UTC, then those 100 tokens will be distributed over 7 days at a rate of 14.285 tokens / day assuming there is BPT staked in the gauge.
3. Each reward token has its own 1 week distribution schedule based on the time of deposit

::: warning
Directly depositing reward tokens to the gauge contract will result in loss of funds! If you want to manage deposits yourself, make sure the depositor is whitelisted as a [distributor](incentive-management.md#whitelisting-reward-tokens-on-a-target-gauge) and that you call `deposit_reward_token`
:::

## Guide: Create a secondary Reward Token Program on Balancer
These sections will provide a step-by-step guide on how to enable, program and distribute secondary rewards based on the Maxis rewards injector infrastructure
::: info
The Balancer Maxis are at your service to setup and deploy rewards injectors. You can also manage injectors yourself if you please to do so, and we are happy to help along the setup process
:::
### Token Whitelisting
Prerequisite for the reward token to be properly picked up by our infrastructure is that it is whitelisted in our tokenlist. Whitelist the reward token by doing a pull-request [here](https://github.com/balancer/tokenlists). Make sure you are providing a checksummed entry for the relevant network.
### Gauge Creation
Depending on the network your pool is deployed on, the procedures slightly differ which is explained further below. This assumes that the pool is deployed and has at least a few dollars of liquidity in it. Make sure to check the main app. If the pool is explorable and shows basic stats, it means it has been indexed by our backend, and you can proceed with creating a gauge.
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
5. There is no need to create a root gauge - only do this if you plan on applying for a veBAL gauge to receive BAL rewards! More detailed instructions on this process can be found [here](https://forum.balancer.fi/t/instructions-overview/2674).

### Rewards Injector Creation
Depending on your use-case you want to create a rewards injector for your reward token. In that case, you need to follow a series of configuration steps outlined below.
::: info
The Balancer Maxis are the primary POC for incentive management and are happy to assist you along the way of setting up your incentive plans. For more information on the Injector v2 infrastructure, consult the repository [documentation](https://github.com/BalancerMaxis/ChildGaugeInjectorV2).
:::

1. Create a new rewards injector from the factory following the [documentation](https://github.com/BalancerMaxis/ChildGaugeInjectorV2?tab=readme-ov-file#deploying-an-injector-using-the-factory).
::: tip
The canonical factory for injectors v2 can be accessed via `0x6142582f8946bf192a4f80ed643a5856d18a7060` on all networks Balancer is currently deployed to.
:::
2. Make sure the reward token is [whitelisted](incentive-management.md#token-whitelisting) in our tokenlist
3. Depending on your needs, choose different initial configuration parameters.
4. If your new injector has been set up correctly, it will show up in the Injector v2 viewer [drop-down list](https://balancer.defilytica.tools/rewards-injector?version=v2)

### Gauge configuration
#### Whitelisting reward tokens on a target gauge
::: tip
Deploying secondary incentives on Balancer is not fully permissionless. For a token to be added as reward token, an authorized multi-sig needs to whitelist that token. The Balancer Maxis control this infrastructure and will facilitate whitelisting.
:::
Before a target pool can receive secondary token rewards, you need to make sure that the reward token has been registered with the correct distributor. On the gauge contract you can read the current configuration via the `reward_data` field by passing the reward token address as input argument. If your token is not whitelisted, follow these steps:
1. Go to the [Add Reward Token to Gauge](https://balancer.defilytica.tools/payload-builder/add-reward-to-gauge) payload builder on the operations UI
2. For the input arguments, do the following:
   * Target gauge: the gauge you want to whitelist
   * Reward token: your desired reward token
   * Distributor addresse: your injector or alternative reward distributor
3. Click "Add Reward"
4. Generate payload and review / simulate via tenderly
5. Do a pull request for the Balancer Maxis operations repository. A Maxi will review the payload and load it within 12h of receiving the request
6. Once the payload has been executed by our managed multi-sig, you should see the reward token configuration by using the `reward_data` method
### Rewards Injector Configuration
::: info
Be careful when setting up rewards schedules. If Chainlink automation and a program without a start timestamp are setup, this will mean that incentives will directly be distributed if they are present in the injector
:::
The Maxis have built comprehensive infrastructure and tooling to make this process as easy as possible. Before configuring an injector make sure the following criteria are met:
* Gauge created
* Reward token and injector as distributor correctly set up
* Reward token is whitelisted on the Balancer [tokenlist](https://github.com/balancer/tokenlists)
* Chainlink Automation: Injector Upkeep is correctly configured and there is enough LINK to fund the upkeep (more details on this topic [here](https://github.com/BalancerMaxis/ChildGaugeInjectorV2?tab=readme-ov-file#setting-up-a-chainlink-automation-balancer-maxi-specific-notes))

Now you can create your own schedule with the [injector configuration tool](https://balancer.defilytica.tools/payload-builder/injector-configurator?version=v2)
![Injector Configurator](/images/incentive-management/injector_config_1.png)
1. Click on "Add Recipients"
2. Choose the parameter set for your incentive program:
   * Recipients: Enter your target gauge(s) you set up in the previous steps
   * Define the amount per one week period you want to emit 
   * Define for how many periods (weeks) the program will run 
   * If you want to define a specific start date, fill out a UNIX time stamp
3. Generate the payload
4. Review if the Tenderly simulation passes correctly
5. If the Balancer Maxis are set as manager, do a pull request to our repository. If you have set your own multi-sig or other EOA as manager, execute the payload via your safe.

### Funding of the Rewards injector
Funding is straightforward: you can simply deposit funds into the injector contract. Rest assured that the configured `owner` can sweep any amounts left in the injector at any time.

## Secondary Reward Setup Checklist
Given the many steps involved in setting up a secondary rewards program, we made this checklist for you to go through based on the above guides:




