---
title: Balancer API
order: 3
---
# Balancer API
Balancer's API exposes data on Balancer's smart contracts accessible via graphql. The API is running as a graphql server and is deployed at [https://api-v3.balancer.fi](https://api-v3.balancer.fi).

:::info Want to keep up with changes to the API?
You can subscribe to the [Telegram channel](https://t.me/BalBeetsApi) or check out the [repo](https://github.com/balancer/backend) stay updated. 
:::

Queries are organised around these main domains: Further documentation is available on the self documented [api server](https://api-v3.balancer.fi).

- Pools
- Gauges
- Events
- Users
- Tokens
- Prices
- SOR


# Examples
## Get a pool's details including APRs.
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
    displayTokens {
      ...on GqlPoolTokenDisplay {
        symbol
      }
    }
    dynamicData {
      totalLiquidity
      apr {
        swapApr
        nativeRewardApr {
          ...on GqlPoolAprTotal {
            total
          }
        }
        thirdPartyApr {
          ...on GqlPoolAprTotal {
            total
          }
        }
        items {
          title
          apr {
            ...on GqlPoolAprRange {
              min
              max
            }
            ...on GqlPoolAprTotal {
              total
            }
          }
        }
      }
    }
  }
}
```

## Query the Smart Order Router (SOR) for specific swap paths like 1WETH to USDC.
```graphql
{
  sorGetSwapPaths(
    chain: MAINNET
    swapAmount: "1"
    swapType: EXACT_IN
    tokenIn: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    tokenOut: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
  ) {
    swapAmountRaw
    returnAmountRaw
    priceImpact {
      priceImpact
      error
    }
  }
}
```

## Query all pools on Arbitrum and Avalanche that have TVL greater than $10k.
```graphql
{
  poolGetPools(where: {chainIn: [AVALANCHE, ARBITRUM], minTvl: 10000}) {
    id
    address
    name
  }
}
```