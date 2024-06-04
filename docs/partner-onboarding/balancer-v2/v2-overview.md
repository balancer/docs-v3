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
4. Voting Incentive Markets

#### Choosing and Launching A Pool
Balancer v2 offers a wide variety of exciting pool types. The following table provides a rough overview of examples and use cases

| Pool Type                  | Use-Cases                                                                                                                                  | Examples                                                                                                                                      |
|----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| Composable Table Pool      | Provision of highly correlated asset liquidity                                                                                             | [wstETH:WETH pool](https://app.balancer.fi/#/ethereum/pool/0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd0000000000000000000005c2) on mainnet     |
| Weighted Pools incl. 80/20 | Creation of pools with any weight distribution with up to 8 tokens.                                                                        | [BAL:WETH 80:20 pool](https://app.balancer.fi/#/ethereum/pool/0x93d199263632a4ef4bb438f1feb99e57b4b5f0bd0000000000000000000005c2)             |
| Gyroscope E-CLPs           | Specialized pools with [customized liquidity curves](https://docs.gyro.finance/gyroscope-protocol/readme)                                  | [USDC:GYD Stable Pool](https://app.balancer.fi/#/ethereum/pool/0xc2aa60465bffa1a88f5ba471a59ca0435c3ec5c100020000000000000000062c) on mainnet |
| Managed pools              | Specialized pools with dynamic pool weights. See [Kassandra Finance](https://app.kassandra.finance/) for an example implemenation use-case | [Example index fund](https://app.kassandra.finance/pool/1370xc22bb237a5b8b7260190cb9e4998a9901a68af6f000100000000000000000d8d) on Avalanche   |

- On Balancer v2, most projects choose to utilize our highly efficient Composable Stable Pool technology. This allows to deploy deep liquidity while guaranteeing correct trades through [rate provider](./rate-providers.md) technology. Furthermore, by harnessing our [vault architecture](../../concepts/vault/README.md) design, pools benefit from direct trading routes, aggregator integration and deep liquidity.
- Our flexible weighted pool design allows for innovative pool design, letting you choose between any target weights and up to 8 token pools opening up the possibility to host governance token liquidity or build exciting index-fund like products.
- Gyroscopes E-CLPs leverage custom trading curves for even higher utilization rates and efficiency
- Managed pools are experimental products. Although certain solutions exist, their support is limited.

#### Providing initial liquidity
Depending on the pool type, you can bootstrap liquidity directly through our UI or our community tooling:
- For weighted pools, use the [pool creation UI](https://app.balancer.fi/#/ethereum/pool/create) from the Balancer v2 front-end
- For Composable Stable pools, use the [community pool creator tool](https://pool-creator.web.app/)
  - If you are considering to deploy liquidity with a yield-bearing asset, consult our [yield-bearing token onboarding guide](./onboard-yb-token.md)
- For E-CLP liquidity pools, consult with [Gyroscope](https://app.gyro.finance/) to set up your customized E-CLP

##### Token Whitelisting

Whitelist your token by doing a Pull-Request [here](https://github.com/balancer/tokenlists). This is needed to fully enable trading of your token on our platform.

1. Provide token images and store png files with the token address like `0xba100000625a3754423978a60c9317c58a424e3D.png`
2. Update `tokenlists/balancer/tokens` and the corresponding network typescript file by adding your token address (
   e.g. `tokenlists/balancer/tokens/arbitrum/0x…`)

#### Receive BAL rewards through Balancer's gauge system
If your project intends to receive BAL rewards, consult our [Gauge Onboarding](gauge-onboarding.md) guide guiding you through any further steps needed.
::: tip
Are you interested in receiving core pool status? Read [here](./core-pools.md)
:::

#### Voting Incentive Markets
Balancer v2's tokenomics around veBAL encourage partaking in various voting incentive markets to attract BAL token rewards to certain gauges. These voting markets are operated by independent entities and leveraging these markets is absolutely not mandatory. The [core pool framework](./core-pools.md) guarantees that a fraction of protocol fees are distributed on voting markets without any further action from a partner. There are, of course, also other methods on how to participate, please consult the [voting market ](./voting-markets.md) section for more details.

#### Placing Direct Incentives
It is possible to stream direct incentives to Balancer staking gauges. Several options exist. Consult our [direct incentives docs](./direct-incentives.md) for more details.

## Onboarding Guides
- [Yield-bearing Token Onboarding](onboard-yb-token.md)
- [Rate Provider Onboarding](rate-providers.md)
- [Gauge Onboarding](gauge-onboarding.md)
- [Core Pool Framework](core-pools.md)


