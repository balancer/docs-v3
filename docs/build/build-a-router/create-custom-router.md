---
order: 7
title: Create a custom router
---

# Create a custom Router

A custom Router is a smart contract which interacts with the Balancer Vault and utilizes the Vaults function in unique combinations. The deployment of a custom Router is beneficial for various projects in the DeFi space. To name some verticals this could be:

- DEX aggregators, which want to tweak the default interaction via the Balancer Router in a certain way to deliver best prices to their users.
- DeFi projects wanting to provide seamless liquidity migrations of their users from various Dexes to Balancer in order to participate from the deep liquidity offered on Balancer
- DeFi projects looking to provide liquidity on Balancer in custom proportions across multiple pools with more granular control metrics as part of the liquidity provisioning
- DeFi projects looking to enhance the liquidity mining experience for LPs by introducing a better staking and migration flow.

The main work custom routers in the outlined examples above have in common is that:

- They utilize multiple Vault interactions based on the required use-case
- They add additional control flows and external interactions to the Router smart contract for granular liquidity operations

## Usage

The following custom Router displays how LPs can migrate pool liquidity to a new pool with the same tokens and stake it in a gauge without the need to transfer tokens except the BPT.

```solidity
// SPDX-License-Identifier: GPL-3.0-or-later

pragma solidity ^0.8.4;

import { IERC20 } from "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import { IVault } from "@balancer-labs/v3-interfaces/contracts/vault/IVault.sol";

import {
    RemoveLiquidityParams,
    RemoveLiquidityKind,
    AddLiquidityKind,
    SwapKind,
    AddLiquidityParams
} from "@balancer-labs/v3-interfaces/contracts/vault/VaultTypes.sol";

interface IMockLiquidityGauge {
    function deposit(uint256 value, address forWhom, bool willClaim) external;
}

/**
 * @title MigrationRouter
 * @notice Router for migrating liquidity from one pool to another and staking the new BPT
 * @dev This contract utilizes proportional remove liquidity and unbalanced add liquidity to ensure
 * accrued credit on withdrawal is perfectly canceled out via debt accrued on the add liquidity operation, ensuring no
 * ERC20 Tokens (Except the BPT) need to be transferred.
 */
contract MigrationRouter {
    IVault private immutable _vault;

    constructor(address vault) {
        _vault = IVault(vault);
    }

    /**
     * @param poolToExit the pool the LP removes liquidity from
     * @param exactAmountsInOfExit exact amount of BPT to burn for share of the pool's tokens.
     * @param minAmountsOutOfExit minimum amount of tokens to receive
     * @param minBptAmountOutOfJoin minimum amount of BPT to receive for the pool to be joined
     * @param poolToJoin address of the pool to join
     * @param gaugeToStakeIn address of the gauge to stake in
     * @param sender address of the user
     */
    function migrate8020PoolAndStake(
        address poolToExit,
        uint256 exactAmountsInOfExit, //BptIn
        uint256[] calldata minAmountsOutOfExit, //tokensOut
        uint256 minBptAmountOutOfJoin,
        address poolToJoin,
        address gaugeToStakeIn,
        address sender
    ) external {
        _vault.unlock(
            abi.encodeWithSignature(
                "migrate8020PoolAndStakeHook(address,uint256,uint256[],uint256,address,address,address)",
                poolToExit,
                exactAmountsInOfExit,
                minAmountsOutOfExit,
                minBptAmountOutOfJoin,
                poolToJoin,
                gaugeToStakeIn,
                sender
            )
        );
    }

    /**
     * @param poolToExit the pool the LP removes liquidity from
     * @param exactAmountsInOfExit exact amount of BPT to burn for share of the pool's tokens.
     * @param minAmountsOutOfExit minimum amount of tokens to receive
     * @param minBptAmountOutOfJoin minimum amount of BPT to receive for the pool to be joined
     * @param poolToJoin address of the pool to join
     * @param gaugeToStakeIn address of the gauge to stake in
     * @param sender address of the user
     */
    function migrate8020PoolAndStakeHook(
        address poolToExit,
        uint256 exactAmountsInOfExit,
        uint256[] calldata minAmountsOutOfExit,
        uint256 minBptAmountOutOfJoin,
        address poolToJoin,
        address gaugeToStakeIn,
        address sender
    ) external {
        // user already has BPT in possession as it was unstaked previously

        // removeLiquidity
        RemoveLiquidityParams memory params = RemoveLiquidityParams({
            pool: poolToExit,
            from: sender,
            maxBptAmountIn: exactAmountsInOfExit,
            minAmountsOut: minAmountsOutOfExit,
            kind: RemoveLiquidityKind.PROPORTIONAL,
            userData: "0x"
        });

        (, uint256[] memory amountsOut, ) = _vault.removeLiquidity(params);

        // addLiquidity
        AddLiquidityParams memory addLiquidityParams = AddLiquidityParams({
            pool: poolToJoin,
            to: address(this),
            maxAmountsIn: amountsOut,
            minBptAmountOut: minBptAmountOutOfJoin,
            kind: AddLiquidityKind.UNBALANCED,
            userData: "0x"
        });

        (, uint256 bptAmountOut, ) = _vault.addLiquidity(addLiquidityParams);

        // bpt has been minted to Router and Router stakes for the `sender`
        IMockLiquidityGauge(gaugeToStakeIn).deposit(bptAmountOut, sender, false);
    }
}
```
