---
order: 3
title: Deploy a Custom AMM Using a Factory
---

# Deploy a Custom AMM Using a Factory

_This section is for developers looking to deploy a custom pool contract that has already been written. If you are looking to design a custom AMM with a novel invariant, start [here](/build/build-an-amm/create-custom-amm-with-novel-invariant.html)._

Balancer recommends that custom pools be deployed via a factory contract because our off-chain infrastructure uses the factory address as a means to identify the type of pool, which is important for integration into the UI, SDK, and external aggregators. Factories also provide important security benefits, mainly guaranteeing the integrity of the setup and preventing front-running. If the contract deploys and registers the factory in one operation, the pool is certain to have the desired configuration.

Although core Balancer pool factories do not do this, as they are meant to be generic and support many different use cases, including separate funding, consider also initializing through the factory (or at least in the same transaction as the create). Factories could even inspect the on-chain conditions during deployment, and revert if they are unfavorable (e.g., nested pool rates have been manipulated), further reducing the risks of front-running or other types of interference. Regarding initialization, it is also recommended to initialize ERC4626 buffers *before* deploying any pools with corresponding wrapped tokens. Initialization is the step that sets the proportion of underlying and wrapped tokens; thereafter, liquidity can only be added proportionally. To ensure the pools work as intended, buffers should be created and funded by sponsors prior to deploying pools designed to use them.

For maximum security, consider using a private node for sensitive / high liquidity operations, to avoid risks associated with the public mempool.

To fully set up a new custom pool so that normal liquidity operations and swaps are enabled, five required steps must be taken:

1. Deploy a factory contract that inherits from [BasePoolFactory.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-utils/contracts/BasePoolFactory.sol)
2. Deploy the pool contract using the factory's `_create` function
3. Register the pool using the factory's `_registerPoolWithVault` function
4. Use [Permit2](https://github.com/Uniswap/permit2) to approve the Router to spend the tokens that will be used to initialize the pool
5. Call [`router.initialize()`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IRouter.sol#L46-L53) to seed the pool with initial liquidity

::: tip

To see example foundry scripts for deploying a custom pool using a factory, check out [Scaffold Balancer v3](https://github.com/balancer/scaffold-balancer-v3)
:::

## Creating a Custom Pool Factory Contract

A factory contract should inherit the [BasePoolFactory.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/pool-utils/contracts/BasePoolFactory.sol) abstract contract, which sets the table for deploying pools with `CREATE3` and streamlines the registration process.

Below, we present an example custom pool factory that uses the `ConstantSumPool` contract from [Build your custom AMM](/build/build-an-amm/create-custom-amm-with-novel-invariant.html#build-your-custom-amm)

::: code-tabs#shell
@tab ConstantSumPool

```solidity
contract ConstantSumFactory is BasePoolFactory {
    // Each factory can only deploy one type of custom pool
    constructor(
        IVault vault,
        uint32 pauseWindowDuration
    ) BasePoolFactory(vault, pauseWindowDuration, type(ConstantSumPool).creationCode) {}

    // Streamline the process of deploying and registering a pool
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
        // Deploy a new pool
        pool = _create(abi.encode(getVault(), name, symbol), salt);
        // Register the pool
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

:::

### Factory Constructor Parameters

- `IVault vault`: The address of the Balancer vault
- `uint32 pauseWindowDuration`: The period, starting from deployment of a factory, during which pools can be paused and unpaused, see [FactoryWidePauseWindow.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/solidity-utils/contracts/helpers/FactoryWidePauseWindow.sol)
- `bytes memory creationCode`: The creation bytecode of the pool contract used by `CREATE3` for deployment

::: code-tabs#shell
@tab BasePoolFactory

```solidity
    constructor(
        IVault vault,
        uint32 pauseWindowDuration,
        bytes memory creationCode
    ) SingletonAuthentication(vault) FactoryWidePauseWindow(pauseWindowDuration) {
        _creationCode = creationCode;
    }
```

:::

### Pool Deployment Parameters

- `bytes memory constructorArgs`: The abi encoded constructor args for the custom pool
- `bytes32 salt`: Used to compute a unique, deterministic address for each pool deployment

::: code-tabs#shell
@tab BasePoolFactory

```solidity
    function _create(bytes memory constructorArgs, bytes32 salt) internal returns (address pool) {
        pool = CREATE3.deploy(_computeFinalSalt(salt), abi.encodePacked(_creationCode, constructorArgs), 0);

        _registerPoolWithFactory(pool);
    }
```

:::

### Pool Registration Parameters

- `TokenConfig[] memory tokens`: An array of descriptors for the tokens the pool will manage, see [Token Types](https://docs-v3.balancer.fi/concepts/vault/token-types.html)
- `uint256 swapFeePercentage`: Fee charged for each swap. For more information, see [Swap fees](https://docs-v3.balancer.fi/concepts/vault/swap-fee.html)
- `bool protocolFeeExempt`: If true, the pool's initial aggregate fees will be set to 0
- `PoolRoleAccounts memory roleAccounts`: Addresses allowed to change certain pool settings, see [Pool Role Permissions](https://docs-v3.balancer.fi/concepts/core-concepts/pool-role-accounts.html)
- `address poolHooksContract`: Contract that implements the hooks for the pool. If no hooks, use the zero address
- `LiquidityManagement memory liquidityManagement`: Specifies support for [Custom Liquidity Operations](https://docs-v3.balancer.fi/build/build-an-amm/create-custom-amm-with-novel-invariant.html#add-remove-liquidity)

::: code-tabs#shell
@tab BasePoolFactory

```solidity
    function _registerPoolWithVault(
        address pool,
        TokenConfig[] memory tokens,
        uint256 swapFeePercentage,
        bool protocolFeeExempt,
        PoolRoleAccounts memory roleAccounts,
        address poolHooksContract,
        LiquidityManagement memory liquidityManagement
    ) internal {
        getVault().registerPool(
            pool,
            tokens,
            swapFeePercentage,
            getNewPoolPauseWindowEndTime(),
            protocolFeeExempt,
            roleAccounts,
            poolHooksContract,
            liquidityManagement
        );
    }
```

:::

::: info
Although deploying pools via a factory contract is the recommended approach, it is not mandatory since it is possible to call [`vault.registerPool`](https://docs-v3.balancer.fi/developer-reference/contracts/vault-api.html#registerpool) directly.
:::

## Initializing a Custom Pool

After a custom pool has been deployed and registered, the next step is to add initial liquidity to the pool, which is a three step process:

1. Ensure the [Permit2](https://github.com/Uniswap/permit2) contract has been granted sufficient allowance to spend tokens on behalf of the `msg.sender`
2. Transfer sufficient allowance to the [Router](https://docs-v3.balancer.fi/concepts/router/overview.html) with [`Permit2.approve`](https://github.com/Uniswap/permit2/blob/cc56ad0f3439c502c246fc5cfcc3db92bb8b7219/src/AllowanceTransfer.sol#L25-L30)
3. Call [`router.initialize()`](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IRouter.sol#L46-L53)

After a pool has been initialized, normal liquidity operations and swaps are instantly enabled.
