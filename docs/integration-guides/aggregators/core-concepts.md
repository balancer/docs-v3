---
order: 1
title: Core Concepts
---

## Core Concepts

* In the Balancer v3 architecture [Routers](/concepts/router/overview.md) serve as the pivotal interface for users (not the Vault)
  * Single swaps: [Balancer Router](/developer-reference/contracts/router-api.md)
  * Multi-hop swaps: [Batch Router](/developer-reference/contracts/batch-router-api.md)
* Because aggregators are contracts that already hold the input tokens, the recommended path is the prepaid [Aggregator Router and Aggregator Batch Router](#aggregator-routers): the caller transfers the input tokens to the Vault up front and the router settles the payment, with no token approvals required. If you instead call the retail Router or Batch Router, the sender must use Permit2 to approve the router to spend each swap input token. See [Token Approvals](/concepts/router/token-approvals.md) for both flows.
* Token amount inputs/outputs are always in the raw token scale, e.g. 1 USDC should be sent as 1000000 because it has 6 decimals
* There are two different swap kinds:
  * ExactIn: Where the user provides an exact input token amount.
  * ExactOut: Where the user provides an exact output token amount.
* There are two subsets of a swap:
  * Single Swap: A swap, tokenIn > tokenOut, using a single pool. This is the most gas efficient option for a swap of this kind.
  * Multi-path Swaps: Swaps involving multiple paths but all executed in the same transaction. Each path can have its own (or the same) tokenIn/tokenOut.
* Boosted Pools and Liquidity Buffers enable gas effective swaps through capital efficient pools (see [Boosted Pool section](./boosted-pools.md))
* Balancer v2 used the concept of poolIds, this is no longer used in v3 which always uses pool address
* Balancers new [API](/data-and-analytics/data-and-analytics/balancer-api/balancer-api.md) can be used to access pool data

## Aggregator routers

Balancer deploys prepaid variants of the swap routers specifically for contract callers such as aggregators, solvers, and smart wallets: the Aggregator Router for single swaps and the Aggregator Batch Router for multi-hop swaps. They expose the same swap functions as the retail Router and Batch Router, but instead of pulling tokens through Permit2 they expect the caller to transfer the input tokens to the Vault within the same transaction, after which the router settles that payment. This removes the approval step entirely and saves gas, and the Vault's settlement accounting guarantees the prepayment covers the swap. See [Token Approvals](/concepts/router/token-approvals.md) for how the prepaid and Permit2 models compare, and the [Aggregator Router](/developer-reference/contracts/aggregator-router-api.md) and [Aggregator Batch Router](/developer-reference/contracts/aggregator-batch-router-api.md) API pages for the functions.