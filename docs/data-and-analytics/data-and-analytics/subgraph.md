---
title: Subgraph
order: 1
---

# Balancer Subgraph

The Balancer Subgraph indexes data on the Balancer smart contracts with a GraphQL interface. It updates data in response to function calls and contract events to maintain data.

Balancer uses Subgraph Studio for development and deployment of its subgraphs. For querying non-rate-limited endpoints, users need to obtain an API key from The Graph. More information on querying The Graph can be found [here](https://thegraph.com/docs/en/querying/querying-the-graph/).

## V3 Subgraphs

The schemas of GraphQL elements are defined in two separate schema files:

- Vault: [`v3-vault/schema.graphql`](https://github.com/balancer/balancer-subgraph-v3/blob/main/subgraphs/v3-vault/schema.graphql)
- Pools: [`v3-pools/schema.graphql`](https://github.com/balancer/balancer-subgraph-v3/blob/main/subgraphs/v3-pools/schema.graphql)

### Vault Subgraphs

| Network   | Production URL                                                                                                                                                                                                       | Development URL (rate-limited)                                                                                                                                       |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Arbitrum  | [https://gateway.thegraph.com/api/[api-key]/subgraphs/id/Ad1cgTzScNmiDPSCeGYxgMU3YdRPrQXGkCZgpmPauauk](https://gateway.thegraph.com/api/[api-key]/subgraphs/id/Ad1cgTzScNmiDPSCeGYxgMU3YdRPrQXGkCZgpmPauauk)         | [https://api.studio.thegraph.com/query/75376/balancer-v3-arbitrum/version/latest](https://api.studio.thegraph.com/query/75376/balancer-v3-arbitrum/version/latest)   |
| Avalanche | [https://gateway.thegraph.com/api/[api-key]/deployments/id/QmSj437ejL2f1pMP2r5E2m5GjhqJa3rmbvFD5kyscmq7u2](https://gateway.thegraph.com/api/[api-key]/deployments/id/QmSj437ejL2f1pMP2r5E2m5GjhqJa3rmbvFD5kyscmq7u2) | [https://api.studio.thegraph.com/query/75376/balancer-v3-avalanche/version/latest](https://api.studio.thegraph.com/query/75376/balancer-v3-avalanche/version/latest) |
| Base      | [https://gateway.thegraph.com/api/[api-key]/subgraphs/id/9b7UBHq8DXxrfGsYhAzF3jZn5mNRgZb5Ag18UL9GJ3cV](https://gateway.thegraph.com/api/[api-key]/subgraphs/id/9b7UBHq8DXxrfGsYhAzF3jZn5mNRgZb5Ag18UL9GJ3cV)         | [https://api.studio.thegraph.com/query/75376/balancer-v3-base/version/latest](https://api.studio.thegraph.com/query/75376/balancer-v3-base/version/latest)           |
| Ethereum  | [https://gateway.thegraph.com/api/[api-key]/subgraphs/id/4rixbLvpuBCwXTJSwyAzQgsLR8KprnyMfyCuXT8Fj5cd](https://gateway.thegraph.com/api/[api-key]/subgraphs/id/4rixbLvpuBCwXTJSwyAzQgsLR8KprnyMfyCuXT8Fj5cd)         | [https://api.studio.thegraph.com/query/75376/balancer-v3/version/latest](https://api.studio.thegraph.com/query/75376/balancer-v3/version/latest)                     |
| Gnosis    | [https://gateway.thegraph.com/api/[api-key]/subgraphs/id/DDoABVc9xCRQwuXRq2QLZ6YLkjoFet74vnfncQDgJVo2](https://gateway.thegraph.com/api/[api-key]/subgraphs/id/DDoABVc9xCRQwuXRq2QLZ6YLkjoFet74vnfncQDgJVo2)         | [https://api.studio.thegraph.com/query/75376/balancer-v3-gnosis/version/latest](https://api.studio.thegraph.com/query/75376/balancer-v3-gnosis/version/latest)       |
| Optimism    | [https://gateway.thegraph.com/api/[api-key]/subgraphs/id/DwreTHTzN3kV6szWr7Ldt6VwnGjtmKTKcYT9aDk37MEs](https://gateway.thegraph.com/api/[api-key]/subgraphs/id/DwreTHTzN3kV6szWr7Ldt6VwnGjtmKTKcYT9aDk37MEs)         | [https://api.studio.thegraph.com/query/75376/balancer-v3-optimism/version/latest](https://api.studio.thegraph.com/query/75376/balancer-v3-optimism/version/latest)       |
| Sepolia   | [https://api.studio.thegraph.com/query/75376/balancer-v3-sepolia/version/latest](https://api.studio.thegraph.com/query/75376/balancer-v3-sepolia/version/latest)                                                     | [https://api.studio.thegraph.com/query/75376/balancer-v3-sepolia/version/latest](https://api.studio.thegraph.com/query/75376/balancer-v3-sepolia/version/latest)     |

### Pools Subgraphs

| Network   | Production URL                                                                                                                                                                                                       | Development URL (rate-limited)                                                                                                                                                   |
| --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Arbitrum  | [https://gateway.thegraph.com/api/[api-key]/subgraphs/id/EjSsjATNpZexLhozmDTe9kBHpZUt1GKjWdpZ2P9xmhsv](https://gateway.thegraph.com/api/[api-key]/subgraphs/id/EjSsjATNpZexLhozmDTe9kBHpZUt1GKjWdpZ2P9xmhsv)         | [https://api.studio.thegraph.com/query/75376/balancer-pools-v3-arbitrum/version/latest](https://api.studio.thegraph.com/query/75376/balancer-pools-v3-arbitrum/version/latest)   |
| Avalanche | [https://gateway.thegraph.com/api/[api-key]/deployments/id/QmchdxtRDQJxtt8VkV5MSmcUPvLmo1wgXD7Y7ZCNKNebN1](https://gateway.thegraph.com/api/[api-key]/deployments/id/QmchdxtRDQJxtt8VkV5MSmcUPvLmo1wgXD7Y7ZCNKNebN1) | [https://api.studio.thegraph.com/query/75376/balancer-pools-v3-avalanche/version/latest](https://api.studio.thegraph.com/query/75376/balancer-pools-v3-avalanche/version/latest) |
| Base      | [https://gateway.thegraph.com/api/[api-key]/subgraphs/id/42QYdE4P8ZMKgPx4Mkw1Vnx3Zf6AEtWFVoeet1HZ4ntB](https://gateway.thegraph.com/api/[api-key]/subgraphs/id/42QYdE4P8ZMKgPx4Mkw1Vnx3Zf6AEtWFVoeet1HZ4ntB)         | [https://api.studio.thegraph.com/query/75376/balancer-pools-v3-base/version/latest](https://api.studio.thegraph.com/query/75376/balancer-pools-v3-base/version/latest)           |
| Ethereum  | [https://gateway.thegraph.com/api/[api-key]/subgraphs/id/C4tijcwi6nThKJYBmT5JaYK2As2kJGADs89AoQaCnYz7](https://gateway.thegraph.com/api/[api-key]/subgraphs/id/C4tijcwi6nThKJYBmT5JaYK2As2kJGADs89AoQaCnYz7)         | [https://api.studio.thegraph.com/query/75376/balancer-pools-v3/version/latest](https://api.studio.thegraph.com/query/75376/balancer-pools-v3/version/latest)                     |
| Gnosis    | [https://gateway.thegraph.com/api/[api-key]/subgraphs/id/yeZGqiwNf3Lqpeo8XNHih83bk5Tbu4KvFwWVy3Dbus6](https://gateway.thegraph.com/api/[api-key]/subgraphs/id/yeZGqiwNf3Lqpeo8XNHih83bk5Tbu4KvFwWVy3Dbus6)           | [https://api.studio.thegraph.com/query/75376/balancer-pools-v3-gnosis/version/latest](https://api.studio.thegraph.com/query/75376/balancer-pools-v3-gnosis/version/latest)       |
| Optimism    | [https://gateway.thegraph.com/api/[api-key]/subgraphs/id/Bd1sEaaGf832AybkNiMipREabdSQ3kNJRDupPZT8RfB6](https://gateway.thegraph.com/api/[api-key]/subgraphs/id/Bd1sEaaGf832AybkNiMipREabdSQ3kNJRDupPZT8RfB6)         | [https://api.studio.thegraph.com/query/75376/balancer-pools-v3-optimism/version/latest](https://api.studio.thegraph.com/query/75376/balancer-pools-v3-optimism/version/latest)       |
| Sepolia   | [https://api.studio.thegraph.com/query/75376/balancer-pools-v3-sepolia/version/latest](https://api.studio.thegraph.com/query/75376/balancer-pools-v3-sepolia/version/latest)                                         | [https://api.studio.thegraph.com/query/75376/balancer-pools-v3-sepolia/version/latest](https://api.studio.thegraph.com/query/75376/balancer-pools-v3-sepolia/version/latest)     |
