---
order: 3
title: Swapping with the Balancer Smart Order Router and SDK
---

# Swapping with the Balancer Smart Order Router and SDK

This guide showcases the capabilities of the Balancer Smart Order Router (SOR) accessible through the Balancer API, focusing on its ability to identify optimal swap paths for a given token pair. Subsequently, we explore the process of utilizing the SDK to seamlessly create and execute swap transactions.

_This guide uses the Balancer API SOR which will find the best result using v2 and v3 liquidity. The SDK supports both._

```typescript
import {
    Token,
    TokenAmount,
    ChainId,
    Slippage,
    SwapKind,
    SwapBuildCallInput,
    SwapBuildOutputExactIn
} from '../../src';

import { querySmartPath } from './querySmartPath';
import { setupExampleFork } from '../lib/setupExampleFork';
import { TOKENS } from 'test/lib/utils';

// Choose chain id to start fork
const chainId = ChainId.MAINNET;
const { client, rpcUrl, userAccount } = await setupExampleFork({ chainId });

// User defines these params for querying swap with SOR
const swapKind = SwapKind.GivenIn;
const tokenIn = new Token(
    chainId,
    TOKENS[chainId].WETH.address,
    TOKENS[chainId].WETH.decimals,
    'WETH',
);
const tokenOut = new Token(
    chainId,
    TOKENS[chainId].BAL.address,
    TOKENS[chainId].BAL.decimals,
    'BAL',
);
const wethIsEth = false; // If true, incoming ETH will be wrapped to WETH, otherwise the Vault will pull WETH tokens
const deadline = 999999999999999999n; // Deadline for the swap, in this case infinite
const slippage = Slippage.fromPercentage("0.1"); // 0.1%
const swapAmount =
    swapKind === SwapKind.GivenIn
        ? TokenAmount.fromHumanAmount(tokenIn, '1')
        : TokenAmount.fromHumanAmount(tokenOut, '1');

// queries the Balancer Smart Order Router (SOR) for the best swap path.
// The SOR returns the best route for either Balancer V2
// or Balancer V3. This information is bundled in the swap.
const { swap, queryOutput } = await querySmartPath({
    rpcUrl,
    chainId,
    swapKind,
    tokenIn,
    tokenOut,
    swapAmount,
});

console.log(
    `Input token: ${swap.inputAmount.token.address}, Amount: ${swap.inputAmount.amount}`
);
console.log(
    `Output token: ${swap.outputAmount.token.address}, Amount: ${swap.outputAmount.amount}`
);

let buildInput: SwapBuildCallInput;

// In v2 the sender/recipient can be set, in v3 it is always the msg.sender
if (swap.protocolVersion === 2) {
    buildInput = {
        slippage,
        deadline,
        queryOutput: queryOutput,
        wethIsEth,
        sender: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
        recipient: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
    };
} else {
    buildInput = {
        slippage,
        deadline,
        queryOutput: queryOutput,
        wethIsEth,
    };
}
const callData = swap.buildCall(buildInput) as SwapBuildOutputExactIn;

console.log(
    `Min Amount Out: ${callData.minAmountOut.amount}\n\nTx Data:\nTo: ${callData.to}\nCallData: ${callData.callData}\nValue: ${callData.value}`
);
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

The three main helpers we use from the SDK are:
* `querySmartPath` - to query the SOR for optimized swap path and query the swap
* `Swap` - to build swap queries and transactions
* `Slippage` - to simplify creating limits with user defined slippage 

### Fetching Optimized Swap Paths

In this example we use the BalancerApi `fetchSorSwapPaths` function via `querySmartPath` to fetch the optimized swap paths for a token pair and swap amount. 
```typescript
const balancerApi = new BalancerApi(
    'https://api-v3.balancer.fi/',
    chainId,
);
const sorPaths = await balancerApi.sorSwapPaths.fetchSorSwapPaths({
    chainId,
    tokenIn: tokenIn.address,
    tokenOut: tokenOut.address,
    swapKind,
    swapAmount,
});
```
To see the full query used to fetch pool state refer to the code [here](https://github.com/balancer/b-sdk/blob/main/src/data/providers/balancer-api/modules/sorSwapPaths/index.ts#L19).

:::tip Liquidity Source
By default the API will return the swap that gives the best result from either v2 or v3 liquidity. The version can be forced by setting the optional `querySmartPath`, `useProtocolVersion` input parameter.
:::

### Queries and safely setting slippage limits

[Router queries](../../concepts/router/queries.md) allow for simulation of operations without execution. In this example, the `querySmartPath` helper also returns the `queryOutput`. 

An onchain call is used to find an updated result for the swap paths from the SOR.

```typescript
// Get up to date swap result by querying onchain
const queryOutput = await swap.query(rpcUrl);
```

In the next step `buildCall` uses the `swapAmount` and the user defined `slippage` to calculate the `minAmountOut`:
```typescript
const callData = swap.buildCall(buildInput) as SwapBuildOutputExactIn;
```

In the full example above, we defined our slippage as `Slippage.fromPercentage('0.1')`, meaning that we if we do not receive at least 99% of our expected `swapAmount`, the transaction should revert.
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
if (swap.vaultVersion === 2) {
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
