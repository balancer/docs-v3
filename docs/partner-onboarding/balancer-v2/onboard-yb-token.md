---
title: Yield-bearing Asset Onboarding
order: 2
---

# Onboarding Yield-bearing Assets

This guide outlines the process of onboarding yield-bearing assets to Balancer v2. To fully leverage Balancer's technology, you'll need to complete several key steps including token setup, rate provider implementation, pool creation, and optional gauge setup for BAL rewards.

## Step-by-Step Onboarding Process

### 1. Token Setup
First, ensure your token is properly whitelisted on Balancer. See our [token whitelisting guide](./token-whitelisting.md) for detailed instructions.

### 2. Rate Provider Implementation
::: tip Documentation
For detailed information, see our [rate provider onboarding FAQ](../onboarding-overview/rate-providers.md)
:::

For yield-bearing asset stable pairs using a stable pool, you must provide a vetted rate provider during pool creation:

1. Review existing rate providers in our [registry](https://github.com/balancer/code-review/tree/main/rate-providers)
2. If needed, submit your rate provider for review [here](https://github.com/balancer/code-review/issues)

::: info Review Timeline
Rate provider reviews typically take 1-2 weeks for Balancer Labs to complete. Monitor the [issue board](https://github.com/balancer/code-review/issues) for review status.
:::

### 3. Pool Creation and Initialization

Use the [community pool creator tool](https://balancer.defilytica.tools/pool-creator-v2) to create your pool:

1. Select ComposableStable Pool type
2. Set `Yield Protocol Fee Exempt` to `false`
3. Add your token and approved rate provider
4. Add additional tokens (up to 5) with their rate providers
5. Create the pool
6. Perform an init join to seed initial liquidity

### 4. APR Data Integration

To ensure accurate yield metrics display:

1. Provide an API endpoint for your yield-bearing token
   - Format: `api-yourtoken`
   - Include APR in return values
2. Register your endpoint in the [yield token registry](https://github.com/balancer/yield-tokens)
3. This ensures correct APR display across Balancer frontend deployments

### 5. BAL Rewards Setup (Optional)

If you want to receive BAL rewards, you'll need to set up a gauge and apply through governance.

#### Gauge Creation
::: info Network-Specific Instructions
Find detailed gauge creation endpoints for different networks in our [instructions overview](https://forum.balancer.fi/t/instructions-overview/2674)
:::

#### Governance Application Timeline

1. Submit proposal following the [instruction set](https://forum.balancer.fi/t/instructions-overview/2674/2)
2. Contributor review by Thursday
3. Voting period: Thursday 8PM CET to Monday 8PM CET
4. On-chain gauge controller transaction by Tuesday evening CET
5. Gauge appears on [veBAL voting page](https://app.balancer.fi/#/ethereum/vebal)

::: tip Reward Distribution
- Ethereum mainnet: BAL rewards begin after voting round
- L2 networks (Arbitrum, Polygon POS): One week delay before reward streaming
  :::

## Additional Resources

- [Gauge Onboarding Guide](../onboarding-overview/gauge-onboarding.md)
- [Rate Provider Documentation](../onboarding-overview/rate-providers.md)
- [Core Pool Framework](../onboarding-overview/core-pools.md)
- [Protocol Fees Documentation](../../concepts/governance/protocol-fees.md)
