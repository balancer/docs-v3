---
order: 5
title: Pool Types - Maths And Details
---

# Pool Maths Reference

Explore our [GitHub repository](https://github.com/balancer/balancer-maths) containing reference mathematical implementations, in Javascript and Python, for supported Balancer pool types. Designed to assist developers and integrators in understanding the underlying swap calculations, these implementations can be imported as a packages into your project or serve as a reference for your own implementation.

# Supported Pool Types

## Weighted Pool

Pools that swap tokens by enforcing a Constant Weighted Product invariant.

* See SC code implementation [here](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/pool-weighted).
* [Typescript maths reference](https://github.com/balancer/balancer-maths/tree/main/typescript/src/weighted)
* [Python maths reference](https://github.com/balancer/balancer-maths/blob/main/python/src/pools/weighted.py)
* [Factory Deployment Addresses](https://docs.balancer.fi/developer-reference/contracts/deployment-addresses/mainnet.html#pool-factories) - See `WeightedPoolFactory`

## Stable Pool

Pools that swap tokens by enforcing a Stable Math invariant, based on Curve.

* See SC code implementation [here](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/pool-stable).
* [Typescript maths reference](https://github.com/balancer/balancer-maths/tree/main/typescript/src/stable)
* [Python maths reference](https://github.com/balancer/balancer-maths/blob/main/python/src/pools/stable.py)
* [Factory Deployment Addresses](https://docs.balancer.fi/developer-reference/contracts/deployment-addresses/mainnet.html#pool-factories) - See `StablePoolFactory`
* Amplification factor can be dynamic see:
  * `getAmplificationParameter()` view function
  * `AmpUpdateStarted` & `AmpUpdateStopped` events

## Gyro ECLP

Elliptic CLPs, or E-CLPs, allow trading along the curve of an ellipse.

* [Gyro Docs](https://docs.gyro.finance/gyroscope-protocol/concentrated-liquidity-pools/e-clps)
* See SC code implementation [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-gyro/contracts/GyroECLPPool.sol)
* [Typescript maths reference](https://github.com/balancer/balancer-maths/blob/main/typescript/src/gyro/gyroECLPPool.ts)
* [Python maths reference](https://github.com/balancer/balancer-maths/blob/main/python/src/pools/gyro/gyroECLP.py)
* [Factory Deployment Addresses](https://docs.balancer.fi/developer-reference/contracts/deployment-addresses/mainnet.html#pool-factories) - See `GyroECLPPoolFactory`
* [GyroE pools on Balancer App](https://balancer.fi/pools?poolTypes=GYRO&protocolVersion=3)
* Maths requires the following pool specific immutable parameters:
```
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
  * [API](/integration-guides/aggregators/fetching-pools-and-data.md#using-balancers-api) Support: Pool will show as `GYROE` type and immutable params are available:
```graphql
query MyQuery {
  aggregatorPools(
    where: {chainIn: ARBITRUM, protocolVersionIn: 3, poolTypeIn: GYROE}
  ) {
    address
    type
    alpha
    beta
    c
    s
    lambda
    tauAlphaX
    tauAlphaY
    tauBetaX
    tauBetaY
    u
    v
    w
    z
    dSq
  }
}
```