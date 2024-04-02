---
order: 2
---

# Pool Configuration

## Overview

Balancer is a flexible protocol and as such there are many choices a user or project has to make when creating a new pool. This page will walk through the different tradeoffs when it comes to pool types, token composition, fees, and more to best optimize liquidity and swap volume.

## Pool Types

Choosing the type of pool to use is straightforward based on a few simple factors. The primary being the expected price variations between the tokens in the pool. For most non-stable assets a [Weighted Pool](/concepts/pools/known-pool-types/weighted-pool.html) is the right choice. For assets that are stable like stablecoins or assets that are stable against each other with a known price rate (ex: wstETH/weth), a [Stable Pool](/concepts/pools/known-pool-types/stable-pool.html) allows for much deeper liquidity.

The Balancer Dapp has a pool creation interface, which will be accessible soon. For stable pool creation, reach out to our devs on [Discord](https://discord.balancer.fi/) for assistance.

## Token Composition

### Weighted Pools

One of the frequent mistakes in new weighted pools has to do with the token composition. A common example is a user creating a 33/33/33 weighted pool with XYZ / WETH / USDC (where XYZ represents any arbitrary token). The thinking behind this is by adding both WETH and USDC to the pool it makes it easier to swap XYZ into either. In a vacuum this may be true, but by doing so this actually hurts slippage for this pool and also is not ideal for overall platform liquidity. Instead a better option is to pair XYZ with a WETH/USDC pool BPT (or even more ideally a bb-a-USDC/(wstETH/weth) pool BPT). Now if a swapper wanted to go from WETH->XYZ, for the same dollar amounts the 50/50 pool will have more liquidity and therefore better slippage for a given pair than 33/33. All of the frontends, aggregators, and arbitrageurs can automatically see the underlying tokens of the BPT paired and create direct paths from WETH->XYZ and USDC->XYZ with minimal gas costs.


## Fees

There a few choices to make when setting the swap fees for a new pool:

1. Should the fee be permanently fixed?
2. If variable, who should control the updates?
   - Balancer Governance
   - A set address or contract
3. What should the swap fee amount be?

To set a permanent fee, an `owner` of `0x0000000000000000000000000000000000000000` is set upon pool creation. However in general the recommendation is to allow Balancer governance (and delegated addresses) to dynamically adjust the fees. This is done by setting an owner of `0xba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1ba1b`.

There are lots of discussion and research around how to best set a swap fee amount, but a general rule of thumb is for stable assets it should be lower (ex: `0.1%`) and non-stable pairs should be higher (ex: `0.3%`).
