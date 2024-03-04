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
