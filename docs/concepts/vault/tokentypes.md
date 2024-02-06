---
title: Token Types
order: 9
---


# Token Types
In line with Balancer's [yield-bearing native thesis](), the vault supports two token specializations to enable built-in support for yield-bearing assets.

## Tokens with external rates (`WITH_RATE`)

Tokens should be defined as `WITH_RATE` when they have an externally available exchange rate to some other asset that the AMM should consider when pricing assets internally. Two classical examples are:

- `wstETH` - A wrapped version of the rebasing token stETH, the wstETH rate represents the exchange rate of wstETH -> stETH, which grows as staking rewards accumulate.
- `EURe` - When pairing a EURO stable coin against a USD stable coin, there is a known FX market exchange rate of EUR -> USD. 

See [Rate scaling](./ratescaling.md) For an in-depth explanation on how Balancer manages tokens with rates.

When [registering](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/VaultExtension.sol#L156) a token as `WITH_RATE`, your [`TokenConfig`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L68) should resemble the following:
```solidity
TokenConfig({
    token: 0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0,
    tokenType: TokenType.WITH_RATE,
    rateProvider: 0x72D07D7DcA67b8A406aD1Ec34ce969c90bFEE768,
    yieldFeeExempt: false
})
```

::: info What does yieldFeeExempt mean?
TODO
:::

## ERC4626 vault tokens (`ERC4626`)
`ERC4626` is an extension of `ERC20` that proposes a standard interface for token vaults. Balancer embraces this standard to empower the next generation of Boosted Pools, see [Boosted Tokens (ERC4626)](./boostedtokens.md) for more information.

An example of an `ERC4626` token is `waUSDC`, a wrapper for AAVE's aUSDC.

When [registering](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/VaultExtension.sol#L156) a token as `ERC4626`, your [`TokenConfig`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L68) should resemble the following:
```solidity
TokenConfig({
    token: "waUSDC address",
    tokenType: TokenType.ERC4626,
    rateProvider: 0x0000000000000000000000000000000000000000,
    yieldFeeExempt: false
})
```

## All other tokens (`STANDARD`)
Any token that does not fall into one of the two specializations above should be set as `STANDARD`. 

When [registering](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/VaultExtension.sol#L156) a token as `STANDARD`, your [`TokenConfig`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L68) should resemble the following:
```solidity
TokenConfig({
    token: 0xba100000625a3754423978a60c9317c58a424e3D,
    tokenType: TokenType.STANDARD,
    rateProvider: 0x0000000000000000000000000000000000000000,
    yieldFeeExempt: false
})
```


Version B

----------------------------------------------------------------------
Version A

# Token Types
Balancer V3 supports various key token characteristics natively. Distinguishing between various token types allows to optimize pool operations & external interactions with the Vault. Supported are:

- `TokenType.STANDARD`
- `TokenType.WITH_RATE`
- `TokenType.ERC4626`

The `TokenType` is set during [pool registration](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/VaultExtension.sol#L156) as part of the [`TokenConfig`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L68)

# Importance of `TokenType`
The `TokenType` definition within Balancer V3 is important for the following reasons:

## Computing prices
The prices a trade happens at in a liquidity pool is based on a certain invariant. Various pool types require the pool balances to compute prices. For a `STANDARD` token the nominal pool balances are used whereas `WITH_RATE` & `ERC4626` have their nominal balances scaled by a rate to determine trade price. See also [rate scaling](./ratescaling.md).
## Reading balances
Accessing a pool's token balances is core to the Balancer Vault & required in many internal calculations and also for external access. For `WITH_RATE` & `ERC4626` tokens "unwrapped" balances are of importance not nominal balances. `STANDARD` will report nominal balances. A `STANDARD` BAL-WETH pool containing 1 WETH & 600 BAL would report 1 WETH & 600 BAL as live balances, whereas a `WITH_RATE` wstETH - WETH pool containing 100 WETH & 92 wstETH would report 100 WETH & 100 WETH. More on [live balances](./livebalances.md)

## Wrapping & unwrapping
For Boosted pools a user usually wants to join & exit these pools with the base token rather than the wrapped version.
`ERC4626` Tokens are a much used token within DeFi. The Balancer Vault supports wrapping & unwrapping to achieve a smoother user experience & cheaper transactions when joining & exiting and trading with a pool containing `ERC4626` Tokens. 

## Yield fees
To support protocol operations Balancer takes swap- & yield fees. If a token needs to pay yield fees depends on its type. The `STANDARD` does not have yield fees as the token itself does not have built-in yield. Tokens `WITH_RATE` pay yield fee if they are not classified as yield exempt during pool creation. `ERC4626` tokens always pay yield fees. Read more on [yield fees](./yieldfee.md).
## Buffer
If a token is classified as `ERC4626` it will have a so called "Buffer" associated with it which allows gas-efficient trades to happen on Balancer without the need to wrap/unwrap during a token trade. This has the advantage that 100% of a pools `ERC4626` tokens can be generating yield. Read more on [Buffers](Action: Link to Buffer page).


## `TokenType.STANDARD`
A Standard token in the V3 Vault context is a token such as BAL, WETH & DAI. It is natively compatible with Balancer. A `STANDARD` token does not have any built-in references to other tokens which might imply an additional conversion to an underlying via some kind of exchange rate. A `STANDARD` token can easily be put into any kind of Balancer pool without external dependencies and will be found in the majority of pools available on Balancer. Typical pool compositions will be:

- `STANDARD` - `STANDARD` (Weighted Pool: 80/20 BAL/WETH)
- `STANDARD` - `WITH_RATE` (Stable Pool: DAI/sDAI)
- `STANDARD` - `ERC4626` (Boosted Pool: DAI/waDAI & Buffer Pool: DAI/waDAI)

This token is considered the most general in the Balancer V3 context.

## `TokenType.WITH_RATE`
A `WITH_RATE` token is any token that is built on an underlying primitive via an exchange rate such as (wstETH -> stETH or sDAI -> DAI) or a token with an exchange rate to an artificial reference such as (USD -> EURO). In these cases Balancer provides improved pool operations (accurate pricing) if a token is considered a `WITH_RATE` token. The rates are fetched via a standard interface [IRateProvider](https://github.com/balancer/metastable-rate-providers/blob/master/contracts/interfaces/IRateProvider.sol#L18) but the rate is part of an external custom contract and could be calculated like: $`(WETH * exchangeRate = wstETH)`$. Often times `WITH_RATE` tokens have "wrapped" in their name however a native wrapping & unwrapping functionality is not given within the Balancer Vault V3 due to non uniform exchange interfaces. Typical pool compositions will be:

- `STANDARD` - `WITH_RATE` (Stable Pool: DAI/sDAI)
- `WITH_RATE` - `WITH_RATE` - `WITH_RATE` (Stable Pool: rETH/wstETH/sfrxETH)
- `WITH_RATE`- `ERC4626` - (Stable Pool: wstETH/yETH)

The wstETH/yETH pool pays yield fees on gains on yETH and wstETH. A token `WITH_RATE`(wstETH) can be exempt from paying yield fees, whereas yETH cannot as it is `ERC4626` and yield fees are enforced. `WITH_RATE`tokens are usually paired with like-kind assets such as ETH/rETH; DAI/USDC; agEUR/stEUR. However no Buffer pools are required.

## `TokenType.ERC4626`
`ERC4626` tokens are similar to `WITH_RATE` tokens in that they are exchangeable to a base asset via an exchangeRate. The exchangeRate is however standardized across all `ERC46426` tokens as defined in its [standard](ERC4626). This allows the Vault to handle wrapping & unwrapping natively and not depend on any external Relayers. Yield fees are enforced on the `ERC4626` token. The standardized interface allows an innovative pool solution to leverage `ERC4626` tokens to build yield-enhancing boosted pools on Balancer V3 where all users `ERC4626` tokens are 100% yield generating as trades are routed through Buffer pools if possible. Examples of `ERC4626` tokens can be found [here](https://www.vaults.fyi/vaults). Typical pools on Balancer containing `ERC4626` tokens are:

- `WITH_RATE`- `ERC4626` - (Stable Pool: wstETH/yETH)
- `STANDARD` - `ERC4626` - (Buffer Pool: DAI/sDAI)
- `ERC4626` - `ERC4626` - (Boosted Pool: waUSDC/waDAI)






