---
order: 1
title: Create a custom AMM with a novel invariant
---

# Create a custom AMM with a novel invariant

Balancer protocol provides developers with a modular architecture that enables the rapid development of custom AMMs.

AMMs built on Balancer inherit the security of the Balancer vault, and benefit from a streamlined development process.
Balancer V3 was re-built from the ground up with developer experience as a core focus.
Development teams can now focus on their product innovation without having to build an entire AMM.

_This section is for developers looking to build a new custom pool type with a novel invariant. If you are looking to extend an existing pool type with hooks, start [here](/build-a-custom-amm/build-an-amm/extend-existing-pool-type-using-hooks.html)._

## Build your custom AMM

At a high level, creating a custom AMM on Balancer protocol involves the implementation of five functions `onSwap`, `computeInvariant` and `computeBalance` as well as `getMaximumSwapFeePercentage` and `getMinimumSwapFeePercentage`.
To expedite the development process, Balancer provides two contracts to inherit from:

- [IBasePool.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IBasePool.sol) - This interface defines the required functions that every Balancer pool must implement
- [BalancerPoolToken.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/BalancerPoolToken.sol) - This contract implements the [ERC20MultiToken](/concepts/vault/erc20-multi-token.html) standard that enables your pool contract to be ERC20 compliant while delegating BPT accounting to the vault. For more information, refer to [BalancerPoolToken](/concepts/core-concepts/balancer-pool-tokens.html).

Both `IBasePool` and `BalancerPoolToken` are used across all core Balancer pools, even those implemented by Balancer Labs (ie: [WeightedPool](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-weighted/contracts/WeightedPool.sol#L18)).

Below, we present a naive implementation of a two token `ConstantProductPool` & `ConstantSumPool` utilising (X * Y = K) & (X + Y = K) as a reference for walking through the required functions necessary to implement a custom AMM on Balancer protocol:

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
    BalancerPoolToken(vault, name, symbol) {}

    /**
     * @notice Execute a swap in the pool.
     * @param params Swap parameters
     * @return amountCalculatedScaled18 Calculated amount for the swap
     */
    function onSwap(PoolSwapParams calldata params)
        external
        view
        returns (uint256 amountCalculatedScaled18)
    {
        amountCalculatedScaled18 = params.balancesScaled18[params.indexOut] * params.amountGivenScaled18 / 
        (params.balancesScaled18[params.indexIn] + params.amountGivenScaled18 );
    }

    /**
     * @notice Computes and returns the pool's invariant.
     * @dev This function computes the invariant based on current balances
     * @param balancesLiveScaled18 Array of current pool balances for each token in the pool, scaled to 18 decimals
     * @return invariant The calculated invariant of the pool, represented as a uint256
     */
    function computeInvariant(uint256[] memory balancesLiveScaled18)
        public
        view
        returns (uint256 invariant)
    {
        // expected to work with 2 tokens only
        invariant = FixedPoint.ONE;
        for (uint256 i = 0; i < balancesLiveScaled18.length; ++i) {
            invariant = invariant.mulDown(balancesLiveScaled18[i]);
        }
        // scale the invariant to 1e18
        invariant = _sqrt(invariant) * 1e9;

    }

    /**
     * @dev Computes the new balance of a token after an operation, given the invariant growth ratio and all other
     * balances.
     * @param balancesLiveScaled18 Current live balances (adjusted for decimals, rates, etc.)
     * @param tokenInIndex The index of the token we're computing the balance for, in token registration order
     * @param invariantRatio The ratio of the new invariant (after an operation) to the old
     * @return newBalance The new balance of the selected token, after the operation
     */
    function computeBalance(
        uint256[] memory balancesLiveScaled18,
        uint256 tokenInIndex,
        uint256 invariantRatio
    ) external view returns (uint256 newBalance) {
        uint256 otherTokenIndex = tokenInIndex == 0 ? 1 : 0;

        uint256 newInvariant = computeInvariant(balancesLiveScaled18).mulDown(invariantRatio);

        newBalance = (newInvariant * newInvariant / balancesLiveScaled18[otherTokenIndex]);
    }

    /// @return minimumSwapFeePercentage The minimum swap fee percentage for a pool
    function getMinimumSwapFeePercentage() external view returns (uint256) {
        return _MIN_SWAP_FEE_PERCENTAGE;
    }

    /// @return maximumSwapFeePercentage The maximum swap fee percentage for a pool
    function getMaximumSwapFeePercentage() external view returns (uint256) {
        return _MAX_SWAP_FEE_PERCENTAGE;
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
    function onSwap(PoolSwapParams calldata params) external returns (uint256 amountCalculatedScaled18) {
        amountCalculatedScaled18 = params.amountGivenScaled18;
    }
    
    /**
     * @notice Computes and returns the pool's invariant.
     * @dev This function computes the invariant based on current balances
     * @param balancesLiveScaled18 Array of current pool balances for each token in the pool, scaled to 18 decimals
     * @return invariant The calculated invariant of the pool, represented as a uint256
     */
    function computeInvariant(uint256[] memory balancesLiveScaled18) external view returns (uint256 invariant) {
        invariant = balancesLiveScaled18[0] + balancesLiveScaled18[1];
    }

    /**
     * @dev Computes the new balance of a token after an operation, given the invariant growth ratio and all other
     * balances.
     * @param balancesLiveScaled18 Current live balances (adjusted for decimals, rates, etc.)
     * @param tokenInIndex The index of the token we're computing the balance for (tokens will be sorted alphanumerically)
     * @param invariantRatio The ratio of the new invariant (after an operation) to the old
     * @return newBalance The new balance of the selected token, after the operation
     */
    function computeBalance(
        uint256[] memory balancesLiveScaled18,
        uint256 tokenInIndex,
        uint256 invariantRatio
    ) external pure returns (uint256 newBalance) {
        uint256 invariant = computeInvariant(balancesLiveScaled18);
        
        newBalance = (balancesLiveScaled18[tokenInIndex] + invariant.mulDown(invariantRatio)) - invariant;
    }

    /// @return minimumSwapFeePercentage The minimum swap fee percentage for a pool
    function getMinimumSwapFeePercentage() external view returns (uint256) {
        return _MIN_SWAP_FEE_PERCENTAGE;
    }

    /// @return maximumSwapFeePercentage The maximum swap fee percentage for a pool
    function getMaximumSwapFeePercentage() external view returns (uint256) {
        return _MAX_SWAP_FEE_PERCENTAGE;
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
They keyword `Live` denote balances that have been scaled by their respective `IRateProvider` and have any pending yield fee removed. Refer to [Live Balances](/concepts/vault/token-scaling.html#live-balances) for more information.
:::

::: info How are add and remove liquidity operations implemented?
Balancer protocol leverages a novel approximation, termed the [Liquidity invariant approximation](/concepts/vault/liquidity-invariant-approximation.html), to provide a generalized solution for liquidity operations.
By implementing `computeInvariant` and `computeBalance`, your custom AMM will immediately support all Balancer liquidity operations: `unbalanced`, `proportional` and `singleAsset`.
:::

### Compute Invariant

Custom AMMs built on Balancer protocol are defined primarily by their invariant. Broadly speaking, an invariant is a mathematical function that defines
how the AMM exchanges one asset for another. A few widely known invariants include [Constant Product (X * Y = K)](https://docs.uniswap.org/contracts/v2/concepts/protocol-overview/how-uniswap-works) and [Stableswap](https://berkeley-defi.github.io/assets/material/StableSwap.pdf).

Our two-token `ConstantSumPool` uses the constant sum invariant, or `X + Y = K`. To implement `computeInvariant`, we simply add the balances of the two tokens. For the `ConstantProductPool` the invariant calculation is the square root of the product of balances. This ensures invariant growth proportional to liquidity growth.

::: code-tabs#shell
@tab Constant Product Pool
```solidity
function computeInvariant(uint256[] memory balancesLiveScaled18)
    public
    view
    returns (uint256 invariant)
{
    // expected to work with 2 tokens only
    invariant = FixedPoint.ONE;
    for (uint256 i = 0; i < balancesLiveScaled18.length; ++i) {
        invariant = invariant.mulDown(balancesLiveScaled18[i]);
    }
    // scale the invariant to 1e18
    invariant = _sqrt(invariant) * 1e9;

}
```solidity

@tab Constant Sum Pool
```solidity
function computeInvariant(uint256[] memory balancesLiveScaled18) external view returns (uint256 invariant) {
    invariant = balancesLiveScaled18[0] + balancesLiveScaled18[1];
}
```
:::



For additional references, refer to the [WeightedPool](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-weighted/contracts/WeightedPool.sol#L73-L75) and [Stable Pool](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-stable/contracts/StablePool.sol#L94-L99) implementations.

::: info application context on computeBalance
In the context of `computeBalance` the invariant is used as a measure of liquidity. What you need to consider when implementing all possible liquidity operations on the pool is that:
- bptAmountOut for an unbalanced add liquidity operation should equal bptAmountOut for a proportional add liquidity in the case that `exactAmountsIn` for the unbalanced add are equal to the `amountsIn` for the same bptAmountOut for both addLiquidity scenarios. `AddLiquidityProportional` does not call into the custom pool it instead calculates BptAmountOut within the [BasePoolMath.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/solidity-utils/contracts/math/BasePoolMath.sol#L33-L40) whereas `addLiquidityUnbalanced` calls the custom pool's `computeInvariant`. 
- the amountIn for an exactBptAmountOut in an `addLiquiditySingleTokenExactOut` should equal the amountIn for an unbalanced addLiquidity when the bptAmountOut is expected to be the same for both operations. `addLiquiditySingleTokenExactOut` uses `computeBalance` whereas `addLiquidityUnbalanced` uses `computeInvariant`.
These are important consideration to ensure that LPs get the same share of the pool's liquidity when adding liquidity. In a Uniswap V2 Pair adding liquidity not in proportional amounts get's [penalized](https://github.com/Uniswap/v2-core/blob/master/contracts/UniswapV2Pair.sol#L123), which you can also implement in a custom pool, as long as you accurately handle the bullet points outlined above.
:::

### Compute Balance

`computeBalance` returns the new balance of a pool token necessary to achieve an invariant change. It is essentially the inverse of the pool's invariant. The `invariantRatio` is the ratio of the new invariant (after an operation) to the old.
`computeBalance` is used for liquidity operations where the token amount in/out is unknown, specifically [`AddLiquidityKind.SINGLE_TOKEN_EXACT_OUT`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Vault.sol#L582-L594) and [`RemoveLiquidityKind.SINGLE_TOKEN_EXACT_IN`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Vault.sol#L788-L800).

You can see the implementations of the `ConstantProductPool` and `ConstantSumPool` below:

::: code-tabs#shell
@tab Constant Product Pool
```solidity
function computeBalance(
    uint256[] memory balancesLiveScaled18,
    uint256 tokenInIndex,
    uint256 invariantRatio
) external view returns (uint256 newBalance) {
    uint256 otherTokenIndex = tokenInIndex == 0 ? 1 : 0;

    uint256 newInvariant = computeInvariant(balancesLiveScaled18).mulDown(invariantRatio);

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
    uint256 invariant = computeInvariant(balancesLiveScaled18);

    newBalance = (balancesLiveScaled18[tokenInIndex] + invariant.mulDown(invariantRatio)) - invariant;
}
```
:::

::: info A note on invariantRatio
The `invariantRatio` refers to the new BPT supply over the total BPT supply and is calculated within the `BasePoolMath.sol` via `newSupply.divUp(totalSupply)`.
:::

For additional references, refer to the [WeightedPool](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-weighted/contracts/WeightedPool.sol#L78-L89) and [StablePool](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-stable/contracts/StablePool.sol#L101-L116) implementations.

### On Swap

Although the outcome of `onSwap` could be determined using `computeInvariant` and `computeBalance`, it is highly likely that there is a more gas-efficient strategy.
`onSwap` is provided as a means to facilitate lower cost swaps.

Balancer protocol supports two types of swaps:

- `EXACT_IN` - The user defines the exact amount of `tokenIn` they want to spend.
- `EXACT_OUT` - The user defines the exact amount of `tokenOut` they want to receive.

The `minAmountOut` or `maxAmountIn` are enforced by the [vault](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Vault.sol#L368-L381) .

When swapping tokens, our constant `K` must remain unchanged. Since our two-token `ConstantSumPool` uses the constant sum invariant (`X + Y = K`),
the amount entering the pool will always equal the amount leaving the pool:

::: code-tabs#shell
@tab Constant Product Pool
```solidity
function onSwap(PoolSwapParams calldata params)
    external
    view
    returns (uint256 amountCalculatedScaled18)
{
    amountCalculatedScaled18 = params.balancesScaled18[params.indexOut] * params.amountGivenScaled18 / 
    (params.balancesScaled18[params.indexIn] + params.amountGivenScaled18 );
}
```

@tab Constant Sum Pool
```solidity
function onSwap(PoolSwapParams calldata params) external returns (uint256 amountCalculatedScaled18) {
    amountCalculatedScaled18 = params.amountGivenScaled18;
}
```
:::


The `PoolSwapParams` struct definition can be found [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IBasePool.sol#L59-L67).

For additional references, refer to the [WeightedPool](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-weighted/contracts/WeightedPool.sol#L100-L126) and [StablePool](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-stable/contracts/StablePool.sol#L118-L146) implementations.

### Constructor arguments

At a minimum, your constructor should have the required arguments to instantiate the `BalancerPoolToken`:

- `IVault vault`: The address of the Balancer vault
- `string name`: ERC20 compliant `name` that will identify the pool token (BPT).
- `string symbol`: ERC20 compliant `symbol` that will identify the pool token (BPT).

```solidity
constructor(IVault vault, string name, string symbol) BalancerPoolToken(vault, name, symbol) {}
```

The approach taken by Balancer Labs is to define a [NewPoolParams](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-weighted/contracts/WeightedPool.sol#L30-L35) struct to better organize the constructor arguments.


## Swap fees

The charging of swap fees is managed entirely by the Balancer vault. The pool is only responsible for declaring the `swapFeePercentage` for any given swap or unbalanced liquidity operation on registration as well as declaring an minimum and maximum swap fee percentage. For more information, see [Swap fees](http://localhost:8080/concepts/vault/swap-fee.html).

::: info Do I need to take swap fees into account when implementing onSwap?
No, swap fees are managed entirely by the Balancer vault. For an `EXACT_OUT` swap, the amount in (`params.amountGivenScaled18`) will already have the swap fee removed before `onSwap` is called.
:::

Balancer supports two types of swap fees:

- **Static swap fee**: Defined on `vault.registerPool()` and managed via calls to `vault.setStaticSwapFeePercentage()`. For more information, see [Swap fee](/concepts/vault/swap-fee.html).
- **Dynamic swap fee**: are managed by a **Hooks** contract. If a swap with a pool uses the dynamic swap fee is determined on pool registration. A Hook flags that it supports dynamic fees on `vault.registerPool()`. For more information, see [Dynamic swap fees](/concepts/vault/swap-fee.html#dynamic-swap-fee).

## Hooks
Hooks as standalone contracts are not part of a custom pool's implementation. However they can be combined with custom pools. For a detailed understanding, see [Hooks](/concepts/core-concepts/hooks.html).

### Vault reentrancy
Hooks allow a pool to reenter the vault within the context of a pool operation. While `onSwap`, `computeInvariant` and `computeBalance` must be executed within a reentrancy guard, the vault is architected such that hooks operate outside of this requirement.

## Add / Remove liquidity 
The implementation of `computeInvariant` and `computeBalance` allows a pool to support ALL [Add/Remove liquidity types](/concepts/vault/add-remove-liquidity-types.html).
For instances where your custom AMM has additional requirements for add/remove liquidity operations, Balancer provides support for `AddLiquidityKind.CUSTOM` and `RemoveLiquidityKind.CUSTOM`.
An example custom liquidity operation can be found in [Cron Finance's](https://docs.cronfi.com/twamm/) TWAMM implementation on Balancer V2, specifically when the pool [registers long term orders](https://github.com/Cron-Finance/v1-twamm/blob/main/contracts/twault/CronV1Pool.sol#L438).

When adding support for custom liquidity operations, it's recommended that your pool contract implement [IPoolLiquidity](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IPoolLiquidity.sol)

```solidity
contract ConstantSumPool is IBasePool, IPoolLiquidity, BalancerPoolToken {
    ...
}
```

### Add liquidity custom

For your AMM to support add liquidity custom, it must:
- Implement `onAddLiquidityCustom`, as defined [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IPoolLiquidity.sol#L22-L28)
- Set `LiquidityManagement.supportsAddLiquidityCustom` to `true` on pool register.

### Remove liquidity custom

For your AMM to support remove liquidity custom, it must:
- Implement `onRemoveLiquidityCustom`, as defined [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IPoolLiquidity.sol#L41-L47)
- Set `LiquidityManagement.supportsRemoveLiquidityCustom` to `true` on pool register.

### Remove support for built in liquidity operations

There may be instances where your AMM should not support specific built-in liquidity operations. If certain operations should be enabled in your custom pool is defined in `LiquidityManagement`. You can choose to:

- disable unbalanced liquidity add and removals
- enable add liquidity custom
- enable remove liquidity custom

To achieve this, the respective entry in the `LiquidityManagement` struct needs to be set.

```solidity
struct LiquidityManagement {
    bool disableUnbalancedLiquidity;
    bool enableAddLiquidityCustom;
    bool enableRemoveLiquidityCustom;
}
```
These settings get passed into the [pool registration](/developer-reference/contracts/vault-api.html#registerpool) flow.


## Deploy your pool

When deploying your pool, there are three required steps that must be taken, in order:

1. Deploy the pool contract to the desired network, ensuring that the correct `vault` is provided. The address of the deployed contract will be needed in step `2` and `3`. Offical deployments can be found [here](/reference/contracts/).
2. Call [`vault.registerPool()`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IVaultExtension.sol#L77). Register will identify the pool with the vault and allow you to define token config, hook support, pause windows, and custom liquidity operation support.
3. Call [`vault.initialize()`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IVaultExtension.sol#L110). Initialize will perform any pool specific setup and seed the pool with initial liquidity, enabling swaps and normal liquidity operations.

Creating pools via a factory contract is the suggested approach, however not mandatory. Balancer's off-chain infrastructure uses the `factory` address as a means to identify the `type` of pool, which is important for integration into the UI, SDK, external aggregators, etc.

<!---
### Balancer UI Support

:::info
an explanation on the steps required to be added to the UI will follow.
:::

### Balancer Swap UI support

:::info
an explanation on the steps required to be supported by the swap UI will follow
:::

### Aggregator support (1inch, paraswap, 0x, etc.)

:::info
an explanation on the steps required for aggregator support will follow.
:::
-->