---
order: 2
title: Boosted
---

# Boosted add liquidity proportional

```solidity
/**
    * @notice Add proportional amounts of tokens to an ERC4626 pool through the buffer.
    * @dev An "ERC4626 pool" contains IERC4626 yield-bearing tokens (e.g., waDAI). Ensure that any buffers associated
    * with the wrapped tokens in the ERC4626 pool have been initialized before initializing or adding liquidity to
    * the "parent" pool, and also make sure limits are set properly.
    *
    * @param pool Address of the liquidity pool
    * @param wrapUnderlying Flags indicating whether the corresponding token should be wrapped or
    * used as a standard ERC20
    * @param maxAmountsIn Maximum amounts of underlying/wrapped tokens in, sorted in token registration order
    * wrapped tokens in the pool
    * @param exactBptAmountOut Exact amount of pool tokens to be received
    * @param wethIsEth If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH
    * @param userData Additional (optional) data required for adding liquidity
    * @return tokensIn Actual tokens added to the pool
    * @return amountsIn Actual amounts of tokens added to the pool
    */
function addLiquidityProportionalToERC4626Pool(
    address pool,
    bool[] memory wrapUnderlying,
    uint256[] memory maxAmountsIn,
    uint256 exactBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (address[] memory tokensIn, uint256[] memory amountsIn);
```


## Javascript With SDK
The following hardhat script shows how to use our SDK to do a boosted proportional add liquidity

```typescript
import { parseUnits, publicActions } from 'viem';
import { setup } from '../setup';
import { approveOnToken } from '../../utils';
import hre from 'hardhat';

import {
  AddLiquidityKind,
  AddLiquidityBoostedV3,
  BalancerApi,
  Slippage,
  Permit2Helper,
  AddLiquidityBoostedProportionalInput,
  MAX_UINT256,
} from '@balancer/sdk';

// npx hardhat run scripts/hardhat/add-liquidity/proportional/boosted.ts
export async function proportionalAddLiquidityBoosted() {
  // User defined inputs
  const chainId = hre.network.config.chainId!;
  const [walletClient] = await hre.viem.getWalletClients();
  const rpcUrl = hre.config.networks.hardhat.forking?.url!;
  const pool = '0xc4Ce391d82D164c166dF9c8336DDF84206b2F812'; // https://balancer.fi/pools/ethereum/v3/0xc4ce391d82d164c166df9c8336ddf84206b2f812
  const kind = AddLiquidityKind.Proportional;
  const wETH: `0x${string}` = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
  const wstETH: `0x${string}` = '0x775f661b0bd1739349b9a2a3ef60be277c5d2d29';
  const tokensIn = [wETH, wstETH];
  const referenceAmount = {
    rawAmount: parseUnits('1', 18),
    decimals: 18,
    address: wETH,
  };

  // Approve the permit2 contract as spender of tokens
  for (const tokenAddress of tokensIn) {
    await approveOnToken(tokenAddress, MAX_UINT256);
  }

  const balancerApi = new BalancerApi('https://api-v3.balancer.fi/', chainId);
  const poolState = await balancerApi.boostedPools.fetchPoolStateWithUnderlyings(pool);

  const addLiquidityInput: AddLiquidityBoostedProportionalInput = {
    chainId,
    rpcUrl,
    referenceAmount,
    tokensIn,
    kind,
  };

  // Query addLiquidity to get the amount of BPT out
  const addLiquidity = new AddLiquidityBoostedV3();
  const queryOutput = await addLiquidity.query(addLiquidityInput, poolState);

  console.log(`Expected BPT Out: ${queryOutput.bptOut.amount.toString()}`);

  const slippage = Slippage.fromPercentage('1'); // 1%
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

The following foundry script shows how to do a boosted proportional add liquidity

```solidity
import { IPermit2 } from "@permit2/interfaces/IPermit2.sol";
import { IRouter } from "@balancer-labs/v3-interfaces/contracts/vault/IRouter.sol";

// forge script scripts/foundry/add-liquidity/proportional/Standard.s.sol --fork-url mainnet
contract Boosted is Setup {
    function run() public {
        setupTokenBalances();

        uint256[] memory maxAmountsIn = new uint256[](2);
        maxAmountsIn[0] = 10e18; // wETH
        maxAmountsIn[1] = 10e18; // wstETH

        // Approve permit2 contract on token
        IERC20(wETH).approve(permit2, maxAmountsIn[0]);
        IERC20(wstETH).approve(permit2, maxAmountsIn[1]);
        // Approve compositeRouter on Permit2
        IPermit2(permit2).approve(wETH, router, type(uint160).max, type(uint48).max);
        IPermit2(permit2).approve(wstETH, router, type(uint160).max, type(uint48).max);

        uint256[] memory amountsIn = IRouter(router).addLiquidityProportional(
            0xc4Ce391d82D164c166dF9c8336DDF84206b2F812, // Aave Lido wETH-wstETH pool
            maxAmountsIn,
            1e18, // exactBptAmountOut
            false, // wethIsEth
            "" // userData
        );
        console.log("Amounts in: %s", amountsIn);
    }
}
```
