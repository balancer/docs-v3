---
title: User - Get joins and exit events for a pool
---

# Get v2 pool join and exits events for a user

```graphql
{
  userGetPoolJoinExits(
    poolId: "0x3de27efa2f1aa663ae5d458857e731c129069f29000200000000000000000588"
    chain: MAINNET
    address: "0x741AA7CFB2c7bF2A1E7D4dA2e3Df6a56cA4131F3"
  ) {
    type
    tx
    valueUSD
    amounts {
      address
      amount
    }
  }
}

```