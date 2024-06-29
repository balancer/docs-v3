---
order: 3
title: Deploy a Custom AMM with a Factory
---

# Deploy a Custom AMM with a Factory

_This section is for developers looking to deploy a custom pool contract that has already been written. If you are looking to design a custom pool type with a novel invariant, start [here](/build-a-custom-amm/build-an-amm/create-custom-amm-with-novel-invariant.html)._

Balancer recommends that custom pools be deployed via a factory contract because our off-chain infrastructure uses the factory address as a means to identify the type of pool, which is important for integration into the UI, SDK, and external aggregators.

To fully set up a new custom pool using a factory, there are five required steps that must be taken, in order:

1. Deploy a factory contract that inherits from [BasePoolFactory.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/factories/BasePoolFactory.sol)
2. Use `_create` to deploy a new pool
3. Use `_registerPoolWithVault` to register the pool
4. Use `Permit2` to approve the Router to spend tokens that will be used to initialize the pool
5. Call `router.initialize()` to seed the pool with initial liquidity, enabling swaps and normal liquidity operations.

## Creating a Custom Pool Factory Contract

The factory's `vault` address, `pauseWindowDuration`, and `YourCustomPool` creationCode are immutable, but the configurations for the pools deployed are quite flexible. The `.creationCode` of the contract is stored as a private state variable to enable `CREATE3` deployments of pools.

```solidity
contract YourPoolFactory is BasePoolFactory {
    constructor(
        IVault vault,
        uint32 pauseWindowDuration
    ) BasePoolFactory(vault, pauseWindowDuration, type(YourCustomPool).creationCode) {}

    /**
     * @notice Deploys a new pool and registers it with the vault
     * @param name The name of the pool
     * @param symbol The symbol of the pool
     * @param salt The salt value that will be passed to create3 deployment
     * @param tokens An array of descriptors for the tokens the pool will manage
     * @param swapFeePercentage Initial swap fee percentage
     * @param protocolFeeExemptIf true, the pool's initial aggregate fees will be set to 0
     * @param roleAccounts Addresses the Vault will allow to change certain pool settings
     * @param poolHooksContract Contract that implements the hooks for the pool
     * @param liquidityManagement Liquidity management flags with implemented methods
     */
    function create(
        string memory name,
        string memory symbol,
        bytes32 salt,
        TokenConfig[] memory tokens,
        uint256 swapFeePercentage,
        bool protocolFeeExempt,
        PoolRoleAccounts memory roleAccounts,
        address poolHooksContract,
        LiquidityManagement memory liquidityManagement
    ) external returns (address pool) {
        // First deploy a new pool
        pool = _create(abi.encode(getVault(), name, symbol), salt);
        // Then register the pool
        _registerPoolWithVault(
            pool,
            tokens,
            swapFeePercentage,
            protocolFeeExempt,
            roleAccounts,
            poolHooksContract,
            liquidityManagement
        );
    }
}
```

## Deploying a Custom Pool via Factory

::: tip

To see example foundry scripts for deploying and initializing a custom pool, also check out [Scaffold Balancer v3](https://github.com/balancer/scaffold-balancer-v3)
:::

### Token Configurations

```solidity
enum TokenType {
    STANDARD,
    WITH_RATE
}

struct TokenConfig {
    IERC20 token;
    TokenType tokenType;
    IRateProvider rateProvider;
    bool paysYieldFees;
}
```

### Pool Administrators

```solidity
struct PoolRoleAccounts {
    address pauseManager;
    address swapFeeManager;
    address poolCreator;
}
```

::: info
Although deploying pools via a factory contract is the recommended approach, it is not mandatory since it is possible to call `vault.register` directly.
:::

## Initializing a Custom Pool

After a custom pool has been deployed and registered, the next step is to add initial liquidity to the pool, which is a three step process involving `Permit2`

1. Ensure the cannonical `Permit2` contract has been granted an allowance to spend tokens on behalf of the `msg.sender`
2. Approve the Router to spend account tokens using `Permit2.approve`
3. Call [`router.initialize()`](https://github.com/balancer/balancer-v3-monorepo/blob/e9bd6b0b154f2bd083a5049267b7a417c5a2c984/pkg/interfaces/contracts/vault/IRouter.sol#L39-L56) to seed the pool with initial liquidity, enabling swaps and normal liquidity operations.
