---
title: Pools - Get details including APRs
---

# Get a v2 pool's details including APRs
```graphql
{
  poolGetPool(id: "0x7f2b3b7fbd3226c5be438cde49a519f442ca2eda00020000000000000000067d", chain:MAINNET) {
    id
    name
    type
    version
    allTokens {
      address
      name
    }
    poolTokens {
      address
      symbol
      balance
      hasNestedPool
    }
    dynamicData {
      totalLiquidity
      aprItems {
        title
        type
        apr
      }
    }
  }
}
```