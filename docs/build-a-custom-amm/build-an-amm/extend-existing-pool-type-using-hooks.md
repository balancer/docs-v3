---
order: 2
title: Extend an existing pool type using hooks
---

# Extend an existing pool type using hooks


Balancer protocol provides developers with a modular architecture that enables the rapid development of custom AMMs.

AMMs built on Balancer inherit the security of the Balancer vault, and benefit from a streamlined development process. Balancer V3 was re-built from the ground up with developer experience as a core focus.
Development teams can now focus on their product innovation without having to build an entire AMM.

_This section is for developers looking to extend an existing pool type with custom hooks, to optimize pool performance. If you are looking to create a custom AMM with a novel invariant, start [here](/build-a-custom-amm/build-an-amm/create-custom-amm-with-novel-invariant.html)._

# Create your custom hook

::: info
Before you start with this walkthrough, consider reading through a more [technical section on hooks](/concepts/core-concepts/hooks.html#hook-contracts) and take a look at the [Hooks API](/developer-reference/contracts/hooks-api.html).
:::

On a high level, creating a hooks contract requires telling the Vault which hooks a given pool should use (happens as part of pool registration) and implementing the logic for the hook contracts behavior. 

Balancer provides the [IHooks.sol](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/interfaces/contracts/vault/IHooks.sol) to inherit from which defines the required functions to implement and provides the necessary structs to handle data.

Below, we present a naive implementation of a swap-fee discount Hook contract. The intention is that every veBAL holder has reduced swap fees on every swap, allowing him to get better prices for swaps. 

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
     * @dev sets swapFee to 0.1% for veBAL holders
     */
    function onComputeDynamicSwapFee (
        IBasePool.PoolSwapParams calldata params
    ) external view onlyTrustedRouter(params.router) returns (bool success, uint256 dynamicSwapFee) {
        // as part of a next merge, `staticSwapFeePercentage` will be availabe
        // meaning, as 50% discount on the current staticSwapFeePercentage can be
        // applied
        // 10% fee by default
        dynamicSwapFee = 10e16;
        address user = IRouter(params.router).getSender();

        if (veBAL.balanceOf(user) > 0) {
            // 0.1% fee for veBAL holders
            dynamicSwapFee = 10e14;
        }
        return (true, dynamicSwapFee);
    }

    /**
     * @notice Optional hook to be executed before pool initialization.
     * @param exactAmountsIn Exact amounts of input tokens
     * @param userData Optional, arbitrary data with the encoded request
     * @return success True if the pool wishes to proceed with initialization
     */
    function onBeforeInitialize(
        uint256[] calldata exactAmountsIn,
        bytes calldata userData
    ) external returns (bool) {
        return false;
    }

    /**
     * @notice Optional hook to be executed after pool initialization.
     * @param exactAmountsIn Exact amounts of input tokens
     * @param bptAmountOut Amount of pool tokens minted during initialization
     * @param userData Optional, arbitrary data with the encoded request
     * @return success True if the pool wishes to proceed with initialization
     */
    function onAfterInitialize(uint256[] memory exactAmountsIn, uint256 bptAmountOut, bytes memory userData) external override returns (bool) {
        return true;
    }

    /**
     * @notice Optional hook to be executed before adding liquidity.
     * @param router The address (usually a router contract) that initiated a swap operation on the Vault
     * @param kind The type of add liquidity operation (e.g., proportional, custom)
     * @param maxAmountsInScaled18 Maximum amounts of input tokens
     * @param minBptAmountOut Minimum amount of output pool tokens
     * @param balancesScaled18 Current pool balances, in the same order as the tokens registered in the pool
     * @param userData Optional, arbitrary data with the encoded request
     * @return success True if the pool wishes to proceed with settlement
     */
    function onBeforeAddLiquidity(
        address router,
        AddLiquidityKind kind,
        uint256[] memory maxAmountsInScaled18,
        uint256 minBptAmountOut,
        uint256[] memory balancesScaled18,
        bytes memory userData
    ) external returns (bool success) {
        return false;
    }

    /**
     * @notice Optional hook to be executed after adding liquidity.
     * @param router The address (usually a router contract) that initiated a swap operation on the Vault
     * @param amountsInScaled18 Actual amounts of tokens added, in the same order as the tokens registered in the pool
     * @param bptAmountOut Amount of pool tokens minted
     * @param balancesScaled18 Current pool balances, in the same order as the tokens registered in the pool
     * @param userData Additional (optional) data provided by the user
     * @return success True if the pool wishes to proceed with settlement
     */
    function onAfterAddLiquidity(
        address router,
        uint256[] memory amountsInScaled18,
        uint256 bptAmountOut,
        uint256[] memory balancesScaled18,
        bytes memory userData
    ) external returns (bool success) {
        return false;
    }

    /**
     * @notice Optional hook to be executed before removing liquidity.
     * @param router The address (usually a router contract) that initiated a swap operation on the Vault
     * @param kind The type of remove liquidity operation (e.g., proportional, custom)
     * @param maxBptAmountIn Maximum amount of input pool tokens
     * @param minAmountsOutScaled18 Minimum output amounts, in the same order as the tokens registered in the pool
     * @param balancesScaled18 Current pool balances, in the same order as the tokens registered in the pool
     * @param userData Optional, arbitrary data with the encoded request
     * @return success True if the pool wishes to proceed with settlement
     */
    function onBeforeRemoveLiquidity(
        address router,
        RemoveLiquidityKind kind,
        uint256 maxBptAmountIn,
        uint256[] memory minAmountsOutScaled18,
        uint256[] memory balancesScaled18,
        bytes memory userData
    ) external returns (bool success) {
        return false;
    }

    /**
     * @notice Optional hook to be executed after removing liquidity.
     * @param router The address (usually a router contract) that initiated a swap operation on the Vault
     * @param bptAmountIn Amount of pool tokens to burn
     * @param amountsOutScaled18 Amount of tokens to receive, in the same order as the tokens registered in the pool
     * @param balancesScaled18 Current pool balances, in the same order as the tokens registered in the pool
     * @param userData Additional (optional) data provided by the user
     * @return success True if the pool wishes to proceed with settlement
     */
    function onAfterRemoveLiquidity(
        address router,
        uint256 bptAmountIn,
        uint256[] memory amountsOutScaled18,
        uint256[] memory balancesScaled18,
        bytes memory userData
    ) external returns (bool success) {
        return false;
    }

    /**
     * @notice Called before a swap to give the Pool an opportunity to perform actions.
     *
     * @param params Swap parameters (see IBasePool.PoolSwapParams for struct definition)
     * @return success True if the pool wishes to proceed with settlement
     */
    function onBeforeSwap(IBasePool.PoolSwapParams calldata params) external returns (bool success) {
        return false;
    }

    /**
     * @notice Called after a swap to give the Pool an opportunity to perform actions.
     * once the balances have been updated by the swap.
     *
     * @param params Swap parameters (see above for struct definition)
     * @param amountCalculatedScaled18 Token amount calculated by the swap
     * @return success True if the pool wishes to proceed with settlement
     */
    function onAfterSwap(
        AfterSwapParams calldata params,
        uint256 amountCalculatedScaled18
    ) external returns (bool success) {
        return false;
    }

    modifier onlyTrustedRouter(address router) {
        require(trustedRouters[router], "Router not trusted");
        _;
    }
}
```

::: info

remember, as outlined in the [Router section](/concepts/router/overview.html#routers), a Router can be any contract, so this Hook contract should ensure that whenever it calls the Router it is considered "trusted".

:::