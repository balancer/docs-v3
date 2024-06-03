---
title: Yield-bearing Asset Onboarding
order: 1
---

# Onboard your yield-bearing Asset to Balancer v2

::: tip
Balancer contributors are happy to help during the onboarding process. Feel free to reach out to us on our discord!
:::
Onboarding of your yield-bearing asset involves a few steps to fully leverage Balancer tech. These steps include
whitelisting of your token, provision of a rate provider for optimized trading as well as applying to a Balancer gauge
to receive BAL rewards if your project wishes to do so.
The following chapters outline the steps needed and points towards all relevant resources to deploy your liquidity on
Balancer v2.

## Token Whitelisting

Whitelist your token by doing a Pull-Request [here](https://github.com/balancer/tokenlists) (Balancer contributors can
assist)

1. Provide token images and store png files with the token address like `0xba100000625a3754423978a60c9317c58a424e3D.png`
2. Update `tokenlists/balancer/tokens` and the corresponding network typescript file by adding your token address (
   e.g. `tokenlists/balancer/tokens/arbitrum/0x…`)

## Rate Provider

Given you want to onboard a yield-bearing asset stable pair with a stable pool, it is required that you provide a vetted
in rate provider upon pool creation.
For security reasons and to make sure your rate provider adheres to
Balancer’s standards, please initiate a rate provider review [here](https://github.com/balancer/code-review/issues)

::: info
Depending on the complexit of your rate provider, reviews usually take up to 1-2 weeks for Balancer labs to complete.
Consult the [issue board](https://github.com/balancer/code-review/issues) for the review status

Consult our [rate provider onboarding FAQ](./rate-providers.md) for more details
:::

A registry of already reviewed providers can be
found [here](https://github.com/balancer/code-review/tree/main/rate-providers)

## Pool Creation and Initialization

Create the pool (with the help from Balancer contributors)

- Go to the [community pool creator tool](https://pool-creator.web.app/)
- Choose ComposableStable Pool and make sure `Yield Protocol Fee Exempt` is `false`
- Approve and Add your token and your rate provider that has been approved in step 2
- Add any other token (and rate providers) for up to 5 tokens
- Create the pool

After successful pool creation, make sure to perform an init join for this pool type to seed initial liquidity

## Data Endpoints for Yield metrics (APR)

Provide an API endpoint for your yield bearing token, ideally with <code>api-yourtoken</code> and the APR as one of the
return values. Contributors
will make sure the APR is propagated in our front-end.
You can provide your endpoint in our [yield token registry](https://github.com/balancer/yield-tokens). This will
guarantee that our backend will pick up token yield correctly and ultimately display the rate correctly on our front-end
deployments.

## BAL Rewards and Gauges

If you want to receive BAL rewards, set up a proper root gauge on the network your pool was deployed and apply for a
gauge (contributors will assist here):

#### Create a gauge

:::info
A detailed overview of target chain gauge creation endpoints can be
found [here](https://forum.balancer.fi/t/instructions-overview/2674)
:::

Depending on the network you want to create a gauge, several steps are needed to onboard your pool to receive BAL
rewards. In essence following steps need to be performed in terms of gauge creation

### Apply for receiving BAL rewards through Balancer governance

1. Post a proposal based on the gauge
   proposal [instruction set](https://forum.balancer.fi/t/instructions-overview/2674/2)
2. Balancer contributors will make sure all criteria are met and post votes by Thurdsays
3. The voting round lasts from Thursday 8PM CET until the following Monday 8PM CET
4. After a successful vote, an on-chain transaction to add gauges to the gauge controller has to be executed. This
   usually happens until Tuesday evening CET
5. The newly voted in gauge should be visible to vote for on
   the [veBAL voting page](https://app.balancer.fi/#/ethereum/vebal)

::: tip
If your gauge is deployed on Ethereum mainnet, BAL rewards will flow shortly after the last voting round concludes. If
you deployed a gauge on any L2 network (e.g. Arbitrum, Polygon POS) there is a one week delay until rewards are streamed
to the corresponding gauge.
:::



