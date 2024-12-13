---
order: 5
title: Security
---
# Security

:::info
This page will gradually be updated with more information.
:::

## Bug Bounty

For more information of Balancer's Bug Bounty program, please visit our [Immunefi page](https://immunefi.com/bounty/balancer/).

::: warning
**Bounties only apply to protocol smart contracts**. Bug reports pertaining to Balancer's web interfaces, both in terms of UI/UX or servers/infrastructure, are not eligible.
:::

For security reports outside of the scope of the bug bounty program, please reach out via security@balancer.finance

## Audits

See the [audits section](https://github.com/balancer/balancer-v3-monorepo/tree/main/audits) of the repo for the published audit reports.


## Code Immutability
The core contracts that make up the Balancer v2 Protocol, such as the Vault and Pools (Weighted, Stable, LBP, Managed, Linear, etc), are immutable by design. Any pool updates are made by deploying brand new factories/pools and require users to electively migrate.

## Balancer x Certora Accelerator

On the 10th [of October 2022](https://medium.com/balancer-protocol/balancer-and-certora-launch-security-accelerator-420d3b839a37), Balancer launched the Balancer Certora Security Accelerator in partnership with [Certora](https://www.certora.com/). The Security Accelerator helps projects building on Balancer increase their code security.

The Accelerator provides code reviews and grants access to Certora's formal verification Prover. This alignment strengthens the soundness of the code base and streamlines the go-to-market process for projects building on Balancer.

The Balancer x Certora Security Accelerator offers the following benefits:

- Two weeks of manual code review by Certora engineers familiar with Balancer’s codebase
- Set up and introduction of Certora's formal verification Prover
- $10.000 USD worth of credits for Certora's formal verification Prover
- Integration assistance by Balancer on code functionality and business logic

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>
