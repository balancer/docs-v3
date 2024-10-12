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

1. The Router calls `unlock` on the Vault, allowing access to protected state-changing functions that perform token [accounting](../vault/transient-accounting.md) by triggering the `transient` modifier. You can think of this step as the Router opening a tab with the Vault, after which any debts or credits from subsequent Vault operations accrue to that tab.
2. The Router executes a hook function (ie: `swapSingleTokenHook`) which calls the Vault's primitives (ie: `swap`). These operations incur debt or supply credit to the currently open tab. 
3. To finalize the user operation, all outstanding debts and credits accrued during `swap` need to be settled. If the tab is not settled, the transaction will revert. This settlement step (i.e., when `unlock` returns and executes the rest of the `transient` modifier) closes out the tab opened with the Vault in step 1.
