---
order: 2
title: Create a custom AMM with a novel invariant
---

# Create a custom AMM with a novel invariant

Balancer protocol provides developers with a modular architecture that enables the rapid development of custom AMMs.

AMMs built on Balancer protocol leverage the security of the Balancer vault, tap into the network of the Balancer ecosystem, and .... TODO: add some more marketing content here.

::: info Are you in the right place?
This section is for developers looking to develop a new custom pool type with a novel invariant. If you are looking to extend an existing pool type with hooks, start [here](/concepts/pools/custom-pools/hooks.html).
:::

## Build your custom AMM

At a high level, creating a custom AMM on Balancer protocol involves the implementation of only three functions `onSwap`, `computeInvariant` and `computeBalance`.
To expedite the development process, Balancer provides two contracts to inherit from:

- [IBasePool.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IBasePool.sol) - This interface defines the required functions that every Balancer pool must implement
- [BalancerPoolToken.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/BalancerPoolToken.sol) - This contract implements the [ERC20MultiToken](/concepts/vault/multitoken.html) standard that enables your pool contract to be ERC20 compliant while delegating BPT accounting to the vault. For more information, refer to [BalancerPoolToken](/concepts/pools/balancerpooltoken.html).

Both `IBasePool` and `BalancerPoolToken` are used across all core Balancer pools, even those implemented by Balancer Labs (ie: [WeightedPool](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-weighted/contracts/WeightedPool.sol#L18)).

Below, we present a naive implementation of a two token `ConstantPricePool` as a useful reference for walking through the required functions necessary to implement a custom AMM on Balancer protocol: 

```solidity
contract ConstantPricePool is IBasePool, BalancerPoolToken {
    /**
     * @notice Computes and returns the pool's invariant.
     * @dev This function computes the invariant based on current balances
     * @param balancesLiveScaled18 Array of current pool balances for each token in the pool, scaled to 18 decimals
     * @return invariant The calculated invariant of the pool, represented as a uint256
     */
    function computeInvariant(uint256[] memory balancesLiveScaled18) external view returns (uint256 invariant) {
        return balancesLiveScaled18[0] + balancesLiveScaled18[1];
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
    ) external view returns(uint256 newBalance) {
        uint256 invariant = computeInvariant(balancesLiveScaled18);
        uint256 invariantAfterJoin = invariant * invariantRatio / 1e18;

        return invariantAfterJoin - balancesLiveScaled18[tokenInIndex == 1 ? 0 : 1];
    }

    /**
     * @notice Execute a swap in the pool.
     * @param params Swap parameters
     * @return amountCalculatedScaled18 Calculated amount for the swap
     */
    function onSwap(SwapParams calldata params) external returns (uint256 amountCalculatedScaled18) {
        uint256 balanceTokenInScaled18 = request.balancesScaled18[request.indexIn];
        uint256 balanceTokenOutScaled18 = request.balancesScaled18[request.indexOut];

        if (request.kind == IVault.SwapKind.GIVEN_IN) {
            // check that enough liquidity is available
            require(request.amountGivenScaled18 < balanceTokenOutScaled18, "no liquidity for trade");
            return (request.balancesScaled18[request.indexIn] + request.amountGivenScaled18
            + request.balancesScaled18[request.indexOut]- computeInvariant(request.balancesScaled18));
        } else {
            revert("not implemented");
        }
    }
}
```

::: info What is Scaled18?
TODO
:::

::: info In balancesLiveScaled18 what does Live refer to?
TODO
:::

### Compute Invariant

The pool's invariant is the core piece determining pool behaviour. A few commonly known pool invariants are constant product, stable swap and constant sum. This function should compute the invariant based on current pool balances.

::: info What is an invariant?
TODO: simple definition of an invariant
:::

#### Weighted Pool [`computeInvariant`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-weighted/contracts/WeightedPool.sol#L73-L75) 
Balancer Labs' Weighted Pool `computeInvariant` implements a constant value invariant.
```solidity
function computeInvariant(uint256[] memory balancesLiveScaled18) public view returns (uint256) {
    return WeightedMath.computeInvariant(_getNormalizedWeights(), balancesLiveScaled18);
}
```
#### Constant Price Pool `computeInvariant`
A sample constant Price pool (X + Y = K) with 2 tokens could implement `computeInvariant` via:
```solidity
function computeInvariant(uint256[] memory balancesLiveScaled18) public view returns (uint256) {
    uint256 invariant;
    uint256 balancesLength = balancesLiveScaled18.length;
    for (uint256 i=0; i<balancesLength; i++) {
        invariant +=  balancesLength[i];
    }
    return invariant;
}
```

### Compute Balance
The exact out operations available on Balancer V3 require the `computeBalance()` function as it acts as an inverse `computeInvariant()` function.

#### Weighted Pool [`computeBalance`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-weighted/contracts/WeightedPool.sol#L78-L89)
Balancer Labs' Weighted Pool `computeBalance` implements a constant value invariant.

```solidity
function computeBalance(
    uint256[] memory balancesLiveScaled18,
    uint256 tokenInIndex,
    uint256 invariantRatio
) external view returns (uint256 newBalance) {
    return
        WeightedMath.computeBalanceOutGivenInvariant(
            balancesLiveScaled18[tokenInIndex],
            _getNormalizedWeights()[tokenInIndex],
            invariantRatio
        );
}
```

#### Constant Price Pool `computeBalance`
A sample constant Price pool (X + Y = K) could implement `computeBalance` via:

TODO: verify correctness & rename
```solidity
contract ConstantPricePool {
    //...
    function computeBalance(
        uint256[] memory balancesLiveScaled18,
        uint256 tokenInIndex,
        uint256 invariantRatio
    ) external view returns (uint256 newBalance) {
        //compute current invariant
        uint256 invariant = computeInvariant(balancesLiveScaled18);
        uint256 invariantAfterJoin = invariant * invariantRatio / 1e18;

        uint256 accessKey = (tokenInIndex == 1? 0 : 1);
        uint256 balancesToSend = invariantAfterJoin - balancesLiveScaled18[accessKey];
        return balancesToSend;
    }
}
```



### On Swap
Users either do a swap with a exact in amount and get a variable out amount. This is the case if `SwapKind` is `GIVEN_IN` or users do a swap with a exact out amount and turn in a variable amount. This is the case when `SwapKind` is `GIVEN_OUT`. These scenarios are implemented as part of the `onSwap` function. 

The Swap parameters definition can be found [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IBasePool.sol#L59-L67).

#### Weighted Pool `onSwap`

Balancer Labs Weighted Pool implementation calculates the `amountOut` based on the swap type `SwapKind`. 

```solidity
/// @inheritdoc IBasePool
    function onSwap(IBasePool.SwapParams memory request) public view onlyVault returns (uint256) {
        uint256 balanceTokenInScaled18 = request.balancesScaled18[request.indexIn];
        uint256 balanceTokenOutScaled18 = request.balancesScaled18[request.indexOut];

        if (request.kind == SwapKind.GIVEN_IN) {
            uint256 amountOutScaled18 = WeightedMath.computeOutGivenIn(
                balanceTokenInScaled18,
                _getNormalizedWeight(request.indexIn),
                balanceTokenOutScaled18,
                _getNormalizedWeight(request.indexOut),
                request.amountGivenScaled18
            );

            return amountOutScaled18;
        } else {
            uint256 amountInScaled18 = WeightedMath.computeInGivenOut(
                balanceTokenInScaled18,
                _getNormalizedWeight(request.indexIn),
                balanceTokenOutScaled18,
                _getNormalizedWeight(request.indexOut),
                request.amountGivenScaled18
            );

            // Fees are added after scaling happens, to reduce the complexity of the rounding direction analysis.
            return amountInScaled18;
        }
    }
```

#### Constant Price Pool `onSwap`

A sample constant Price pool (X + Y = K) could implement computeBalance via:

```solidity
contract ConstantPricePool {
    //...
    function onSwap(IBasePool.SwapParams memory request) public view onlyVault returns (uint256 amountCalculatedScaled18) {

        uint256 balanceTokenInScaled18 = request.balancesScaled18[request.indexIn];
        uint256 balanceTokenOutScaled18 = request.balancesScaled18[request.indexOut];

        if (request.kind == IVault.SwapKind.GIVEN_IN) {
            // check that enough liquidity is available
            require(request.amountGivenScaled18 < balanceTokenOutScaled18, "no liquidity for trade");
            return (request.balancesScaled18[request.indexIn] + request.amountGivenScaled18 
            + request.balancesScaled18[request.indexOut]- computeInvariant(request.balancesScaled18));
        } else {
            revert("not implemented");
        }
    }
}
```

## Custom liquidity operations (Optional)
Custom liquidity operations allow for a more flexible exactAmountIn -> MinAmountOut & exactAmountOut -> MaxAmountIn behaviour. The custom liquidity additions do not enforce this intended behaviour.

- `onAddLiquidityCustom`
- `onRemoveLiquidityCustom`

### Add liquidity custom
Custom liquidity additions can be utilized if additional functionality should be built ontop of the regular pool functionality. 
:::note
As an example a pool can introduce it's own accounting state while drawing in tokens from the user to give them out at a later stage, without giving BPT back. [Cron Finance](https://github.com/Cron-Finance/v1-twamm/blob/main/contracts/twault/CronV1Pool.sol#L438) utilises this storage to create custom TWAMM orders that have accounting as part of the pool state.
:::

### Remove liquidity custom
:::note
As an example a pool can utilise it's own accounting state while giving back tokens to the user without drawing in BPT. This pool internal accounting is used by [Cron Finance](https://github.com/Cron-Finance/v1-twamm/blob/main/contracts/twault/CronV1Pool.sol#L569) to manage long term orders.
:::


## How to deploy your pool

Creating pools via a factory contract is the suggested approach, however not mandatory. The required constructor arguments for the pool to work with the Balancer Vault are:

- `IVault vault`: the address of the Balancer Vault casted to the `IVault` interface type
- `string name` : the BPT's name
- `string symbol` the BPT's symbol

A sample constructor of a custom pool could look like:

```solidity
contract MyCustomPool is IBasePool, BalancerPoolToken {
    ...

    constructor(IVault vault, string name, string symbol) BalancerPoolToken(vault, name, symbol) {

    }
}
```

TODO: Before public launch revisit the way how swap fees are determined.
Additionally a pool needs to be registered with the Vault via `vault.registerPool()`. It is recommended to register a pool during construction. By default a pool's swap fees are set to 0 and need to be updated via an authorized entity by calling `vault.setStaticSwapFeePercentage()`.
