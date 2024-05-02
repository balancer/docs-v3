---
order: 6
title: Pool Creator Fee
---
## Pool Creator Fee

Introducing the Pool Creator Fee—a groundbreaking feature within the Balancer Protocol that revolutionizes the way developers engage with liquidity pools. With this innovative concept, developers of specific pools have the opportunity to earn a share of the swap fee revenue, incentivizing the creation of successful and thriving pools. In the following section, we delve into the details of this exciting feature, exploring how it works and its implications for pool creators.

## Implementation

Every swap within the Balancer Protocol incurs a swap fee, which is distributed among:
* Liquidity Providers
* The Balancer Protocol
* Pool Creator

:::info TODO
add https://github.com/balancer/balancer-v3-monorepo/issues/478
add https://github.com/balancer/balancer-v3-monorepo/issues/494
:::

The Creator is setting this address by configuring the `poolCreator` address during pool registration, which cannot be changed afterwards.

### Collecting Fees

:::info
Collecting pool creator fees is a permissionless function. While anyone can call the `collectPoolCreatorFees` function, the accrued fees are only transferred to the `poolCreator` address.
:::

You can collect the accrued creator fees by calling `collectPoolCreatorFees`.

::: info Looking to track the amount of creator fees accrued already?
You can read who the pool creator is by  calling `getPoolCreator(address pool)` and the amount of creator fees already accrued by calling `getPoolCreatorFees(address pool, IERC20 token)`.
:::

### Setting The Fee Appropriately

Developers must carefully balance their decisions regarding the creator fee, as increasing this fee reduces the portion of swap fees allocated to Liquidity Providers. While higher creator fees may increase revenue for the creator, they can also diminish incentives for Liquidity Providers to participate, potentially resulting in reduced liquidity and overall fee generation within the pool.

The pool creator can set the `poolCreatorFeePercentage` by calling:
```solidity
function setPoolCreatorFeePercentage(address pool, uint256 poolCreatorFeePercentage) external;
```
The maximum `poolCreatorFeePercentage` is 100% (`100e18`) and minimum 0%.