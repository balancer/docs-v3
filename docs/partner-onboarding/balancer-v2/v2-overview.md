---
title: Overview
order: 0
---

# Onboarding to Balancer v2

Balancer v2 has been a core pillar of DeFi since 2021. By leveraging innovative pool types, Balancer v2 has attracted liquidity in the liquid staking token (LST) and liquid restaking token (LRT) sector.

Balancer Technology provides decentralized infrastructure for DAOs, enabling efficient scaling of Yield Bearing assets, creating advanced Governance positions, and developing customized pool types. The Balancer ecosystem facilitates the streamlined scaling of liquidity for DAOs through core pool incentive flywheels and its network of liquidity enhancing protocols.

::: warning Security Advisory
Before integrating new tokens with Balancer V2, please review our [token whitelisting](./token-whitelisting.md) documentation and security considerations. For new integrations, we recommend using Balancer V3.
:::

## Onboarding Steps

Onboarding to Balancer v2's tech stack involves various steps depending on your specific needs:

1. Choosing and launching your pool
2. Providing initial liquidity
3. Onboarding to Balancer's gauge system
4. Setting up voting incentive markets

### Choosing and Launching A Pool

Balancer v2 offers a variety of pool types to suit different needs:

| Pool Type | Use-Cases | Examples |
|-----------|-----------|-----------|
| Composable Stable Pool | Provision of highly correlated asset liquidity | [wstETH:WETH pool](https://app.balancer.fi/#/ethereum/pool/0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd0000000000000000000005c2) on mainnet |
| Weighted Pools incl. 80/20 | Creation of pools with any weight distribution with up to 8 tokens | [BAL:WETH 80:20 pool](https://app.balancer.fi/#/ethereum/pool/0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd0000000000000000000005c2) |
| Gyroscope E-CLPs | Specialized pools with [customized liquidity curves](https://docs.gyro.finance/gyroscope-protocol/readme) | [USDC:GYD Stable Pool](https://app.balancer.fi/#/ethereum/pool/0xc2aa60465bffa1a88f5ba471a59ca0435c3ec5c100020000000000000000062c) on mainnet |
| Managed pools | Specialized pools with dynamic pool weights | [Example index fund](https://app.kassandra.finance/pool/1370xc22bb237a5b8b7260190cb9e4998a9901a68af6f000100000000000000000d8d) on Avalanche |

### Providing Initial Liquidity

Depending on your chosen pool type, you can bootstrap liquidity through:
- [Pool creation UI](https://app.balancer.fi/#/ethereum/pool/create) for weighted pools
- [Community pool creator tool](https://pool-creator.web.app/) for Composable Stable pools
- [Gyroscope platform](https://app.gyro.finance/) for E-CLP liquidity pools

### Gauge System Integration

If your project intends to receive BAL rewards, consult our [Gauge Onboarding](../onboarding-overview/gauge-onboarding.md) documentation. The gauge system enables:
1. BAL rewards through [veBAL](https://app.balancer.fi/#/ethereum/vebal) holder votes
2. [vlAURA](https://app.aura.finance/#/1/lock) votes from AURA finance
3. Direct incentives on Balancer Gauges
4. Direct incentives on AURA Finance Gauges
5. Voting incentive markets

::: tip Core Pool Status
Interested in receiving core pool status? Read our [core pools documentation](../onboarding-overview/core-pools.md)
:::

## Additional Resources

- [Yield-bearing Token Onboarding](./onboard-yb-token.md)
- [Rate Provider Onboarding](../onboarding-overview/rate-providers.md)
- [Token Whitelisting](./token-whitelisting.md)
- [Incentives Management Documentation](../onboarding-overview/incentive-management.md)
- [Voting Markets](../onboarding-overview/voting-markets.md)
