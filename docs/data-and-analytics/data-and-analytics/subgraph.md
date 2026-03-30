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

| Network   | URL                                                                                                                                                                                                                                                                                                                 |
| --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Arbitrum  | [https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-vault-arbitrum-one-smol/latest/gn](https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-vault-arbitrum-one-smol/latest/gn)   |
| Avalanche | [https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-vault-avalanche-smol/latest/gn](https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-vault-avalanche-smol/latest/gn)         |
| Base      | [https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-vault-base-smol/latest/gn](https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-vault-base-smol/latest/gn)                   |
| Ethereum  | [https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-vault-mainnet-smol/latest/gn](https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-vault-mainnet-smol/latest/gn)             |
| Gnosis    | [https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-vault-gnosis-smol/latest/gn](https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-vault-gnosis-smol/latest/gn)               |
| Optimism  | [https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-vault-optimism-smol/latest/gn](https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-vault-optimism-smol/latest/gn)           |
| Plasma    | [https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-vault-plasma-smol/latest/gn](https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-vault-plasma-smol/latest/gn)               |
| Sepolia   | [https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-vault-sepolia-smol/latest/gn](https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-vault-sepolia-smol/latest/gn)             |

### Pools Subgraphs

| Network   | URL                                                                                                                                                                                                                                                                                                                     |
| --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Arbitrum  | [https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-pools-arbitrum-one-smol/latest/gn](https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-pools-arbitrum-one-smol/latest/gn)   |
| Avalanche | [https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-pools-avalanche-smol/latest/gn](https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-pools-avalanche-smol/latest/gn)         |
| Base      | [https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-pools-base-smol/latest/gn](https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-pools-base-smol/latest/gn)                   |
| Ethereum  | [https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-pools-mainnet-smol/latest/gn](https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-pools-mainnet-smol/latest/gn)             |
| Gnosis    | [https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-pools-gnosis-smol/latest/gn](https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-pools-gnosis-smol/latest/gn)               |
| Optimism  | [https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-pools-optimism-smol/latest/gn](https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-pools-optimism-smol/latest/gn)           |
| Plasma    | [https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-pools-plasma-smol/latest/gn](https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-pools-plasma-smol/latest/gn)               |
| Sepolia   | [https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-pools-sepolia-smol/latest/gn](https://api.subgraph.ormilabs.com/api/public/717cf785-de57-4761-94dd-9ac51b019902/subgraphs/v3-pools-sepolia-smol/latest/gn)             |
