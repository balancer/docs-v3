---
title: Pools - With TVL greater than $10k
---

# Query all pools on Arbitrum and Avalanche that have TVL greater than $10k

```graphql
{
  poolGetPools(where: {chainIn: [AVALANCHE, ARBITRUM], minTvl: 10000}) {
    id
    address
    name
  }
}
```