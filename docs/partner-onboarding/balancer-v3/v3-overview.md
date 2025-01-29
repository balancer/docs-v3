---
title: Overview
order: 0
---

# Onboarding to Balancer v3

Balancer v3 introduces a simplified and more efficient AMM infrastructure, optimized for scalability and developer experience. The v3 architecture brings native support for yield-bearing tokens, 100% boosted pools, and a flexible hooks system for custom pool extensions.

::: tip Key Improvements
- Simplified pool development with core features managed by vault
- Native support for yield-bearing tokens
- Gas-efficient 100% boosted pools
- Flexible hooks system for custom extensions
- No token whitelisting required
  :::

## Onboarding Steps

1. Choosing and launching your pool
2. Providing initial liquidity
3. Implementing hooks (optional)
4. Setting up incentives through the gauge and our incentive management systems

### Pool Types and Use Cases

| Pool Type | Key Features | Best For |
|-----------|-------------|-----------|
| Boosted Pools | 100% yield-bearing exposure, gas-efficient swaps | Passive LPs seeking additional yield |
| Weighted Pools | Customizable weight distributions | Token pairs and index-style products |
| Composable Stable Pools | Highly correlated assets, native rate scaling | Stablecoin and LST/LRT pairs |
| Custom Pools | Fully customizable AMM logic | Specialized trading strategies |

::: info
Consult our [pool type](../../concepts/explore-available-balancer-pools) section for more in-depth information on supported pools on Balancer v3.
:::

### Pool Creation and Liquidity

1. Use the [Pool Creation UI](https://pool-creator.balancer.fi/v3) to:
    - Select pool type
    - Configure parameters
    - Set initial liquidity
    - Deploy pool

::: info Boosted Pools
Boosted Pools in v3 use an efficient buffer system that:
- Maintains 100% exposure to yield-bearing assets
- Provides gas-efficient swaps
- Automatically manages underlying token conversions
  :::

Check out our pool creation [tutorials and docs](./pool-creation.md) for more details.

### Implementing Hooks (Optional)

Balancer v3 remains a platform for AMM experimentation and innovation, allowing custom pools to iterate on existing or define entirely new swap invariants. With the v3 vault handling much of the responsibility that was previously delegated to the pool contract, internally developed pools are significantly less complex. By shifting core design patterns out of the pool and into the vault, we believe v3 strikes a better balance and produces a 10x improvement in pool developer experience (DX).

In addition to custom pools, we’ve introduced a hooks framework that allows developers to easily extend existing pool types at various key points throughout the pool’s lifecycle. While already present in v2, the v3 vault formalizes the definition of hooks and transient accounting enables secure vault reentrancy, unlocking an infinite design space.

To showcase the potential of hooks, we’ve put together some simple examples:

- [veBalDiscountHook](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-hooks/contracts/VeBALFeeDiscountHookExample.sol)
- [LotteryHook](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-hooks/contracts/LotteryHookExample.sol)
- [ExitFeeHook](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-hooks/contracts/ExitFeeHookExample.sol)
- [FeeTakingHook](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-hooks/contracts/FeeTakingHookExample.sol)

::: tip Developer Resources
Check our [example hooks](https://github.com/balancer/balancer-v3-monorepo) for implementation guidance and our [hooks docs](../../concepts/core-concepts/hooks.md).
:::

### Gauge System Integration

The gauge system remains consistent with v2:

1. BAL rewards through [veBAL](https://app.balancer.fi/#/ethereum/vebal) votes
2. Integration with [vlAURA](https://app.aura.finance/#/1/lock)
3. Direct incentive placement options

See our [gauge onboarding documentation](../onboarding-overview/gauge-onboarding.md) for detailed setup instructions.

::: tip Core Pool Status
Review our [core pools documentation](../onboarding-overview/core-pools.md) for information about enhanced benefits and requirements.
:::

## Developer Support

- Grants program offering up to 150k BAL for v3 implementations
- Hooks bounty program for innovative extensions
- Direct support through [Balancer Discord](https://discord.balancer.fi)

## Additional Resources

- [Technical Documentation](../../concepts/vault/README.md)
- [Core Pool Framework](../onboarding-overview/core-pools.md)
- [Gauge System Guide](../onboarding-overview/gauge-onboarding.md)
- [Incentives Management](../onboarding-overview/incentive-management.md)
- [Pool Creation Guide](./pool-creation.md)
- [Example Hooks Repository](https://github.com/balancer/balancer-v3-monorepo)
