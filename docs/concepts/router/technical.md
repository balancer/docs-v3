---
order: 1
title: Technical description
---

:::info
This section is a technical explainer of how the Router works. If you are looking to integrate with the Router, take a look at the [API docs](./overview.md).
:::

## Example Transaction Flow
The Router and Vault interact in a back and forth manner to achieve the intended outcome of liquidity or query operations.
![Router Vault interaction](/images/router-vault.png)

Every user interaction going through the Router follows the same pattern of execution flow. The elegance of `unlock` wrapping the transaction in a Vault context is further explained in the [transient accounting](../vault/transient-accounting.md) section

1. The Router calls `unlock` on the Vault, allowing access to protected state-changing functions that perform token [accounting](../vault/transient-accounting.md) by triggering the `transient` modifier. You can think of this step as the Router opening a tab with the Vault and any operation on the Vault will attribute to that tab.
2. The Router executes a hook function (ie: `swapSingleTokenHook`) which calls the Vault's primitives (ie: `swap`). These operations add debt or credit tab the Vault manages. 
3. To finalize the user operation, the outstanding debts & credits need to be settled, which was accrued during `swap`. In the case of the Balancer Router, the Router is the account settling the debt. If debt & credit is not settled, the transaction will revert. This step closes out the tab opened with the Vault in step 1.

