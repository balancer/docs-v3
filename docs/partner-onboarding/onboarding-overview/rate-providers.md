---
title: Rate Providers
order: 4
---

# Rate Providers

Rate providers are contracts that provide an exchange rate between two assets. For example, the rate of stETH to wstETH. If a pool is created with tokens that use unreviewed rate providers, it will not show on [balancer.fi](https://balancer.fi/pools)

::: tip
- Technical information on rate providers can be found [here](../../concepts/core-concepts/rate-providers.md)
- To submit your own rate provider contract for review, create an issue [here](https://github.com/balancer/code-review/issues/new?assignees=mkflow27&labels=request&projects=&template=review-request.yml)
:::

## When is a rate provider needed?
The primary use-case of a rate provider is the deployment of liquidity in a composable stable pool consisting of correlated or non-correlated assets containing a yield-bearing asset. If 50% or more of the tokens are yield-bearing, the pool is eligible to be flagged as a [core pool](/partner-onboarding/balancer-v2/core-pools.html) to receive a share of fees as voting incentives

## What are the requirements for a rate provider contract?
- Must implement the [`IRateProvider`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/solidity-utils/helpers/IRateProvider.sol) interface, which simply requires a `getRate()` function that returns an 18 decimal fixed point number that is the exchange rate of the token to some other underlying token.
- If the rate provider or any underlying portion of the rate can be upgraded, changed, manipulated in any way it will not be owned by or executed by an EOA. It must be a multisig with a minimum set up of 3/5 signers.
- Timelock is encouraged but not required.
- Should not be susceptible to donation attacks.
- Should be monotonic (up only) in nature.

::: warning Warning
It is essential for the rate provider to behave in the expected way at all times. Scenarios where for example an upgrade 
makes the `getRate` call revert, swaps through the pool will revert. If the rate provider returns unexpected values the pool can get drained.
:::

## What are the steps needed to set up a rate provider with Balancer?
1. Build a rate provider based on the above mentioned requirements and consult the Balancer RP registry
2. Make an [issue](https://github.com/balancer/code-review/issues/new?assignees=mkflow27&labels=request&projects=&template=review-request.yml) against the RP Registry to start the code review process
3. Wait for the review to finish (takes approx. 1-2 weeks depending on the backlog)
4. Implement any needed changes that are required to pass the review
5. Upon merge the rate provider is vetted and a composable stable pool can be set up with the newly implemented rate provider set.


## Resources
- [IRateProvider interface](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/solidity-utils/helpers/IRateProvider.sol)
- [Request a rate provider review](https://github.com/balancer/code-review/issues/new?assignees=mkflow27&labels=request&projects=&template=review-request.yml)
- [Registry of completed rate provider reviews](https://github.com/balancer/code-review/tree/main/rate-providers)
