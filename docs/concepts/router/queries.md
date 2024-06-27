# Query Functions

## Overview

Queries provide the ability to simulate an operation and find its result without executing a transaction. [Balancer Routers](./overview.md#balancer-routers) provide a query for all state changing liquidity operations. An example of how this is useful can be seen when [setting slippage limits](../../integration-guides/guides/add-liquidity-to-pool.md#queries-and-safely-setting-slippage-limits).

## Router queries
The detailed Router API description can be found in the [Router API section](/concepts/router/onchain-api/router-api.html).

- `queryAddLiquidityUnbalanced`
- `queryAddLiquiditySingleTokenExactOut`
- `queryAddLiquidityCustom`
- `queryRemoveLiquidityProportional`
- `queryRemoveLiquiditySingleTokenExactIn`
- `queryRemoveLiquiditySingleTokenExactOut`
- `queryRemoveLiquidityCustom`
- `queryRemoveLiquidityCustom`
- `querySwapSingleTokenExactIn`
- `querySwapSingleTokenExactOut`
- `querySwapExactIn`
- `querySwapExactOut`

## Batch Router queries
The detailed Router API description can be found in the [Batch Router API section](/concepts/router/onchain-api/batch-router-api.html).

- `querySwapExactIn`
- `querySwapExactOut`

## Complex queries

The Router and Batch Router are primarily used as entrypoints for standard queries. However, Balancer's design allows for a more flexible querying mechanism. Any Vault operation that includes a `onlyWhenUnlocked` modifier can be queried natively.

### Quote
This is facilitated through a `quote` mechanism. The concept of Transient Accounting enables the querying of complex Vault operations. To execute a query, the Router invokes the `quote` function on the Vault.

The Vault mandates that any invocation of quote is executed as a staticcall within an offchain eth_call (ensured by the `query` modifier). Within the quote context, the Router has the flexibility to carry out a series of complex actions without the need to settle any debt.

### quoteAndRevert

Since `quote` changes the Vault state some queries combination are not possible. For example if you wanted to quote `querySwapExactIn` for POOL_A but also `querySwapExactOut` for POOL_A in it's initial state you have to use `quoteAndRevert` where the call always reverts and returns the result in the revert reason.