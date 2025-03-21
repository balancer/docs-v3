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

In addition, the following token features are unsupported by the Vault. This list is not meant to be exhaustive, but covers many common types of tokens that will not work with the Vault architecture.
(See https://github.com/d-xo/weird-erc20 for examples of features that are problematic for many protocols.)

- Rebasing tokens (e.g., aDAI). The Vault keeps track of token balances in its internal accounting; any token whose balance changes asynchronously (i.e., outside a swap or liquidity operation),
  would get out-of-sync with this internal accounting. This category would also include "airdrop" tokens, whose balances can change unexpectedly.

- Double entrypoint tokens (e.g., old Synthetix tokens, now fixed). These could likewise bypass internal accounting by registering the token under one address, then accessing it through another.
  This is especially troublesome in v3, with the introduction of ERC4626 buffers and transient accounting.

- Fee on transfer tokens (e.g., PAXG). The Vault issues credits and debits according to given and calculated token amounts, and settlement assumes that the send/receive transfer functions transfer   
  exactly the given number of tokens. If this is not the case, and the token itself imposes a "tax" on transfers, transactions will not settle. Unlike with the other types, which are fundamentally
  incompatible, it would be possible to design a Router to handle this - but we didn't try it. In any case, it's not supported in the current Routers.

- Tokens with more than 18 decimals (e.g., YAM-V2). The Vault handles token scaling: i.e., handling I/O for amounts in native token decimals, but doing calculations with full 18-decimal precision.
  This requires reading and storing the decimals for each token. Since virtually all tokens are 18 or fewer decimals, and we have limited storage space, 18 was a reasonable maximum. Unlike the other types, this is enforceable by the Vault. Attempting to register such tokens will revert with `InvalidTokenDecimals`. Of course, we must also be able to read the token decimals, so the Vault only supports tokens that implement `IERC20Metadata.decimals`, and return a value less than or equal to 18.

- Token decimals are checked and stored only once, on registration. Valid tokens store their decimals as immutable variables or constants. Malicious tokens that don't respect this basic property
  would not work anywhere in DeFi.

These types of tokens are technically supported but discouraged, as they don't tend to play well with AMMs generally.

- Very low-decimal tokens (e.g., GUSD). The Vault has been extensively tested with 6-decimal tokens (e.g., USDC), but going much below that may lead to unanticipated effects due to precision loss,
  especially with smaller trade values.

- Revert on zero value approval/transfer. The Vault has been tested against these, but peripheral contracts, such as hooks, might not have been designed with this in mind.

- Other types from "weird-erc20," such as upgradeable, pausable, or tokens with blocklists. We have seen cases where a token upgrade fails, "bricking" the token - and many operations on pools
  containing that token. Any sort of "permissioned" token that can make transfers fail can cause operations on pools containing them to revert. Even Recovery Mode cannot help then, as it does a
  proportional withdrawal of all tokens. If one of them is bricked, the whole operation will revert. Since v3 does not have "internal balances" like v2, there is no recourse.

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
