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
