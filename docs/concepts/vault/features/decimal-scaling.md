---
title: Decimal scaling
order: 5
---

# Decimal scaling

Working with fixed-point math in Solidity presents a unique set of challenges that developers must navigate to ensure accurate and secure smart contract functionality.

In an effort to abstract the complexity of managing tokens with variable decimals, all token balances and input values are scaled to 18 decimal places prior to being sent to the [Pool](/concepts/pools). Once scaled, these numbers are referred to internally as `scaled18`.
By implementing decimal scaling at the vault, we ensure consistency of rounding direction across all [Custom Pool](/concepts/pools/CustomPool.html) implementations, removing a significant amount of complexity from the pool and allowing it to focus primarily on it's invariant implementation.

## Pool registration
During pool registration, the vault stores the `tokenDecimalDiffs` for each token in the pool in the `PoolConfig` bits. Refer to the full implementation [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/VaultExtension.sol#L239).

```solidity
tokenDecimalDiffs[i] = uint8(18) - IERC20Metadata(address(token)).decimals();
```

A token with 6 decimals (USDC) would have a `tokenDecimalDiff = 18 - 6 = 12`, and a token with 18 decimals (WETH) would have a `tokenDecimalDiff = 18 - 18 = 0`.

## Scaling factors
The `tokenDecimalDiffs` are then used to calculate the decimal `scalingFactors` for each token. This implementation can be found in the [PoolConfigLib](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/lib/PoolConfigLib.sol#L211-L227).

```solidity
function getDecimalScalingFactors(
    PoolConfig memory config,
    uint256 numTokens
) internal pure returns (uint256[] memory) {
    uint256[] memory scalingFactors = new uint256[](numTokens);

    bytes32 tokenDecimalDiffs = bytes32(uint256(config.tokenDecimalDiffs));

    for (uint256 i = 0; i < numTokens; i++) {
        uint256 decimalDiff = tokenDecimalDiffs.decodeUint(i * _DECIMAL_DIFF_BITLENGTH, _DECIMAL_DIFF_BITLENGTH);

        // This is equivalent to `10**(18+decimalsDifference)` but this form optimizes for 18 decimal tokens.
        scalingFactors[i] = FixedPoint.ONE * 10 ** decimalDiff;
    }

    return scalingFactors;
}
```

## References
To review the scaling implementations, refer to [ScalingHelpers.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/solidity-utils/contracts/helpers/ScalingHelpers.sol).

You can review the logic flow of [swap](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Vault.sol#L185), [addLiquidity](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Vault.sol#L462) and [removeLiquidity](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Vault.sol#L639)
to better understand how the vault manages token scaling.