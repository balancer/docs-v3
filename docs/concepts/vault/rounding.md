---
title: Rounding
order: 5
---

# Rounding

## Overview

Balancer V3 performs pool math in fixed-point arithmetic on values [scaled to 18 decimals](/concepts/vault/token-scaling.html), so most operations produce a result whose final wei cannot be represented exactly and has to be rounded one way or the other.

The direction is never arbitrary: it is always chosen to favor the pool over the caller, so that for every possible round-trip path the caller receives the same or fewer tokens than they supplied, and never more. This protects the pool invariant, and with it the other liquidity providers, from having value drained across one or more transactions.

## What it means per operation

The rounding direction is guided by a single general principle: amounts you receive are rounded down, and amounts you pay or burn are rounded up. Applied to each user-facing operation:

| Operation | Rounding |
|-----------|----------|
| Swap, given an exact amount in | the amount out is rounded **down**: you receive the same or slightly less |
| Swap, given an exact amount out | the amount in is rounded **up**: you pay the same or slightly more |
| Add liquidity, receiving BPT | the BPT minted is rounded **down** |
| Add liquidity, for an exact BPT amount out | the token amount in is rounded **up** |
| Remove liquidity, receiving tokens | the token amounts out are rounded **down** |
| Remove liquidity, for an exact token amount out | the BPT burned is rounded **up** |

A round trip therefore never yields value: adding and then immediately removing liquidity, or swapping A → B → A, returns the same or slightly fewer tokens than the caller started with. The small remainder stays in the pool, and like a very tiny swap fee, accrues to its liquidity providers.

## For custom pool developers

This is a deliberate simplification from V2, where each pool implemented all add / remove (join / exit) operations, each applying its own decimal scaling and rounding. In V3 the Vault performs the liquidity math, and only calls into the pool for two primitives: `computeInvariant` and `computeBalance`. Because the Vault now drives the surrounding calculation, only it knows which operation is running, and therefore which direction rounds in the protocol's favor.

That is why `computeInvariant` takes a `Rounding` argument (`ROUND_UP` or `ROUND_DOWN`): the Vault specifies the direction it needs for the current operation, and the pool implementation must honor it. Its inverse, `computeBalance`, takes no such argument, because the correct direction happens to be the same (up) for all operations involving it. A pool that rounds the wrong way in either function could leak value. Rate scaling follows the same favor-the-protocol convention; see [Token scaling](/concepts/vault/token-scaling.html).

The Vault also performs decimal scaling, but this is an integer operation with no loss of precision, so cannot result in rounding errors.
