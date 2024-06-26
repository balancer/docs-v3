---
order: 2
title: Extend an Existing Pool Type Using Hooks
---

# Extend an Existing Pool Type Using Hooks

_This section is for developers looking to extend an existing pool type with custom hooks. If you are looking to create a custom AMM with a novel invariant, start [here](/build-a-custom-amm/build-an-amm/create-custom-amm-with-novel-invariant.html)._

Hooks introduce a new framework for extending the functionality of existing pool types at key points throughout their lifecycle. By enabling actions during pool operation and facilitating dynamic swap fee computation, hooks offer unprecedented control over pool behavior. This innovative concept empowers developers to craft tailored pool behaviors, catering to specific use cases and enhancing operations with greater flexibility and control.

::: info
Before you start with this walkthrough, consider reading through a more [technical section on hooks](/concepts/core-concepts/hooks.html#hook-contracts) and take a look at the [Hooks API](/developer-reference/contracts/hooks-api.html).
:::

## Creating a Dynamic Swap Fee Hook Contract

A hooks contract should implement the [IHooks.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IHooks.sol) interface, which provides the blueprint for defining and enabling hooks. At a high level this interface entails:
* Configuration: Specifying the supported hooks, allowing the Vault to determine which hooks are implemented.
* Hooks functionality: Comprising the logic for each configured hook, dictating the actions to be executed when a specific hook is triggered.

Below, we present a naive implementation of a swap-fee discount hook contract giving any veBAL holder a reduced swap fee:

```solidity
contract VeBALFeeDiscountHook is IHooks {

    // allowlist the weighted pool factory on mainnet to work with this hook
    address public allowedFactory;
    IVeBAL public veBAL;

    // trusted Routers
    mapping(address => bool) public trustedRouters;

    constructor(address _allowedFactory, address _veBal, address _router) {
        // verify that this hook can only be used by pools created from `_allowedFactory`
        allowedFactory = _allowedFactory;
        veBAL = IVeBAL(_veBal);
        trustedRouters[_router] = true;
    }

    // Define which hooks this pool supports. It is necessary to implement as the Vault checks these settings
    // and stores them in the pool configuration upon `registerPool`.
    function getHookFlags() external returns (HookFlags memory hookFlags) {
        return
            HookFlags({
                enableHookAdjustedAmounts: false,
                shouldCallBeforeInitialize: false,
                shouldCallAfterInitialize: false,
                shouldCallComputeDynamicSwapFee: true,
                shouldCallBeforeSwap: false,
                shouldCallAfterSwap: false,
                shouldCallBeforeAddLiquidity: false,
                shouldCallAfterAddLiquidity: false,
                shouldCallBeforeRemoveLiquidity: false,
                shouldCallAfterRemoveLiquidity: false
            });
    }

    /**
     * @notice Hook to be executed when pool is registered. If it returns false, the registration
     * is reverted.
     * @dev Vault address can be accessed with msg.sender.
     * @param factory Address of the pool factory
     * @param pool Address of the pool
     * @param tokenConfig An array of descriptors for the tokens the pool will manage
     * @param liquidityManagement Liquidity management flags with implemented methods
     * @return success True if the hook allowed the registration, false otherwise
     */
    function onRegister(
        address factory,
        address pool,
        TokenConfig[] memory tokenConfig,
        LiquidityManagement calldata liquidityManagement
    ) external returns (bool) {
        return factory == allowedFactory;
    }

    /**
     * @notice Called before `onBeforeSwap` if the pool has dynamic fees.
     * @param params Swap parameters (see IBasePool.PoolSwapParams for struct definition)
     * @return success True if the pool wishes to proceed with settlement
     * @return dynamicSwapFee Value of the swap fee
     * @dev Gives a 50% discount for veBAL holders
     */
    function onComputeDynamicSwapFee (
        IBasePool.PoolSwapParams calldata params,
        uint256 staticSwapFeePercentage
    ) external view onlyTrustedRouter(params.router) returns (bool success, uint256 dynamicSwapFee) {
        dynamicSwapFee = staticSwapFeePercentage;
        address user = IRouter(params.router).getSender();

        if (veBAL.balanceOf(user) > 0) {
            // 50% discount for veBAL holders
            dynamicSwapFee = dynamicSwapFee / 2;
        }
        return (true, dynamicSwapFee);
    }

    modifier onlyTrustedRouter(address router) {
        require(trustedRouters[router], "Router not trusted");
        _;
    }
}
```

### Setting Hook Configuration

```solidity
function getHookFlags() external returns (HookFlags memory hookFlags) {
    return
        HookFlags({
            enableHookAdjustedAmounts: false,
            shouldCallBeforeInitialize: false,
            shouldCallAfterInitialize: false,
            shouldCallComputeDynamicSwapFee: true,
            shouldCallBeforeSwap: false,
            shouldCallAfterSwap: false,
            shouldCallBeforeAddLiquidity: false,
            shouldCallAfterAddLiquidity: false,
            shouldCallBeforeRemoveLiquidity: false,
            shouldCallAfterRemoveLiquidity: false
        });
}
```

The `getHookFlags` function returns a `HookFlags` struct, which indicates the implemented hooks in the contract. When a pool is registered, the Vault calls this function to store the configuration. In this example, the `shouldCallComputeDynamicSwapFee` flag is set to true, indicating that the contract is configured to calculate the dynamic swap fee.

### Hook Registration

```solidity
function onRegister(
    address factory,
    address pool,
    TokenConfig[] memory tokenConfig,
    LiquidityManagement calldata liquidityManagement
) external returns (bool) {
    return factory == allowedFactory;
}
```

The `onRegister` function enables developers to implement custom validation logic to ensure the registration is valid. When a new pool is registered, a hook address can be provided to "link" the pool and the hook. At this stage, the onRegister function is invoked by the Vault, and it must return true for the registration to be successful. If the validation fails, the function should return false, preventing the registration from being completed.

In this example we validate that the `factory` param forwarded from the Vault matches the `allowedFactory` set during the hook deployment.

### Implementing the Swap Fee Logic

```solidity
function onComputeDynamicSwapFee (
    IBasePool.PoolSwapParams calldata params
) external view onlyTrustedRouter(params.router) returns (bool success, uint256 dynamicSwapFee) {
    dynamicSwapFee = 10e16;
    address user = IRouter(params.router).getSender();

    if (veBAL.balanceOf(user) > 0) {
        dynamicSwapFee = 10e14;
    }
    return (true, dynamicSwapFee);
}
```

Now we can implement the logic in the `onComputeDynamicSwapFee` function, which the Vault calls to retrieve the swap fee value. In our example, any veBal holder enjoys a 0.1% swap fee, instead of the default 10%. However, there are some nuances to consider in this implementation.

To obtain the user's veBAL balance, we need the sender's address, which we can retrieve by calling `getSender()` on the router. This relies on the router returning the correct address, so it's crucial to ensure the router is "trusted" (any contract can act as a [Router](/concepts/router/overview.html#routers)). In our example we passed a trusted `_router` address which is saved during the hook deployment:

```solidity
mapping(address => bool) public trustedRouters;

constructor(..., address _router) {
    ...
    trustedRouters[_router] = true;
}
```

this is then used in the `onlyTrustedRouter` modifier to verify the `params.router` which is forwarded by the Vault:

```solidity
modifier onlyTrustedRouter(address router) {
    require(trustedRouters[router], "Router not trusted");
    _;
}
```
