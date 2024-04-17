# Query Functions

## Overview

Performing queries allows anyone to know the result of an operation by performing a static call before executing a transaction. This makes results from operations more accessible and simpler to fetch. Each query performs the same calculations as their state-changing counterpart. Meaning for example, the outcome of `querySwapSingleTokenExactIn` and `swapSingleTokenExactIn` is identical as the Vault & pool do the identical calculations. All state changing liquidity operations are available as queries. This includes:

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

The Router and Batch Router are primarily used as entrypoints for standard queries. However, Balancer's design allows for a more flexible querying mechanism. Any Vault operation that includes a `withLocker` modifier can be queried natively. This is facilitated through a `quote` mechanism.

The concept of Transient Accounting enables the querying of complex Vault operations. To execute a query, the Router invokes the `quote` function on the Vault.

The Vault mandates that any invocation of quote is executed as a staticcall within an offchain eth_call (ensured by the `query` modifier). Within the quote context, the Router has the flexibility to carry out a series of complex actions without the need to settle any debt.