# Add liquidity to a pool

<!--
- Assume reader has basic knowledge of web3 dev. e.g. not explaining concepts like approaval, weth wrapping, etc
- Top level concepts shared amongst all
- Javascript examples feel a bit strange - SDK is full process whereas non-sdk is just contract interaction
-->

This guide demonstrates how to add liquidity to a pool. We will use the `addLiquidityUnbalanced` method, since it allows exact amounts of any pool token to be added to a pool, avoiding unnecessary dust in the user's wallet. Other add methods are supported, see the [Router API](../router/overview.html) for more detail.

_This guide is for adding liquidity to Balancer V3. If you're looking to add liquidity to a Balancer V2 pool, start [here]()._

## Core Concepts

The core concepts of adding liquidity are the same for any programming language or framework:
* The sender must approve the Vault (not the Router) for each token they wish to add to the pool
* Token amount inputs/outputs are always in the raw token scale, e.g. `1 USDC` should be sent as `1000000` because it has 6 decimals
* Transactions are always sent to the [Router](../router/overview.md)
* In exchange for providing liquidity the sender will receive [Balancer Pool Tokens](../pools/balancer-pool-token.md) (BPTs) which represents their share of the pool and can be used to remove liquidity at any time

The Router interface for `addLiquidityUnbalanced` is:
```solidity
/**
* @notice Adds with arbitrary token amounts in to a pool.
* @param pool Address of the liquidity pool
* @param exactAmountsIn Exact amounts of tokens to be added, sorted in token registration order
* @param minBptAmountOut Minimum amount of pool tokens to be received
* @param wethIsEth If true, incoming ETH will be wrapped to WETH; otherwise the Vault will pull WETH tokens
* @param userData Additional (optional) data required for adding liquidity
* @return bptAmountOut Actual amount of pool tokens received
*/
function addLiquidityUnbalanced(
    address pool,
    uint256[] memory exactAmountsIn,
    uint256 minBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256 bptAmountOut);
```

* `exactAmountsIn` defines the exact amounts of each token to add to the pool. _Note: these must be sent in token registration order (TODO - Confirm how this is determined. Maybe add another section?)_
* `minBptAmountOut` defines the minimum amount of BPT to receive. If the amount is less than this (e.g. because of slippage) the transaction will revert
* If `wethIsEth` is set to `true`, the Router will deposit the `exactAmountIn` of `ETH` into the `WETH` contract. So, the transaction must be sent with the appropriate `value` amount
* `userData` allows additional parameters to be provided for custom pool types. In most cases it is not required and a value of `0x` can be provided.

The following sections provide specific implementation details for Javascript (with and without the SDK) and Solidity.

## Javascript With SDK

This example demonstrates the full flow for adding liquidity to a given pool. The SDK provides functionality to easily fetch pool data from the [API-TODO add link]() and create a transaction with user defined slippage protection. 

```typescript
TODO - THIS IS NOT FINALISED

import { parseUnits } from 'viem';
import {
    AddLiquidityInput,
    AddLiquidityKind,
    AddLiquidity,
    BalancerApi,
    ChainId,
    PriceImpact,
    Slippage,
} from '@balancer/sdk';

// User defined
const chainId = ChainId.MAINNET;
const userAccount = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
// Balancer V3 uses the pool address as the poolId.
// Balancer V2 uses a unique poolId generated when the pool is registered.
// TODO: Would do this as an address insted of an id since these docs are for v3
const poolId =
    '0x5c6ee304399dbdb9c8ef030ab642b10820db8f56000200000000000000000014'; // 80BAL-20WETH
const slippage = Slippage.fromPercentage('1'); // 1%

// Start a local anvil fork that will be used to query/tx against
const { rpcUrl } = await startFork(ANVIL_NETWORKS.MAINNET);

// API is used to fetch relevant pool data
const balancerApi = new BalancerApi(
    'https://backend-v3-canary.beets-ftm-node.com/graphql',
    chainId,
);
const poolState = await balancerApi.pools.fetchPoolState(poolId);

// We create arbitrary amounts in but these would usually be set by user
const amountsIn = poolState.tokens.map((t) => ({
    rawAmount: parseUnits('1', t.decimals),
    decimals: t.decimals,
    address: t.address,
}));

// Construct the AddLiquidityInput, in this case an AddLiquidityUnbalanced
const addLiquidityInput: AddLiquidityInput = {
    amountsIn,
    chainId,
    rpcUrl,
    kind: AddLiquidityKind.Unbalanced,
};

// Simulate addLiquidity to get the amount of BPT out
const addLiquidity = new AddLiquidity();
const queryOutput = await addLiquidity.query(addLiquidityInput, poolState);

console.log('\nAdd Liquidity Query Output:');
console.log('Tokens In:');
queryOutput.amountsIn.map((a) =>
    console.log(a.token.address, a.amount.toString()),
);
console.log(`BPT Out: ${queryOutput.bptOut.amount.toString()}`);

// Apply slippage to the BPT amount received from the query and construct the call
const call = addLiquidity.buildCall({
    ...queryOutput,
    slippage,
    sender: userAccount,
    recipient: userAccount,
    chainId,
    wethIsEth: false,
});

console.log('\nWith slippage applied:');
console.log('Max tokens in:');
call.maxAmountsIn.forEach((a) =>
    console.log(a.token.address, a.amount.toString()),
);
console.log(`Min BPT Out: ${call.minBptOut.amount.toString()}`);
```

TODO - Go through example describing most relevant points, e.g.:
* SDK intro/installation.
  * The [Balancer SDK TODO - link to SDK section like V2 had?](https://github.com/balancer/b-sdk) is a Typescript/Javascript library for interfacing with the Balancer protocol
* API interaction (detailing API query)
* Querying - what its doing and why its important
* Setting Slippage

## Javascript Without SDK

These snippets demonstrate how to interact with the Router contract directly with the popular Viem and Ethers libraries.

- TODO - Explaining what a query is and how it can be beneficial for setting limits

TODO for feedback:
- The following would show code snippets for querying and creating call data
- Would not show the whole flow, e.g.
  - Not showing how to fetch pool info
  - Not showing how to calculate limits
  - using arbitrary example values

<details>
<summary><b>Viem</b></summary>

1. Do a query
```typescript
TODO - Placeholder example needs updated
const client = createPublicClient({
    transport: http(rpcUrl),
    chain: CHAINS[chainId],
});

const { result: bptAmountOut } = await client.simulateContract({
    address: BALANCER_ROUTER[chainId],
    abi: balancerRouterAbi,
    functionName: 'queryAddLiquidityUnbalanced',
    args: [
        poolAddress,
        maxAmountsIn,
        0n, // minBptOut set to 0 when querying
        '0x',
    ],
});
```
2. Construct call
```typescript
TODO - Placeholder example needs updated
encodeFunctionData({
    abi: balancerRouterAbi,
    functionName: 'addLiquidityUnbalanced',
    args: [
        input.poolId,
        input.amountsIn.map((a) => a.amount),
        amounts.minimumBpt,
        input.wethIsEth,
        '0x',
    ],
});
```
</details>

<details>
<summary><b>Ethers</b></summary>

1. Do a query
```typescript
TODO - Placeholder example needs updated
const client = createPublicClient({
    transport: http(rpcUrl),
    chain: CHAINS[chainId],
});

const { result: bptAmountOut } = await client.simulateContract({
    address: BALANCER_ROUTER[chainId],
    abi: balancerRouterAbi,
    functionName: 'queryAddLiquidityUnbalanced',
    args: [
        poolAddress,
        maxAmountsIn,
        0n, // minBptOut set to 0 when querying
        '0x',
    ],
});
```
2. Construct call
```typescript
TODO - Placeholder example needs updated
encodeFunctionData({
    abi: balancerRouterAbi,
    functionName: 'addLiquidityUnbalanced',
    args: [
        input.poolId,
        input.amountsIn.map((a) => a.amount),
        amounts.minimumBpt,
        input.wethIsEth,
        '0x',
    ],
});
```
</details>


## Solidity

The following code snippet shows how to add liquidity from a smart contract.

::: warning Queries cannot be used within the same block to set minBptAmountOut due to possible manipulation
The integrator must set limits appropriately using some other methods - TODO should we provide some examples?
:::

```solidity
TODO - Placeholder example needs updated
pragma solidity ^0.7.0;

import "@balancer-labs/v2-vault/contracts/interfaces/IVault.sol";
import "@balancer-labs/v2-vault/contracts/interfaces/IFlashLoanRecipient.sol";

contract FlashLoanRecipient is IFlashLoanRecipient {
    IVault private constant vault = "0xBA12222222228d8Ba445958a75a0704d566BF2C8";

    function makeFlashLoan(
        IERC20[] memory tokens,
        uint256[] memory amounts,
        bytes memory userData
    ) external {
      vault.flashLoan(this, tokens, amounts, userData);
    }

    function receiveFlashLoan(
        IERC20[] memory tokens,
        uint256[] memory amounts,
        uint256[] memory feeAmounts,
        bytes memory userData
    ) external override {
        require(msg.sender == vault);
        ...
    }
}
```
