---
order: 0
title: Overview
---

# Router

A Router is the required contract to facilitate user interactions with the Balancer V3 Vault. A Router acts as the default entrypoint for user operations and provides the required API to facilitate the user operations & queries

## Router design

The router is designed to closely interact with the Vault. Whenever a user operation is done on the Vault, the Router does:

1. It `invoke`s the Vault, allowing access to protected Vault functions
2. Execute the respective Callback from the Vault 
-  Call the vault's respective primitive (swap, add- or remove liquidity)
-  Execute arbitrary logic required for the user operation
5. Settle outstanding debt, the vault attributed to the Router during step 3

Interacting with the Router returns the expect amountsIn/amountsOut & facilitates the interactions with the Balancer V3 Vault. The amountsIn/amountsOut for a given operation are also available as part of query functions. 
swapCal
### Vault invocation
The Router calling the Vault's `invoke` function places the caller in a temporarily list of allowed callers, so called `handlers`. Only these `handlers` are allowed to interact with the Vault directly. This triggers the functions `transient` modifier, enabling the transaction to be executed in a transient accounting context, allowing great flexibility with the Vault's token balances with the requirements to have a net zero balance at the end. Before token balances are settled at the end of the transaction, the Vault passes execution flow back to the Router to execute the user required operations. 

### Callback execution

Action: Should queries be included in this section?

While the Router has many user-centric entrypoints, the required callback implementations are defined by the Vault's main three primitives (`swap`, `addLiquidity` and `removeLiquidity`). The Router supports these by implementing

- `swapCallback`
- `addLiquidityCallback`
- `RemoveLiquidityCallback`

As the transaction now is within a transient accounting context, a Router can now implemented any arbitrary logic such as swaps, joins & exits. More complex operations like flashloans (from Balancer), interacting with external contracts and with Balancer pools. It is possible to reenter the Vault again (See Vault invocation).

#### Executing the Vault's core primitive
Either a `swap` `addLiquidity` or `removeLiquidity` operation is called on the Vault & the Vault has stored the balances owed from the Router to the Vault as part of an internal `accountDelta` var. 

#### Execute additional arbitrary logic
With the transient accounting context enabled the Vault allows the router to pull funds via `wire` and accrue debt or send funds to the Vault via `retrieve` and settle debt. Combining 
this accounting approach with additional external calls or further Vault interactions allows for more flexible liquidity.

### Settling debt
While the Vault's core primitives for sure accrue either debt & or credit, the Router's callback has this possibility as optional. Regardless of usage all debts & credits need to be settled at the end of the transaction otherwise the transaction [reverts](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Vault.sol#L83) because the `_accountDelta` has not been cleared.

## Router Queries
Querying user-operations execute the Vaults primitives but instead of setting debt/credit the query functions simply return the `amountsCalculated`. 

## Custom Router
Action: verify if what governance approvals are required for custom routers due to approvals.
