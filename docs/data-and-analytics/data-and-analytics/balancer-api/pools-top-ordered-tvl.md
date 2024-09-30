---
title: Pools - Top 10 Ordered by TVL
---

# Query to find top 10 pools ordered by TVL

This query also returns the pools APRs and staking gauge. One of the conventions is to use "dynamicData" for querying changing parts of the state.

```graphql
{
  poolGetPools(first:10, orderBy:totalLiquidity) {
    id
    name
    chain
    dynamicData {
      totalLiquidity
      aprItems {
        apr
      }
    }
    staking {
      gauge {
        gaugeAddress
      }
    }
  }
}
```