# Balancer Contract Registry

## Overview

The Balancer Contract Registry is an onchain registry that maintains a canonical list of trusted Balancer contracts. It provides a single source of truth for discovering and validating routers, pool factories, hooks, and other protocol contracts across all supported networks.

## Purpose

The registry enables:

- **Router Validation**: Verify trusted routers before allowing transactions with the Vault
- **Contract Discovery**: Query deployed pool factories and their deployment status  
- **Alias Management**: Use human-readable names instead of addresses
- **Integration Safety**: Ensure applications only interact with authorized contracts

## Contract Types

The registry categorizes contracts into the following types:

| Type | Value | Description |
|------|-------|-------------|
| `OTHER` | 0 | Unspecified contract type |
| `POOL_FACTORY` | 1 | Factory contracts that deploy pools |
| `ROUTER` | 2 | Router contracts for swaps and liquidity operations |
| `HOOK` | 3 | Hook contracts for custom pool behavior |
| `ERC4626` | 4 | ERC4626 wrapper contracts |

## Registered Contracts

### Routers

The following routers are registered as trusted:

| Router | Description | Deployment |
|--------|-------------|------------|
| Router v2 | Primary router for swaps and liquidity | `20250307-v3-router-v2` |
| BatchRouter | Batch operations router | `20241205-v3-batch-router` |
| BufferRouter | Buffer operations router | `20241205-v3-buffer-router` |
| CompositeLiquidityRouter | Composite liquidity operations | `20250123-v3-composite-liquidity-router-v2` |

### Pool Factories

| Factory | Pool Type | Deployment |
|---------|-----------|------------|
| WeightedPoolFactory | Constant product pools | `20241205-v3-weighted-pool` |
| StablePoolFactory | Stableswap pools | `20241205-v3-stable-pool` |
| StableSurgePoolFactory | Stable pools with dynamic fees | `20250121-v3-stable-surge` |
| LBPoolFactory | Liquidity bootstrapping pools | `20250307-v3-liquidity-bootstrapping-pool` |

### Contract Aliases

Aliases provide friendly names for common contracts:

| Alias | Type | Target |
|-------|------|--------|
| `WeightedPool` | POOL_FACTORY | WeightedPoolFactory |
| `StablePool` | POOL_FACTORY | StablePoolFactory |
| `Router` | ROUTER | Router v2 |
| `BatchRouter` | ROUTER | BatchRouter |

## Usage Examples

### Validate a Router

Check if a router address is trusted before allowing transactions:

```solidity
// In your smart contract
IBalancerContractRegistry registry = IBalancerContractRegistry(REGISTRY_ADDRESS);

function executeSwap(address router, SwapParams calldata params) external {
    require(registry.isTrustedRouter(router), "Untrusted router");
    // Execute swap...
}
```

### Query Contract Information

Get detailed information about any registered contract:

```solidity
IBalancerContractRegistry.ContractInfo memory info = 
    registry.getBalancerContractInfo(factoryAddress);

require(info.isRegistered, "Contract not registered");
require(info.isActive, "Contract not active");
require(info.contractType == ContractType.POOL_FACTORY, "Not a factory");
```

### Lookup by Alias

Find contracts using human-readable aliases:

```solidity
(address factoryAddress, bool isActive) = registry.getBalancerContract(
    ContractType.POOL_FACTORY,
    "WeightedPool"
);

require(isActive, "Factory not active");
// Use factoryAddress to create pool...
```

## Integration Guide

### For Frontend Developers

When building user interfaces:

1. Query the registry for available pool types
2. Display user-friendly names using aliases
3. Validate router addresses before transactions
4. Check factory status before pool creation

### For Smart Contract Developers

When integrating with Balancer:

1. Always validate routers with `isTrustedRouter()`
2. Check contract status before interactions
3. Use `getBalancerContractInfo()` for detailed validation
4. Consider caching active contracts to reduce gas

### For Aggregators

When routing through Balancer:

1. Query all trusted routers on initialization
2. Filter by contract type for specific operations
3. Monitor registry for newly added routers
4. Update routing logic when contracts become inactive

## Registry Initialization

The registry was populated on March 14, 2025 via the `BalancerContractRegistryInitializer` deployment.

**Details:**
- **Task**: `20250314-balancer-registry-initializer`
- **Code**: [GitHub Commit](https://github.com/balancer/balancer-v3-monorepo/commit/e1ae7f0091244ae20e5c1add3e7f89b6d33f48d23)
- **Deployment**: [balancer-deployments](https://github.com/balancer/balancer-deployments/tree/master/v3/scripts/20250314-balancer-registry-initializer)

The initializer registered all V3 routers and pool factories, then renounced its admin permissions to ensure the registry can only be updated by governance.

## See Also

- [Vault Architecture](/concepts/vault/)
- [Router Documentation](/developer-reference/contracts/router.html)
- [Pool Factories](/developer-reference/contracts/pool-factories.html)
- [Balancer Deployments](https://github.com/balancer/balancer-deployments)
