---
order: 5
title: Pool Types - Maths And Details
---

# Pool Maths Reference

Explore our [GitHub repository](https://github.com/balancer/balancer-maths) containing reference mathematical implementations, in Javascript and Python, for supported Balancer pool types. Designed to assist developers and integrators in understanding the underlying swap calculations, these implementations can be imported as a packages into your project or serve as a reference for your own implementation.

# Supported Pool Types

## Weighted Pool

Pools that swap tokens by enforcing a Constant Weighted Product invariant.

- See SC code implementation [here](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/pool-weighted).
- [Typescript maths reference](https://github.com/balancer/balancer-maths/tree/main/typescript/src/weighted)
- [Python maths reference](https://github.com/balancer/balancer-maths/tree/main/python/src/pools/weighted)
- [Factory Deployment Addresses](https://docs.balancer.fi/developer-reference/contracts/deployment-addresses/mainnet.html#pool-factories) - See `WeightedPoolFactory`

## Stable Pool

Pools that swap tokens by enforcing a Stable Math invariant, based on Curve.

- See SC code implementation [here](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/pool-stable).
- [Typescript maths reference](https://github.com/balancer/balancer-maths/tree/main/typescript/src/stable)
- [Python maths reference](https://github.com/balancer/balancer-maths/tree/main/python/src/pools/stable)
- [Factory Deployment Addresses](https://docs.balancer.fi/developer-reference/contracts/deployment-addresses/mainnet.html#pool-factories) - See `StablePoolFactory`
- Amplification factor can be dynamic; see:
  - `getAmplificationParameter()` view function
  - `AmpUpdateStarted` & `AmpUpdateStopped` events

## Stable Surge Pool

Stable Pools that use the Stable Surge Hook, a dynamic fee implementation that increases fees on transactions that unbalance the pool. The pool itself is exactly the same - a standard Stable Pool. The only difference is the hook, which is attached to the pool by the factory.

- See SC code implementation [here](https://github.com/balancer/balancer-v3-monorepo/tree/main/pkg/pool-hooks/contracts/StableSurgePoolFactory.sol).
- [Typescript maths reference](https://github.com/balancer/balancer-maths/tree/main/typescript/src/stable)
- [Python maths reference](https://github.com/balancer/balancer-maths/tree/main/python/src/pools/stable)
- [Factory Deployment Addresses](https://docs.balancer.fi/developer-reference/contracts/deployment-addresses/mainnet.html#pool-factories) - See `StableSurgePoolFactory`
- Amplification factor can be dynamic; see:
  - `getAmplificationParameter()` view function
  - `AmpUpdateStarted` & `AmpUpdateStopped` events

## Liquidity Bootstrapping Pool

Liquidity Bootstrapping pools have linearly changing weights but use weighted math to determine prices.

- [LBP docs](https://docs.balancer.fi/concepts/explore-available-balancer-pools/liquidity-bootstrapping-pool)
- See SC code implementation [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-weighted/contracts/lbp/LBPool.sol)
- [Typescript maths reference](https://github.com/balancer/balancer-maths/blob/main/typescript/src/liquidityBootstrapping)
- [Python maths reference](https://github.com/balancer/balancer-maths/tree/main/python/src/pools/liquidity_bootstrapping)
- [Factory Deployment Addresses](https://docs.balancer.fi/developer-reference/contracts/deployment-addresses/mainnet.html#pool-factories) - See `LBPoolFactory	`
- [LB pools on Balancer App](https://balancer.fi/pools?poolTypes=LBP&protocolVersion=3)
- weight calculation requires the following parameters:

```
projectTokenIndex
currentTime
startTime
endTime
projectTokenStartWeight
projectTokenEndWeight
```

- pool tokens are always sorted alphanumerically.
- Data can be fetched onchain using the following helpers (see [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-weighted/contracts/lbp/LBPool.sol#L265-L282) and [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-weighted/contracts/lbp/LBPool.sol#L251-L262)):
- The pool interface is available [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/pool-weighted/ILBPool.sol).

```solidity
    function getLBPoolDynamicData() external view override returns (LBPoolDynamicData memory data) {
        data.balancesLiveScaled18 = _vault.getCurrentLiveBalances(address(this));
        data.normalizedWeights = _getNormalizedWeights();
        data.staticSwapFeePercentage = _vault.getStaticSwapFeePercentage((address(this)));
        data.totalSupply = totalSupply();

        PoolConfig memory poolConfig = _vault.getPoolConfig(address(this));
        data.isPoolInitialized = poolConfig.isPoolInitialized;
        data.isPoolPaused = poolConfig.isPoolPaused;
        data.isPoolInRecoveryMode = poolConfig.isPoolInRecoveryMode;
        data.isSwapEnabled = _isSwapEnabled();
    }

    struct LBPoolDynamicData {
    uint256[] balancesLiveScaled18;
    uint256[] normalizedWeights;
    uint256 staticSwapFeePercentage;
    uint256 totalSupply;
    bool isPoolInitialized;
    bool isPoolPaused;
    bool isPoolInRecoveryMode;
    bool isSwapEnabled;
    }

    /// @inheritdoc ILBPool
    function getLBPoolImmutableData() external view override returns (LBPoolImmutableData memory data) {
        data.tokens = _vault.getPoolTokens(address(this));
        data.projectTokenIndex = _projectTokenIndex;
        data.reserveTokenIndex = _reserveTokenIndex;

        (data.decimalScalingFactors, ) = _vault.getPoolTokenRates(address(this));
        data.isProjectTokenSwapInBlocked = _blockProjectTokenSwapsIn;
        data.startTime = _startTime;
        data.endTime = _endTime;

        data.startWeights = new uint256[](_TWO_TOKENS);
        data.startWeights[_projectTokenIndex] = _projectTokenStartWeight;
        data.startWeights[_reserveTokenIndex] = _reserveTokenStartWeight;

        data.endWeights = new uint256[](_TWO_TOKENS);
        data.endWeights[_projectTokenIndex] = _projectTokenEndWeight;
        data.endWeights[_reserveTokenIndex] = _reserveTokenEndWeight;
    }
    struct LBPoolImmutableData {
    IERC20[] tokens;
    uint256[] decimalScalingFactors;
    uint256[] startWeights;
    uint256[] endWeights;
    uint256 startTime;
    uint256 endTime;
    uint256 projectTokenIndex;
    uint256 reserveTokenIndex;
    bool isProjectTokenSwapInBlocked;
    }
```

- [API](/integration-guides/aggregators/fetching-pools-and-data.md#using-balancers-api) Support: Pool will show as `LIQUIDITY_BOOTSTRAPPING` type and immutable params are available:

A sample graphql query is below returning information about a LBP and docs on the `GqlPoolLiquidityBootstrapping` is available at [https://api-v3.balancer.fi/](https://api-v3.balancer.fi/).

```graphql
query {
  poolGetPool(id: "0x812C1217EA39c5242eD1C6D1015EbeD31261E28A", chain: BASE) {
    id
    ... on GqlPoolLiquidityBootstrapping {
      address
      startTime
      endTime
      isProjectTokenSwapInBlocked
      lbpOwner
      projectTokenIndex
      projectToken
      reserveToken
      reserveTokenIndex
      projectTokenStartWeight
      reserveTokenStartWeight
      projectTokenEndWeight
      reserveTokenEndWeight
    }
  }
}
```

## Gyro 2-CLP

Gyroscope two-token pools that concentrate liquidity in a fungible manner, and can have uncorrelated assets.

- [Gyro Docs](https://docs.gyro.finance/gyroscope-protocol/concentrated-liquidity-pools/2-clps)
- See SC code implementation [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-gyro/contracts/Gyro2CLPPool.sol)
- [Typescript maths reference](https://github.com/balancer/balancer-maths/blob/main/typescript/src/gyro/gyro2CLPPool.ts)
- [Python maths reference](https://github.com/balancer/balancer-maths/blob/main/python/src/pools/gyro/gyro_2clp.py)
- [Factory Deployment Addresses](https://docs.balancer.fi/developer-reference/contracts/deployment-addresses/mainnet.html#pool-factories) - See `Gyro2CLPPoolFactory`
- [Gyro pools on Balancer App](https://balancer.fi/pools?poolTypes=GYRO&protocolVersion=3)
- Maths requires the following pool specific immutable parameters:

```
paramsAlpha
paramsBeta
```

- These are set at creation and are immutable.
- Data can be fetched onchain using the following helpers (see [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-gyro/contracts/Gyro2CLPPool.sol#L224-L235) and [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-gyro/contracts/Gyro2CLPPool.sol#L238-L243)):

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

- [Gyro Docs](https://docs.gyro.finance/gyroscope-protocol/concentrated-liquidity-pools/e-clps)
- See SC code implementation [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-gyro/contracts/GyroECLPPool.sol)
- [Typescript maths reference](https://github.com/balancer/balancer-maths/blob/main/typescript/src/gyro/gyroECLPPool.ts)
- [Python maths reference](https://github.com/balancer/balancer-maths/blob/main/python/src/pools/gyro/gyroECLP.py)
- [Factory Deployment Addresses](https://docs.balancer.fi/developer-reference/contracts/deployment-addresses/mainnet.html#pool-factories) - See `GyroECLPPoolFactory`
- [Gyro pools on Balancer App](https://balancer.fi/pools?poolTypes=GYRO&protocolVersion=3)
- Maths requires the following pool specific immutable parameters:

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

- These are set at creation and are immutable.
- Data can be fetched onchain using the following helpers (see [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-gyro/contracts/GyroECLPPool.sol#L238C66-L238C89) and [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-gyro/contracts/GyroECLPPool.sol#L252)):

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

- [API](/integration-guides/aggregators/fetching-pools-and-data.md#using-balancers-api) Support: Pool will show as `GYROE` type and immutable params are available:

```graphql
query MyQuery {
  aggregatorPools(
    where: { chainIn: ARBITRUM, protocolVersionIn: 3, poolTypeIn: GYROE }
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

## reCLAMM Pools

reCLAMM Pools are two-token concentrated liquidity pools conceptually similar to 2-CLPs, but the parameters are not immutable. They can be changed not only by admins, but also by the pool itself, as it automatically adjusts virtual balances to shift the price range as necessary to keep the pool balanced (and earning fees for LPs).

::: warning V2 Changes
V1 reCLAMM pools are deprecated in favour of V2. 
V2 has a small maths fix to handle an edge case when pool is out of range.
They have independent factories. If using the API please use `version` to differentiate. 
:::

* See SC code implementation in this [dedicated repo](https://github.com/balancer/reclamm/blob/main/contracts/ReClammPool.sol)
* [Typescript maths reference](https://github.com/balancer/balancer-maths/blob/main/typescript/src/reClammV2/reClammV2Pool.ts)
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
## QuantAMM BTFs

BTFs by QuantAMM dynamically adjust pool weights to capitalize on price movements. For example, a BTF pool can automatically increase its WBTC allocation when the BTF strategy thinks the value will rise faster than ETH. This allows LPs to earn both trading fees and profits from underlying asset appreciation through continuous, responsive, fully on-chain TradFi-style strategies.

- [QuantAMM Docs](https://quantamm.fi/documentation)
- See SC code implementation [here](https://github.com/QuantAMMProtocol/QuantAMM-V1)
- [Typescript maths reference](https://github.com/balancer/balancer-maths/tree/main/typescript/src/quantAmm)
- [Python maths reference](https://github.com/balancer/balancer-maths/tree/main/python/src/pools/quantamm)
- [BTF pools on Balancer App](https://balancer.fi/pools?poolTypes=QUANT_AMM_WEIGHTED)
- [Deployment Addresses](https://mono-test-v3-git-feat-quantamm-support-balancer.vercel.app/pools/ethereum/v3/0xd4ed17bbf48af09b87fd7d8c60970f5da79d4852):

```
Mainnet:
* UpdateWeightRunner: 0x21Ae9576a393413D6d91dFE2543dCb548Dbb8748
* QuantAMMWeightedPoolFactory: 0xD5c43063563f9448cE822789651662cA7DcD5773

Arbitrum:
* UpdateWeightRunner: 0x8Ca4e2a74B84c1feb9ADe19A0Ce0bFcd57e3f6F7
* QuantAMMWeightedPoolFactory: 0x62B9eC6A5BBEBe4F5C5f46C8A8880df857004295

Base:
* UpdateWeightRunner: 0x8Ca4e2a74B84c1feb9ADe19A0Ce0bFcd57e3f6F7
* QuantAMMWeightedPoolFactory: 0x62B9eC6A5BBEBe4F5C5f46C8A8880df857004295
```

- Maths requires the following dynamic data:

```
firstFourWeightsAndMultipliers
secondFourWeightsAndMultipliers
lastUpdateTime
lastInterpolationTimePossible
```

- Event tracking systems can use the `UpdateWeightRunner`, `WeightsUpdated` [event](https://github.com/QuantAMMProtocol/QuantAMM-V1/blob/main/pkg/pool-quantamm/contracts/UpdateWeightRunner.sol#L93). The UpdateWeight runner is a single contract that controls weight changes for all pools.
- Data can also be fetched onchain using the following helpers (see [here](https://github.com/QuantAMMProtocol/QuantAMM-V1/blob/main/pkg/pool-quantamm/contracts/QuantAMMWeightedPool.sol#L595) and [here](https://github.com/QuantAMMProtocol/QuantAMM-V1/blob/main/pkg/pool-quantamm/contracts/QuantAMMWeightedPool.sol#L615)):

```solidity
function getQsecondFourWeightsAndMultipliersuantAMMWeightedPoolDynamicData() external view returns (QuantAMMWeightedPoolDynamicData memory data);

struct QuantAMMWeightedPoolDynamicData {
    uint256[] balancesLiveScaled18;
    uint256[] tokenRates;
    uint256 totalSupply;
    bool isPoolInitialized;
    bool isPoolPaused;
    bool isPoolInRecoveryMode;
    int256[] firstFourWeightsAndMultipliers;
    int256[] ;
    uint40 lastUpdateTime;
    uint40 lastInteropTime;
}

function getQuantAMMWeightedPoolImmutableData() external view returns (QuantAMMWeightedPoolImmutableData memory data);

struct QuantAMMWeightedPoolImmutableData {
  IERC20[] tokens;
  uint oracleStalenessThreshold;
  uint256 poolRegistry;
  int256[][] ruleParameters;
  uint64[] lambda;
  uint64 epsilonMax;
  uint64 absoluteWeightGuardRail;
  uint64 updateInterval;
  uint256 maxTradeSizeRatio;
}
```

- [API](/integration-guides/aggregators/fetching-pools-and-data.md#using-balancers-api) Support: Pool will show as `QUANT_AMM_WEIGHTED` type:

```graphql
query MyQuery {
  aggregatorPools(
    where: {
      chainIn: MAINNET
      protocolVersionIn: 3
      poolTypeIn: QUANT_AMM_WEIGHTED
    }
  ) {
    address
    type
  }
}
```

- Max trade size: Each BTF pool has a `maxTradeSizeRatio` that is set on [pool creation](https://github.com/QuantAMMProtocol/QuantAMM-V1/blob/main/pkg/interfaces/contracts/pool-quantamm/IQuantAMMWeightedPool.sol#L105). This determines the max amount that can be traded.
