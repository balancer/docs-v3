---
order: 1
title: Technical description
---

# Router

A Router is the required contract to facilitate user interactions with the Balancer V3 Vault. A Router acts as the default entrypoint for user operations and provides the required API to facilitate the user operations & queries. It can be extended with arbitrary logic which can enhance the specific usecase at hand when interacting with Balancer.

:::info
This section is a technical deep dive into how the Router - Vault interactions work. If you are looking to integrate against the Router, take a look at the [API docs](./overview.md);
:::

## Router design

The router is designed to closely interact with the Vault. Some advantages are that a user interacting with the Router has access to simplified function signatures (names & parameter types) allowing clear understanding of the function to be called. Complex user-interactions can be aggregated at the Router level and exposed via single functions rather than custom contracts needing to be built to serve these complex user-interactions. Also since user approvals are given to the Vault only once, a Router can be exchanged in case additions are required as it uses built-in functions in the Vault to settle the debt. 


 Whenever a user operation is done on the Vault a set of operations are executed. 


1. It `invoke`s the Vault, allowing access to protected Vault functions
2. Execute the respective Callback function the Vault calls on the Router
-  Call the Vault's respective primitive (swap, add- or remove liquidity)
-  Execute arbitrary logic required for the user operation
5. Settle outstanding debt, the vault attributed to the Router during step 2

### Sequence of interactions
The Router and Vault interact in a back and forth manner to achieve the intended outcome of liquidity or query operations.
![Router Vault interaction](/images/router-vault.png)


Interacting with the Router returns the expect amountsIn/amountsOut & facilitates the interactions with the Balancer V3 Vault. The Router also exposes the Vault's primitives (swap, addLiquidity & removeLiquidity) as query functions. 


### Vault invocation


The Router calling the Vault's `invoke` function places the Router in a temporarily list of allowed callers, so called `handlers`. Only these `handlers` are allowed to interact with the Vault's functions that handle token accounting. This triggers the functions `transient` modifier, enabling the transaction to be executed in a transient accounting context, allowing great flexibility with the Vault's token balances only to be settled at the end.

### Callback execution

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
While the Vault's core primitives accrue either debt & or credit (as part of the logic defined in pools), the Router's callback has this possibility as optional. Regardless of usage all debts & credits need to be settled at the end of the transaction otherwise the transaction [reverts](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/Vault.sol#L83) because the `_accountDelta` has not been cleared.

## Router Queries
Querying user-operations execute the Vaults primitives but instead of setting debt/credit the query functions simply return the `amountsCalculated`. However only valid calls succeed as the `transient` modifier ensures balance changes within the Vault are settled
Action: Verify this with Juani where transient is being executed as part of a quote

Instead of calling `invoke` on the Vault, the Router calls `quote` on the Vault. This modifier ensures that it is a `staticcall` as in an offchain eth_call.
All operations with the `withHandler` modifier can be queried. 

:::info
It is not possible to use queries as part of `view` functions onchain as the used Vault operations does state changes and would revert with `EvmError: StateChangeDuringStaticCall`. These scenarios are prohibited by the `query` modifier which requires the `tx.origin` to equal `address(0)`. This is the case if called in an offchain context.
:::

## Custom Router
Action: verify if what governance approvals are required for custom routers due to approvals.
