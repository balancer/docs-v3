---
order: 5
title: Pool Types - Maths And Details
---

# Pool Maths Reference

Explore our [GitHub repository](https://github.com/balancer/balancer-maths) containing reference mathematical implementations, in Javascript and Python, for supported Balancer pool types. Designed to assist developers and integrators in understanding the underlying swap calculations, these implementations can be imported as a packages into your project or serve as a reference for your own implementation.

# Supported Pool Types

## Weighted Pool

Pools that swap tokens by enforcing a Constant Weighted Product invariant.

See SC code implementation [here](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/pool-weighted).

[Typescript maths reference](https://github.com/balancer/balancer-maths/tree/main/typescript/src/weighted)

[Python maths reference](https://github.com/balancer/balancer-maths/blob/main/python/src/pools/weighted.py)

[Factory Deployment Addresses](https://docs.balancer.fi/developer-reference/contracts/deployment-addresses/mainnet.html#pool-factories) - See `WeightedPoolFactory`

## Stable Pool

Pools that swap tokens by enforcing a Stable Math invariant, based on Curve.

See SC code implementation [here](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/pool-stable).

[Typescript maths reference](https://github.com/balancer/balancer-maths/tree/main/typescript/src/stable)

[Python maths reference](https://github.com/balancer/balancer-maths/blob/main/python/src/pools/stable.py)

[Factory Deployment Addresses](https://docs.balancer.fi/developer-reference/contracts/deployment-addresses/mainnet.html#pool-factories) - See `StablePoolFactory`

Notes:
* Amplification factor can be dynamic see:
  * getAmplificationParameter() view function
  * AmpUpdateStarted & AmpUpdateStopped events

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