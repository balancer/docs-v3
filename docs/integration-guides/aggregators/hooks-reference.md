---
order: 6
title: Hook Ref - Maths And Details
---

# Hooks Reference

Explore our [GitHub repository](https://github.com/balancer/balancer-maths) containing reference mathematical implementations, in Javascript and Python, for supported Balancer hook types. Designed to assist developers and integrators in understanding the underlying swap calculations, these implementations can be imported as a packages into your project or serve as a reference for your own implementation.

For more details about Balancer V3 Hooks implementation see [Hooks Core Concepts](/concepts/core-concepts/hooks.md).

# Supported Hook Types

## Stable Surge Hook

* This uses the [onComputeDynamicSwapFeePercentage](/developer-reference/contracts/hooks-api.md#oncomputedynamicswapfeepercentage) hook.
* [Intro blog post](https://medium.com/balancer-protocol/balancers-stablesurge-hook-09d2eb20f219).
* Pools with StableSurge hook will be deployed from a dedicated [factory](https://github.com/balancer/balancer-v3-monorepo/blob/2f088c6b8f66ad55885d257c1e3debe2a6e21e97/pkg/pool-hooks/contracts/StableSurgePoolFactory.sol).
* [Factory Deployment Addresses](https://docs.balancer.fi/developer-reference/contracts/deployment-addresses/mainnet.html#pool-factories).
* See SC code implementation [here](https://github.com/balancer/balancer-v3-monorepo/blob/2f088c6b8f66ad55885d257c1e3debe2a6e21e97/pkg/pool-hooks/contracts/StableSurgeHook.sol).
* [Typescript maths reference](https://github.com/balancer/balancer-maths/blob/eeff3ef8cf1105a0aaa6d96a4c0f8b7a62135256/typescript/src/hooks/stableSurgeHook.ts)
* [Python maths reference](https://github.com/balancer/balancer-maths/blob/main/python/src/hooks/stable_surge/stable_surge_hook.py).
* Maths requires the configurable `maxSurgeFeePercentage` and `thresholdPercentage` values which can be fetched and tracked using the following functions and events:
```solidity
function getMaxSurgeFeePercentage(address pool) external view returns (uint256);

event ThresholdSurgePercentageChanged(address indexed pool, uint256 newSurgeThresholdPercentage);

function getSurgeThresholdPercentage(address pool) external view returns (uint256);

event MaxSurgeFeePercentageChanged(address indexed pool, uint256 newMaxSurgeFeePercentage);
```
* API Support: Can use the filter: `includeHooks: [STABLE_SURGE]`, to include all pools using this hook type:
```graphql
query MyQuery {
  aggregatorPools(
    where: {chainIn: SEPOLIA, includeHooks: [STABLE_SURGE], protocolVersionIn: 3}
  ) {
    address
    type
    hook {
      dynamicData {
        maxSurgeFeePercentage
        surgeThresholdPercentage
      }
    }
  }
}
```

## AkronWeightedLVRFee Hook

* This uses the [onComputeDynamicSwapFeePercentage](/developer-reference/contracts/hooks-api.md#oncomputedynamicswapfeepercentage) hook.
* Uses adapted weighted maths to calculate fee - does not need to track any hook state.
* Only used with Weighted pools.
* [Pools](https://balancer.fi/pools?textSearch=akron)
* [Akron Docs](https://crocus-sidewalk-9c5.notion.site/Balancer-Weighted-Pool-implementing-Akron-LVR-linked-Dynamic-Swap-Fee-Hook-integration-guide-inclu-1697cd41d8b880e1840be00404df2e3a).
* See SC code implementation [here](https://github.com/Akron-admin/balancer-v3-monorepo/blob/Weighted-Hook/pkg/pool-hooks/contracts/AkronWeightedLVRFeeHook.sol)
* [Typescript maths reference](https://github.com/balancer/balancer-maths/tree/main/typescript/src/hooks/akron)
* Deployment Addresses:
```
Base:
hookAddress: '0xA45570815dbE7BF7010c41f1f74479bE322D02bd'

Arbitrum:
hookAddress: '0xD221aFFABdD3C1281ea14C5781DEc6B0fCA8937E'
```
* API Support: Can use the filter: `includeHooks: [AKRON]`, to include all pools using this hook type:
```graphql
query MyQuery {
  aggregatorPools(
    where: {chainIn: BASE, includeHooks: [AKRON], protocolVersionIn: 3}
  ) {
    address
    type
    hook {
      type
    }
    dynamicData {
      swapFee
    }
  }
}
```