---
order: 1
title: Token Approvals
---

::: info Using the Balancer SDK?
You usually do not need to build these approvals by hand. The SDK generates Permit2 and permit signatures for you through `Permit2Helper` with `buildCallWithPermit2` for adds and swaps, and through `PermitHelper` with `buildCallWithPermit` for removes. See the [SDK API](/developer-reference/sdk/API.md) and the [add liquidity](/integration-guides/add-liquidity/sdk-tutorial.md) and [remove liquidity](/integration-guides/remove-liquidity/sdk-tutorial.md) tutorials.
:::

In Balancer v3, the Vault holds all tokens and performs the accounting, while users interact through stateless [Routers](./overview.md). Because a router moves your tokens into the Vault on your behalf, it needs authorization to do so. The required authorization depends on the router and the operation: adding liquidity and the input side of a swap use Permit2, while removing liquidity uses a standard pool-token approval. Read-only `query` functions do not need authorization.

## Two kinds of routers

Balancer routers fall into two categories, based on who calls them and how tokens are transferred.

**Retail routers** are designed for externally owned accounts (EOAs), including typical users interacting through the Balancer SDK or UI. An EOA holds its own tokens, but it cannot run custom code to transfer tokens mid-transaction, so the router uses Permit2 to move the tokens from the account into the Vault during the operation. These routers include the Basic Router, Batch Router, Buffer Router, Composite Liquidity Router, and Add Unbalanced Via Swap Router.

**Aggregator routers** are designed for contract callers that already hold the input tokens and can move them as part of their own execution flow, such as DEX aggregators, solvers, smart wallets, and EIP-7702 accounts. Instead of approving a router to pull tokens, the caller sends the input tokens to the Vault up front. The router then settles that payment through the Vault's settlement accounting. This prepaid path is cheaper and avoids token approvals. These routers are the Aggregator Router and Aggregator Batch Router.

Most integrations use the retail Permit2 flow described next. The prepaid model is covered under [Aggregator routers](#aggregator-routers-the-prepaid-model).

## Retail routers: Permit2

Routers are stateless and may be added or replaced over time. That creates a router approval problem: approving each new router individually is repetitive, and costly where gas is expensive. Permit2, Uniswap's canonical approval contract, solves this by sitting between your tokens and the routers. You approve Permit2 once per token. From there, Permit2 can grant any router a narrow, expiring allowance, so the protocol can ship new router versions without requiring users to redo token approvals.

Balancer v3 adopted Permit2 for this reason, and because users who have already approved Permit2 for another protocol can start using Balancer without additional approvals. Balancer v2 reached a similar goal differently: it had no routers, so users approved the Vault directly, with relayers covering operations that needed third-party transfers.

Permit2 is deployed at the same address on every supported chain. It holds a single ERC20 approval per token and then issues per-spender, time-bound allowances, either on-chain or by signature. This lets you authorize a specific router for a specific amount and time without giving that router a direct token allowance.

Adding liquidity, or supplying the input token for a swap, through a retail router requires two approvals:

1. **Approve Permit2 on the token one time.** Call `approve` on the ERC20 token with the Permit2 contract as the spender. This is the only broad allowance you grant, and you do it once per token. Permit2 then controls how much any router can pull.
2. **Authorize the router through Permit2.** Authorize the specific router as a spender in Permit2, either with an on-chain `approve(token, router, amount, expiration)` call on Permit2 or with an off-chain Permit2 signature that the router consumes during execution.

During the operation, the router calls Permit2 to transfer the tokens directly from your account into the Vault, then calls the Vault to settle the payment. The tokens move straight from you to the Vault; they never pass through the router. You do not approve the Vault directly, and you do not give the router a direct allowance for input tokens.

### permitBatchAndCall: approvals and the operation in one transaction

Retail routers expose `permitBatchAndCall` so approvals and the operation itself can be bundled into a single transaction. It takes a batch of EIP-2612 `permit` signatures, a Permit2 batch signature, and a list of encoded router calls. It applies the permits first, then runs the calls as a `multicall`.

For compatible tokens, the EIP-2612 permits can grant Permit2 an allowance and can approve the router to spend pool tokens for removals. That lets a user go from no existing approvals to a completed operation without sending any separate approval transactions. The [Balancer SDK](/developer-reference/sdk/API.md) assembles these calls for you. See the [Router API](/developer-reference/contracts/router-api.md) for the exact signature.

### Routers that use Permit2

Every retail router takes a Permit2 address and moves tokens into the Vault through Permit2 in the same way. This applies to the Basic Router, Batch Router, Buffer Router, Composite Liquidity Router, and Add Unbalanced Via Swap Router. The Add Unbalanced Via Swap Router is a specialized helper for adding unbalanced liquidity to pools that only allow proportional adds, such as AutoRange pools.

The `permitBatchAndCall` and `multicall` helpers are available on all retail routers. See the [Router overview](./overview.md) for what each router does, and the [deployment addresses](/developer-reference/contracts/deployment-addresses/mainnet.md) for current addresses.

## Removing liquidity: approving BPT

Removing liquidity works differently because it burns your pool tokens (BPT) rather than spending an input token. Instead of a Permit2 allowance, the router needs permission to spend your BPT. Balancer Pool Tokens are ERC20 tokens that implement EIP-2612, so you can grant that permission either with a standard `approve` call on the pool or with an off-chain `permit` signature that names the router as the spender.

The Vault spends the allowance when it burns the BPT. A maximum (`type(uint256).max`) allowance is treated as unlimited and is not reduced. This is a direct approval of the router and does not go through Permit2.

## Queries require no approvals

The [`query` variants](./queries.md) of add, remove, and swap operations simulate the result against current on-chain state without moving tokens or burning BPT. They require no approvals, no Permit2 setup, and no token or pool-token balance. This lets a front end quote an operation and set slippage before the user holds the tokens or grants any allowance. Authorization is only required for the state-changing call.

## Aggregator routers: the prepaid model

The Aggregator Router and Aggregator Batch Router are intended for contract callers that already hold the input tokens, such as aggregators, solvers, and smart wallets. For these callers, there is little benefit to adding a Permit2 approval step.

Instead of pulling tokens, these routers expect the input tokens to already be in the Vault when the swap executes. The caller transfers the tokens to the Vault within the same transaction, and the router settles that payment. No token approvals or Permit2 signatures are involved, which also saves gas.

Because there is nothing to approve, these routers do not offer the `permitBatchAndCall` or `multicall` helpers. The Vault's settlement accounting guarantees that the prepayment covers the swap. For function references, see the [Aggregator Router](/developer-reference/contracts/aggregator-router-api.md) and [Aggregator Batch Router](/developer-reference/contracts/aggregator-batch-router-api.md) API pages, and the [aggregator guides](/integration-guides/aggregators/introduction.md) for integration details.

## Best practices

- Approve only the router you intend to use, and prefer limited, expiring Permit2 allowances over unlimited standing approvals.
- Favor signatures, both Permit2 and EIP-2612, over long-lived on-chain allowances, and revoke allowances you no longer need.
- Keep the one-time ERC20 approval of Permit2 as your only broad allowance; Permit2 then limits how much any individual router can move on your behalf.

For router-building security considerations, see [Existing Routers](/build/build-a-router/existing-routers.md#security-considerations).
