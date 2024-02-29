---
title: Live Balances
order: 5
---

# Intro
Live balances are a key concept within the Balancer code base. They are used in most internal calculations and functions that are available for external consumption. The purpose of live balances is to provide an accurate representation of the expected token balances. This is particularly useful for contracts that need to work with these balances like the Vault, pools and externally developed contracts.

In essence, live balances offer a snapshot of token balances 'as is', serving as a complement to raw balances. For instance, consider a pool with DAI (`STANDARD` token) and waDAI (`ERC4626` token), with an exchange rate of DAI/waDAI being 1.1. A balanced pool would report raw balances of 100 DAI and 90.9 waDAI. However, the live balances for this pool would report 100 DAI and 100 DAI (90.9 waDAI unwrapped to 100 DAI).

This abstraction simplifies several complexities, such as:

- abstracting away wrappedToken balances and representing the balances as unwrapped tokens with an exchange rate applied. This is the case for boosted pools (`ERC4626`) and tokens `WITH_RATE`.
- Yield fees which can accrue on a per block basis by an increasing tokenRate are already accounted for when fetching live balances. Generally speaking live is used to denote amounts where any pending yield fee has already been removed, as the Vault manages yield fees.




