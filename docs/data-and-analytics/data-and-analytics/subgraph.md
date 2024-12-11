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

| Network  | Development URL (rate-limited)                                                 | Production URL                                                                                                        |
| -------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Ethereum | https://api.studio.thegraph.com/query/75376/balancer-v3/version/latest         | https://gateway.thegraph.com/api/[API-KEY]/subgraphs/id/QmPoxXQWfZffo454w7aM1fV6jK32zApX4J7VS4Ls4MSLGm                |
| Gnosis   | https://api.studio.thegraph.com/query/75376/balancer-v3-gnosis/version/latest  | https://gateway-gnosis.network.thegraph.com/api/[API-KEY]/subgraphs/id/QmSLd8fuWE6eGRMZrYmxjX6ckumZDhG5mcQUBMY5Zfz3oU |
| Sepolia  | https://api.studio.thegraph.com/query/75376/balancer-v3-sepolia/version/latest | https://api.studio.thegraph.com/query/75376/balancer-v3-sepolia/version/latest                                        |

### Pools Subgraphs

| Network  | Development URL (rate-limited)                                                       | Production URL                                                                                                        |
| -------- | ------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| Ethereum | https://api.studio.thegraph.com/query/75376/balancer-pools-v3/version/latest         | https://gateway.thegraph.com/api/[API-KEY]/subgraphs/id/QmVGssjwfVAP8b2buqVVKz5sdb69ryyvxED5qQPGeW8Yk2                |
| Gnosis   | https://api.studio.thegraph.com/query/75376/balancer-pools-v3-gnosis/version/latest  | https://gateway-gnosis.network.thegraph.com/api/[API-KEY]/subgraphs/id/QmQpKVgaEhrPygATrgpCTLSMqqmHCLuC3vpdonSC1Z9iqo |
| Sepolia  | https://api.studio.thegraph.com/query/75376/balancer-pools-v3-sepolia/version/latest | https://api.studio.thegraph.com/query/75376/balancer-pools-v3-sepolia/version/latest                                  |
