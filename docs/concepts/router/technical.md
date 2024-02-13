---
order: 1
title: Technical description
---

# Router

A Router is the required contract to facilitate user interactions with the Balancer V3 Vault and acts as the default entrypoint. **It provides the required API to facilitate user operations & queries**. It can be extended with arbitrary logic which can enhance the user experience when interacting with Balancer.

:::info
This section is a technical explainer of how the Router works. If you are looking to integrate against the Router, take a look at the [API docs](./overview.md).
:::

## Router design

The Router is designed to closely interact with the Vault. Some advantages are that a user interacting with the Router has access to simplified function signatures (names & parameter types) allowing more concise function naming. Complex user-interactions can be aggregated at the Router level and exposed via single functions rather than custom contracts needing to be built to serve these complex user-interactions.

### Sequence of interactions
Every user interaction going through the Router follows the same pattern of execution flow. 

1. The Router `invoke`s the Vault, allowing access to protected Vault functions that do token [accounting](/concepts/vault/transient.md)
2. The Router executes the respective Callback function the Vault calls on the Router which include
-  The Router calling the Vault's respective primitive (swap, add- or remove liquidity)
-  The Router Executing arbitrary logic required for the user operation
3. The Router settles outstanding debt, which the Vault attributed to the Router during step 2

### Sequence Diagram
The Router and Vault interact in a back and forth manner to achieve the intended outcome of liquidity or query operations.
![Router Vault interaction](/images/router-vault.png)


Interacting with the Router returns the expect amountsIn/amountsOut & facilitates the interactions with the Balancer V3 Vault. The Router also exposes the Vault's primitives (swap, addLiquidity & removeLiquidity) as query functions. 


### Vault invocation


The Router calling the Vault's `invoke` function places the Router in a temporarily list of allowed callers, so called `handlers`. Only these `handlers` are allowed to interact with the Vault's functions that handle token accounting. This triggers the functions `transient` modifier, enabling the transaction to be executed in a [transient accounting context](/concepts/vault/transient.md), allowing great flexibility with the Vault's token balances only to be settled at the end. You can think of this step as the Router opening a tab with the Vault and any operations will attribute to the tab.

### Callback execution

While the Router has many user-centric entrypoints, the required callback implementations are defined by the Vault's main three primitives (`swap`, `addLiquidity` and `removeLiquidity`). The Router supports these by implementing

- `swapCallback`
- `addLiquidityCallback`
- `RemoveLiquidityCallback`

As the transaction is now within a transient accounting context, a Router can now implemented any arbitrary logic, swaps, joins & exits and also utilise more complex operations like flashloans (from Balancer). Interacting with external contracts and reentering the Vault again (see Vault invocation) is possible as well.

The combination of these possibilities enables great flexibility for operating with liquidity on Balancer.

**Executing the Vault's core primitive**

Either a `swap` `addLiquidity` or `removeLiquidity` operation is called on the Vault & the Vault has stored the balances owed from the Router to the Vault as part of an internal `accountDelta` var. 

**Execute additional arbitrary logic**

With the transient accounting context enabled the Vault allows the router to pull funds via `wire` and accrue debt or send funds to the Vault via `retrieve` and settle debt. Combining 
this accounting approach with additional external calls or further Vault interactions allows for more flexible liquidity.

### Settling debt
While the Vault's core primitives attribute either debt & or credit to the Router (as part of the logic defined in pools). Regardless of usage all debts & credits need to be settled at the end of the transaction otherwise the transaction [reverts](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Vault.sol#L83) because the `_accountDelta` has not been cleared. This closes out the tab opened in step 1.

## Router Queries
Querying user-operations execute the Vaults primitives but instead of setting debt/credit the query functions simply return the `amountsCalculated`. However only valid calls succeed as the `transient` modifier ensures balance changes within the Vault are settled

Instead of calling `invoke` on the Vault, the Router calls `quote` on the Vault. This modifier ensures that it is a `staticcall` as in an offchain eth_call.
All operations with the `withHandler` modifier can be queried. 

:::info onchain queries
Action: test how `call` will work


It is not possible to use queries as part of `view` functions onchain as the used Vault operations does state changes and would revert with `EvmError: StateChangeDuringStaticCall`. These scenarios are prohibited by the `query` modifier which requires the `tx.origin` to equal `address(0)`. This is the case if called in an offchain context.
:::

## Trusted Routers

Using trusted Routers to settle accrued debt via `retrieve` reduces the amounts of token transfers for each operation from user -> router -> Vault to only user -> Vault. This is possible as `retrieve` uses token approvals users have given the Vault. This feature also necessitates putting `retrieve` to only work with trusted Routers. While any smart contract can work as a Router and settle debt via `settle`, creating a router that is trusted increases user experience for users by allowing it to settle debt via `retrieve`.
