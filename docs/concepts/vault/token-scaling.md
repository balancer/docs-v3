---
title: Token scaling
order: 4
---

# Token scaling

Working with fixed-point math in Solidity presents a unique set of challenges that developers must navigate to ensure accurate and secure smart contract functionality.

In an effort to abstract this complexity, the Vault manages decimal and rate scaling internally, scaling all token balances and input values prior to being sent to the [Pool](/concepts/pools).
By doing this, we ensure consistency of rounding direction across all [Custom Pool](/concepts/overview/build-a-custom-amm.html) implementations, removing a significant
amount of complexity from the pool and allowing it to focus primarily on it's invariant implementation.

## Decimal scaling

All token balances and input values are scaled to 18 decimal places prior to being sent to the [Pool](/concepts/pools). Once scaled, these numbers are referred to internally as `scaled18`.

### Pool registration
During pool registration, the vault stores the `tokenDecimalDiffs` for each token in the pool in the `PoolConfig` bits. Refer to the full implementation [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/VaultExtension.sol#L239).

```solidity
tokenDecimalDiffs[i] = uint8(18) - IERC20Metadata(address(token)).decimals();
```

A token with 6 decimals (USDC) would have a `tokenDecimalDiff = 18 - 6 = 12`, and a token with 18 decimals (WETH) would have a `tokenDecimalDiff = 18 - 18 = 0`.

### Scaling factors
The `tokenDecimalDiffs` are then used to calculate the decimal `scalingFactors` for each token. This implementation can be found in the [PoolConfigLib](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/lib/PoolConfigLib.sol#L214-L230).

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

### References
To review the scaling implementations, refer to [ScalingHelpers.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/solidity-utils/contracts/helpers/ScalingHelpers.sol).

You can review the logic flow of [swap](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Vault.sol#L174), [addLiquidity](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Vault.sol#L469) and [removeLiquidity](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Vault.sol#L699)
to better understand how the vault manages token scaling.

## Rate scaling

With the successful rollout of [The Merge](https://ethereum.org/roadmap/merge) and the adoption of [ERC-4626](https://docs.openzeppelin.com/contracts/4.x/erc4626), the ecosystem has seen a proliferation of yield bearing tokens. Recognizing the pivotal role that LSTs will play in the liquidity landscape moving forward, Balancer seeks to position itself as the definitive yield-bearing hub in DeFi.

To facilitate the adoption of yield bearing liquidity, Balancer abstracts the complexity of managing LSTs by centralizing all rate scaling in the vault, providing all pools with uniform rate scaled balances and input values by default, drastically reducing LVR and ensuring that YB yield is not captured by arbitrage traders.

### What is a token rate
The classical example of a token with a rate is Lido's [wstETH](https://help.lido.fi/en/articles/5231836-what-is-lido-s-wsteth). As [stETH](https://help.lido.fi/en/articles/5230610-what-is-steth) accrues value from staking rewards, the exchange rate of wstETH -> stETH grows over time.

### How does the Balancer Vault utilize token rates

Besides [decimal scaling](#decimal-scaling) a tokens rate is taken into account in Balancer under in the following scenarios:
- price computation as part of Stable & boosted pools
- Yield fee computation when tokens with a rate are part of pools

A token's rate is defined as a 18 decimal fixed point number. It represents a factor of value difference relative to it's underlying. For example a rate of 11e17 of rETH means that 1reth has the value of 1.1 eth.


### Creating a pool with tokens that have rates

On pool [register](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IVaultExtension.sol#L83) a [TokenConfig](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L74-L89) is provided for each of the pool's tokens.
To define a token with a rate, specify the token type as  `TokenType.WITH_RATE`. Additionally, you must provide a `rateProvider` address that implements the `IRateProvider` interface. Refer to [Token types](/concepts/vault/token-types.html) for a detailed explanation on each token type.

### Rate scaling usage
Rate scaling technically is used on every `swap`, `addLiqudity` & `removeLiquidity` operations. If the token has been registered as a `TokenType.WITH_RATE` an external call to the Rate Provider is made via `getRate` if the `TokenType.STANDARD` is selected the rate is set as `1e18`. These rates are used to upscale the `amountGiven` as part of the Vault's primitives.
:::info
1. Calling a swap has amount as [`amountGivenRaw`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L112)
2. [`AmountGivenRaw` is upscaled](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Vault.sol#L318)
3. [`AmountGivenScaled18`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Vault.sol#L251) is forwarded to the pool.
4. Rates are undone before returning either `amountIn` or `amountOut`
:::

## Live balances

The term `liveBalances` is used internally to refer to balances that have been:

1. [Decimal scaled](/concepts/vault/token-scaling.html#decimal-scaling) - Upscaled to 18 decimals
2. [Rate scaled](/concepts/vault/token-scaling.html#rate-scaling) - Adjusted for token rates
3. [Yield fee](/concepts/vault/yield-fee.html) removed - Had yield fees deducted.

Any token balances sent to the pool will always be in live balance form. This ensures consistency across all tokens and removes the burden
of token scaling from the pools logic.