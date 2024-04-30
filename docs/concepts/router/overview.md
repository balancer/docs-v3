---
order: 0
title: Overview
---

## Routers

In the Balancer V3 architecture, Routers serve as the pivotal interface for users, facilitating efficient interaction with the underlying Vault primitives. Rather than directly engaging with the Vault, users are encouraged to utilize Routers as their primary entry point. This approach streamlines operations and enhances flexibility by abstracting complex functionalities into simplified user-facing functions.

Key Functions:
* Aggregation of Operations: Routers excel in consolidating intricate user interactions into cohesive, single-function calls. By amalgamating various functionalities, Routers provide users with a seamless and intuitive experience.
* External API Provision: Acting as the external interface, Routers furnish users with accessible endpoints to interact with the protocol. This abstraction shields users from the complexities of the underlying system, promoting ease of use.
* Integration with the Vault: Routers interface with the Vault, enabling seamless access to fundamental operations and liquidity management functionalities.
* Custom Logic Implementation: Beyond facilitating basic operations, Routers are empowered to implement custom logic tailored to specific user requirements. This flexibility allows for the seamless incorporation of bespoke functionalities into the protocol ecosystem.
* Dynamic Update Capabilities: Unlike the Vault, Routers do not retain liquidity, rendering them highly adaptable to evolving protocol dynamics. This inherent flexibility facilitates the deployment of new Router versions with patches and extended functionalities, ensuring that users can access the latest innovations effortlessly.

In essence, Routers play a pivotal role in abstracting complexity, enhancing user accessibility, and fostering innovation. By serving as the conduit between users and the underlying Vault system, Routers empower seamless interaction and enable the realization of diverse use cases.

## Balancer Routers

Balancer has developed, audited and deployed Router contracts with the goal of providing simplified, easy to use functions for common liquidity actions. These Routers also serve as a useful reference for other Router implementations.

**Balancer Router**:
- Most common user actions, initialize/add/remove/swap
- [API](../../developer-reference/contracts/router-api.md)
- [Code](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Router.sol)

**Batch Router**:
- Batch swaps
- [API](../../developer-reference/contracts/batch-router-api.md)
- [Code](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/BatchRouter.sol)

Additionally both Routers expose [Query Functions](./queries.md) providing the ability to query the result of an operation using the latest onchain state.

Latest deployment of the Routers can be found in the [deployments section](/reference/contracts/).
