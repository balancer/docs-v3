---
order: 5
title: Pool Role Accounts
---

# Pool Role Permissions

During pool registration `PoolRoleAccounts` are set immutably. These addresses have permission to change certain pool settings:

```solidity
struct PoolRoleAccounts {
    address pauseManager;
    address swapFeeManager;
    address poolCreator;
}
```

* pauseManager: Can pause or unpause a pool. When a pool is paused, all state-changing operations will revert, and putting the pool in recovery mode (if not already done) becomes permissionless
* swapFeeManager: Can set static swap fees for a pool
* poolCreator: Can set the [pool creator fee](./pool-creator-fee.md)

Passing the zero address grants Balancer Governance permission by default.

::: info Pause Permission
Balancer Governance can always pause/unpause pools, even if there is a pause manager. However, governance cannot set swap fees if there is a swap manager, or pool creator fees if there is a pool creator.
:::
,