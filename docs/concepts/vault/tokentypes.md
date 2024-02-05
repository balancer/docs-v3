---
title: Token Types
order: 9
---
# Token Types
Balancer V3 supports various key token characteristics natively. Distinguishing between various token types allows to optimize pool operations & external interactions with the Vault. Supported are:

- `TokenType.STANDARD`
- `TokenType.WITH_RATE`
- `TokenType.ERC4626`

The `TokenType` is set during [pool registration](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/VaultExtension.sol#L156) as part of the [`TokenConfig`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L68)

# Importance of `TokenType`
The `TokenType` definition within Balancer V3 is important for the following reasons:

- [Computing prices](./ratescaling.md) of tokens in pools (`WITH_RATE` & `ERC4626`). Example: (wstETH-ETH) pool
- [Wrapping & unwrapping](Action: link to boosted pool page) functionality for pool Tokens (`ERC4626`). Example: (USDC - waUSDT) pool
- [Reading balances](Action: link to live balances page) contained in a pool. `WITH_RATE` & `STANDARD` will report nominal balances whereas `ERC4626` will report amount of "unwrapped" balances.
- Computing [Yield fees](./yieldfee.md) taken by the Balancer protocol
- Routing trades through an available [Buffer](Action: Link to Buffer page) only for tokens `WITH_RATE` & `ERC4626`

## `TokenType.STANDARD`
A Standard Token in the V3 Vault context is a token such as BAL,WETH & DAI. It is natively compatible with Balancer. A `STANDARD` Token does not have any built-in references to other tokens which might imply an additional conversion to an underlying via some kind of exchange rate.

## `TokenType.WITH_RATE`
A `WITH_RATE` Token is any Token that is built on an underlying primitive via an exchange rate such as (wstETH -> stETH or sDAI -> DAI) or a Token with an exchange rate to an artificial reference such as (USD -> EURO). In these cases Balancer provides improved pool operations if a token is considered a `WITH_RATE` Token. The rates are fetched via a standard interface [IRateProvider](https://github.com/balancer/metastable-rate-providers/blob/master/contracts/interfaces/IRateProvider.sol#L18) but the rate computation is customized.

## `TokenType.ERC4626`
The application context of pools containing `ERC4626` Tokens is extended to those being Tokens `WITH_RATE` in that `ERC4626` Tokens have their balances reported in the underlying. The Tokens rate are fetched in a similar fashion as for Tokens `WITH_RATE` but how these tokens appear "to the outside" is changed. Anyone reading pool balances for a pool containing 100 USDC & 99 waUSDT (The ERC4626 Vault for USDT on Aave) would read 100 USDC & 100 USDT. These are called "live-balances". Examples of `ERC4626` Tokens can be found [here](https://www.vaults.fyi/vaults).




