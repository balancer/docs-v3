# Introduction - Balancer Pools API

**Alpha Release, use with caution, there may be breaking changes**

Balancer's API exposes data on Balancer's smart contracts accessible via graphql. The API is running as a graphql server and is deployed at [https://api-v3.balancer.fi](https://api-v3.balancer.fi).

Queries are organised around these main domains: Further documentation is available on the self documented [api server](https://api-v3.balancer.fi).

- Pools
- Gauges
- Events
- Users
- Tokens
- Prices
- SOR


# Examples
Get a pool's details including APRs.
```json
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