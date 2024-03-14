---
order: 10
title: Finding Pool Token Order
---

# Finding Pool Token Order

The Vault registers a pools tokens in the order they are passed by the creator. Some actions, e.g. adding liquidity, require that provided inputs match this token ordering so it is useful to understand some methods to find this.

### getPoolTokens()

The `getPoolTokens` function exists on both the Pool itself and the Vault.

```solidity
// Pool
function getPoolTokens() external view returns (IERC20[] memory tokens);

// Vault
function getPoolTokens(address pool) external view returns (IERC20[] memory);
```

### Using the API

When using the Balancer Pools API we can query the tokens `index` field. This can then be used to sort the tokens in the correct order.

```graphql
query MyQuery {
  poolGetPool(
    id: "0xc50351ccf9f4396efb33f91974c0149398dad2a4000200000000000000000a2c"
    chain: POLYGON
  ) {
    id
    ... on GqlPoolWeighted {
      tokens {
        ... on GqlPoolTokenBase {
          address
          index
        }
      }
    }
  }
}
```

