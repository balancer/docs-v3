---
title: ERC20MultiToken
order: 2
---

# ERC20MultiToken

ERC20MultiToken was inspired by [ERC1155](https://docs.openzeppelin.com/contracts/3.x/erc1155), but customized for Balancer v3.
At a high level, it allows the [Balancer Vault](/concepts/vault) full control over Balancer Pool Token (BPT) accounting, enabling it to both mint and burn BPT directly.
By centralizing both token and BPT accounting in the vault, Balancer v3 ensures atomic updates to critical pool state. In contrast to ERC1155, ERC20MultiToken allows
Balancer Pool Tokens to be fully ERC20-compliant, supporting composability.

The full implementation of ERC20MultiToken can be found [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/token/ERC20MultiToken.sol).

The snippet below presents the storage variables implemented in ERC20MultiToken. We can see that each variable has a top level mapping that is indexed on the address of the token (pool):
```solidity
// Users' pool token (BPT) balances.
mapping(address token => mapping(address owner => uint256 balance)) private _balances;

// Users' pool token (BPT) allowances.
mapping(address token => mapping(address owner => mapping(address spender => uint256 allowance))) private _allowances;

// Total supply of all pool tokens (BPT). These are tokens minted and burned by the Vault.
// The Vault balances of regular pool tokens are stored in `_reservesOf`.
mapping(address token => uint256 totalSupply) private _totalSupplyOf;
```

Additionally, we can observe that each action `mint`, `burn`, `approve`, etc. Takes the pool's address as the first argument, and additionally invokes ERC20-compliant events on BalancerPoolToken.
```solidity
function _approve(address token, address owner, address spender, uint256 amount) internal {
    if (owner == address(0)) {
        revert ERC20InvalidApprover(owner);
    }
    
    if (spender == address(0)) {
        revert ERC20InvalidSpender(spender);
    }
    
    _allowances[token][owner][spender] = amount;
    
    emit Approval(token, owner, spender, amount);
    // We also emit the "approve" event on the pool token to ensure full compliance with ERC20 standards.

    BalancerPoolToken(token).emitApproval(owner, spender, amount);
}
```

## Where is the public interface?

You'll notice that [ERC20MultiToken.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/token/ERC20MultiToken.sol) contains only internal functions.
You can find the public interface defined in [IVaultExtension.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IVaultExtension.sol#L231-L290) and implemented in [VaultExtension.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/VaultExtension.sol#L589-L630).
To ensure that the state changing public interface is always delegate-called by the vault, each function has the [onlyVaultDelegateCall](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/VaultExtension.sol#L69-L72) modifier.

```solidity
function approve(address owner, address spender, uint256 amount) external onlyVaultDelegateCall returns (bool) {
    _approve(msg.sender, owner, spender, amount);
    return true;
}
```

## How is ERC20 compliance achieved?

ERC20MultiToken leverages the relationship between the Balancer vault and its pools to ensure that all pool tokens (BPT) are fully ERC20-compliant.
For a detailed discussion on how this is achieved, refer to the [BalancerPoolToken](/concepts/core-concepts/balancer-pool-tokens.html) section in the docs, or go directly to the
implementation [here](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/BalancerPoolToken.sol).
