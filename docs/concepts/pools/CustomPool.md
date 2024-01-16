---
order: 2
title: Custom Pool
---

# Custom Pools

Custom pools are smart contracts, which developers create to implement custom logic. The two main components a pool can implement are:

- Base functionality to work with the Balancer Vault (Adding & removing liquidity, Swapping)
- Adding additional Hook logic

# Base functionality - Development approach

Creating Balancer pools builds on the core functions `computeInvariant` & `computeBalance` to implement the trade logic required for the whole lifecycle of the pool. To facilitate the helpful implementation of the required functions Balancer provides two contracts to inherit from:

- [BalancerPoolToken.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/BalancerPoolToken.sol)
- [IBasePool.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IBasePool.sol)

A sample custom pool contract could look like this

```solidity
contract MyCustomPool is IBasePool, BalancerPoolToken {
    ...
}
```

## Why inherit from IBasePool?

Inheriting from `IBasePool` forces you as a pool developer to implement all the required functions the Vault is calling on the custom pool.

## Why inherit from BalancerPoolToken?

Balancer Pool Tokens (BPTs) are not implemented as standalone ERC20 Tokens but are part of the Vault's ERC20Multitoken contract. Inheriting from `BalancerPoolToken` allows the Pool to behave in compliance with the ERC20 standard while calls are delegated to the ERC20Multitoken contract.

## Requirements

The main entrypoint to Balancer for a User is the Router. The call to the Router eventually gets routed to the Pool contract and executes the logic implemented by the developer. Below you see the required functions of a custom pool that needs to be implemented for the intended user action.

| Router                             | VaultCase                                  | Poolfunction            |
| ---------------------------------- | ------------------------------------------ | ----------------------- |
| addLiquidityCustom                 | AddLiquidityKind.CUSTOM                    | onAddLiquidityCustom    |
| addLiquidityUnbalanced             | AddLiquidityKind.UNBALANCED                | computeInvariant        |
| addLiquiditySingleTokenExactOut    | AddLiquidityKind.SINGLE_TOKEN_EXACT_OUT    | computeBalance          |
| removeLiquidityProportional        | RemoveLiquidityKind.PROPORTIONAL           |                         |
| removeLiquiditySingleTokenExactIn  | RemoveLiquidityKind.SINGLE_TOKEN_EXACT_IN  | computeBalance          |
| removeLiquiditySingleTokenExactOut | RemoveLiquidityKind.SINGLE_TOKEN_EXACT_OUT | computeInvariant        |
| removeLiquidityCustom              | RemoveLiquidityKind.CUSTOM                 | onRemoveLiquidityCustom |
| swapExactIn                        | SwapKind.GIVEN_IN                          | onSwap                  |
| swapExactOut                       | SwapKind.GIVEN_OUT                         | onSwap                  |

## Pool construction.

Creating pools via a factory contract is the suggested approach, however not mandatory. The required constructor arguments for the pool to be working with the Balancer Vault are:

- `IVault vault`
- `string name`
- `string symbol`

A sample constructor of a custom pool could look like:

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
}
```

## Pool logic

Based on the user action defined as VaultCases for interacting with the pool, the developer needs to implement multiple functions. Building on the pool snippet from before, the contract can be extended to now include:

- `computeInvariant()`
- `computeBalance()`
- `onAddLiquidityCustom`
- `onRemoveLiquidityCustom`
- `oSwap()`

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
