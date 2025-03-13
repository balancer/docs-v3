---
order: 3
title: Swapping with the Balancer Smart Order Router and SDK
---

# Swapping with the Balancer Smart Order Router and SDK

This guide showcases the capabilities of the Balancer Smart Order Router (SOR) accessible through the Balancer API, focusing on its ability to identify optimal swap paths for a given token pair. Subsequently, we explore the process of utilizing the SDK to seamlessly create and execute swap transactions.

_This guide uses the Balancer API SOR which will find the best result using v2 and v3 liquidity. The SDK supports both._

<GithubCode url="https://raw.githubusercontent.com/balancer/balancer-v3-sdk-examples/refs/heads/main/scripts/swap/swapSmartPath.ts" clipStartLines=4 clipEndLines=8 />

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
* `BalancerApi` - to query the SOR for optimized swap path
* `Swap` - to build swap queries and transactions
* `Slippage` - to simplify creating limits with user defined slippage 

### Fetching Optimized Swap Paths

In this example we use the BalancerApi `fetchSorSwapPaths` function to fetch the optimized swap paths for a token pair and swap amount. 
```typescript
const balancerApi = new BalancerApi('https://api-v3.balancer.fi/', chainId);
const paths = await balancerApi.sorSwapPaths.fetchSorSwapPaths({
    chainId,
    tokenIn: tokenIn.address,
    tokenOut: tokenOut.address,
    swapKind,
    swapAmount,
});
```
To see the full query used to fetch pool state refer to the code [here](https://github.com/balancer/b-sdk/blob/main/src/data/providers/balancer-api/modules/sorSwapPaths/index.ts#L19).

:::tip Liquidity Source
By default the API will return the swap that gives the best result from either v2 or v3 liquidity. The version can be forced by setting the optional `fetchSorSwapPaths`, `useProtocolVersion` input parameter.
:::

### Queries and safely setting slippage limits

[Router queries](../../concepts/router/queries.md) allow for simulation of operations without execution. In this example, when the `query` function is called: 

```typescript
const queryOutput = await swap.query(rpcUrl, await client.getBlockNumber());
```
An onchain call is used to find an updated result for the swap paths, `expectedAmountOut`.

In the next step `buildCall` uses the `amount` and the user defined `slippage` to calculate the `minAmountOut`:
```typescript
const call = swap.buildCallWithPermit2({ queryOutput, slippage }, permit2);
```

In the full example above, we defined our slippage as `Slippage.fromPercentage('1')`, meaning that we if we do not receive at least 99% of our expected `amount`, the transaction should revert.
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

::: tip v2 vs v3 differences
In Balancer v2 the swap functions required the user to define the `sender` and `recipient` as part of the [FundManagement](https://docs.balancer.fi/reference/swaps/batch-swaps.html#fundmanagement-struct) parameter. In v3 this is no longer an option and the msg.sender is always the sender/recipient. `swap.protocolVersion` is used to correctly construct the parameters for the `buildCall` function:

```typescript
let buildInput: SwapBuildCallInput;
// In v2 the sender/recipient can be set, in v3 it is always the msg.sender
if (swap.protocolVersion === 2) {
    buildInput = {
        slippage,
        deadline,
        queryOutput: updated,
        wethIsEth,
        sender: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    };
} else {
    buildInput = {
        slippage,
        deadline,
        queryOutput: updated,
        wethIsEth,
    };
}
```
:::


### Constructing the call

The output of the `buildCall` function provides all that is needed to submit the swap transaction:
* `to` - the address the transaction should be sent to
* `callData` - the encoded call data
* `value` - the native asset value to be sent

It also returns the `minAmountOut` amount which can be useful to display/validation purposes before the transaction is sent.
