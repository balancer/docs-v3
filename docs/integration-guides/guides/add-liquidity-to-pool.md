---
order: 1
title: Add liquidity to a pool
---

# Add liquidity to a pool

This guide demonstrates how to add liquidity to a pool. We will use the `addLiquidityUnbalanced` method, since it allows exact amounts of any pool token to be added to a pool, avoiding unnecessary dust in the user's wallet. See the [Router API](/developer-reference/contracts/router-api.html) for other supported add methods.

_This guide is for adding liquidity to Balancer v3. If you're looking to add liquidity to a Balancer v2 pool, start [here](https://docs.balancer.fi/guides/builders/join-pool.html)._

## Core Concepts

The core concepts of adding liquidity are the same for any programming language or framework:
* The sender must approve the Vault (not the Router) for each token they wish to add to the pool
* Token amount inputs/outputs are always in the raw token scale, e.g. `1 USDC` should be sent as `1000000` because it has 6 decimals
* Transactions are always sent to the [Router](../../concepts/router/overview.md)
* In exchange for providing liquidity the sender will receive [Balancer Pool Tokens](../../concepts/core-concepts/balancer-pool-tokens.md) (BPTs) which represents their share of the pool and can be used to remove liquidity at any time

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

* `exactAmountsIn` defines the exact amounts of each token to add to the pool. _Note: these must be sent sorted in alphanumeric order_
* `minBptAmountOut` defines the minimum amount of BPT to receive. If the amount is less than this (e.g. because of slippage) the transaction will revert
* If `wethIsEth` is set to `true`, the Router will deposit the `exactAmountIn` of `ETH` into the `WETH` contract. So, the transaction must be sent with the appropriate `value` amount
* `userData` allows additional parameters to be provided for custom pool types. In most cases it is not required and a value of `0x` can be provided.

The following sections provide specific implementation details for Javascript (with and without the SDK) and Solidity.

## Javascript With SDK

This example demonstrates the full flow for adding liquidity to a given pool. The SDK provides functionality to easily fetch pool data from the [Balancer Pools API](https://docs.balancer.fi/guides/API/) and create a transaction with user defined slippage protection. 

```typescript
import {
  AddLiquidityInput,
  AddLiquidityKind,
  AddLiquidity,
  BalancerApi,
  ChainId,
  Slippage,
  InputAmount,
} from "@balancer/sdk";

// User defined
const chainId = ChainId.MAINNET;
const userAccount = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
const rpcUrl = 'RPC_END_POINT'
// Balancer v3 uses the pool address as the poolId.
const pool = '0x1e5b830439fce7aa6b430ca31a9d4dd775294378';
const amountsIn: InputAmount[] = [
  {
    address: "0xba100000625a3754423978a60c9317c58a424e3D",
    decimals: 18,
    rawAmount: 1000000000000000000n,
  },
  {
    address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    decimals: 18,
    rawAmount: 1000000000000000000n,
  },
];
const slippage = Slippage.fromPercentage('1'); // 1%

// API can be used to fetch relevant pool data
const balancerApi = new BalancerApi(
    'https://api-v3.balancer.fi/',
    chainId,
);
const poolState = await balancerApi.pools.fetchPoolState(pool);

// Construct the AddLiquidityInput, in this case an AddLiquidityUnbalanced
const addLiquidityInput: AddLiquidityInput = {
    amountsIn,
    chainId,
    rpcUrl,
    kind: AddLiquidityKind.Unbalanced,
};

// Query addLiquidity to get the amount of BPT out
const addLiquidity = new AddLiquidity();
const queryOutput = await addLiquidity.query(addLiquidityInput, poolState);

console.log(`Expected BPT Out: ${queryOutput.bptOut.amount.toString()}`);

// Applies slippage to the BPT out amount and constructs the call
  const call = addLiquidity.buildCall({
    ...queryOutput,
    slippage,
    chainId,
    wethIsEth: false,
  });

console.log(`Min BPT Out: ${call.minBptOut.amount.toString()}`);

const hash = await client.sendTransaction({
    account: userAccount,
    data: call.callData,
    to: call.to,
    value: call.value,
});
```

### Install the Balancer SDK

The [Balancer SDK](https://github.com/balancer/b-sdk) is a Typescript/Javascript library for interfacing with the Balancer protocol and can be installed with:

::: code-tabs#shell
@tab pnpm

```bash
pnpm add @balancer/sdk
```

@tab yarn

```bash
yarn add @balancer/sdk
```

@tab npm
```bash
npm install @balancer/sdk
```
:::

The three main helper classes we use from the SDK are:
* `BalancerApi` - to simplify retrieving pool data from the Pools API
* `AddLiquidity` - to build addLiquidity queries and transactions
* `Slippage` - to simplify creating limits with user defined slippage 

### Fetching Pool Data

In this example we use the BalancerApi `fetchPoolState` function to fetch the pool data required for the addLiquidityUnbalanced `poolState` parameter. 
```typescript
const balancerApi = new BalancerApi(
    'https://api-v3.balancer.fi/',
    chainId,
);
const poolState = await balancerApi.pools.fetchPoolState(pool);
```
To see the full query used to fetch pool state refer to the code [here](https://github.com/balancer/b-sdk/blob/41d2623743ab7fa466ed4d0f5f5c7e5aa16b7d91/src/data/providers/balancer-api/modules/pool-state/index.ts#L7).

### Queries and safely setting slippage limits

[Router queries](../../concepts/router/queries.md) allow for simulation of operations without execution. In this example, when the `query` function is called: 

```typescript
const queryOutput = await addLiquidity.query(addLiquidityInput, poolState);
// queryOutput.bptOut
```
The Routers [queryAddLiquidityUnbalanced](../../developer-reference/contracts/router-api.md#queryaddliquidityunbalanced) function is used to find the amount of BPT that would be received, `bptOut`.

In the next step `buildCall` uses the `bptOut` and the user defined `slippage` to calculate the `minBptAmountOut`:
```typescript
const call = addLiquidity.buildCall({
    ...queryOutput,
    slippage,
    chainId,
    wethIsEth: false,
});
```

In the full example above, we defined our slippage as `Slippage.fromPercentage('1')`, meaning that we if we do not receive at least 99% of our expected `bptOut`, the transaction should revert.
Internally, the SDK subtracts 1% from the query output, as shown in `Slippage.applyTo` below:

```typescript
/**
 * Applies slippage to an amount in a given direction
 *
 * @param amount amount to apply slippage to
 * @param direction +1 adds the slippage to the amount, and -1 will remove the slippage from the amount
 * @returns
 */
public applyTo(amount: bigint, direction: 1 | -1 = 1): bigint {
    return MathSol.mulDownFixed(
        amount,
        BigInt(direction) * this.amount + WAD,
    );
}
```

### Constructing the call

The output of the `buildCall` function provides all that is needed to submit the addLiquidity transaction:
* `to` - the address of the Router
* `callData` - the encoded call data
* `value` - the native asset value to be sent

It also returns the `minBptOut` amount which can be useful to display/validation purposes before the transaction is sent.

## Javascript Without SDK

The following Viem and Ethers snippets demonstrate how to perform an add liquidity unbalanced operation. To achieve this, we use two Router functions:

* [`addLiquidityUnbalanced`](../../developer-reference/contracts/router-api.md#addliquidityunbalanced) - Add liquidity to a pool, unbalanced.
* [`queryAddLiquidityUnbalanced`](../../developer-reference/contracts/router-api.md#queryaddliquidityunbalanced) - The [router query](../../concepts/router/queries.md) used to simulate an add liquidity unbalanced operation. It returns the exact amount of BPT that would be received.

**Resources**:
* [Router ABI](../../developer-reference/contracts/router-api.md)
* [Router deployment addresses](../../reference/contracts)

::: code-tabs#shell
@tab Viem
```typescript
// Query operation
const client = createPublicClient({
  transport: http(RPC_URL),
  chain: sepolia,
});

const { result: bptAmountOut } = await client.simulateContract({
  address: routerAddress,
  abi: routerAbi,
  functionName: "queryAddLiquidityUnbalanced",
  args: [
    "0x1e5b830439fce7aa6b430ca31a9d4dd775294378", // pool address
    [100000000000000000n, 100000000000000000n], // token amounts in raw form
    0n, // minBptOut set to 0 when querying
    "0x", // userData, set to 0x in most scenarios
  ],
});

// Sending transaction
const walletClient = createWalletClient({
  chain: sepolia,
  transport: http(RPC_URL),
});

const hash = await walletClient.writeContract({
  address: routerAddress,
  abi: routerAbi,
  functionName: "addLiquidityUnbalanced",
  args: [
    "0x1e5b830439fce7aa6b430ca31a9d4dd775294378", // pool address
    [100000000000000000n, 100000000000000000n], // token amounts in raw form
    900000000000000000n, // minBptOut must be set appropriately
    false, // wethIsEth for Eth wrapping
    "0x", // userData, set to 0x in most scenarios
  ],
  account: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
});
```

@tab Ethers

```typescript
// Query operation
const provider = new JsonRpcProvider(RPC_URL);

const router = new Contract(
  routerAddress,
  routerAbi,
  provider
);

const bptAmountOut = await router.queryAddLiquidityUnbalanced.staticCall(
  "0x1e5b830439fce7aa6b430ca31a9d4dd775294378", // pool address
  [100000000000000000n, 100000000000000000n], // token amounts in raw form
  0n, // minBptOut set to 0 when querying
  "0x" // userData, set to 0x in most scenarios
);

// Sending transaction
const tx = await router.addLiquidityUnbalanced(
  "0x1e5b830439fce7aa6b430ca31a9d4dd775294378", // pool address
  [100000000000000000n, 100000000000000000n], // token amounts in raw form
  900000000000000000n, // minBptOut must be set appropriately
  false, // wethIsEth for Eth wrapping
  "0x" // userData, set to 0x in most scenarios
);
```
:::

## Solidity

The following code snippet shows how to add liquidity from a smart contract.

::: warning Queries should not be used onchain to set minAmountOut due to possible manipulation via frontrunning.
:::

```solidity
pragma solidity ^0.8.4;

// TODO - Assume there will be interface type package? Needs updated when released.
import "@balancer-labs/...../IRouter.sol";

contract AddLiquidityUnbalanced {
    IRouter public router;

    constructor(IRouter _router) {
      router = _router;
    }

    function addLiquidityUnbalanced(
        address pool,
        uint256[] memory exactAmountsIn,
        uint256 minBptAmountOut,
        bool wethIsEth,
        bytes memory userData
    ) external override {
        router.addLiquidityUnbalanced(
          pool,
          exactAmountsIn,
          minBptAmountOut,
          wethIsEth,
          userData
        );
    }
}
```
