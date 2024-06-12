---
title: Rate Provider Onboarding
order: 2
---

## Rate Provider FAQ

### What is a rate provider?
::: tip
Technical information on rate providers can be consulted in this [developer section](../../concepts/core-concepts/rate-providers.md)
:::
A rate provider is a contract that provides a rate relative to the underlying asset. For example: wstETH and stETH. Examples can be found in [this repo](https://github.com/balancer/code-review/tree/main/rate-providers).

Requirements for a rate contract are:

- The contract returns a getRate() function which is and 18 decimal fixed point number regardless of underlying tokens.
- Implements the IRateProvider interface
- If the rate provider or any underlying portion of the rate can be upgraded, changed, manipulated in any way it will not be owned by or executed by an EOA. It must be a multisig with a minimum set up of 3/5 signers.
- Timelock is encouraged but not required.
- Ideally is not susceptible to donation attacks and is monotonic (up only) in nature.

### When is a rate provider needed?
The primary use-case of a rate provider is the deployment of liquidity in a composable stable pool consisting of correlated or non-correlated assets containing a yield-bearing asset. If 50% or more of the tokens are yield-bearing, the pool is eligible to be flagged as a [core pool](v2-overview.md#balancer-v2-s-core-pool-framework) to receive a share of fees as voting incentives

### What are the steps needed to set up a rate provider with Balancer?
1. Build a rate provider based on the above mentioned requirements and consult the Balancer RP registry
2. Make an [issue](https://github.com/balancer/code-review/issues/new?assignees=mkflow27&labels=request&projects=&template=review-request.yml) against the RP Registry to start the code review process
3. Wait for the review to finish (takes approx. 1-2 weeks depending on the backlog)
4. Implement any needed changes that are required to pass the review
5. Upon merge the rate provider is vetted and a composable stable pool can be set up with the newly implemented rate provider set.

## Resources
- [Rate provider registry](https://github.com/balancer/code-review/tree/main/rate-providers)
