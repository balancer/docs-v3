---
title: Core Pools
order: 6
---

# Core Pools

Core pools are a fundamental concept in Balancer's tokenomics model, designed to align token emissions with pool performance and fee generation. This document outlines the requirements and benefits of core pools across both Balancer v2 and v3.

## What is a Core Pool?

A core pool is a liquidity pool that meets specific criteria established by governance and participates in enhanced fee distribution and incentive mechanisms. Core pools receive additional benefits through voting incentives and participate in the protocol's sustainable incentive flywheel.

## Requirements for Core Pool Status

### Composition Requirements

1. Token composition must meet one of these criteria:
    - Minimum 50% yield-bearing or boosted tokens for weighted/composable stable pools
    - 80/20 weighted pools using Balancer as primary liquidity hub (requires application)
2. Maintain minimum $100k TVL

### Technical Requirements

- No yield fee exemption allowed
- Fee settings must be delegated to Balancer governance
- If default protocol fee settings are unavailable, an alternative fee setting must be established

::: warning Important
Pools without proper protocol fee settings (e.g., CoWAMM v1 pools) cannot achieve core pool status unless an alternative fee collection mechanism is implemented.
:::

### Token Requirements

- All pool tokens must have verified smart contracts
- Tokens cannot have transfer restrictions
- Tokens cannot implement rebasing mechanics

## Core Pool Benefits

Core pools receive several advantages:

1. Enhanced fee distribution:
    - 70% of collected fees distributed as voting incentives
    - 12.5% to veBAL holders
    - 17.5% to DAO
2. Participation in protocol's incentive flywheel
3. Increased visibility in the Balancer ecosystem

::: tip Fee Processing
Core pool fees are processed every two weeks to align with:
- veBAL vote cooldown period (10 days)
- Bi-weekly voting schedule on yield aggregators
  :::

## Maintaining Core Pool Status

- Status is evaluated bi-weekly before fee sweeps
- Automated checks are performed by Balancer Maxis
- Pools must continuously meet all requirements
- New pool types require explicit governance approval

## How to Apply for Core Pool Status

If your pool meets the above requirements:

1. For standard pools (50% yield-bearing):
    - Ensure all requirements are met
    - Pool will be automatically evaluated during bi-weekly checks

2. For 80/20 weighted pools:
    - Submit a governance proposal
    - Include documentation of Balancer as primary liquidity hub
    - Follow the template from [ALCX/ETH proposal](https://forum.balancer.fi/t/bip-290-designate-alcx-eth-80-20-as-a-core-pool-with-10-emissions-cap/4753)

## Additional Resources

- [Core Pools Analytics Dashboard](https://balancer.defilytica.com/#/corePools)
- [Protocol Fee Dashboard](https://dune.com/balancer/protocol-fees)
- [Automatic Core Pool List](https://github.com/BalancerMaxis/bal_addresses/blob/main/outputs/core_pools.json)
- [Fee Model Documentation](/concepts/protocol-fee-model)
