---
order: 2
title: Custom Pool
references:
  - details: Balancer Pool Token
    link: /concepts/advanced/balancerpooltoken
---

# Custom Pools 

Custom pools are smart contracts, which developers create to implement custom logic. The two main components a pool can implement are:

- Pool math
- Pool callbacks

The intention of the pool math component is the calculation of the pools invariant or other math related aspects such as amount of tokens going out of the vault or tokens required to go into the vault.

# Development approach

Creating custom Balancer pools builds on the core functions `computeInvariant` & `computeBalance` to implement the trade logic. Balancer provides two helpful contracts to inherit from:

- [BalancerPoolToken.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/BalancerPoolToken.sol)
- [IBasePool.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IBasePool.sol)

A sample custom pool contract could look like this

```solidity
contract MyCustomPool is IBasePool, BalancerPoolToken {
    ...
}
```

## Inherit from IBasePool

Inheriting from `IBasePool` forces you as a pool developer to implement all the required functions the Vault is calling on the custom pool and the return types.

## Inherit from BalancerPoolToken

Balancer Pool Tokens (BPTs) are not implemented as standalone ERC20 Tokens but are part of the Vault's ERC20Multitoken contract. The ERC20Multitoken contract pairs well with the Balancer V3 Vault as it encapsulates BPT management within the Vault and does not have dependency on the Pool contract, moving complexity from the Pool contract to the Vault. This voids read-only-reentrancy concerns as there is no seperate Vault & pool state anymore. Also concepts such as preminted BPT/Phantom BPT have been removed and the Vault is now fully BPT aware as it is the contract managing BPTs. A detailed explanation on BalancerPoolTokens is provided [here](). 


Inheriting from `BalancerPoolToken` allows the Pool to behave in compliance with the ERC20 standard while calls are delegated to the Vault's `ERC20Multitoken` contract. This means the BPT has all ERC20 features such as: `approve`, `transfer`, `transferFrom`, `totalSupply`, etc. but is "managed" by the vault. BPT's have the same composability features as regular ERC20 contracts. For example to transfer a BPT you have the possibility to either call `bpt.transfer(from, to)` or `vault.transfer(address(bpt), from, to)`. 

::: info
Take a look at the [BalancerPoolToken contract](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/BalancerPoolToken.sol) or an explainer on [ERC20MultiToken](TODO: add link to in depth ERC20MultiToken explainer)
:::

## Pool construction

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

## Pool logic

The majority of Balancer custom pools can be created by implementing the three core functions. These allow the standard repertoire of providing liquidity and swapping with an AMM. 

- `computeInvariant()`
- `computeBalance()`
- `onSwap()`

::: note
Balancer V3 has exact in - minimum out & max in - exact out operations available. Operations computing the minimum out require an invariant computation, whereas operations computing the exact out the reverse invariant is required. This reverse invariant is computed via `computeBalance`.
:::

```solidity
contract MyCustomPool is IBasePool, BalancerPoolToken {
    //...
    /**
     * @notice Computes and returns the pool's invariant.
     * @dev This function computes the invariant based on current balances
     * @param balancesLiveScaled18 Array of current pool balances for each token in the pool, scaled to 18 decimals
     * @return invariant The calculated invariant of the pool, represented as a uint256
     */
    function computeInvariant(uint256[] memory balancesLiveScaled18) external view returns (uint256 invariant) {
        //custom implementation
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
        //custom implementation
    }

    /**
     * @notice Execute a swap in the pool.
     * @param params Swap parameters
     * @return amountCalculatedScaled18 Calculated amount for the swap
     */
    function onSwap(SwapParams calldata params) external returns (uint256 amountCalculatedScaled18) {
        //custom implementation
    }
    
}
```

:::info on balances
Before the Vault passes the pool's balances to the pool contract it scales them to 18 decimals and multiplies by the rate, if a rate provider was supplied during construction. A more detailed explanation on rate providers is [here](https://docs.balancer.fi/reference/contracts/rate-providers.html#yield-fees-for-weightedpools).
:::

:::info on fees.
Fees are computed at the Vault level and do not need to be taken into account when implementing custom pool functions. More on [Swap fee](/concepts/vault/swapfee.md) & [Yield fee](/concepts/vault/yieldfee.md).
:::

### Invariant computation
The pool's invariant is the core piece determining pool behaviour. The most common pool invariants these days are constant product, stable swap, constant sum. This function should compute the invariant based on current pool balances.

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

### Balance computation
The available exact out operations available on Balancer V3 require the `computeBalance()` function as it acts as an inverse `computeInvariant()` function.

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



### Swap computation
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

## Optional custom add liquidity operations.
Custom liquidity operations allow for a more flexible exactAmountIn -> MinAmountOut & exactAmountOut -> MaxAmountIn behaviour. The custom liquidity additions do not enforce this intended behaviour.

- `onAddLiquidityCustom`
- `onRemoveLiquidityCustom`

### Custom Liquidity addition
TODO: small code snippet how cron finance opens a twamm trade
Custom Liquidity additions allow for more customization as `amountIn` and `amountOut` are more flexible. In Balancer V2 Cron Finance for example used 

### Custom Liquidity removal
TODO: small code snippet how cron finance closes a twamm trade


# Hooks
Balancer supports pools that implement hooks. A hook is a codeblock that implements arbitrary logic in a pool or external contract. Whenever a pool is registered in the Vault, part of the [`PoolConfig`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L26-L37) stores this information. A set of [8 different pool hooks](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L9-L18) are available to be implemented, depending on what part of the execution flow the additional logic is needed. All hooks are expected to return a `boolean` type of either `true` on success or `false` on failure. When working with hooks, the suggestion is to inherit from [`IPoolCallbacks`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IPoolCallbacks.sol) as different hooks have access to different payloads. The available hooks are:

- `onBeforeInitialize`
- `onAfterInitialize`
- `onBeforeAddLiquidity`
- `onAfterAddLiquidity`
- `onBeforeRemoveLiquidity`
- `onAfterRemoveLiquidity`
- `onBeforeSwap`
- `onAfterSwap`

:::info hooks & reentrancy
It is possible to reenter the Vault as part of a hook execution as only the respective internal function like `_swap`, `_addLiquidity` & `_removeLiquidity` are reentrancy protected.
:::

## Hook architecture
Various choices for hook implementations are possible. Either:
- Implement the hook logic as part of the Pool contract
- Forward hook execution to external contracts

It is up to the developer to choose where the logic is implemented.

### Hook logic implementation as part of the pool's code

```solidity
contract MyCustomPool is BalancerPoolToken, IBasePool, IPoolCallbacks {
    //...

    uint256 public constant MAX_AMOUNT_GIVEN = 100e18;

    function onBeforeSwap(IBasePool.SwapParams memory params) external view returns (bool) {
        if (params.kind == IVault.SwapKind.GIVEN_IN) {
            require(params.amountGivenScaled18 < MAX_AMOUNT_GIVEN, "amount in exceeds limit");
        } else {
            require(params.amountGivenScaled18 > MAX_AMOUNT_GIVEN, "amount out exceeds limit");
        }
        return true;
    }
}
```

### Hook logic implementation as part of an external contract's code

```solidity
interface IOnBeforeSwapHookContract {
    function swapEnabled() external view returns (bool);
}

contract myCustomPool is BalancerPoolToken, IBasePool, IPoolCallbacks {
    //...

    address public onBeforeSwapTarget;

    function onBeforeSwap(IBasePool.SwapParams memory params) external view returns (bool) {
        return IOnBeforeSwapHookContract(onBeforeSwapTarget).swapEnabled();
    }
}
```

