---
order: 2
title: Fetching Pools And Data
---

# Fetching Pool List

## Using Balancers API

The [Balancer API](/data-and-analytics/data-and-analytics/balancer-api/balancer-api.md ) can be used to retrieve a list of v3 pools and immutable data for calculating swaps. The API is running as a graphql server and is deployed at [https://test-api-v3.balancer.fi](https://test-api-v3.balancer.fi).

The following query can be used to fetch v3 pools with the required immutable data used for swap calculations:

```
query MyQuery {
    poolGetAggregatorPools(
    where: {chainIn: SEPOLIA, protocolVersionIn: 3, hasHook:false}
    ) {
    id
    type
    poolTokens {
        address
        weight
        isErc4626
        underlyingToken {
        address
        }
    }
    }
}
```

## Onchain

It is possible to query a list of pools from each pool factory using the following:

```solidity
/**
* @notice Return a subset of the list of pools deployed by this factory.
* @dev `start` must be a valid index, but if `count` exceeds the total length, it will not revert, but simply
* stop at the end and return fewer results than requested.
*
* @param start The index of the first pool to return
* @param count The maximum number of pools to return
* @return pools The list of pools deployed by this factory, starting at `start` and returning up to `count` pools
*/
function getPoolsInRange(uint256 start, uint256 count) external view returns (address[] memory pools);

/**
* @notice Return the complete list of pools deployed by this factory.
* @return pools The list of pools deployed by this factory
*/
function getPools() external view returns (address[] memory pools);
```

# Fetching Pool Data

Swap calculations require a combination of data that can be considered as immutable and dynamic. The API can provide both but dynamic data will be subject to a 5minute cache which may not provide the required accuracy. Pools also expose useful view functions that can be used to retrieve this data. These functions follow the format:

```
getPOOLTYPEPoolDynamicData
e.g.:
- function getStablePoolDynamicData() external view returns (StablePoolDynamicData memory data);

getPOOLTYPEImmutableData
e.g.:
- function getStablePoolImmutableData() external view returns (StablePoolImmutableData memory data);
```

If a pool is not exposing the helper functions or you prefer to query for specific data the following view functions are available on the [Vault](/developer-reference/contracts/vault-api.md) and can be used to find onchain pool state:

```
getPoolTokenRates
getCurrentLiveBalances
getPoolConfig
totalSupply
isPoolPaused
getHooksConfig
```