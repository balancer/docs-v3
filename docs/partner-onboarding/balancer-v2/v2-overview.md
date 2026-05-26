---
title: Overview
order: 0
---

# Onboarding to Balancer v2

Balancer v2 has been a core pillar of DeFi since 2021. By leveraging innovative pool types, Balancer v2 has attracted liquidity in the liquid staking token (LST) and liquid restaking token (LRT) sector.

Balancer Technology provides decentralized infrastructure for DAOs, enabling efficient scaling of Yield Bearing assets, creating advanced Governance positions, and developing customized pool types. The Balancer ecosystem facilitates the streamlined scaling of liquidity for DAOs through its network of liquidity enhancing protocols.

::: warning Security Advisory
Before integrating new tokens with Balancer V2, please review our [token whitelisting](./token-whitelisting.md) documentation and security considerations. For new integrations, we recommend using Balancer V3.
:::

## Onboarding Steps

Onboarding to Balancer v2's tech stack involves various steps depending on your specific needs:

1. Choosing and launching your pool
2. Providing initial liquidity
3. (Optional) Standing up a gauge to stream your own secondary rewards

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

Gauges remain operational for routing third-party (non-BAL) reward tokens to LPs. **BAL emissions to gauges have been halted per [BIP-919](https://forum.balancer.fi/t/bip-919-bal-tokenomics-revamp/7001)**, and all voting-incentive markets have been terminated. If your project wants to stream its own reward tokens, see the [Gauge Onboarding](../onboarding-overview/gauge-onboarding.md) and [Incentive Management](../onboarding-overview/incentive-management.md) guides. Direct incentives on AURA Finance Gauges remain a separate option managed by AURA.

## Additional Resources

- [Yield-bearing Token Onboarding](./onboard-yb-token.md)
- [Rate Provider Onboarding](../onboarding-overview/rate-providers.md)
- [Token Whitelisting](./token-whitelisting.md)
- [Incentives Management Documentation](../onboarding-overview/incentive-management.md)
