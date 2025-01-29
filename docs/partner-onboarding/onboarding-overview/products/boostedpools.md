---
order: 0
title: Boosted Pools
---

# Boosted Pools

Boosted Pools represent a significant evolution in DeFi yield generation, combining the benefits of DEX liquidity provision and lending market yields in a single position. These pools maximize capital efficiency while maintaining a simple, passive user experience.

## Overview

Boosted Pools in Balancer v3 enable:
- 100% utilization of pool liquidity in lending markets
- Simultaneous earning from swap fees and lending yields
- Gas-efficient swaps through an innovative buffer system
- Simple UX with permissionless entry and exit

![Boosted Pool Overview](/images/boostedTokens.png)

## How Boosted Pools Work

### Architecture
Boosted Pools deploy 100% of liquidity into yield-generating strategies (e.g., Aave) while maintaining full swap functionality through a buffer system:

1. **Underlying Assets**: Users deposit base assets (e.g., USDC, DAI)
2. **Yield Generation**: Assets are automatically converted to yield-bearing tokens (e.g., aUSDC, aDAI)
3. **Buffer System**: Facilitates efficient swaps between base assets

::: tip Buffer Mechanism
Buffers are simple two-token systems that:
- Hold small amounts of both base and yield-bearing tokens
- Enable gas-efficient swaps without external calls for most transactions
- Automatically rebalance when needed for larger swaps
  :::

### Key Benefits

For Liquidity Providers:
- Earn both swap fees and lending yields
- Simplified position management
- Permissionless entry and exit
- Full exposure to yield-bearing assets

For Traders:
- Seamless swaps between base assets
- Gas-efficient transactions
- Deep, reliable liquidity
- No additional complexity

## Implementation

Boosted Pools in v3 improve upon previous versions by:
- Eliminating nested pool structures
- Introducing efficient buffer mechanics
- Optimizing gas costs for all operations
- Maintaining 100% capital efficiency

::: info Security
Buffers implement simple, limited logic adjacent to the vault, significantly reducing potential security risks compared to previous implementations.
:::

## Use Cases

Boosted Pools are ideal for:
- Stablecoin liquidity provision
- Passive yield optimization strategies
- High-volume trading pairs
- Long-term liquidity deployment

## Additional Resources
- [Buffer Documentation](../../../concepts/explore-available-balancer-pools/boosted-pool.md)
- [Buffer Documentation](../../../concepts/vault/buffer.md)
- [Pool Creation Guide](../../balancer-v3/pool-creation.md)
