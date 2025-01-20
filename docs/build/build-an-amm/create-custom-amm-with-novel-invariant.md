---
order: 1
title: Create a custom AMM with a novel invariant
---

# Create a custom AMM with a novel invariant

Balancer protocol provides developers with a modular architecture that enables the rapid development of custom AMMs.

AMMs built on Balancer inherit the security of the Balancer vault, and benefit from a streamlined development process.
Balancer v3 was re-built from the ground up with developer experience as a core focus.
Development teams can now focus on their product innovation without having to build an entire AMM.

_This section is for developers looking to build a new custom pool type with a novel invariant. If you are looking to extend an existing pool type with hooks, start [here](/build/build-a-hook/extend-existing-pool-type.html)._

## Build your custom AMM

At a high level, creating a custom AMM on Balancer protocol involves the implementation of five functions `onSwap`, `computeInvariant` and `computeBalance` as well as the `ISwapFeePercentageBounds` and `IUnbalancedLiquidityInvariantRatioBounds` interfaces (which define `getMinimumSwapFeePercentage` / `getMaximumSwapFeePercentage`, and `getMinimumInvariantRatio` / `getMaximumInvariantRatio`, respectively).
To expedite the development process, Balancer provides two contracts to inherit from:

- [IBasePool.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IBasePool.sol) - This interface defines the required functions that every Balancer pool must implement
- [BalancerPoolToken.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/BalancerPoolToken.sol) - This contract implements the [ERC20MultiToken](/concepts/vault/erc20-multi-token.html) standard that enables your pool contract to be ERC20 compliant while delegating BPT accounting to the vault. For more information, refer to [BalancerPoolToken](/concepts/core-concepts/balancer-pool-tokens.html).

Both `IBasePool` and `BalancerPoolToken` are used across all core Balancer pools, even those implemented by Balancer Labs (ie: [WeightedPool](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-weighted/contracts/WeightedPool.sol)).

Standard Balancer pools also implement the optional `Version` interface (for easy on- and off-chain verification of the contract version), and `IPoolInfo`, which exposes Vault getters (e.g., `getTokens`, and `getTokenInfo`) through the pool itself as a convenience. On top of that, the standard pools define custom interfaces that return structs corresponding to the immutable and dynamic data fields for the pools. For instance, Weighted Pools return the weights. Note that dynamic pool values (e.g., live balances), exposed through either `IPoolInfo` or the custom interfaces, will only be valid on-chain if the Vault is locked (i.e., not in the middle of a transaction).

Below, we present a naive implementation of a two token `ConstantProductPool` and `ConstantSumPool` utilizing (sqrt(X * Y) = K) and (X + Y = K) as references for walking through the required functions necessary to implement a custom AMM on Balancer protocol.

You can think of the invariant as a measure of the "value" of the pool, which is related to the total liquidity (i.e., the "BPT rate" is `invariant` / `totalSupply`). Two critical properties must hold (for Balancer, and for AMMs in general):

1) The invariant should not change due to a swap. In practice, it can *increase* due to swap fees, which effectively add liquidity after the swap - but it should never decrease.
2) The invariant must be "linear"; i.e., increasing the balances proportionally must increase the invariant in the same proportion: inv(a * n,b * n,c * n) = inv(a, b, c) * n

Property #1 is required to prevent "round trip" paths that drain value from the pool (and all LP shareholders). Intuitively, an accurate pricing algorithm ensures the user gets an equal value of token out given token in, so the total value should not change.

Property #2 is essential for the "fungibility" of LP shares. If it did not hold, then different users depositing the same total value would get a different number of LP shares. In that case, LP shares would not be interchangeable, as they must be in a fair DEX.

::: code-tabs#shell
@tab Constant Product Pool

```solidity
contract ConstantProductPool is IBasePool, BalancerPoolToken {
    using FixedPoint for uint256;

    uint256 private constant _MIN_SWAP_FEE_PERCENTAGE = 0;
    uint256 private constant _MAX_SWAP_FEE_PERCENTAGE = 0.1e18; // 10%

    constructor(
        IVault vault,
        string memory name,
        string memory symbol)
    BalancerPoolToken(vault, name, symbol) {
        // solhint-disable-previous-line no-empty-blocks
    }

    /**
     * @notice Execute a swap in the pool.
     * @param params Swap parameters
     * @return amountCalculatedScaled18 Calculated amount for the swap
     */
    function onSwap(PoolSwapParams calldata params)
        external
        pure
        returns (uint256 amountCalculatedScaled18)
    {
        uint256 poolBalancetokenIn = params.balancesScaled18[params.indexIn]; // X
        uint256 poolBalancetokenOut = params.balancesScaled18[params.indexOut]; // Y

        if (params.kind == SwapKind.EXACT_IN) {
            uint256 amountTokenIn = params.amountGivenScaled18; // dx
            // dy = (Y * dx) / (X + dx)
            amountCalculatedScaled18 = (poolBalancetokenOut * amountTokenIn) / (poolBalancetokenIn + amountTokenIn);
        } else {
            uint256 amountTokenOut = params.amountGivenScaled18; // dy
            // dx = (X * dy) / (Y - dy)
            amountCalculatedScaled18 = (poolBalancetokenIn * amountTokenOut) / (poolBalancetokenOut - amountTokenOut);
        }
    }

    /**
     * @notice Computes and returns the pool's invariant.
     * @dev This function computes the invariant based on current balances.
     * @param balancesLiveScaled18 Token balances after paying yield fees, applying decimal scaling and rates
     * @param rounding Rounding direction to consider when computing the invariant
     * @return invariant The calculated invariant of the pool, represented as a uint256
     */
    function computeInvariant(
        uint256[] memory balancesLiveScaled18,
        Rounding rounding
    ) public view returns (uint256 invariant) {
        // expected to work with 2 tokens only.
        invariant = FixedPoint.ONE;
        for (uint256 i = 0; i < balancesLiveScaled18.length; ++i) {
            invariant = rounding == Rounding.ROUND_DOWN
                ? invariant.mulDown(balancesLiveScaled18[i])
                : invariant.mulUp(balancesLiveScaled18[i]);
        }
        // scale the invariant to 1e18
        invariant = Math.sqrt(invariant) * 1e9;
    }

    /**
     * @notice Computes the new balance of a token after an operation.
     * @dev This takes into account the invariant growth ratio and all other balances.
     * @param balancesLiveScaled18 Current live balances (adjusted for decimals, rates, etc.)
     * @param tokenInIndex The index of the token we're computing the balance for, in token registration order
     * @param invariantRatio The ratio of the new invariant (after an operation) to the old
     * @return newBalance The new balance of the selected token, after the operation
     */
    function computeBalance(
        uint256[] memory balancesLiveScaled18,
        uint256 tokenInIndex,
        uint256 invariantRatio
    ) external pure returns (uint256 newBalance) {
        uint256 otherTokenIndex = tokenInIndex == 0 ? 1 : 0;

        uint256 newInvariant = computeInvariant(balancesLiveScaled18, Rounding.ROUND_DOWN).mulDown(invariantRatio);

        newBalance = (newInvariant * newInvariant / balancesLiveScaled18[otherTokenIndex]);
    }

    /// @inheritdoc ISwapFeePercentageBounds
    function getMinimumSwapFeePercentage() external pure returns (uint256) {
        return _MIN_SWAP_FEE_PERCENTAGE;
    }

    /// @inheritdoc ISwapFeePercentageBounds
    function getMaximumSwapFeePercentage() external pure returns (uint256) {
        return _MAX_SWAP_FEE_PERCENTAGE;
    }

    /// @inheritdoc IUnbalancedLiquidityInvariantRatioBounds
    function getMinimumInvariantRatio() external pure returns (uint256) {
        return WeightedMath._MIN_INVARIANT_RATIO;
    }

    /// @inheritdoc IUnbalancedLiquidityInvariantRatioBounds
    function getMaximumInvariantRatio() external pure returns (uint256) {
        return WeightedMath._MAX_INVARIANT_RATIO;
    }
}
```

@tab Constant Sum Pool

```solidity
contract ConstantSumPool is IBasePool, BalancerPoolToken {

    uint256 private constant _MIN_SWAP_FEE_PERCENTAGE = 0;
    uint256 private constant _MAX_SWAP_FEE_PERCENTAGE = 0.1e18; // 10%

    constructor(
        IVault vault,
        string memory name,
        string memory symbol)
    BalancerPoolToken(vault, name, symbol) {}
    
    /**
     * @notice Execute a swap in the pool.
     * @param params Swap parameters
     * @return amountCalculatedScaled18 Calculated amount for the swap
     */
    function onSwap(PoolSwapParams calldata params) external pure returns (uint256 amountCalculatedScaled18) {
        amountCalculatedScaled18 = params.amountGivenScaled18;
    }
    
    /**
     * @notice Computes and returns the pool's invariant.
     * @dev This function computes the invariant based on current balances. There is no precision loss for addition,
     * so we can ignore the rounding direction.
     *
     * @param balancesLiveScaled18 Token balances after paying yield fees, applying decimal scaling and rates
     * @param rounding Rounding direction to consider when computing the invariant
     * @return invariant The calculated invariant of the pool, represented as a uint256
     */
    function computeInvariant(
        uint256[] memory balancesLiveScaled18,
        Rounding
    ) public pure returns (uint256 invariant) {
        invariant = balancesLiveScaled18[0] + balancesLiveScaled18[1];
    }

    /**
     * @dev Computes the new balance of a token after an operation, given the invariant growth ratio and all other
     * balances.
     * @param balancesLiveScaled18 Current live balances (adjusted for decimals, rates, etc.)
     * @param tokenInIndex The index of the token we're computing the balance for (tokens are sorted alphanumerically)
     * @param invariantRatio The ratio of the new invariant (after an operation) to the old
     * @return newBalance The new balance of the selected token, after the operation
     */
    function computeBalance(
        uint256[] memory balancesLiveScaled18,
        uint256 tokenInIndex,
        uint256 invariantRatio
    ) external pure returns (uint256 newBalance) {
        uint256 invariant = computeInvariant(balancesLiveScaled18, Rounding.ROUND_DOWN);
        
        newBalance = (balancesLiveScaled18[tokenInIndex] + invariant.mulDown(invariantRatio)) - invariant;
    }

    /// @return minimumSwapFeePercentage The minimum swap fee percentage for a pool
    function getMinimumSwapFeePercentage() external pure returns (uint256) {
        return _MIN_SWAP_FEE_PERCENTAGE;
    }

    /// @return maximumSwapFeePercentage The maximum swap fee percentage for a pool
    function getMaximumSwapFeePercentage() external pure returns (uint256) {
        return _MAX_SWAP_FEE_PERCENTAGE;
    }

    /// @inheritdoc IUnbalancedLiquidityInvariantRatioBounds
    function getMinimumInvariantRatio() external pure returns (uint256) {
        return WeightedMath._MIN_INVARIANT_RATIO;
    }

    /// @inheritdoc IUnbalancedLiquidityInvariantRatioBounds
    function getMaximumInvariantRatio() external pure returns (uint256) {
        return WeightedMath._MAX_INVARIANT_RATIO;
    }
}
```

:::

::: info What does Scaled18 mean?
Internally, Balancer protocol scales all tokens to 18 decimals to minimize the potential for errors that can occur when
comparing tokens with different decimals numbers (ie: WETH/USDC). `Scaled18` is a suffix used to signify values has already been scaled.
**By default, ALL values provided to the pool will always be `Scaled18`.** Refer to [Decimal scaling](/concepts/vault/token-scaling.html#pool-registration) for more information.
:::

::: info What does Live refer to in balancesLiveScaled18?
The keyword `Live` denotes balances that have been scaled by their respective `IRateProvider` and have any pending yield fees removed. Refer to [Live Balances](/concepts/vault/token-scaling.html#live-balances) for more information.
:::

::: info How are add and remove liquidity operations implemented?
Balancer protocol leverages a novel approximation, termed the [Liquidity invariant approximation](/concepts/vault/liquidity-invariant-approximation.html), to provide a generalized solution for liquidity operations.
By implementing `computeInvariant` and `computeBalance`, your custom AMM will immediately support all Balancer liquidity operations: `unbalanced`, `proportional` and `singleAsset`.
:::

### Compute Invariant

Custom AMMs built on Balancer protocol are defined primarily by their invariant. Broadly speaking, an invariant is a mathematical function that defines
how the AMM exchanges one asset for another. A few widely known invariants include [Constant Product (X * Y = K)](https://docs.uniswap.org/contracts/v2/concepts/protocol-overview/how-uniswap-works) and [StableSwap](https://berkeley-defi.github.io/assets/material/StableSwap.pdf).

Our two-token `ConstantSumPool` uses the constant sum invariant, or `X + Y = K`. To implement `computeInvariant`, we simply add the balances of the two tokens. For the `ConstantProductPool`, the invariant calculation is the square root of the product of balances. This ensures invariant growth proportional to liquidity growth.

::: code-tabs#shell
@tab Constant Product Pool
```solidity
    function computeInvariant(
        uint256[] memory balancesLiveScaled18,
        Rounding rounding
    ) public view returns (uint256 invariant) {
        // expected to work with 2 tokens only.
        invariant = FixedPoint.ONE;
        for (uint256 i = 0; i < balancesLiveScaled18.length; ++i) {
            invariant = rounding == Rounding.ROUND_DOWN
                ? invariant.mulDown(balancesLiveScaled18[i])
                : invariant.mulUp(balancesLiveScaled18[i]);
        }
        // scale the invariant to 1e18
        invariant = Math.sqrt(invariant) * 1e9;
    }
```

@tab Constant Sum Pool
```solidity
    function computeInvariant(
        uint256[] memory balancesLiveScaled18,
        Rounding
    ) public pure returns (uint256 invariant) {
        invariant = balancesLiveScaled18[0] + balancesLiveScaled18[1];
    }
```
:::



For additional references, refer to the [WeightedPool](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-weighted/contracts/WeightedPool.sol) and [Stable Pool](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-stable/contracts/StablePool.sol) implementations.

::: info application context on computeBalance
In the context of `computeBalance` the invariant is used as a measure of liquidity. What you need to consider when implementing all possible liquidity operations on the pool is that:
- `bptAmountOut` for an unbalanced add liquidity operation should equal `bptAmountOut` for a proportional add liquidity in the case that `exactAmountsIn` for the unbalanced add are equal to the `amountsIn` for the same `bptAmountOut` for both addLiquidity scenarios. `AddLiquidityProportional` does not call into the custom pool it instead calculates `bptAmountOut` using [BasePoolMath.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/BasePoolMath.sol#L50-L54) whereas `addLiquidityUnbalanced` calls the custom pool's `computeInvariant`.
- The `amountIn` for an `exactBptAmountOut` in an `addLiquiditySingleTokenExactOut` should equal the `amountIn` for an unbalanced addLiquidity when the `bptAmountOut` is expected to be the same for both operations. `addLiquiditySingleTokenExactOut` uses `computeBalance` whereas `addLiquidityUnbalanced` uses `computeInvariant`.

These are important consideration to ensure that LPs get the same share of the pool's liquidity when adding liquidity. In a Uniswap V2 Pair adding liquidity not in proportional amounts gets [penalized](https://github.com/Uniswap/v2-core/blob/master/contracts/UniswapV2Pair.sol#L123), which you can also implement in a custom pool, as long as you accurately handle the bullet points outlined above.
:::

### Compute Balance

`computeBalance` returns the new balance of a pool token necessary to achieve an invariant change. It is essentially the inverse of the pool's invariant. The `invariantRatio` is the ratio of the new invariant (after an operation) to the old.
`computeBalance` is used for liquidity operations where the token amount in/out is unknown, specifically [`AddLiquidityKind.SINGLE_TOKEN_EXACT_OUT`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Vault.sol#L645-L660) and [`RemoveLiquidityKind.SINGLE_TOKEN_EXACT_IN`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Vault.sol#L871-L885).

You can see the implementations of the `ConstantProductPool` and `ConstantSumPool` below:

::: code-tabs#shell
@tab Constant Product Pool
```solidity
function computeBalance(
    uint256[] memory balancesLiveScaled18,
    uint256 tokenInIndex,
    uint256 invariantRatio
) external pure returns (uint256 newBalance) {
    uint256 otherTokenIndex = tokenInIndex == 0 ? 1 : 0;

    uint256 newInvariant = computeInvariant(balancesLiveScaled18, Rounding.ROUND_DOWN).mulDown(invariantRatio);

    newBalance = (newInvariant * newInvariant / balancesLiveScaled18[otherTokenIndex]);
}
```

@tab Constant Sum Pool
```solidity
function computeBalance(
    uint256[] memory balancesLiveScaled18,
    uint256 tokenInIndex,
    uint256 invariantRatio
) external pure returns (uint256 newBalance) {
    uint256 invariant = computeInvariant(balancesLiveScaled18, Rounding.ROUND_DOWN);

    newBalance = (balancesLiveScaled18[tokenInIndex] + invariant.mulDown(invariantRatio)) - invariant;
}
```
:::

::: info A note on invariantRatio
The `invariantRatio` refers to the new BPT supply over the total BPT supply and is calculated within the `BasePoolMath.sol` via `newSupply.divUp(totalSupply)`.
:::

For additional references, refer to the [WeightedPool](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-weighted/contracts/WeightedPool.sol#L113-L124) and [StablePool](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-stable/contracts/StablePool.sol#L157-L171) implementations.

### On Swap

Although the outcome of `onSwap` could be determined using `computeInvariant` and `computeBalance`, it is highly likely that there is a more gas-efficient strategy.
`onSwap` is provided as a means to facilitate lower cost swaps.

Balancer protocol supports two types of swaps:

- `EXACT_IN` - The user defines the exact amount of `tokenIn` they want to spend.
- `EXACT_OUT` - The user defines the exact amount of `tokenOut` they want to receive.

The `minAmountOut` or `maxAmountIn` are enforced by the [vault](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Vault.sol#L387-L429) .

When swapping tokens, our constant `K` must remain unchanged. Since our two-token `ConstantSumPool` uses the constant sum invariant (`X + Y = K`),
the amount entering the pool will always equal the amount leaving the pool:

::: code-tabs#shell
@tab Constant Product Pool
```solidity
function onSwap(PoolSwapParams calldata params)
    external
    pure
    returns (uint256 amountCalculatedScaled18)
{
    amountCalculatedScaled18 = params.balancesScaled18[params.indexOut] * params.amountGivenScaled18 / 
    (params.balancesScaled18[params.indexIn] + params.amountGivenScaled18 );
}
```

@tab Constant Sum Pool
```solidity
function onSwap(PoolSwapParams calldata params) external pure returns (uint256 amountCalculatedScaled18) {
    amountCalculatedScaled18 = params.amountGivenScaled18;
}
```
:::

The `PoolSwapParams` struct definition can be found [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L238-L246).

For additional references, refer to the [WeightedPool](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-weighted/contracts/WeightedPool.sol) and [StablePool](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-stable/contracts/StablePool.sol) implementations.

### Constructor arguments

At a minimum, your constructor should have the required arguments to instantiate the `BalancerPoolToken`:

- `IVault vault`: The address of the Balancer vault
- `string name`: ERC20 compliant `name` that will identify the pool token (BPT).
- `string symbol`: ERC20 compliant `symbol` that will identify the pool token (BPT).

```solidity
constructor(IVault vault, string name, string symbol) BalancerPoolToken(vault, name, symbol) {}
```

The approach taken by Balancer Labs is to define a [NewPoolParams](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-weighted/contracts/WeightedPool.sol#L59-L65) struct to better organize the constructor arguments.


## Swap fees

The charging of swap fees is managed entirely by the Balancer vault. The pool is only responsible for declaring the `swapFeePercentage` for any given swap or unbalanced liquidity operation on registration as well as declaring an minimum and maximum swap fee percentage. For more information, see [Swap fees](https://docs-v3.balancer.fi/concepts/vault/swap-fee.html).

::: info Do I need to take swap fees into account when implementing onSwap?
No, swap fees are managed entirely by the Balancer vault. For an `EXACT_OUT` swap, the amount in (`params.amountGivenScaled18`) will already have the swap fee removed before `onSwap` is called. Fees are always taken on `tokenIn`.
:::

Balancer supports two types of swap fees:

- **Static swap fee**: Defined on `vault.registerPool()` and managed via calls to `vault.setStaticSwapFeePercentage()`. For more information, see [Swap fee](/concepts/vault/swap-fee.html).
- **Dynamic swap fee**: Managed by a **Hooks** contract. Whether a swap with a pool uses the dynamic swap fee is determined at pool registration. A Hook sets the flag indicating support for dynamic fees on `vault.registerPool()`. For more information, see [Dynamic swap fees](/concepts/vault/swap-fee.html#dynamic-swap-fee).

## Hooks
Hooks as standalone contracts are not part of a custom pool's implementation. However they can be combined with custom pools. For a detailed understanding, see [Hooks](/concepts/core-concepts/hooks.html).

### Vault reentrancy
Hooks allow a pool to reenter the vault within the context of a pool operation. While `onSwap`, `computeInvariant` and `computeBalance` must be executed within a reentrancy guard, the vault is architected such that hooks operate outside of this requirement.

## Add / Remove liquidity 
The implementation of `computeInvariant` and `computeBalance` allows a pool to support ALL [Add/Remove liquidity types](/concepts/vault/add-remove-liquidity-types.html).
For instances where your custom AMM has additional requirements for add/remove liquidity operations, Balancer provides support for `AddLiquidityKind.CUSTOM` and `RemoveLiquidityKind.CUSTOM`.
An example custom liquidity operation can be found in [Cron Finance's](https://docs.cronfi.com/twamm/) TWAMM implementation on Balancer v2, specifically when the pool [registers long term orders](https://github.com/Cron-Finance/v1-twamm/blob/main/contracts/twault/CronV1Pool.sol#L438).

When adding support for custom liquidity operations, it's recommended that your pool contract implement [IPoolLiquidity](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IPoolLiquidity.sol)

```solidity
contract ConstantSumPool is IBasePool, IPoolLiquidity, BalancerPoolToken {
    ...
}
```

### Add liquidity custom

For your AMM to support add liquidity custom, it must:
- Implement `onAddLiquidityCustom`, as defined [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IPoolLiquidity.sol#L19-L32)
- Set `LiquidityManagement.supportsAddLiquidityCustom` to `true` on pool register.

### Remove liquidity custom

For your AMM to support remove liquidity custom, it must:
- Implement `onRemoveLiquidityCustom`, as defined [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IPoolLiquidity.sol#L46-L59)
- Set `LiquidityManagement.supportsRemoveLiquidityCustom` to `true` on pool register.

### Remove support for built in liquidity operations

There may be instances where your AMM should not support specific built-in liquidity operations. If certain operations should be enabled in your custom pool is defined in `LiquidityManagement`. You can choose to:

- disable add and remove liquidity unbalanced (i.e., non-proportional; enabled by default. These cannot be disabled independently.)
- enable add liquidity custom (disabled by default)
- enable remove liquidity custom (disabled by default)
- enable donation (disabled by default)

To achieve this, the respective entry in the `LiquidityManagement` struct needs to be set.

```solidity
struct LiquidityManagement {
    bool disableUnbalancedLiquidity;
    bool enableAddLiquidityCustom;
    bool enableRemoveLiquidityCustom;
    bool enableDonation;
}
```
These settings get passed into the [pool registration](/developer-reference/contracts/vault-api.html#registerpool) flow.


## Testing your pool

Depending on the combination of liquidity operations you allow for your pool you need to ensure the correct amount of BPT get's minted whenever a user adds/removes liquidity unbalanced (which calls into `computeInvariant`) and proportional adds/removes (which does not call into the pool and solely relies on [BasePoolMath.sol](https://github.com/balancer/balancer-v3-monorepo/blob/4864599800adc88d6a53f0a5b71c8352eac2f3a1/pkg/solidity-utils/contracts/math/BasePoolMath.sol#L7)). Let's say your pool has reserves of [100, 100] and an `addLiquidityProportional([50,50])` gets the user 100 BPT in return, if the user were to `addLiquidityUnbalanced([50,50])` you must ensure that the amount of BPT that gets minted is the same as in the `addLiquidityProportional([50,50])` operation. Consider also reading through [liquidity invariant approximation](/concepts/vault/liquidity-invariant-approximation.md) to get more context on various combination of pool operations.


## Deploying your pool

See the guide to [Deploy a Custom AMM Using a Factory](/build/build-an-amm/deploy-custom-amm-using-factory.html).


<!---
### Balancer UI Support

:::info
an explanation on the steps required to be added to the UI will follow.
:::

### Balancer Swap UI support

:::info
an explanation on the steps required to be supported by the swap UI will follow
:::

### Aggregator support (1inch, Paraswap, 0x, etc.)

:::info
an explanation on the steps required for aggregator support will follow.
:::
-->
