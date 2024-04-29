---
order: 7
title: Pool Role Accounts
---

# Pool Role Permissions

During pool registration `PoolRoleAccounts` are immutably set. These addresses have permission to change certain pool settings:

```solidity
struct PoolRoleAccounts {
    address pauseManager;
    address swapFeeManager;
    address poolCreator;
}
```

* pauseManager: Can see Pool paused/unpaused. When a pool is paused all state-changing operations will revert, and putting the pool in recovery mode (if not already done) becomes permissionless
* swapFeeManager: Set static swap fees for a pool
* poolCreator: Set the [pool creator fee](./pool-creator-fee.md)

Passing the zero address grants Balancer Governance permission by default.

::: info Pause Permission
Balancer Governance is always granted pauseManager permission as well as any user configure address.
:::
