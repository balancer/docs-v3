---
title: Token Types
order: 3
---


# Token Types
In line with Balancer's [yield-bearing native thesis](https://medium.com/balancer-protocol/balancer-the-yield-bearing-asset-thesis-f44489ba2deb), the vault supports a token specialization to provide built-in support for yield-bearing assets.

## Tokens with external rates (`WITH_RATE`)

Tokens should be defined as `WITH_RATE` when they have an externally available exchange rate to some other asset that the AMM should consider when pricing assets internally. Two classical examples are:

- `wstETH` - A wrapped version of the rebasing token stETH, the wstETH rate represents the exchange rate of wstETH -> stETH, which grows as staking rewards accumulate.
- `EURe` - When pairing a EURO stable coin against a USD stable coin, there is a known FX market exchange rate of EUR -> USD. 

See [Rate scaling](./token-scaling.md#rate-scaling) For an in-depth explanation on how Balancer manages tokens with rates.

When [registering](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/VaultExtension.sol#L144-L166) a token as `WITH_RATE`, your [`TokenConfig`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L84-L89) should resemble the following:
```solidity
TokenConfig({
    token: 0x7f39C581F595B53c5cb19bD0b3f8dA6c935E2Ca0,
    tokenType: TokenType.WITH_RATE,
    rateProvider: 0x72D07D7DcA67b8A406aD1Ec34ce969c90bFEE768,
    paysYieldFees: true
})
```

::: info What does `paysYieldFees` mean?
paysYieldFees means that a portion of the yield a specific token accrues is used to fund Balancer DAO operations. Similar to how swap fees accrue to the Balancer treasury.
:::

## All other tokens (`STANDARD`)
Any token that is not `WITH_RATE` should be set as `STANDARD`. 

When [registering](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/VaultExtension.sol#L144-L166) a token as `STANDARD`, your [`TokenConfig`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L84-L89) should resemble the following:
```solidity
TokenConfig({
    token: 0xba100000625a3754423978a60c9317c58a424e3D,
    tokenType: TokenType.STANDARD,
    rateProvider: 0x0000000000000000000000000000000000000000,
    paysYieldFees: true
})
```
