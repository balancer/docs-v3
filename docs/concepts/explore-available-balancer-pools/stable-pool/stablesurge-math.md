---
order: 3
references:
  - details: Stable Math
    link: /reference/math/stable-math
---
---

# StableSurge Math

## Overview

StableSurge Math leverages [Stable Math](./stable-math.md) for the pool invariant, and the hook itself only affects the swap fee. The swap fee is calculated linearly based on the absolute delta values of pool token balances based on an add, remove, or swap event, resulting in a fee increase when the surge criteria are met.

The hook utilizes all parameters which inherited from the traditional stable pool but introduces 2 new variables which are mutable and controlled by the swap fee manager:

Inherited: 
- `Number of tokens (n)`: Nominal amount of unique assets in the pool; not balances. For example for wETH/wstETH, n=2
- `staticSwapFeePercentage`: The base fee a trade will be charged when the pool is within the surge threshold range, or whenever a trade pushes the ratio of assets towards parity.

Specific to StableSurge:
- `surgeThresholdPercentage`: This value is the percentage away from parity (50:50) at which a pool will begin to charge traders surging fees. For example if set to 10% the fee will begin to increase once the pool balance percentages reach (55:45)
- `maxSurgeFeePercentage`: This is the maximum fee the pool can experience, which would happen if the asset ratios strayed as close to 99%/1% as technically possible. This setting defines how quickly the fee will surge up from the base fee, once the threshold is hit.

## Implementation

```solidity
Here is the main function in `StableSurgeHook` that calculations the surge fee:

function _getSurgeFeePercentage(
    PoolSwapParams calldata params,
    address pool,
    uint256 staticFeePercentage,
    uint256[] memory newBalances
) internal view returns (uint256 surgeFeePercentage) {
    SurgeFeeData memory surgeFeeData = _surgeFeePoolData[pool];
   
    // No matter where the imbalance is, the fee can never be smaller than the static fee.
    if (surgeFeeData.maxSurgeFeePercentage < staticFeePercentage) {
        return staticFeePercentage;
    }

    uint256 newTotalImbalance = StableSurgeMedianMath.calculateImbalance(newBalances);

    bool isSurging = _isSurging(surgeFeeData, params.balancesScaled18, newTotalImbalance);
    if (isSurging) {
        surgeFeePercentage =
            staticFeePercentage +
            (surgeFeeData.maxSurgeFeePercentage - staticFeePercentage).mulDown(
                (newTotalImbalance - surgeFeeData.thresholdPercentage).divDown(
                    uint256(surgeFeeData.thresholdPercentage).complement()
                )
            );
    } else {
        surgeFeePercentage = staticFeePercentage;
    }
}

function _isSurging(
    SurgeFeeData memory surgeFeeData,
    uint256[] memory currentBalances,
    uint256 newTotalImbalance
) internal pure returns (bool isSurging) {
    if (newTotalImbalance == 0) {
        return false;
    }

    uint256 oldTotalImbalance = StableSurgeMedianMath.calculateImbalance(currentBalances);

    // Surging if imbalance grows and we're currently above the threshold.
    return (newTotalImbalance > oldTotalImbalance && newTotalImbalance > surgeFeeData.thresholdPercentage);
}

The `StableSurgeMedianMath` library contains the functions that calculate the imbalance. Note that though the examples use two-token pools for simplicity, the imbalance calculation applies to any stable pool (up to 5 tokens). Essentially, it is measuring the total deviation from a perfectly balance pool (where all balances are equal).

function calculateImbalance(uint256[] memory balances) internal pure returns (uint256) {
    uint256 median = findMedian(balances);

    uint256 totalBalance = 0;
    uint256 totalDiff = 0;

    for (uint i = 0; i < balances.length; i++) {
        totalBalance += balances[i];
        totalDiff += absSub(balances[i], median);
    }

    return totalDiff.divDown(totalBalance);
}

function findMedian(uint256[] memory balances) internal pure returns (uint256) {
    uint256[] memory sortedBalances = balances.sort();
    uint256 mid = sortedBalances.length / 2;

    if (sortedBalances.length % 2 == 0) {
        return (sortedBalances[mid - 1] + sortedBalances[mid]) / 2;
    } else {
        return sortedBalances[mid];
    }
}

function absSub(uint256 a, uint256 b) internal pure returns (uint256) {
    unchecked {
        return a > b ? a - b : b - a;
    }
}
```