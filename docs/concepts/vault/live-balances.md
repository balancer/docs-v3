---
title: Live Balances
order: 5
---

# Intro
Live balances are a fundamental concept within the Balancer protocol. They play a crucial role in most internal computations and functions that are accessible externally. Live balances can be thought of as raw balances that have been 1) upscaled to 18 decimals, 2) adjusted for token rates, and 3) had yield fees deducted.

The primary purpose of live balances is to provide an accurate depiction of the anticipated token balances. This is especially beneficial for contracts that need to interact with these balances, such as the Vault, pools, and contracts developed externally.

Here's a Solidity code snippet that calculates a live balance:

```solidity
liveBalancesScaled18[pool][token] = 
    // Fetch the raw balance of the token for the specified pool
    rawBalances[pool][token] *
    // Scale the raw balance to achieve 18-decimal internal accounting
    (18 - token.decimals()) *
    // Scale the 18-decimal balance to include the token's rate
    token.getRate() - 
    // Deduct the accrued yield fees by comparing the yield gain (changes in rate since the last yield fees were charged)
    yieldFees[pool][token]
```
This code retrieves the raw balance of a token for a given pool, scales it to 18 decimals for internal accounting, adjusts it for the token's rate, and then deducts any accrued yield fees. The result is the live balance for that token in the specified pool.

Live balances provide a real-time view of token balances, complementing the role of raw balances. For example, let's consider a pool containing DAI (a `STANDARD` token) and wstETH (a `WITH_RATE` token), with an exchange rate of DAI/wstETH at 4049. A balanced pool would show raw balances of 100 wstETH and 404900 DAI. However, the live balances for this pool would display 115 ETH and 404900 DAI, as 100 wstETH is equivalent to 115 ETH when unwrapped.

This concept simplifies several complexities, including:

It abstracts the balances of wrapped tokens, representing them as unwrapped tokens with an applied exchange rate. This is particularly useful for boosted pools (`ERC4626`) and `WITH_RATE` tokens.
Yield fees, which can accumulate on a per-block basis due to an increasing token rate, are already factored in when retrieving live balances. Generally, the term 'live' is used to denote amounts where any pending yield fee has already been deducted, as the Vault handles yield fees.




