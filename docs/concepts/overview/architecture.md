---
title: Architecture
order: 30
---

# Architecture

- Excalidraw image of the Protocol architecture
- Reason why certain design decisions have been taken
- Diagrams of increasing complexity. Simple architecture of all components and their one main function
- Add new smart contract components to diagram (either inheritance, authorisation, factories at a later stage.).

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
