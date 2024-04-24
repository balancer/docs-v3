---
order: 6
title: Pool Developer fee
---
# Pool developer fee

Balancer pools allow developers to participate from the success of a liquidity pool by allocating a certain percentage of the swap fees to the `poolCreator`. The `poolCreator` is an address that needs to be passed during pool registration.

When a user makes a transaction, a swap fee is charged. This fee is then split into three parts: protocol fees, developer fees, and remaining fees. The protocol fees are transferred to the protocol, the developer fees are transferred to the pool developer, and the remaining fees stay in the pool.

:::info
Collecting pool creator fees is a permissionless function. While anyone can call the `collectPoolCreatorFees` function, the accrued fees are only transferred to the `poolCreator` address.
:::

The pool developer is encouraged to reduce their share of the fees to attract more usage of their pool, as the creator fee is deducted from the LP's portion of the swap fees. Furthermore, if developer fees are not applied to joins/exits, those fees are added to the pool instead, making joins/exits no more advantageous than a swap.

:::info TODO
add https://github.com/balancer/balancer-v3-monorepo/issues/478
add https://github.com/balancer/balancer-v3-monorepo/issues/494
:::

### Collecting Fees

You can collect the accrued creator fees by calling `collectPoolCreatorFees`.

::: info Looking to track the amount of developer fees accrued already?
You can read who the pool creator is by  calling `getPoolCreator(address pool)` and the amount of creator fees already accrued by calling `getPoolCreatorFees(address pool, IERC20 token)`.
:::