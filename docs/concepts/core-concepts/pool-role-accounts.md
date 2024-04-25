---
order: 7
title: Pool Role accounts
---

# Pool Role permissions

Managing a pool requires the user to initially set certain parameters such as `staticSwapFee` and `poolCreatorFee` during the pool registration process. Additionally, pools can be set to a paused or unpaused state. Balancer governs these permissions using `PoolRoleAccounts` and an internally managed `onlyOwner` setting. In this context, [`onlyOwner`]((https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/VaultExtension.sol#L269)) determines whether permissions for that function will be additionally delegated to Balancer governance or not. It's important to note that `PoolRoleAccounts` are immutable and must be defined by the user at the time of pool registration.

```solidity
struct PoolRoleAccounts {
    address pauseManager;
    address swapFeeManager;
    address poolCreator;
}
```

The table below outlines the permissions for each function and if it can additionally be delegated to Balancer governance. Functions marked with `onlyOwner:false` will, by default, also allow Balancer governance to call them. For functions marked with `onlyOwner:true`, if an address that is not the zero address is passed, only the passed address will have permission to call the function.

| Function                      | onlyOwner | example Address passed   | also delegated to governance          |
| --------                      | --------  | --------                 | --------                              |
| pausePool                     | false     | address(0xexample)       | yes                                   |
| unpausePool                   | false     | address(0xexample)       | yes                                   |
| unpausePool                   | false     | address(0)               | yes                                   |
| setStaticSwapFeePercentage    | true      | address(0xexample)       | no                                    |
| setStaticSwapFeePercentage    | true      | address(0)               | yes                                   |
| setPoolCreatorFeePercentage   | true      | address(0xexample)       | no                                    |

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>
