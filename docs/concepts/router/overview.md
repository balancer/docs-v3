---
order: 0
title: Overview
---

## Routers

In the Balancer v3 architecture, Routers serve as the pivotal interface for users, facilitating efficient interaction with the underlying Vault primitives. Rather than directly engaging with the Vault, users are encouraged to use Routers as their primary entry point. This approach streamlines operations and enhances flexibility by abstracting multi-step operations into simple user-facing functions.

Key Functions:
* Aggregation of Operations: Routers excel at consolidating complex user interactions into specific single-purpose function calls. This encapsulation provides users with a seamless and intuitive experience.
* External API Provision: Acting as the external interface, Routers furnish users with accessible endpoints to interact with the protocol. This abstraction shields users from the complexities of the underlying system, promoting ease of use.
* Integration with the Vault: Routers interface with the Vault, enabling seamless access to fundamental operations and liquidity management functionality.
* Custom Logic Implementation: Beyond facilitating basic operations, Routers implement custom logic tailored to specific user requirements. This flexibility allows for the seamless incorporation of bespoke functionality into the protocol ecosystem.
* Dynamic Update Capabilities: Unlike the Vault, Routers are stateless and do not retain liquidity. This inherent flexibility facilitates the deployment of new Router versions with patches and extended functionality, ensuring that users can always access the latest innovations.

In essence, Routers play a pivotal role in abstracting complexity, enhancing user accessibility, and fostering innovation. By serving as the conduit between users and the underlying Vault system, Routers enable seamless interactions and diverse use cases.

## Balancer Routers

Balancer has developed, audited and deployed Router contracts with the goal of providing simplified, easy to use functions for common liquidity actions. These Routers also serve as a useful reference for other Router implementations.

### Basic Router

- Most common user actions, initialize/add/remove/swap
- [API](../../developer-reference/contracts/router-api.md)
- [Code](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Router.sol)

### Batch Router
- Batch swaps
- [API](../../developer-reference/contracts/batch-router-api.md)
- [Code](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/BatchRouter.sol)

### Composite Liquidity Router
- Liquidity operations on pools containing ERC4626 tokens, and nested pools (i.e. pools containing the BPT of other pools)
- [API](../../developer-reference/contracts/composite-liquidity-router-api.md)
- [Code](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/CompositeLiquidityRouter.sol)

Additionally all Routers expose [Query Functions](./queries.md) providing the ability to query the result of an operation using the latest onchain state.

Latest deployment of the Routers can be found in the [deployments section](/developer-reference/contracts/deployment-addresses/mainnet.html).
