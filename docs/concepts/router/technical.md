---
order: 1
title: Technical description
---

# Router
A smart contract is required to facilitate user interactions with Balancer due to the callback execution flow in the Vault. Balancer provides these smart contracts in the form of trusted Routers. It is important to note that any third party can create custom Routers to interact with the Vault. **These Routers offer the suggested API to facilitate user operations & queries**. The Router functionality developed by Balancer Labs cannot be extended but new smart contracts in the form of Routers can be developed.

:::info
This section is a technical explainer of how the Router works. If you are looking to integrate with the Router, take a look at the [API docs](./overview.md).
:::

## Router design

The Router is engineered to have a close interaction with the Balancer Vault and is the suggested way of interacting as it acts as the primary interface for common user interactions and makes interacting with Balancer easier. It provides simplified function signatures, including names and parameter types, which contribute to concise function naming. The Router is capable of aggregating complex user interactions and exposing them through single functions.

### Sequence Diagram
The Router and Vault interact in a back and forth manner to achieve the intended outcome of liquidity or query operations.
![Router Vault interaction](/images/router-vault.png)

Every user interaction going through the Router follows the same pattern of execution flow. The elegance of `invoke` wrapping the transaction in a Vault context is further explained in the [transient accounting](../vault/features/transient-accounting.md) section

1. The Router calls `invoke` on the Vault, allowing access to protected state-changing functions that perform token [accounting](../vault/features/transient-accounting.md) by triggering the `transient` modifier. This pushes the current caller on a list of `handlers` where only one handler is allowed to interact at any given moment to ensure no operations are overlapping. You can think of this step as the Router opening a tab with the Vault and any operation on the Vault will attribute to that tab.
2. The Router executes a callback function (ie: `swapCallback`) which calls the Vault's primitives (ie: `swap`). These operations add debt or credit to the handler's tab with the Vault. 
3. To finalize the user operation, the Router needs to settle outstanding debt which the Vault attributed to the Router during the execution of `swap`. If debt & credit is not settled, the transaction will revert. This step closes out the tab opened with the Vault in step 1.

## Router Queries

[Transient Accounting]() allows complex Vault operations to be queryable. To perform a query, the Router calls `quote` on the Vault.
The vault enforces that any call to `quote` is performed as a `staticcall` made in an offchain `eth_call`. Inside of the `quote` context,
the Router is allowed to perform any set of complex actions without settling debt.


## Trusted Routers

A Trusted Router has access to the allowances users have granted the Vault. This allows for a reduction in the number of token transfers for each operation from user -> Router -> Vault to user -> Vault. While any smart contract can work as a Router and settle debt via `vault.settle`, Trusted Routers can settle debt via `vault.retrieve`.