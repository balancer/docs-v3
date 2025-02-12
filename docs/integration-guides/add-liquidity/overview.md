---
order: 1
title: Overview
---

# Add Liquidity Overview

The guides in this section demonstrate how to add liquidity to standard, boosted, and nested pools. We will use the `addLiquidityUnbalanced` method, since it allows exact amounts of any pool token to be added to a pool, avoiding unnecessary dust in the user's wallet. See the [Router API](/developer-reference/contracts/router-api.html) for other supported add methods.

_These guides are for adding liquidity to Balancer v3 with the latest version of our [sdk](https://github.com/balancer/b-sdk)_

## Lifecycle
The core concepts of the add liquidity lifecycle are the same for any programming language or framework:

1. The sender must `token.approve` the cannonical permit2 contract for each token they wish to add to the pool
2. The sender must `permit2.approve` the correct Balancer router, which depends on if the pool tokens are normal, nested, or boosted
3. The transaction must be sent to the appropriate Balancer [Router](../../concepts/router/overview.md) with token amount inputs/outputs that use raw token scale, e.g. `1 USDC` should be sent as `1000000` because it has 6 decimals
1. In exchange for providing liquidity the sender will receive [Balancer Pool Tokens](../../concepts/core-concepts/balancer-pool-tokens.md) (BPTs) which represents their share of the pool and can be used to remove liquidity at any time