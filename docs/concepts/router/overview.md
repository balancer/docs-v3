---
order: 0
title: Overview
---
# Router Onchain API
The Router is the recommended entrypoint for user operations. It provides functions to both query and execute `swap`, `addLiquidity` and `removeLiquidity` operations against the Balancer vault.
[Transient Accounting](/concepts/vault/features/transient-accounting.html) enables a simple query system that ensures query functions will always return the exact same outcome as their state-changing counterpart.

Because routers are stateless and do not hold token balances, they can be replaced safely and trustlessly, if necessary. These docs will always reference the latest version of the Balancer Router. 

::: info User token approvals should always be for the Balancer Vault, never the router contract
The Balancer Router router is a [Trusted Router](./technical.html#trusted-routers), so it will inherit vault token approvals once `approved` by both the user AND governance. In a scenario where an issue is discovered in a Trusted Router,
governance has the ability to revoke the **Trusted** designation, disabling vault approval access globally.
:::

## API
The onchain APIs to work can be found here:
- [Router API](./onchain-api/router-api.md)
- [Batch Router API](./onchain-api/batch-router-api.md)

## Code

- [Router](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Router.sol)
- [Batch Router](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/BatchRouter.sol)

## Deployments

Latest deployment of the Routers can be found in the [deployments section](/reference/contracts/).
