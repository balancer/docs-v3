---
order: 2
title: Custom Pool
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

Balancer Pool Tokens (BPTs) are not implemented as standalone ERC20 Tokens but are part of the Vault's ERC20Multitoken contract. Inheriting from `BalancerPoolToken` allows the Pool to behave in compliance with the ERC20 standard while calls are delegated to the Vault's ERC20Multitoken contract. This means the BPT has all ERC20 features such as: `approve`, `transfer`, `transferFrom`, `totalSupply`, etc but is "managed" by the vault. BPT's have the same composability features as regular ERC20 contracts. For example to transfer a BPT you have the possibility to either call `bpt.transfer(from, to)` or `vault.transfer(address(bpt), from, to)`.

::: info
The complexity of the Vault is split accross several contracts. The ERC20 functionality of BPTs is part of the [`VaultCommon`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/VaultExtension.sol#L413-L448) & [`VaultExtension`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/VaultCommon.sol#L17)
:::

## Pool construction

Creating pools via a factory contract is the suggested approach, however not mandatory. The required constructor arguments for the pool to be working with the Balancer Vault are:

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
- `oSwap()`

### Invariant computation
The pool's invariant is the core piece determining pool behaviour. The most common pool invariants these days are constant product, stable swap, constant sum. This function should compute the invariant based on current pool balances.

```solidity
contract MyCustomPool {
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
    
}
```
#### Weighted Pool `computeInvariant` 
Balancer Labs' Weighted Pool `computeInvariant` implements a constant value invariant.
```solidity
contract WeightedPool {
    //...
    function computeInvariant(uint256[] memory balancesLiveScaled18) public view returns (uint256) {
        return WeightedMath.computeInvariant(_getNormalizedWeights(), balancesLiveScaled18);
    }
}
```
#### Constant Price Pool `computeInvariant`
A sample constant Price pool (X + Y = K) could implement `computeInvariant` via:
```solidity
contract ConstantPricePool {
    //...
    function computeInvariant(uint256[] memory balancesLiveScaled18) public view returns (uint256) {
        uint256 invariant;
        uint256 balancesLength = balancesLiveScaled18.length;
        require(balancesLength == 2, "not a 2 token pool");
        for (uint256 i=0; i<balancesLength; i++) {
            invariant +=  balancesLength[i];
        }
        return invariant;
    }
}
```



### Balance computation
Similarly users can specify operations on the Router that effectively change the pools invariant with user-defined values and require the computation of the resulting pool balances. For example a user-specified exactAmount of BPT out as part of a add liquidity operation. Passed parameters `balancesLiveScaled18` and `invariantRatio`are passed scaled as 18 decimals. `tokenInIndex`refers to the index of the pool's tokens based on registration order.
TODO: Needs to be rephrased
TODO: Nomenclature and terminology. 
Action: more broadly say that there is exact in and exact out. Operations that compute the exact out, you need the reverse invariant which is calculated via the balance computation. Difference between compute balance is compute invariant needs to be made more clear.

```solidity
contract MyCustomPool {
    //...
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
}
```

#### Weighted Pool `computeBalance`
Balancer Labs' Weighted Pool `computeBalance` implements a constant value invariant.

```solidity
contract WeightedPool {
    /// @inheritdoc IBasePool
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
```solidity
contract MyCustomPool {
    //...
    /**
     * @notice Execute a swap in the pool.
     * @param params Swap parameters
     * @return amountCalculatedScaled18 Calculated amount for the swap
     */
    function onSwap(SwapParams calldata params) external returns (uint256        amountCalculatedScaled18) {
        //custom implementation
    }
}
```
The Swap parameters definition can be found [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IBasePool.sol#L59-L67).


:::info on balances
Before the Vault passes the pool's balances to the pool contract it scales them to 18 decimals and multiplies by the rate, if a rate provider was supplied during construction. A more detailed explanation on rate providers is [here](https://docs.balancer.fi/reference/contracts/rate-providers.html#yield-fees-for-weightedpools).
:::

:::info on fees.
Fees are computed at the Vault level. Meaning as a pool developer you do not need to think about:
- Incorporating any fees going to LPs 
- Any fees going to the Balancer protocol
A developer writing tests for token outflows on the Vault needs to take swap fees into account. 
:::




## Execution Flow

The main entrypoint to Balancer for a user is the Router. The call to the Router gets routed to the Vault and then the pool, which executes the swap logic implemented by the developer. The required functions of a custom pool depending use can be seen in the table below.

transfer it to a sequence diagram

| Router                               | VaultCase                                    | Poolfunction              |
| ------------------------------------ | -------------------------------------------- | -----------------------   |
| `initialize`                         | `initialize             `                    | `computeInvariant`    |
| `addLiquidityCustom`                 | `AddLiquidityKind.CUSTOM`                    | `onAddLiquidityCustom`    |
| `addLiquidityUnbalanced `            | `AddLiquidityKind.UNBALANCED`                | `computeInvariant`        |
| `addLiquiditySingleTokenExactOut`    | `AddLiquidityKind.SINGLE_TOKEN_EXACT_OUT`    | `computeBalance`          |
| `removeLiquidityProportional`        | `RemoveLiquidityKind.PROPORTIONAL`           |                           |
| `removeLiquiditySingleTokenExactIn`  | `RemoveLiquidityKind.SINGLE_TOKEN_EXACT_IN`  | `computeBalance`          |
| `removeLiquiditySingleTokenExactOut` | `RemoveLiquidityKind.SINGLE_TOKEN_EXACT_OUT` | `computeInvariant`        |
| `removeLiquidityCustom`              | `RemoveLiquidityKind.CUSTOM`                 | `onRemoveLiquidityCustom` |
| `swapExactIn`                        | `SwapKind.GIVEN_IN`                          | `onSwap`                  |
| `swapExactOut`                       | `SwapKind.GIVEN_OUT`                         | `onSwap`                  |



## Optional custom add liquidity operations.
Custom liquidity operations allow for not resolving the whole trade within one transactions. Cron Finance TWAMMs fit into the section as
a custom TWAMM order is created/exited as part of these custom operations. These operations need to be implemented via:

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
        params.kind == IVault.SwapKind.GIVEN_IN? require(params.amountGivenScaled18 < MAX_AMOUNT_GIVEN, "amount in exceeds limit") : require(params.amountGivenScaled18 > MAX_AMOUNT_GIVEN, "amount out exceeds limit");
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

## Hook examples

- As a developer I want to take a cut of swapFees and route them to my own Treasury. How would I go about that
- As a developer I want to update some external contract state on every swap with Balancer. For example a price oracle. How would I go about doing that?
- As a developer I want to arbitrage additional dexes during swapTime to realise the arbitrage gains as part of the LP revenue or swap execution gain. How would I go about doing that?

