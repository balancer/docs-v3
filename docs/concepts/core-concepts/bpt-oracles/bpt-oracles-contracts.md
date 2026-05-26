---
order: 4
title: BPT Oracle contracts
---
# Overview

We have implemented oracles for both Weighted and Stable Balancer pools, as well as Gyro E-CLPs. These are in the `oracles` package: `WeightedLPOracle`, `StableLPOracle`, `EclpLPOracle`, and associated factories.

![Inheritance Diagram (for Weighted and Stable)](/images/BPTOracles.png)

## Oracle Factories

Oracles are created from the corresponding pool factories using the create function:

`function create(IBasePool pool, bool shouldUseBlockTimeForOldestFeedUpdate, bool shouldRevertIfVaultUnlocked, AggregatorV3Interface[] memory feeds) external returns (ILPOracleBase oracle);`

If `shouldUseBlockTimeForOldestFeedUpdate` is set, `latestRoundData` returns the current time for `updatedAt`, instead of calculating the minimum update time over all the feeds (i.e., using the update time of the "oldest" / most stale feed).

If `shouldRevertIfVaultUnlocked` is set, operations requiring calculation of the TVL will revert if the Vault is unlocked (i.e., in the middle of an operation). This guarantees that the BPT balance is "real," and not transient, which would make the result manipulable in cases where no other protective mechanisms are available (such as using wrapped BPT, or imposing limits in the lending protocol).

`AggregatorV3Interface` is a Chainlink price feed. Note that this assumes the feed array is parallel to the pool tokens; i.e., the feed at each position is the correct one for the corresponding pool token. There is no way for the code to check this, so responsibility falls on the caller to ensure that this is the case. See the [Usage with Rate Providers](./bpt-oracles.md#usage-with-rate-providers) section for further considerations. Note that there are no restrictions in the factories that limit oracle creation, **so any mistakes can be remedied by simply calling create again with correct values**.

This first computes an "OracleID" as the hash of the pool and price feed addresses. Since the tokens must be ordered, we know the price feed addresses will also be in the same order, so a given combination of the pool and price feeds is guaranteed unique. It then calls an internal `_create` (implemented by derived contracts) to deploy the oracle with the given configuration, and registers it with the factory.

The base factory contract [interface](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/oracles/ILPOracleFactoryBase.sol) defines functions to find an oracle given pool and feed addresses, and check whether a given oracle was deployed by the official factory:

Note that all basic parameters must be specified. Distinct oracles can be deployed with all combinations of flag settings.

```
function getOracle(
    IBasePool pool,
    bool shouldUseBlockTimeForOldestFeedUpdate,
    bool shouldRevertIfVaultUnlocked,
    AggregatorV3Interface[] memory feeds
) external view returns (ILPOracleBase oracle);

function isOracleFromFactory(ILPOracleBase oracle) external view returns (bool success);
```

## Oracle contracts

The common factory contract [interface](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/oracles/ILPOracleBase.sol) defines:

`function calculateTVL() external view returns (uint256 tvl);`
`function calculateTVLGivenPrices(int256[] memory prices) external view returns (uint256 tvl);`

This function computes the total value of the pool, solving the pool and price constraints simultaneously as described in the [main article](./bpt-oracles.md#derivation). THe function without price arguments uses current prices.

Just as the price feeds implement the Chainlink interface `AggregatorV3Interface` to fetch individual token prices, the common factory [contract](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/oracles/contracts/LPOracleBase.sol) also implements this interface, and calling `latestRoundData` invokes the virtual `calculateTVL` function to get the total value, then divides by the total supply to get the BPT price.
