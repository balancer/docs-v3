---
title: Balancer API
order: 3
---
# Balancer API
Balancer's API exposes data on Balancer's smart contracts accessible via graphql. The API is running as a graphql server and is deployed at [https://api-v3.balancer.fi](https://api-v3.balancer.fi).

:::info Want to keep up with changes to the API?
You can subscribe to the [Telegram channel](https://t.me/BalBeetsApi) or check out the [repo](https://github.com/balancer/backend) to stay updated. 
:::

Queries are organized around these main domains:

- Pools
- Gauges
- Events
- Users
- Tokens
- Prices
- SOR (Smart Order Router used for swaps)

One of the conventions is to use "dynamicData" for querying changing parts of the state.

Further documentation is available on the self documented [api server](https://api-v3.balancer.fi).

# Examples

* [Pools - Get a v2 pool's details including APRs](./pool-details-with-apr.md)
* [Pools - Pools with TVL greater than $10k](./pools-with-tvl.md)
* [Pools - Top 10 pools ordered by TVL](./pools-top-ordered-tvl.md)
* [Pools - Get swap events for a pool](./pool-swap-events.md)
* [Swap - Query the Smart Order Router (SOR)](./swap-query-sor.md)
* [User - Get pool balances for a user](./user-pool-balance.md)
* [User - Get v2 pool add & remove events for a user](./user-pool-add-remove.md)



