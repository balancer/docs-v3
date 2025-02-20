---
order: 1
title: TypeScript Guide
---

## Add Liquidity with Typescript SDK


This example demonstrates the full flow for removing liquidity from a given pool. The SDK provides functionality to easily fetch pool data from the [Balancer Pools API](https://docs.balancer.fi/guides/API/) and create a transaction with user defined slippage protection. 

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



<GithubCode language="typescript" url="https://raw.githubusercontent.com/MattPereira/v3-pool-operation-examples/refs/heads/main/scripts/hardhat/add-liquidity/addLiquidityUnbalanced.ts" />


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