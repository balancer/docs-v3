---
order: 6
title: Hook Ref - Maths And Details
---

# Hooks Reference

Explore our [GitHub repository](https://github.com/balancer/balancer-maths) containing reference mathematical implementations, in Javascript and Python, for supported Balancer hook types. Designed to assist developers and integrators in understanding the underlying swap calculations, these implementations can be imported as a packages into your project or serve as a reference for your own implementation.

For more details about Balancer V3 Hooks implementation see [Hooks Core Concepts](/concepts/core-concepts/hooks.md).

# Supported Hook Types

## Stable Surge Hook

[Intro blog post](https://medium.com/balancer-protocol/balancers-stablesurge-hook-09d2eb20f219).

Pools with StableSurge hook will be deployed from a [factory](https://github.com/balancer/balancer-v3-monorepo/blob/2f088c6b8f66ad55885d257c1e3debe2a6e21e97/pkg/pool-hooks/contracts/StableSurgePoolFactory.sol).

See SC code implementation [here](https://github.com/balancer/balancer-v3-monorepo/blob/2f088c6b8f66ad55885d257c1e3debe2a6e21e97/pkg/pool-hooks/contracts/StableSurgeHook.sol).

[Typescript maths reference](https://github.com/balancer/balancer-maths/blob/eeff3ef8cf1105a0aaa6d96a4c0f8b7a62135256/typescript/src/hooks/stableSurgeHook.ts)

Python maths reference - WIP.

[Factory Deployment Addresses](https://docs.balancer.fi/developer-reference/contracts/deployment-addresses/mainnet.html#pool-factories) - See `StableSurgePoolFactory` WIP

Notes:
* This uses the [onComputeDynamicSwapFeePercentage](/developer-reference/contracts/hooks-api.md#oncomputedynamicswapfeepercentage) hook.
* Maths requires the configurable `maxSurgeFeePercentage` and `thresholdPercentage` values which can be fetched and tracked using the following functions and events:
```solidity
function getMaxSurgeFeePercentage(address pool) external view returns (uint256);

event ThresholdSurgePercentageChanged(address indexed pool, uint256 newSurgeThresholdPercentage);

function getSurgeThresholdPercentage(address pool) external view returns (uint256);

event MaxSurgeFeePercentageChanged(address indexed pool, uint256 newMaxSurgeFeePercentage);
```

## Gyro 2CLP

::: warning
Gyro 2CLP are currently going through Audit and have not been released.
:::

Gyroscope’s 2-CLPs are AMMs that concentrate liquidity within a pricing range.

[Docs](https://docs.gyro.finance/gyroscope-protocol/concentrated-liquidity-pools/2-clps)

See SC code implementation [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-gyro/contracts/Gyro2CLPPool.sol).

Notes:
* Maths requires the following pool specific parameters:
```solidity
sqrtAlpha
sqrtBeta
```
  * These are set at creation and are immutable.
  * Data can be fetched onchain using the following helpers (see [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-gyro/contracts/GyroECLPPool.sol#L238C66-L238C89) and [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-gyro/contracts/GyroECLPPool.sol#L252)):

```solidity
function getGyro2CLPPoolDynamicData() external view returns (Gyro2CLPPoolDynamicData memory data);

struct Gyro2CLPPoolDynamicData {
  uint256[] balancesLiveScaled18;
  uint256[] tokenRates;
  uint256 staticSwapFeePercentage;
  uint256 totalSupply;
  uint256 bptRate;
  bool isPoolInitialized;
  bool isPoolPaused;
  bool isPoolInRecoveryMode;
}

function getGyro2CLPPoolImmutableData() external view returns (Gyro2CLPPoolImmutableData memory data);

struct Gyro2CLPPoolImmutableData {
  IERC20[] tokens;
  uint256[] decimalScalingFactors;
  uint256 sqrtAlpha;
  uint256 sqrtBeta;
}
```
  * Offchain the fields are available from the [API](/integration-guides/aggregators/fetching-pools-and-data.md#using-balancers-api)

## Gyro ECLP

::: warning
Gyro ECLPs are currently going through Audit and have not been released.
:::

Elliptic CLPs, or E-CLPs, allow trading along the curve of an ellipse. E-CLPs will be used for stablecoin pools that include the Gyroscope stablecoin, GYD.

[Docs](https://docs.gyro.finance/gyroscope-protocol/concentrated-liquidity-pools/e-clps)

See SC code implementation [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-gyro/contracts/GyroECLPPool.sol).

Notes:
* Maths requires the following pool specific parameters:
```solidity
paramsAlpha
paramsBeta
paramsC
paramsS
paramsLambda
tauAlphaX
tauAlphaY
tauBetaX
tauBetaY
u
v
w
z
dSq
``` 
  * These are set at creation and are immutable.
  * Data can be fetched onchain using the following helpers (see [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-gyro/contracts/GyroECLPPool.sol#L238C66-L238C89) and [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-gyro/contracts/GyroECLPPool.sol#L252)):
```solidity
function getGyroECLPPoolDynamicData() external view returns (GyroECLPPoolDynamicData memory data);

struct GyroECLPPoolDynamicData {
  uint256[] balancesLiveScaled18;
  uint256[] tokenRates;
  uint256 staticSwapFeePercentage;
  uint256 totalSupply;
  uint256 bptRate;
  bool isPoolInitialized;
  bool isPoolPaused;
  bool isPoolInRecoveryMode;
}

function getGyroECLPPoolImmutableData() external view returns (GyroECLPPoolImmutableData memory data);

struct GyroECLPPoolImmutableData {
    IERC20[] tokens;
    uint256[] decimalScalingFactors;
    int256 paramsAlpha;
    int256 paramsBeta;
    int256 paramsC;
    int256 paramsS;
    int256 paramsLambda;
    int256 tauAlphaX;
    int256 tauAlphaY;
    int256 tauBetaX;
    int256 tauBetaY;
    int256 u;
    int256 v;
    int256 w;
    int256 z;
    int256 dSq;
}
```
  * Offchain the fields are available from the [API](/integration-guides/aggregators/fetching-pools-and-data.md#using-balancers-api)