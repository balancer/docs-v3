---
order: 1
title: TypeScript SDK Tutorial
---

## Remove Liquidity with Typescript SDK

This guide demonstrates how to remove liquidity from a pool. We will use the preferred function for removing liquidity, removeLiquidityProportional. Tokens are removed from the pool in proportional amounts, causing zero price impact and avoiding the swap fee charged when exiting non-proportional. Specifying an exactBptAmountIn ensures that the user will not be left with any dust. See the [Router API](/developer-reference/contracts/router-api.html) for other supported remove methods.

_This guide is for removing liquidity from Balancer v3 with the [b-sdk](https://github.com/balancer/b-sdk). This sdk supports removing liquidity from Balancer v3, Balancer v2 as well as Cow-AMMs._

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

### Example Script

Run this example script on a local fork of Ethereum mainnet using our [v3 pool operation examples repo](https://github.com/MattPereira/v3-pool-operation-examples/tree/main?tab=readme-ov-file#balancer-v3-pool-operation-examples)

<GithubCode url="https://raw.githubusercontent.com/MattPereira/v3-pool-operation-examples/refs/heads/main/scripts/hardhat/remove-liquidity/removeLiquidityProportional.ts" clipEndLines=8 clipStartLines=4 />

The four main helper classes we use from the SDK are:

- `BalancerApi` - to simplify retrieving pool data from the Pools API
- `RemoveLiquidity` - to build removeLiquidity queries and transactions
- `Slippage` - to simplify creating limits with user defined slippage
- `PermitHelper` - to simplify creating a permit signature

### Fetch Pool Data

In this example we use the BalancerApi `fetchPoolState` function to fetch the pool data required for the removeLiquidityProportional `poolState` parameter.

```typescript
const balancerApi = new BalancerApi('https://api-v3.balancer.fi/', chainId);
const poolState = await balancerApi.pools.fetchPoolState(pool);
```

To see the full query used to fetch pool state refer to the code [here](https://github.com/balancer/b-sdk/blob/41d2623743ab7fa466ed4d0f5f5c7e5aa16b7d91/src/data/providers/balancer-api/modules/pool-state/index.ts#L7).

### Query remove liquidity

[Router queries](../../concepts/router/queries.md) allow for simulation of operations without execution. In this example, when the `query` function is called:

```typescript
const queryOutput = await removeLiquidity.query(
  removeLiquidityInput,
  poolState
);
// queryOutput.amountsOut
```

The Routers [queryRemoveLiquidityUnbalanced](../../developer-reference/contracts/router-api.md#queryremoveliquidityproportional) function is used to find the amount of pool tokens that would be received, `amountsOut`.

### Build the call with permit and slippage

The `PermitHelper` abstracts away the complexity involved with creating a permit signature

```typescript
const permit = await PermitHelper.signRemoveLiquidityApproval({
  ...queryOutput,
  slippage,
  client: walletClient.extend(publicActions),
  owner: walletClient.account,
});
```

Then `buildCallWithPermit` uses the `amountsOut` and the user defined `slippage` to calculate the `minAmountsOut`:

```typescript
const call = removeLiquidity.buildCallWithPermit(
  { ...queryOutput, slippage },
  permit2
);
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

### Send the call

The output of the `buildCallWithPermit` function provides all that is needed to submit the removeLiquidity transaction:

- `to` - the address of the Router
- `callData` - the encoded call data
- `value` - the native asset value to be sent

It also returns the `minAmountsOut` amounts which can be useful to display/validation purposes before the transaction is sent.

```typescript
const hash = await walletClient.sendTransaction({
  account: walletClient.account,
  data: call.callData,
  to: call.to,
  value: call.value,
});
```
