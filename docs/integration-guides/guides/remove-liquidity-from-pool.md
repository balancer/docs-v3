---
order: 2
title: Remove liquidity from a pool
---

# Remove liquidity from a pool

This guide demonstrates how to remove liquidity from a pool. We will use the preferred function for removing liquidity, `removeLiquidityProportional`. Tokens are removed from the pool in proportional amounts, causing zero price impact and avoiding the swap fee charged when exiting non-proportional. Specifying an exactBptAmountIn ensures that the user will not be left with any dust. See the [Router API](../router/overview.html) for other supported remove methods.

_This guide is for removing liquidity to Balancer v3. If you're looking to remove liquidity from a Balancer v2 pool, start [here](https://docs.balancer.fi/guides/builders/exit-pool.html)._

## Core Concepts

The core concepts of removing liquidity are the same for any programming language or framework:
* When removing liquidity the user sends [Balancer Pool Tokens](../../concepts/core-concepts/balancer-pool-tokens.md) (BPTs), and will receive pool tokens
* Unlike standard ERC20s, the vault has control over the supply of BPT, so there is no need for the sender to make approvals when sending BPTs. For more info see: [Balancer Pool Token](../../concepts/core-concepts/balancer-pool-tokens.md)
* Token amount inputs/outputs are always in the raw token scale, e.g. `1 USDC` should be sent as `1000000` because it has 6 decimals
* Transactions are always sent to the [Router](../../concepts/router/overview.md)

The Router interface for `removeLiquidityProportional` is:
```solidity
 /**
* @notice Removes liquidity with proportional token amounts from a pool, burning an exact pool token amount.
* @param pool Address of the liquidity pool
* @param exactBptAmountIn Exact amount of pool tokens provided
* @param minAmountsOut Minimum amounts of tokens to be received
* @param wethIsEth If true, outgoing WETH will be unwrapped to ETH; otherwise the Vault will send WETH tokens
* @param userData Additional (optional) data required for removing liquidity
* @return amountsOut Actual amounts of tokens received
*/
function removeLiquidityProportional(
    address pool,
    uint256 exactBptAmountIn,
    uint256[] memory minAmountsOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256[] memory amountsOut);
```

* `exactBptAmountIn` defines the exact amount of the pool token that will be sent.
* `minAmountsOut` defines the minimum amount of each token to receive. If the amount is less than this (e.g. because of slippage) the transaction will revert. _Note: these values correspond to the same index value of pool tokens which are sorted alphanumerically_
* If `wethIsEth` is set to `true`, and a pool token is `WETH`, the Router will unwrap to `ETH` and forward to the sender.
* `userData` allows additional parameters to be provided for custom pool types. In most cases it is not required and a value of `0x` can be provided.

The following sections provide specific implementation details for Javascript (with and without the SDK) and Solidity.

## Javascript With SDK

This example demonstrates the full flow for removing liquidity from a given pool. The SDK provides functionality to easily fetch pool data from the [Balancer Pools API](https://docs.balancer.fi/guides/API/) and create a transaction with user defined slippage protection. 

```typescript
import {
  BalancerApi,
  ChainId,
  InputAmount,
  PoolState,
  RemoveLiquidity,
  RemoveLiquidityInput,
  RemoveLiquidityKind,
  Slippage,
} from "@balancer/sdk";

// User defined:
const chainId = ChainId.MAINNET;
const userAccount = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
const rpcUrl = "RPC_END_POINT";
// Balancer v3 uses the pool address as the poolId.
const pool =
  "0x1e5b830439fce7aa6b430ca31a9d4dd775294378";
const slippage = Slippage.fromPercentage("1"); // 1%

// API can be used to fetch relevant pool data
const balancerApi = new BalancerApi(
  "https://api-v3.balancer.fi/",
  chainId
);
const poolState: PoolState = await balancerApi.pools.fetchPoolState(pool);

// Construct the RemoveLiquidityInput, in this case a RemoveLiquiditySingleTokenExactIn
const bptIn: InputAmount = {
  rawAmount: 1000000000000000000n,
  decimals: 18,
  address: poolState.address,
};

// Construct the RemoveLiquidityInput, in this case an RemoveLiquidityProportional
const removeLiquidityInput: RemoveLiquidityInput = {
  chainId,
  rpcUrl,
  bptIn,
  kind: RemoveLiquidityKind.Proportional,
};

// Query removeLiquidity to get the token out amounts
const removeLiquidity = new RemoveLiquidity();
const queryOutput = await removeLiquidity.query(
  removeLiquidityInput,
  poolState
);

console.log(
  `BPT In: ${queryOutput.bptIn.amount.toString()},\nExpected Tokens Out:`
);
console.table({
  tokensOut: queryOutput.amountsOut.map((a) => a.token.address),
  amountsOut: queryOutput.amountsOut.map((a) => a.amount),
});

// Applies slippage to the tokens out amounts and constructs the call
const call = removeLiquidity.buildCall({
  ...queryOutput,
  slippage,
  chainId,
  wethIsEth: false,
});

console.log(`Min Tokens Out:`);
console.table({
  tokensOut: call.minAmountsOut.map((a) => a.token.address),
  minAmountsOut: call.minAmountsOut.map((a) => a.amount),
});

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
* `RemoveLiquidity` - to build removeLiquidity queries and transactions
* `Slippage` - to simplify creating limits with user defined slippage 

### Fetching Pool Data

In this example we use the BalancerApi `fetchPoolState` function to fetch the pool data required for the removeLiquidityProportional `poolState` parameter. 
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
const queryOutput = await removeLiquidity.query(removeLiquidityInput, poolState);
// queryOutput.amountsOut
```
The Routers [queryRemoveLiquidityUnbalanced](../../developer-reference/contracts/router-api.md#queryremoveliquidityproportional) function is used to find the amount of pool tokens that would be received, `amountsOut`.

In the next step `buildCall` uses the `amountsOut` and the user defined `slippage` to calculate the `minAmountsOut`:
```typescript
const call = removeLiquidity.buildCall({
    ...queryOutput,
    slippage,
    chainId,
    wethIsEth: false,
});
```

In the full example above, we defined our slippage as `Slippage.fromPercentage('1')`, meaning that we if we do not receive at least 99% of our expected `amountsOut`, the transaction should revert.
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

The output of the `buildCall` function provides all that is needed to submit the removeLiquidity transaction:
* `to` - the address of the Router
* `callData` - the encoded call data
* `value` - the native asset value to be sent

It also returns the `minAmountsOut` amounts which can be useful to display/validation purposes before the transaction is sent.

## Javascript Without SDK

The following Viem and Ethers snippets demonstrate how to perform a remove liquidity proportional operation. To achieve this, we use two Router functions:

* [`removeLiquidityProportional`](../../developer-reference/contracts/router-api.md#removeliquidityproportional) - Remove liquidity from a pool in proportional amounts.
* [`queryRemoveLiquidityProportional`](../../developer-reference/contracts/router-api.md#queryremoveliquidityproportional) - The [router query](../../concepts/router/queries.md) used to simulate a remove liquidity unbalanced operation. It returns the exact amounts of tokens that would be received.

**Resources**:
* [Router ABI](../../developer-reference/contracts/abi/router.md)
* [Router deployment addresses](../../reference/contracts)

::: code-tabs#shell
@tab Viem
```typescript
// Query operation
const client = createPublicClient({
    transport: http(RPC_URL),
    chain: sepolia,
});

const { result: amountsOut } = await client.simulateContract({
    address: routerAddress,
    abi: routerAbi,
    functionName: "queryRemoveLiquidityProportional",
    args: [
        "0x1e5b830439fce7aa6b430ca31a9d4dd775294378", // pool address
        100000000000000000n, // token amounts in raw form
        [0n, 0n], // minAmountsOut set to 0 when querying
        "0x", // userData, set to 0x in most scenarios
    ],
});

// Sending transaction
const walletClient = createWalletClient({
  transport: http(RPC_URL),
  chain: sepolia,
});

const hash = await walletClient.writeContract({
    address: routerAddress,
    abi: routerAbi,
    functionName: "removeLiquidityProportional",
    args: [
        "0x1e5b830439fce7aa6b430ca31a9d4dd775294378", // pool address
        100000000000000000n, // token amounts in raw form
        [90000000000000000n, 90000000000000000n], // minAmountsOut must be set appropriately
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

const amountsOut = await router.queryRemoveLiquidityProportional.staticCall(
    "0x1e5b830439fce7aa6b430ca31a9d4dd775294378", // pool address
    100000000000000000n, // token amounts in raw form
    [0n, 0n], // minAmountsOut set to 0 when querying
    "0x" // userData, set to 0x in most scenarios
);

// Sending transaction
const tx = await router.removeLiquidityProportional(
    "0x1e5b830439fce7aa6b430ca31a9d4dd775294378", // pool address
    100000000000000000n, // token amounts in raw form
    [0n, 0n], // minAmountsOut set to 0 when querying
    false, // wethIsEth for Eth wrapping
    "0x" // userData, set to 0x in most scenarios
);
```
:::

## Solidity

The following code snippet shows how to remove liquidity from a smart contract.

::: warning Queries should not be used onchain to set minAmountOut due to possible manipulation via frontrunning.
:::

```solidity
pragma solidity ^0.8.4;

// TODO - Assume there will be interface type package? Needs updated when released.
import "@balancer-labs/...../IRouter.sol";

contract RemoveLiquidityProportional {
    IRouter public router;

    constructor(IRouter _router) {
      router = _router;
    }

    function removeLiquidityProportional(
        address pool,
        uint256 exactBptAmountIn,
        uint256[] memory minAmountsOut,
        bool wethIsEth,
        bytes memory userData
    ) external override {
        router.removeLiquidityProportional(
          pool,
          exactBptAmountIn,
          minAmountsOut,
          wethIsEth,
          userData
        );
    }
}
```
