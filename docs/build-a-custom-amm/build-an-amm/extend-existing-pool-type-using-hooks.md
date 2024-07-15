---
order: 2
title: Extend an Existing Pool Type Using Hooks
---

# Extend an Existing Pool Type Using Hooks

_This section is for developers looking to extend an existing pool type with custom hooks. If you are looking to create a custom AMM with a novel invariant, start [here](/build-a-custom-amm/build-an-amm/create-custom-amm-with-novel-invariant.html)._

Hooks introduce a new framework for extending the functionality of existing pool types at key points throughout their lifecycle. By enabling actions during pool operations and facilitating dynamic swap fee computation, hooks offer unprecedented control over pool behavior. This innovative concept empowers developers to craft tailored pool behaviors, catering to specific use cases and enhancing operations with greater flexibility and control.

::: info
Before you start with this walkthrough, consider reading through the [technical section on hooks](/concepts/core-concepts/hooks.html#hook-contracts) and take a look at the [Hooks API](/developer-reference/contracts/hooks-api.html).
:::

## Creating a Dynamic Swap Fee Hook Contract

A hooks contract should inherit the [BaseHooks.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/BaseHooks.sol) abstract contract, which provides a minimal implementation for a hooks contract. At a high level this contract includes:
* **Base implementation**: A complete implementation of the [IHooks.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IHooks.sol) interface, with each implemented function returning false.
* **Configuration**: A virtual function `getHookFlags` that must be implemented by your hooks contract, defining which hooks your contract supports.

Below, we present a naive implementation of a swap-fee discount hook contract giving any veBAL holder a reduced swap fee:

```solidity
contract VeBALFeeDiscountHook is BaseHooks {
    // only pools from the allowedFactory are able to register and use this hook
    address private immutable _allowedFactory;
    // only calls from a trusted routers are allowed to call this hook, because the hook relies on the getSender
    // implementation to work properly
    address private immutable _trustedRouter;
    IERC20 private immutable _veBAL;

    constructor(IVault vault, address allowedFactory, address veBAL, address trustedRouter) BaseHooks(vault) {
        _allowedFactory = allowedFactory;
        _trustedRouter = trustedRouter;
        _veBAL = IERC20(veBAL);
    }

    /// @inheritdoc IHooks
    function getHookFlags() external pure override returns (IHooks.HookFlags memory hookFlags) {
        hookFlags.shouldCallComputeDynamicSwapFee = true;
    }

    /// @inheritdoc IHooks
    function onRegister(
        address factory,
        address pool,
        TokenConfig[] memory,
        LiquidityManagement calldata
    ) external view override returns (bool) {
        // This hook implements a restrictive approach, where we check if the factory is an allowed factory and if
        // the pool was created by the allowed factory. Since we only use onComputeDynamicSwapFee, this might be an
        // overkill in real applications because the pool math doesn't play a role in the discount calculation.
        return factory == _allowedFactory && IBasePoolFactory(factory).isPoolFromFactory(pool);
    }

    /// @inheritdoc IHooks
    function onComputeDynamicSwapFee(
        PoolSwapParams calldata params,
        uint256 staticSwapFeePercentage
    ) external view override returns (bool, uint256) {
        // If the router is not trusted, does not apply the veBAL discount because getSender() may be manipulated by a
        // malicious router.
        if (params.router != _trustedRouter) {
            return (true, staticSwapFeePercentage);
        }

        address user = IRouterCommon(params.router).getSender();

        // If user has veBAL, apply a 50% discount to the current fee (divides fees by 2)
        if (_veBAL.balanceOf(user) > 0) {
            return (true, staticSwapFeePercentage / 2);
        }

        return (true, staticSwapFeePercentage);
    }
}
```

### Setting Hook Configuration

```solidity
function getHookFlags() external pure override returns (IHooks.HookFlags memory hookFlags) {
    // all flags default to false
    hookFlags.shouldCallComputeDynamicSwapFee = true;
}
```

The `getHookFlags` function returns a `HookFlags` struct, which indicates which hooks are implemented by the contract. When a pool is registered, the Vault calls this function to store the configuration. In this example, the `shouldCallComputeDynamicSwapFee` flag is set to true, indicating that the contract is configured to calculate the dynamic swap fee.

### Hook Registration

```solidity
function onRegister(
    address factory,
    address pool,
    TokenConfig[] memory,
    LiquidityManagement calldata
) external view override returns (bool) {
    return factory == _allowedFactory && IBasePoolFactory(factory).isPoolFromFactory(pool);
}
```

The `onRegister` function enables developers to implement custom validation logic to ensure the registration is valid. When a new pool is registered, a hook address can be provided to "link" the pool and the hook. At this stage, the `onRegister` function is invoked by the Vault, and it must return true for the registration to be successful. If the validation fails, the function should return false, preventing the registration from being completed.

In this example we validate that the `factory` param forwarded from the Vault matches the `allowedFactory` set during the hook deployment, and that the pool was deployed by that factory.

### Implementing the Swap Fee Logic

```solidity
function onComputeDynamicSwapFee(
    PoolSwapParams calldata params,
    address pool,
    uint256 staticSwapFeePercentage
) external view override returns (bool, uint256) {
    // If the router is not trusted, does not apply the veBAL discount because getSender() may be manipulated by a
    // malicious router.
    if (params.router != _trustedRouter) {
        return (true, staticSwapFeePercentage);
    }

    address user = IRouterCommon(params.router).getSender();

    // If user has veBAL, apply a 50% discount to the current fee (divides fees by 2)
    if (_veBAL.balanceOf(user) > 0) {
        return (true, staticSwapFeePercentage / 2);
    }

    return (true, staticSwapFeePercentage);
}
```

Now we can implement the logic in the `onComputeDynamicSwapFee` function, which the Vault calls to retrieve the swap fee value. In our example, any veBal holder enjoys a 50% swap fee discount, instead of the default static swap fee. However, there are some nuances to consider in this implementation.

To obtain the user's veBAL balance, we need the sender's address, which we can retrieve by calling `getSender()` on the router. This relies on the router returning the correct address, so it's crucial to ensure the router is "trusted" (any contract can act as a [Router](/concepts/router/overview.html#routers)). In our example we passed a trusted `_router` address, which is saved during the hook deployment.

