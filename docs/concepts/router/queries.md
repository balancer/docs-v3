# Query Functions

## Overview

Queries provide the ability to simulate an operation and find its result without executing a transaction. [Balancer Routers](./overview.md#balancer-routers) provide a query for all state changing liquidity operations. An example of how this is useful can be seen when [setting slippage limits](/integration-guides/add-liquidity/sdk-tutorial.html#query-add-liquidity).

::: info
queries are expected to be call offchain as they cannot be called onchain.
:::

## Router queries

The detailed Router API description can be found in the [Router API section](/developer-reference/contracts/router-api.html).

- `queryAddLiquidityProportional`
- `queryAddLiquidityUnbalanced`
- `queryAddLiquiditySingleTokenExactOut`
- `queryAddLiquidityCustom`
- `queryRemoveLiquidityProportional`
- `queryRemoveLiquiditySingleTokenExactIn`
- `queryRemoveLiquiditySingleTokenExactOut`
- `queryRemoveLiquidityCustom`
- `queryRemoveLiquidityRecovery`
- `querySwapSingleTokenExactIn`
- `querySwapSingleTokenExactOut`

## Batch Router queries

The detailed Router API description can be found in the [Batch Router API section](/developer-reference/contracts/batch-router-api.html).

- `querySwapExactIn`
- `querySwapExactOut`

## Buffer Router queries

The detailed Buffer Router API description can be found in the [Buffer Router API section](/developer-reference/contracts/buffer-router-api.html).

- `queryInitializeBuffer`
- `queryAddLiquidityToBuffer`
- `queryRemoveLiquidityToBuffer`

## Composite Liquidity Router queries

The detailed Router API description can be found in the [Composite Liquidity Router API section](/developer-reference/contracts/composite-liquidity-router-api.html).

- `queryAddLiquidityUnbalancedToERC4626Pool`
- `queryAddLiquidityProportionalToERC4626Pool`
- `queryRemoveLiquidityProportionalFromERC4626Pool`
- `queryAddLiquidityUnbalancedNestedPool`
- `queryRemoveLiquidityProportionalNestedPool`

## Complex queries

The Router contracts are primarily used as entrypoints for standard queries. However, Balancer's design allows for a more flexible querying mechanism. Any Vault operation that includes a `onlyWhenUnlocked` modifier can be queried natively.

### Quote

This is facilitated through a `quote` mechanism. The concept of Transient Accounting enables the querying of complex Vault operations. To execute a query, the Router invokes the `quote` function on the Vault.

The Vault requires that any invocation of `quote` be executed as a staticcall (ensured by the `query` modifier). Within the quote context, the Router has the flexibility to carry out a series of complex actions without the need to settle any debt.

### quoteAndRevert

Since `quote` changes the Vault state some query combinations are not possible. For example, if you wanted to quote `querySwapExactIn` for POOL_A but also `querySwapExactOut` for POOL_A in its initial state, you would have to use `quoteAndRevert`. In this variant, the call always reverts and returns the result in the revert data (similar to the v2 mechanism).
