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
* Amplification factor can be dynamic; see:
  * `getAmplificationParameter()` view function
  * `AmpUpdateStarted` & `AmpUpdateStopped` events

## Stable Surge Pool

Stable Pools that use the Stable Surge Hook, a dynamic fee implementation that increases fees on transactions that unbalance the pool. The pool itself is exactly the same - a standard Stable Pool. The only difference is the hook, which is attached to the pool by the factory.

* See SC code implementation [here](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/pool-hooks/contracts/StableSurgePoolFactory.sol).
* [Typescript maths reference](https://github.com/balancer/balancer-maths/tree/main/typescript/src/stable)
* [Python maths reference](https://github.com/balancer/balancer-maths/blob/main/python/src/pools/stable.py)
* [Factory Deployment Addresses](https://docs.balancer.fi/developer-reference/contracts/deployment-addresses/mainnet.html#pool-factories) - See `StableSurgePoolFactory`
* Amplification factor can be dynamic; see:
  * `getAmplificationParameter()` view function
  * `AmpUpdateStarted` & `AmpUpdateStopped` events

## Gyro 2-CLP

Gyroscope two-token pools that concentrate liquidity in a fungible manner, and can have uncorrelated assets.

* [Gyro Docs](https://docs.gyro.finance/gyroscope-protocol/concentrated-liquidity-pools/2-clps)
* See SC code implementation [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-gyro/contracts/Gyro2CLPPool.sol)
* [Typescript maths reference](https://github.com/balancer/balancer-maths/blob/main/typescript/src/gyro/gyro2CLPPool.ts)
* [Python maths reference](https://github.com/balancer/balancer-maths/blob/main/python/src/pools/gyro/gyro2CLP.py)
* [Factory Deployment Addresses](https://docs.balancer.fi/developer-reference/contracts/deployment-addresses/mainnet.html#pool-factories) - See `Gyro2CLPPoolFactory`
* [Gyro pools on Balancer App](https://balancer.fi/pools?poolTypes=GYRO&protocolVersion=3)
* Maths requires the following pool specific immutable parameters:
```
paramsAlpha
paramsBeta
``` 

  * These are set at creation and are immutable.
  * Data can be fetched onchain using the following helpers (see [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-gyro/contracts/Gyro2CLPPool.sol#L224-L235) and [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-gyro/contracts/Gyro2CLPPool.sol#L238-L243)):
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

## Gyro E-CLP

Elliptic CLPs, or E-CLPs, allow trading along the curve of an ellipse. Suitable for correlated assets that would be used with Stable Pools.

* [Gyro Docs](https://docs.gyro.finance/gyroscope-protocol/concentrated-liquidity-pools/e-clps)
* See SC code implementation [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-gyro/contracts/GyroECLPPool.sol)
* [Typescript maths reference](https://github.com/balancer/balancer-maths/blob/main/typescript/src/gyro/gyroECLPPool.ts)
* [Python maths reference](https://github.com/balancer/balancer-maths/blob/main/python/src/pools/gyro/gyroECLP.py)
* [Factory Deployment Addresses](https://docs.balancer.fi/developer-reference/contracts/deployment-addresses/mainnet.html#pool-factories) - See `GyroECLPPoolFactory`
* [Gyro pools on Balancer App](https://balancer.fi/pools?poolTypes=GYRO&protocolVersion=3)
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

## ReClamm Pools

ReClamm Pools are two-token concentrated liquidity pools conceptually similar to 2-CLPs, but the parameters are not immutable. They can be changed not only by admins, but also by the pool itself, as it automatically adjusts virtual balances to shift the price range as necessary to keep the pool balanced (and earning fees for LPs).

* See SC code implementation in this [dedicated repo](https://github.com/balancer/reclamm/blob/main/contracts/ReClammPool.sol)
* [Typescript maths reference](https://github.com/balancer/balancer-maths/blob/main/typescript/src/reClamm/reClammPool.ts)
* [Factory Deployment Addresses](https://docs.balancer.fi/developer-reference/contracts/deployment-addresses/mainnet.html#pool-factories) - See `ReClammPoolFactory`
* Maths requires the following pool specific parameters:
```
dailyPriceShiftExponent;
centerednessMargin;
initialMinPrice;
initialMaxPrice;
initialTargetPrice;
tokenAPriceIncludesRate;
tokenBPriceIncludesRate;
``` 
  * The "initial params" are set at creation and are immutable. They are only used to facilitate initializing the pool with correct token amounts to avoid arbitration losses.
  * The `dailyPriceShiftExponent` and `centerednessMargin` can be changed by admins after deployment.
  * The price shift exponent affects how quickly the pool is allowed to automatically shift the price range to keep the pool in balance. Faster = more responsive to volatility, but also more vulnerable to manipulation.
  * The centeredness margin determines how sensitive the pool is to swaps that move it toward a more unbalanced state. Higher values mean greater sensitivity: the pool will react quicker to becoming unbalanced (e.g., at 60/40 vs. 80/20). A zero margin is essentially equivalent to a 2-CLP Gyro pool constructed with the same price range.
  * Many common use cases involved wrapped tokens with rate providers. The rate flags allow the price to be specified using either the wrapped or underlying token prices
  * Admins can change the sensitivity and behavior of the pool after deployment by setting the margin or price shift exponent. While the price range cannot be set directly while the pool is in operation, it can be narrowed or widened (slowly over time, to prevent manipulation), by changing the ratio of the bounds.
  * Data can be fetched onchain using the following helpers (see [here](https://github.com/balancer/reclamm/blob/main/contracts/ReClammPool.sol#L522-L546) and [here](https://github.com/balancer/reclamm/blob/main/contracts/ReClammPool.sol#L549-L564)):
```solidity
function getReClammPoolDynamicData() external view returns (ReClammPoolDynamicData memory data);

struct ReClammPoolDynamicData {
    // Base Pool
    uint256[] balancesLiveScaled18;
    uint256[] tokenRates;
    uint256 staticSwapFeePercentage;
    uint256 totalSupply;
    // ReClamm
    uint256 lastTimestamp;
    uint256[] lastVirtualBalances;
    uint256 dailyPriceShiftExponent;
    uint256 dailyPriceShiftBase;
    uint256 centerednessMargin;
    uint256 currentPriceRatio;
    uint256 currentFourthRootPriceRatio;
    uint256 startFourthRootPriceRatio;
    uint256 endFourthRootPriceRatio;
    uint32 priceRatioUpdateStartTime;
    uint32 priceRatioUpdateEndTime;
    // Pool State
    bool isPoolInitialized;
    bool isPoolPaused;
    bool isPoolInRecoveryMode;
}

function getReClammPoolImmutableData() external view returns (ReClammPoolImmutableData memory data);

struct ReClammPoolImmutableData {
    // Base Pool
    IERC20[] tokens;
    uint256[] decimalScalingFactors;
    bool tokenAPriceIncludesRate;
    bool tokenBPriceIncludesRate;
    uint256 minSwapFeePercentage;
    uint256 maxSwapFeePercentage;
    // Initialization
    uint256 initialMinPrice;
    uint256 initialMaxPrice;
    uint256 initialTargetPrice;
    uint256 initialDailyPriceShiftExponent;
    uint256 initialCenterednessMargin;
    // Operating Limits
    uint256 maxDailyPriceShiftExponent;
    uint256 maxDailyPriceRatioUpdateRate;
    uint256 minPriceRatioUpdateDuration;
    uint256 minPriceRatioDelta;
    uint256 balanceRatioAndPriceTolerance;
}
```
