---
order: 2
title: Boosted
---

# Boosted add liquidity unbalanced

```solidity
/**
* @notice Add arbitrary amounts of tokens to an ERC4626 pool through the buffer.
* @dev An "ERC4626 pool" contains IERC4626 yield-bearing tokens (e.g., waDAI). Ensure that any buffers associated
* with the wrapped tokens in the ERC4626 pool have been initialized before initializing or adding liquidity to
* the "parent" pool, and also make sure limits are set properly.
*
* @param pool Address of the liquidity pool
* @param wrapUnderlying Flags indicating whether the corresponding token should be wrapped or
* used as a standard ERC20
* @param exactAmountsIn Exact amounts of underlying/wrapped tokens in, sorted in token registration order
* @param minBptAmountOut Minimum amount of pool tokens to be received
* @param wethIsEth If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH
* @param userData Additional (optional) data required for adding liquidity
* @return bptAmountOut Actual amount of pool tokens received
*/
function addLiquidityUnbalancedToERC4626Pool(
    address pool,
    bool[] memory wrapUnderlying,
    uint256[] memory exactAmountsIn,
    uint256 minBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256 bptAmountOut);
```


## Javascript With SDK
The following hardhat script shows how to use our SDK to do a boosted add liquidity

```typescript
import { parseUnits, publicActions } from 'viem';
import { setup } from '../setup';
import { approveOnToken } from '../../utils';
import hre from 'hardhat';

import {
  AddLiquidityInput,
  AddLiquidityKind,
  AddLiquidityBoostedV3,
  BalancerApi,
  Slippage,
  InputAmount,
  Permit2Helper,
} from '@balancer/sdk';

// npx hardhat run scripts/hardhat/add-liquidity/unbalanced/boosted.ts
export async function unbalancedAddLiquidityBoosted() {
  // User defined inputs
  const chainId = hre.network.config.chainId!;
  const [walletClient] = await hre.viem.getWalletClients();
  const rpcUrl = hre.config.networks.hardhat.forking?.url!;
  const pool = '0xc4Ce391d82D164c166dF9c8336DDF84206b2F812'; // https://balancer.fi/pools/ethereum/v3/0xc4ce391d82d164c166df9c8336ddf84206b2f812
  const amountsIn: InputAmount[] = [
    {
      address: '0x0fe906e030a44ef24ca8c7dc7b7c53a6c4f00ce9', // waEthLidowETH
      decimals: 18,
      rawAmount: parseUnits('1', 18),
    },
    {
      address: '0x775f661b0bd1739349b9a2a3ef60be277c5d2d29', // wstETH
      decimals: 18,
      rawAmount: 0n,
    },
  ];
  const slippage = Slippage.fromPercentage('1'); // 1%

  // Approve the permit2 contract as spender of tokens
  for (const token of amountsIn) {
    await approveOnToken(token.address, token.rawAmount);
  }

  const balancerApi = new BalancerApi('https://api-v3.balancer.fi/', chainId);
  const poolState = await balancerApi.boostedPools.fetchPoolStateWithUnderlyings(pool);

  const addLiquidityInput: AddLiquidityInput = {
    amountsIn,
    chainId,
    rpcUrl,
    kind: AddLiquidityKind.Unbalanced,
  };

  // Query addLiquidity to get the amount of BPT out
  const addLiquidity = new AddLiquidityBoostedV3();
  const queryOutput = await addLiquidity.query(addLiquidityInput, poolState);

  console.log(`Expected BPT Out: ${queryOutput.bptOut.amount.toString()}`);

  const queryOutputWithSlippage = { ...queryOutput, slippage };

  // Use helper to create the necessary permit2 signatures
  const permit2 = await Permit2Helper.signAddLiquidityBoostedApproval({
    ...queryOutputWithSlippage,
    client: walletClient.extend(publicActions),
    owner: walletClient.account,
  });

  // Applies slippage to the BPT out amount and constructs the call
  const call = addLiquidity.buildCallWithPermit2(queryOutputWithSlippage, permit2);

  console.log(`Min BPT Out: ${call.minBptOut.amount.toString()}`);

  const hash = await walletClient.sendTransaction({
    account: walletClient.account,
    data: call.callData,
    to: call.to,
    value: call.value,
  });

  return hash;
}
```


## Solidity

The following foundry script shows how to do a standard unblanced add liquidity to a pool

::: warning Queries should not be used onchain to set minAmountOut due to possible manipulation via frontrunning.
:::

```solidity
import { IPermit2 } from "@permit2/interfaces/IPermit2.sol";
import { ICompositeLiquidityRouter } from "@balancer-labs/v3-interfaces/contracts/vault/ICompositeLiquidityRouter.sol";

// forge script scripts/foundry/add-liquidity/unbalanced/Boosted.s.sol --fork-url mainnet
contract Boosted is Setup {
    function run() public {
        setupTokenBalances();

        bool[] memory wrapUnderlying = new bool[](2);
        wrapUnderlying[0] = true; // wrap wETH into waEthLidowETH
        wrapUnderlying[1] = false;

        uint256[] memory exactAmountsIn = new uint256[](2);
        exactAmountsIn[0] = 1e18; // waEthLidowETH
        exactAmountsIn[1] = 0; // waEthLidowstETH

        // Approve permit2 contract on token
        IERC20(wETH).approve(permit2, exactAmountsIn[0]);
        // Approve compositeRouter on Permit2
        IPermit2(permit2).approve(wETH, compositeRouter, type(uint160).max, type(uint48).max);

        uint256 bptAmountOut = ICompositeLiquidityRouter(compositeRouter).addLiquidityUnbalancedToERC4626Pool(
            0xc4Ce391d82D164c166dF9c8336DDF84206b2F812, // Aave Lido wETH-wstETH pool
            wrapUnderlying,
            exactAmountsIn,
            0, // minBptAmountOut
            false, // wethIsEth
            "" // userData
        );
        console.log("BPT amount out: %s", bptAmountOut);
    }
}
```
