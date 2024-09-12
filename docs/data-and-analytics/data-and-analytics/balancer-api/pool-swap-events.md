---
title: Pools - Swap Events
---

# Get swap events for a pool

As this is a CowAMM pool we also use the expanded `GqlPoolSwapEventCowAmm` type to get CowAMM specific swap data.

```graphql
{
  poolEvents(
    where: {typeIn: [SWAP], chainIn: [MAINNET], poolIdIn: ["0xf08d4dea369c456d26a3168ff0024b904f2d8b91"]}
  ) {
    type
    valueUSD
    ... on GqlPoolSwapEventCowAmm {
      surplus {
        address
        amount
        valueUSD
      }
    }
  }
}

```