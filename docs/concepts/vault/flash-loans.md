---
title: Flash Loans
order: 12
---
# Introduction

Flash loans in Balancer V3 allow users to borrow assets without collateral, as long as the borrowed amount is repaid within the same transaction. This page explains the logic behind executing a flash loan and settling it correctly using the Balancer V3 Vault.

# Prerequisites

- Basic understanding of Solidity and smart contract development.
- Familiarity with ERC20 token approvals and transfers.
- Knowledge of Balancer V3's Vault architecture.

# Flash Loan Process

1. **Unlocking the Vault:** Flash loans in Balancer V3 operate within a transient unlocked state, where the Vault grants temporary access to funds.
2. **Receiving Funds:** The requested asset is transferred to the borrower contract.
3. **Executing Transactions:** The borrower contract can use the funds for any logic, such as liquidations, lending, or arbitrage.
4. **Repaying the Loan:** The borrowed amount must be returned before the transaction ends.
5. **Settling with the Vault:** The contract ensures that the Vault registers the repayment and completes the process.

# Example Contract Implementation

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import { IVaultMain } from "./IVaultMain.sol";

contract BalancerFlashLoan {
    IVaultMain public immutable balancerVault;
    address public immutable loanToken;
    address public owner;

    constructor(address _balancerVault, address _loanToken) {
        balancerVault = IVaultMain(_balancerVault);
        loanToken = _loanToken;
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    function executeFlashLoan(uint256 amount) external onlyOwner {
        // Prepare calldata for the vault callback
        bytes memory userData = abi.encode(amount);
        balancerVault.unlock(abi.encodeWithSelector(this.receiveFlashLoan.selector, userData));
    }

    function receiveFlashLoan(bytes memory userData) external {
        require(msg.sender == address(balancerVault), "Unauthorized callback");

        // Decode flash loan amount
        uint256 amount = abi.decode(userData, (uint256));

        // Send some tokens from the vault to this contract (taking a flash loan)
        balancerVault.sendTo(IERC20(loanToken), address(this), amount);

        // Execute any logic with the borrowed funds (e.g., arbitrage, liquidation, etc.)

        // Repay the loan
        IERC20(loanToken).transfer(address(balancerVault), amount);
        
        // Settle the repayment
        balancerVault.settle(IERC20(loanToken), amount);
    }
}
```

:::info
Key Considerations when using Flash Loans:
- Ensure Approval: If interacting with other contracts, ensure the Balancer Vault has sufficient token allowance.
- Transaction Atomicity: The entire flash loan execution and repayment must occur within the same transaction.
- Settlement Accuracy: The `settle()` function is required to inform the Vault that the borrowed funds have been repaid and to settle the balances.
:::

