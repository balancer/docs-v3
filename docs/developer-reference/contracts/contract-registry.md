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
| `OTHER` | 0 | Unspecified contract type (catch-all for helper contracts, etc.) |
| `POOL_FACTORY` | 1 | Factory contracts that deploy pools |
| `ROUTER` | 2 | Router contracts for swaps and liquidity operations |
| `HOOK` | 3 | Hook contracts for custom pool behavior |
| `ERC4626` | 4 | ERC4626 wrapper contracts (restricted to wrappers known to be compatible) |

## Contract Aliases

Aliases provide friendly names for common contracts. The aliases registered at deployment are listed below. Governance can update alias targets at any time (e.g., when migrating to a new pool version, such as LBP V3 to V4), so treat this list as illustrative only.

Query the registry on-chain via getBalancerContract(type, alias) for the current target.

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

## See Also

- [Vault Architecture](/concepts/vault/)
- [Router Documentation](/developer-reference/contracts/router-api.html)
- [Balancer Deployments](https://github.com/balancer/balancer-deployments)
