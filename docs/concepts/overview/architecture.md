---
title: Architecture
order: 30
---

# Architecture

- Excalidraw image of the Protocol architecture
- Reason why certain design decisions have been taken
- Diagrams of increasing complexity. Simple architecture of all components and their one main function
- Add new smart contract components to diagram (either inheritance, authorisation, factories at a later stage.).

The Balancer protocol architecture is based on three main components, which serve a unique purpose in making Balancer flexible while drastically reducing complexity of pool code. Each liquidity pool is a separate contract but token balances are tracked at the Vault level. 

- Router: Entrypoint for user operations with simple interfaces
- Vault: Handle liquidity operations and accounting
- Pool: Expose pool math via invariant calculations

## Overview
The diagram shows the core components making up Balancer and their sequence of interactions including the main goal of each interaction.

![Router Vault interaction](/images/architecture-1.png)

1. The [Router]() serves as the initial point of interaction with Balancer. It provides a user-friendly interface for Balancer functions and abstracts away direct interactions with the Vault.

2. The Router establishes a Transactional Accounting Balance (TAB) with the [Vault](). This TAB records all tokens expected to be deposited and withdrawn during operations such as adding and removing liquidity, swaps, and additional liquidity operations like flash loans.

3. The initial core Vault operation selected by the user (such as swap, add liquidity, or remove liquidity) necessitates the execution of mathematical operations. These operations are defined in the [pool]() contract and calculate the required number of tokens to be deposited or withdrawn, depending on the vault operation used. The behavior of these operations is determined by the specific mathematical model employed by the pool, such as a StablePool or Weighted Pool.

4. Once the required token amounts have been calculated, these amounts are recorded as either credit or debt in the Vault. The amount of Balancer Pool Tokens (bpt) to be minted or burned is also determined.

5. To maintain accurate accounting and ensure the Vault's token balances align with internal accounting, the Router's accrued credit and/or debt must be settled, resulting in a evened out change.

6. In the final step, the Vault verifies that the Router has correctly settled its accrued debts and credits. The transaction will only succeed if the debts and credits have been accurately settled; otherwise, it will be reverted.

## Detailed overview

![Detailed Router Vault interaction](/images/architecture-2.png)

1. The Balancer Router is the primary interface for interacting with Balancer. It offers a user-friendly way to access Balancer functions and simplifies the process by managing direct interactions with the Vault. Any smart contract can function as a Router.

2. The Router invokes the Vault's `invoke` method and is added to a list of `_handlers`. These handlers are assigned either debt or credit as part of the ongoing transaction. The entries on this Transactional Accounting Balance (TAB) are stored in transient storage, allowing them to reenter the vault (as part of a hook operation) if required.

3. With the TAB open, the Vault calls back into the Router's specific action callback implementation (for example, swapCallback for a swap action) to continue the regular transaction flow.

4. Since the Router has previously invoked the Vault, it is now authorized to call the Vault's functions that require the caller to be in the _handlers list. This ensures proper assignment of debt and credit. The function inputs from step (1) are now used to call the Vault's core functions like swap.

5. Each Vault primitive results in either the pool's `computeInvariant` or `computeBalance` being called. This determines the tokens needed to be deposited into and withdrawn from the vault. These results are attributed to the Router's debt and credit that must be eventually settled. The simplicity of the pool's code positions Balancer favorably for custom pool development.

6. Pools have various hook capabilities that can be used throughout the pool's lifecycle. These hooks can be executed before and/or after a pool operation, depending on the pool's configuration at deployment. Hooks provide a high level of customization to achieve desired outcomes.

4* With the TAB entries for the Router made by the Vault, the execution flow is passed to the Router.

7. The Router is responsible for settling the remaining debt and credit, which must be done for the transaction to succeed. If ETH or WETH is to be used in the transaction, the Router wraps or unwraps Ether as the final step.

8. The last step is to verify that all credit and debt accrued during the operation has been settled for all `_handlers`. The transient state (TAB) is closed, and if all conditions are met, the transaction succeeds.


### Router API
The [Router API](/concepts/Router/overview.md)



## Router
The design for the Router has been chosen to 

## Vault

## Pool

## Optional

- Excalidraw components of how all Balancer components enable a frontend-trade?
- Recipient/Target group of every component?

## Execution flow
## Execution Flow

The main entrypoint to Balancer for a user is the Router. The call to the Router gets routed to the Vault and then the pool, which executes the swap logic implemented by the developer. The required functions of a custom pool depending use can be seen in the table below.

transfer it to a sequence diagram

| Router                               | VaultCase                                    | Poolfunction              |
| ------------------------------------ | -------------------------------------------- | -----------------------   |
| `initialize`                         | `initialize             `                    | `computeInvariant`    |
| `addLiquidityCustom`                 | `AddLiquidityKind.CUSTOM`                    | `onAddLiquidityCustom`    |
| `addLiquidityUnbalanced `            | `AddLiquidityKind.UNBALANCED`                | `computeInvariant`        |
| `addLiquiditySingleTokenExactOut`    | `AddLiquidityKind.SINGLE_TOKEN_EXACT_OUT`    | `computeBalance`          |
| `removeLiquidityProportional`        | `RemoveLiquidityKind.PROPORTIONAL`           |                           |
| `removeLiquiditySingleTokenExactIn`  | `RemoveLiquidityKind.SINGLE_TOKEN_EXACT_IN`  | `computeBalance`          |
| `removeLiquiditySingleTokenExactOut` | `RemoveLiquidityKind.SINGLE_TOKEN_EXACT_OUT` | `computeInvariant`        |
| `removeLiquidityCustom`              | `RemoveLiquidityKind.CUSTOM`                 | `onRemoveLiquidityCustom` |
| `swapExactIn`                        | `SwapKind.GIVEN_IN`                          | `onSwap`                  |
| `swapExactOut`                       | `SwapKind.GIVEN_OUT`                         | `onSwap`                  |
