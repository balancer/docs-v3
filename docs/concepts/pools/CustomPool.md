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

Balancer Pool Tokens (BPTs) are not implemented as standalone ERC20 Tokens but are part of the Vault's ERC20Multitoken contract. Inheriting from `BalancerPoolToken` allows the Pool to behave in compliance with the ERC20 standard while calls are delegated to the Vault's ERC20Multitoken contract.

## Requirements

The main entrypoint to Balancer for a user is the Router. The call to the Router gets routed to the Vault and then the pool, which executes the swap logic implemented by the developer. The required functions of a custom pool depending use can be seen in the table below.

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

## Pool construction

Creating pools via a factory contract is the suggested approach, however not mandatory. The required constructor arguments for the pool to be working with the Balancer Vault are:

- `IVault vault`: the address of the Balancer Vault casted to the `IVault` interface type
- `string name` : the BPT's name 
- `string symbol` the BPT's symbol

A sample constructor of a custom pool could look like:

```solidity
contract MyCustomPool is IBasePool, BalancerPoolToken {
    ...
    // define params specific to this pool
    struct PoolParams {
        string name;   //required for BalancerPoolToken
        string symbol; //required for BalancerPoolToken
    }

    constructor(PoolParams memory params, IVault vault) BalancerPoolToken(vault, params.name, params.symbol) {

    }
}
```

Additionally a pool needs to be registed with the Vault via `vault.registerPool()`. It is recommended to register a pool during construction.

## Pool logic

Based on the user action defined as VaultCases for interacting with the pool, multiple functions need to be implemented. Building on the pool snippet from before, the contract can be extended to now include:

- `computeInvariant()`
- `computeBalance()`
- `onAddLiquidityCustom`
- `onRemoveLiquidityCustom`
- `oSwap()`

### Invariant computation
The pool's invariant is the core piece determining pool behaviour. The most common pool invariants these days are constant product, stable swap, constant sum. This function should compute the invariant based on current pool balances, which are passed scaled to 18 decimals.

### Balance computation
Similarly users can specify operations on the Router that effectively change the pools invariant with user-defined values and require the computation of the resulting pool balances. For example a user-specified exactAmount of BPT out as part of a add liquidity operation. Passed parameters `balancesLiveScaled18` and `invariantRatio`are passed scaled as 18 decimals. `tokenInIndex`refers to the index of the pool's tokens based on registration order.

### Custom Liquidity addition
Custom liquidity addition can be thought as neither the input tokens being guaranteed to be put in, nor the exactBpt out being guaranteed. A users set the intended `amountsInScaled18` for a `minBptOut` however only an `amountsInActual` (scaled18?) will be used. One example of custom liquidity addition is a proportional pool join, regardless of the pool's balances distribution.

### Custom Liquidity removal
TODO:

### Swap logic
As part of the `onSwap` function, the pool computes either the `amountOut` if `SwapKind` is  `GIVEN_IN` or the `amountIn` if `SwapKind` is `GIVEN_OUT`. 
```note
Add swap fee to the amountGiven to account for the fee taken in GIVEN_OUT swap on tokenOut
Perform the swap request callback and compute the new balances for 'token in' and 'token out' after the swap
If it's a GivenIn swap, vars.swapFeeAmountScaled18 will be zero here, and set based on the amountCalculated.
```

An unimplemented custom pool contract with NatSpec can be found below.

```solidity
contract MyCustomPool is IBasePool, BalancerPoolToken {
    ...
    // define params specific to this pool
    struct PoolParams {
        string name; //required for BalancerPoolToken
        string symbol; //required for BalancerPoolToken
    }

    constructor(PoolParams memory params, IVault vault) BalancerPoolToken(vault, params.name, params.symbol) {

    }

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
    function onSwap(IBasePool.SwapParams memory request) public view onlyVault returns (uint256 amountCalculatedScaled18) {
        //custom implementation
    }
}
```

# Hook logic - Development approach

# Custom pool application context - FAQs:
- As a developer I want to take a cut of swapFees and route them to my own Treasury. How would I go about that
- As a developer I want to update some external contract state on every swap with Balancer. For example a price oracle. How would I go about doing that?
- As a developer I want to arbitrage additional dexes during swapTime to realise the arbitrage gains as part of the LP revenue or swap execution gain. How would I go about doing that?

# 
