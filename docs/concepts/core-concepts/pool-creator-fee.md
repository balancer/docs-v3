---
order: 6
title: Pool Creator Fee
---
## Pool Creator Fee

Introducing the Pool Creator Fee—a groundbreaking feature within the Balancer Protocol that revolutionizes the way developers engage with liquidity pools. With this innovative concept, developers of specific pools have the opportunity to earn a share of the swap fee & yield fee as revenue, incentivising the creation of successful and thriving pools. In the following section, we delve into the details of this exciting feature, exploring how it works and its implications for pool creators.

## Implementation

Whenever swap fees or yield fees are charged within the Balancer Protocol they are distributed among:

* Liquidity Providers
* The Balancer Protocol
* Pool Creator

## Enabling the pool creator fee.

The pool creator sets the `poolCreator` address during pool registration, which cannot be changed afterwards. By default, both the pool creator swap fee percentage and the pool creator yield fee percentage start at 0% and can be set later.
::: info
If you are not yet sure when you want to start collecting a pool creator fee, or how high it should be, you can defer this decision until later, as long as you pass `poolCreator` address on pool registration.
:::

### Collecting Fees

The accrued creator fees can only be claimed by the `poolCreator`, as the function to claim `withdrawPoolCreatorFees` is permissioned.

```solidity
/**
    * @notice Withdraw collected pool creator fees for a given pool.
    * @dev Sends swap and yield pool creator fees to the recipient.
    * @param pool The pool on which fees were collected
    * @param recipient Address to send the tokens
    */
function withdrawPoolCreatorFees(address pool, address recipient) external;
```
This collects the entire amount of accrued creator fees. It is not possible to claim creator swap or yield fees separately.
### Tracking accrued fees

The aggregate pool creator fees (sum of pool creator swap and yield fees) can be fetched from the [ProtocolFeeController.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/ProtocolFeeController.sol)
```solidity
/**
 * @notice Returns the amount of each pool token allocated to the pool creator for withdrawal.
 * @dev Includes both swap and yield fees.
 * @param pool The pool on which fees were collected
 * @param feeAmounts The total amounts of each token that are available for withdrawal, in token registration order
 */
function getPoolCreatorFeeAmounts(address pool) external view returns (uint256[] memory feeAmounts);
```

### Setting The Fee Appropriately

Developers must carefully consider their decisions regarding the creator fee, as increasing this fee reduces the portion of swap & yield fees allocated to Liquidity Providers. While higher creator fees may increase revenue for the creator, they can also diminish incentives for Liquidity Providers to participate, potentially resulting in reduced liquidity and overall fee generation within the pool.

The pool creator can set the fees by calling the [`ProtocolFeeController`'s](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/ProtocolFeeController.sol) `setPoolCreatorYieldFeePercentage` &  `setPoolCreatorSwapFeePercentage`.

The maximum `poolCreatorFeePercentage` for both types is 100% (`100e18`). Note that this percentage is net protocol fees, which are paid first. As described above, a 100% fee would leave nothing for LPs.