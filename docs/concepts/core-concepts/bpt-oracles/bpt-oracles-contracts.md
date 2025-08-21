---
order: 4
title: BPT Oracle contracts
---
# Overview

We have implemented oracles for both Weighted and Stable Balancer pools. (ReCLAMM pools should also work, as they are fundamentally Weighted pools, just incorporating virtual balances.) These are in the standalone-utils package: `WeightedLPOracle` and `StableLPOracle`, and associated factories.

![Inheritance Diagram](/images/BPTOracles.png)

## Oracle Factories

Oracles are created from the corresponding pool factories using the create function:

`function create(IBasePool pool, AggregatorV3Interface[] memory feeds) external returns (ILPOracleBase oracle);`

`AggregatorV3Interface` is a Chainlink price feed. Note that this assumes the feed array is parallel to the pool tokens; i.e., the feed at each position is the correct one for the corresponding pool token. There is no way for the code to check this, so responsibility falls on the caller to ensure that this is the case. See the [Usage with Rate Providers](./bpt-oracles.md#usage-with-rate-providers) section for further considerations.

This first computes an "OracleID" as the hash of the pool and price feed addresses. Since the tokens must be ordered, we know the price feed addresses will also be in the same order, so a given combination of the pool and price feeds is guaranteed unique. It then calls an internal `_create` (implemented by derived contracts) to deploy the oracle with the given configuration, and registers it with the factory.

The base factory contract [interface](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/standalone-utils/ILPOracleFactoryBase.sol) defines functions to find an oracle given pool and feed addresses, and check whether a given oracle was deployed by the official factory:

```
function getOracle(
    IBasePool pool,
    AggregatorV3Interface[] memory feeds
) external view returns (ILPOracleBase oracle);

function isOracleFromFactory(ILPOracleBase oracle) external view returns (bool success);
```

## Oracle contracts

The common factory contract [interface](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/standalone-utils/ILPOracleBase.sol) defines:

`function calculateTVL(int256[] memory prices) external view returns (uint256 tvl);`

This function computes the total value of the pool, solving the pool and price constraints simultaneously as described in the [main article](./bpt-oracles.md#derivation).

Just as the price feeds implement the Chainlink interface `AggregatorV3Interface` to fetch individual token prices, the common factory [contract](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/standalone-utils/contracts/LPOracleBase.sol) also implements this interface, and calling `latestRoundData` invokes the virtual `calculateTVL` function to get the total value, then divides by the total supply to get the BPT price.
