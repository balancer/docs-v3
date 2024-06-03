---
title: Overview
order: 0
---

## Onboarding to Balancer v2
Balancer v2 has been a core pillar of DeFi since 2021. By leveraging innovative pool types Balancer v2 has attracted
liquidity in the liquid stakig token (LST) and liquid restaking token (LRT) sector. 

Balancer Technology provides decentralised infrastructure for DAOs, which enables efficient scaling of Yield Bearing assets, creating advanced Governance positions, and developing customised pool types. In addition, the Balancer ecosystem facilitates the streamlined scaling of liquidity for DAOs through core pool incentive flywheels and its network of liquidity enhancing protocols.

### Onboaring Steps
Onboarding to Balancer v2's tech stack involves various steps depending on the specific needs. In general the onboarding journey consists of following steps:

1. Choosing and launching your pool
2. Providing initial liqudity
3. Receive BAL rewards through Balancer's gauge system
4. Thinking about incentive markets

#### Choosing and Launching A Pool
Balancer v2 offers a wide variety of exciting pool types. The following table provides a rough overview of examples and use cases

| Pool Type                  | Use-Cases                                                                                                                             | Examples                                                                                                                                      |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| Composable Table Pool      | Provision of highly correlated asset liquidity                                                                                        | [wstETH:WETH pool](https://app.balancer.fi/#/ethereum/pool/0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd0000000000000000000005c2) on mainnet     |
| Weighted Pools incl. 80/20 | Creation of pools with any weight distribution with up to 8 tokens.                                                                   | [BAL:WETH 80:20 pool](https://app.balancer.fi/#/ethereum/pool/0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd0000000000000000000005c2)             |
| Gyroscope E-CLPs           | Specialized pools with [customized liquidity curves](https://docs.gyro.finance/gyroscope-protocol/readme)                             | [USDC:GYD Stable Pool](https://app.balancer.fi/#/ethereum/pool/0xc2aa60465bffa1a88f5ba471a59ca0435c3ec5c100020000000000000000062c) on mainnet |
| Managed pools              | Specialized pools dynamic pool weights. See [Kassandra Finance](https://app.kassandra.finance/) for an example implemenation use-case | [Example index fund](https://app.kassandra.finance/pool/1370xc22bb237a5b8b7260190cb9e4998a9901a68af6f000100000000000000000d8d) on Avalanche   |

On Balancer v2, most projects choose to utilize our highly efficient Composable Stable Pool technology. This allows to deploy deep liquidity while guaranteeing correct trades through [rate provider](./rate-providers.md) technology. Furthermore, by harnessing our [vault architecture](../../concepts/vault/README.md) design, pools benefit from direct trading routes, aggregator integration and deep liquidity.

#### Providing initial liquidity
Depending on the pool type, you can bootstrap liquidity directly through our UI or our community tooling:
- For weighted pools, use the [pool creation UI](https://app.balancer.fi/#/ethereum/pool/create) from the Balancer v2 front-end
- For Composable Stable pools, use the [community pool creator tool](https://pool-creator.web.app/)
  - If you are considering to deploy liquidity with a yield-bearing asset, consult our [yield-bearing token onboarding guide](./onboard-yb-token.md)
- For E-CLP liquidity pools, consult with [Gyroscope](https://app.gyro.finance/) to set up your customized E-CLP

#### Receive BAL rewards through Balancer's gauge system
If your project intends to receive BAL rewards, consult our [Gauge Onboarding](gauge-onboarding.md) guide guiding you through any further steps needed.
::: tip
Are you interested in receiving core pool status? Read [here](./core-pools.md)
:::



## Onboarding Guides
- [Yield-bearing Token Onboarding](onboard-yb-token.md)
- [Rate Provider Onboarding](rate-providers.md)
- [Gauge Onboarding](gauge-onboarding.md)
- [Core Pool Framework](core-pools.md)

## Helpful Resources to Learn More

- [BIP-19: Incentivize Core Pools & L2 Usage](https://forum.balancer.fi/t/bip-19-incentivize-core-pools-l2-usage/3329)
- [Core Pools Dashboard](https://balancer.defilytica.com/#/corePools)
- [Protocol Fee Dune Dashboard](https://dune.com/balancer/protocol-fees)
