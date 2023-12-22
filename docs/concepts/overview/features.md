---
title: Features
order: 20
---

# Features

The goal of this feature section is to name the unique features of Balancer V3 and explain how these features are realized & what parts of the Balancer system enable it

## System Features

### Easier system

Much of V2s complex inheritance hierarchies have been removed as well as highly decreased use of assembly blocks. Additionally much of old pool logic has been moved to the Vault to make creation custom pools on Balancer as easy as possible. A dev needs to focus on 2 things (Callsbacks and invariant)

### Multi-token

The Vault is BPT aware & pool balances are modeled in the MultiToken format. Partially supporting the Multitoken Standard ERC1155.

### Queriable operations

The outcome of an operation can be queried instead of executed. This allowes easier consumption of function outcomes on & offchain. Querying operations will follow the same exact function signatures as executing the operation

- [current query interface](https://github.com/balancer/balancer-v3-monorepo/commit/68c5792d9c7b70178bb44470e620e3ce471e9fe7)

### Chained actions

The pool's code has been reduced in complexity to facility easier "building on balancer". In order to still deliver on uneven joins/exits, this functionality has moved to the Router contract.

### Simplification

Interfaces are not cluttered with seldom used parameters. A simple etherscan friendly interface & use intuitive naming. Pool complexity has been moved into the Vault

### Clearer Dev UX.

Balancer V2 was a complex product. In order to improve devUX certain features have been removed. Namely:

- Caches
- Asset managers
- FlashLoans
- Pool specialization
- preminted BPTs
- poolIds

### Clearer function and event names

### Focus on fungible tokens

The Vault will only support fungible BPT pools. No special use cases.

### Simplified fee calculation

Pool fee computation has been designed to work with tokenIn instead of BPT, which reduces pool code complexity and allows pool creators to much easier implement their custom pool have reducing the amount of code to be implemented

## Vault features

The Vault is at the core of Balancer V3. and much of the logic previously found in pools has been moved to the Vault. Namely:

- Accounting done in the vault (BPT mins & burns especially)
- Vault handles protocoll fees
- Vault handles recovery mode exists

### Natively yield bearing

Balancer V3 continues to build on yield bearning tokens. This is possible due to the vault's native understanding of value of wrapped token = rate \* value of main token. For example: Pools will work with wrappedStakedEther but will also expose underlying data for stakedEther. (strategy focus)

### Transient accounting

- Live: Yes
  Router calls into the Vault. Locks starting balances, allows any operation, compares balances deltas and either passes or reverts. This simplifies integrations challenges due to the non-reentrant characteristic of the V2 vault.
- Action: The reason for why this feature is desirable including some example operations should be included at launch.

### Token scaling moved to the Vault

Rate providers and token decimals changed the pool prices and was included in the pool'S code. In order to reduce complexity this has been moved to the Vault to allow easier custom pool developement.

### Live Balances

- Live: Yes
  Balancer aims to serve "yield-tokens". Part of this strategy requires exposing the "true" underlying balances as part of the pools reserves so that external clients. The live balances are either exposed via `IERC4626.convertToAssets()` or via the respective assets `rateProvider`.
- Action: Add seperate explaining this concept (includes liveBalances <-> nominalTokenBalance)

### Buffers

In order to allow pool boosting while maintaining gas efficient swapping, Buffers allow for deposits of poolTokens with the intention to facilitate the majority of the trades without needing to wrap/unwrap tokens.

### Staggered APIs for core level interactions

Tier 1:
`SwapGivenIn` & `SwapGivenOut` replace `swap` with less input params
Basic join `Join`
`sender` & `recipient` removed and assumed to be msg.sender
Tier 2:
Allows more granular operations with Balancer by allowing more function parameters. Such as JoinSwaps, ExitSwaps

Tier 3: chained operations & relayer operations

## Router features

### Custom Routers as your entrypoint

- Live: Yes
  Develop DEX interactions with Balancer exactly how you want it. Simply create a Router that implements the required callbacks + logic and. (Routers that user user's vault approvals need to be governance approved)

## pool features

Overall much of previous pool developers challenges have been moved to either the Vault or the Router so that poo developers only need to focus on 2 things:

- Focus on the invariant behaviour when designing pools
- Focus on the required callbacks to enhance your pools operations

### Invariant as the core pool math building block

- Live: Yes
  The vault expects only changes in the invariant of a pool to settle in/outs. This gives developers great flexibility to implement custom math without much compleity.

### Pool complexity & interactions reduced to minimum viable interaction points

- Live: Yes
  Balancer pools support joins, exits, swaps, batchSwaps. Uneven joins/exits are moved to the Router contract and modeled as separate swap & even join. This is useful to reduce pool complexity

### Callbacks

- Live: Yes
  Balancer pools ship with Callbacks. Any pool factory can deploy pools with custom callbacks allowing pool developers to add their own pool behaviour. The design space here is endless. A simple example could be:
- A Callback that only allows the pool to trade during certain daytime.
- A Callback that implements price oracles to fetch timeweighted average prices of pool assets
- A Callback that interacts with an external system on swaps whenever certain trade size criteria is met

### Increased pool safeguarding

Pools need to be explicitly initialized and require a minimum balances to limit the attack surface. Making Balancer pools a great choice to build pools with.

### E-CLP pools

This section needs an explanation how all custom pools (Twamm, eclps) mint BPT based on invariant changes so that the system behind it can be conveyed rather than the concrete pool idea.

### TWAMM functionality

- Live: No
  Many pools have added TWAMM functionality to allow LPs to slowly switch tokens over a defined amount of time, with a set size and a defined slippage. Namely a user can set the following parameters:
- `size`
- `duration`
- `slippage`

### Pool boosts

- Live: No
  Many pools have added boosting capability, allowing the LP to get additional exposure to underlying lending protocols such as Aave.

### Auctionable pool fee setting

- Live: No
  The auctionability of pool fees for `address` allows Aggregators to capture MEV and pay to forward to LPs

### Pool nesting

Balancer V2 has seen great examples of pool nesting. V3 continues with that and

### low pool fee grace period

grace period for protocol fees to allow bootstrapping of pool TVL. Flexible pool fee which lowers for pools where volume is high

### Extended pause windows

### Max pool token reduction
