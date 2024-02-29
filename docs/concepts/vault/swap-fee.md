---
title: Swap Fee
order: 4
---
# Swap fee
A swap fee is charged for each swap operation. This fee is determined by a specific percentage, which is set during the registration of the pool. This percentage is static and is stored as part of [the pool's configuration](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L33). When a pool is registered, the initial swap fee is set to 0% by default. Whenever swap fees are charged, they are always charged in the token going out.

## Setting a static swap fee
Authorized users have the ability to define the static swap fee percentage for pools. This is achieved by invoking the `vault.setStaticSwapFeePercentage(address pool, uint256 swapFeePercentage)` function. However, it's important to note that the maximum static swap fee percentage is capped and can only range between 0 and 10%.

## Dynamic swap fee
Pools can be configured to have dynamic swap fees. This choice is made during the pool's registration with the Vault. Rather than retrieving the swap fee from the [pool configuration](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/VaultTypes.sol#L33), the Vault calls the `getDynamicSwapFee(SwapInfo calldata info)` function on the pool contract, which returns the swapFeePercentage. 
:::info
The ability to calculate dynamic swap fee percentages introduces innovative possibilities for fee calculations. For instance, fees can be determined based on the direction of the swap or set to protect a token's peg.
:::