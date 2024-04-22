---
order: 7
title: Role accounts
---

Pool management involves setting certain parameters such as `staticSwapFee` and `poolCreatorFee`. Pools can be paused or unpaused based on the role assigned during pool registration. The permissions for these actions are determined by the arguments passed during pool registration, specifically through a `PoolRoleAccounts` struct.

```solidity
struct PoolRoleAccounts {
    address pauseManager;
    address swapFeeManager;
    address poolCreator;
}
```

The table below outlines the permissions for each function and if it can additionally be delegated to Balancer governance.

| Function                      | onlyOwner | example Address passed   | also delegated to governance          |
| --------                      | --------  | --------                 | --------                              |
| pausePool                     | false     | address(0xexample)       | yes                                   |
| unpausePool                   | false     | address(0xexample)       | yes                                   |
| unpausePool                   | false     | address(0)               | yes                                   |
| setStaticSwapFeePercentage    | true      | address(0xexample)       | no                                    |
| setStaticSwapFeePercentage    | true      | address(0)               | yes                                   |
| setPoolCreatorFeePercentage   | true      | address(0xexample)       | no                                    |

Functions marked with `onlyOwner:false` will, by default, also allow Balancer governance to call them. For functions marked with `onlyOwner:true`, if an address that is not the zero address is passed, only the passed address will have permission to call the function.
