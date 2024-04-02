---
order: 3
title: BalancerPoolToken (BPT)
---
# BalancerPoolToken


The BalancerPoolToken contract complies with the ERC20 token standard by implementing the required methods and properties of an ERC20 token. **However, instead of managing the state of the token itself, it delegates these responsibilities to the Vault contract, which is an instance of [ERC20MultiToken](../vault/features/erc20-multi-token.md).** This is done to centralize the accounting and management of the tokens, ensuring atomic updates to critical pool state. 

Here's how the `BalancerPoolToken` contract achieves this:

Inheritance: The `BalancerPoolToken` contract also inherits from `IERC20`, `IERC20Metadata` and `IERC20Permit`. This means it has all the methods and properties required by the ERC20 standard.

- Delegation: The BalancerPoolToken contract doesn't manage the token state itself. Instead, it delegates this responsibility to the Vault contract. For example, the totalSupply, balanceOf, transfer, allowance, approve, and transferFrom methods all call the corresponding methods on the Vault contract.

- ERC20 Events: The BalancerPoolToken contract emits the Transfer and Approval events, which are required by the ERC20 standard. These events are emitted in the emitTransfer and emitApproval methods, which can only be called by the Vault contract on the pool contract.

- ERC20Permit: The BalancerPoolToken contract also implements the ERC20 Permit extension, which allows approvals to be made via signatures. This is done in the permit method, which again delegates the approval to the Vault contract.

By doing this, the BalancerPoolToken contract ensures that Balancer Pool Tokens (BPTs) are fully ERC20 compliant, while also allowing the Vault contract to have full control over BPT accounting. This design ensures atomic updates to critical pool state and supports composability, which is crucial for integration with other DeFi protocols.

