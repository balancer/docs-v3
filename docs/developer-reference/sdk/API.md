---
order: 2
title: SDK API Reference
heroImage: /images/backgrounds/purple.png
---

# SDK API Reference

## AddLiquidity

This class provides functionality to:
* Perform on-chain queries to see the result of an addLiquidity operation
* Build an addLiquidity transaction, with slippage, for a consumer to submit
* Supported add types: SingleToken, Unbalanced, Proportional
* Supports Balancer v2 and v3

### Example

See the [addLiquidity guide](../../integration-guides/guides/add-liquidity-to-pool.md) and the [addLiquidity example](https://github.com/balancer/b-sdk/tree/main/examples/addLiquidity/addLiquidity.ts).

### Constructor

```typescript
const addLiquidity = new AddLiquidity();
```

### Methods

### query

Simulate addLiquidity operation by using an onchain call.

```typescript
query(
  input: AddLiquidityInput, 
  poolState: PoolState
): Promise<AddLiquidityQueryOutput>
```

**Parameters**

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| input | [AddLiquidityInput](https://github.com/balancer/b-sdk/tree/main/src/entities/addLiquidity/types.ts#L38) | User defined inputs |
| poolState | [PoolState](https://github.com/balancer/b-sdk/tree/main/src/entities/types.ts#L5) | Current state of pool that liquidity is being added to |

**Returns**

```typescript
Promise<AddLiquidityQueryOutput>
```

[AddLiquidityQueryOutput](https://github.com/balancer/b-sdk/tree/main/src/entities/addLiquidity/types.ts#L54) - Data that can be passed to `buildCall`. Includes updated `bptOut` amount.
___

### buildCall

Builds the addLiquidity transaction using user defined slippage.

```typescript
buildCall(input: AddLiquidityBuildCallInput): AddLiquidityBuildCallOutput
````

**Parameters**

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| input | [AddLiquidityBuildCallInput](https://github.com/balancer/b-sdk/tree/main/src/entities/addLiquidity/types.ts#L63) | Parameters required to build the call including user defined slippage |

**Returns**

```typescript
AddLiquidityBuildCallOutput
```

[AddLiquidityBuildCallOutput](https://github.com/balancer/b-sdk/tree/main/src/entities/addLiquidity/types.ts#L75) - Encoded call data for addLiquidity that user can submit.
___

## RemoveLiquidity

This class provides functionality to:
* Perform on-chain queries to see the result of an removeLiquidity operation
* Build a removeLiquidity transaction, with slippage, for a consumer to submit
* Supported remove types: Unbalanced, SingleTokenExactOutInput, SingleTokenExactInInput, Proportional
* Supports Balancer v2 and v3

### Example

See the [removeLiquidity guide](../../integration-guides/guides/remove-liquidity-from-pool.md) and the [removeLiquidity example](ttps://github.com/balancer/b-sdk/tree/main/examples/removeLiquidity/removeLiquidity.ts).

### Constructor

```typescript
const removeLiquidity = new RemoveLiquidity();
```

### Methods

### query

Simulate removeLiquidity operation by using an onchain call.

```typescript
query(
  input: RemoveLiquidityInput,
  poolState: PoolState,
): Promise<RemoveLiquidityQueryOutput>
```

**Parameters**

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| input | [RemoveLiquidityInput](https://github.com/balancer/b-sdk/tree/main/src/entities/removeLiquidity/types.ts#L52) | User defined inputs |
| poolState | [PoolState](https://github.com/balancer/b-sdk/tree/main/src/entities/types.ts#L5) | Current state of pool that liquidity is being removed from |

**Returns**

```typescript
Promise<RemoveLiquidityQueryOutput>
```

[RemoveLiquidityQueryOutput](https://github.com/balancer/b-sdk/tree/main/src/entities/removeLiquidity/types.ts#L70) - Data that can be passed to `buildCall`. Includes updated `amountsOut` amount.
___

### queryRemoveLiquidityRecovery

Calculates proportional exit using pool state. Note - this does not do an onchain query.

```typescript
queryRemoveLiquidityRecovery(
  input: RemoveLiquidityRecoveryInput,
  poolState: PoolState,
): Promise<RemoveLiquidityQueryOutput> 
```

**Parameters**

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| input | [RemoveLiquidityRecoveryInput](https://github.com/balancer/b-sdk/tree/main/src/entities/removeLiquidity/types.ts#L47) | User defined inputs |
| poolState | [PoolState](https://github.com/balancer/b-sdk/tree/main/src/entities/types.ts#L5) | Current state of pool that liquidity is being removed from |

**Returns**

```typescript
Promise<RemoveLiquidityQueryOutput>
```

[RemoveLiquidityQueryOutput](https://github.com/balancer/b-sdk/tree/main/src/entities/removeLiquidity/types.ts#L70) - Data that can be passed to `buildCall`. Includes updated `amountsOut` amount.
___

### buildCall

Builds the removeLiquidity transaction using user defined slippage.

```typescript
buildCall(
  input: RemoveLiquidityBuildCallInput,
): RemoveLiquidityBuildCallOutput
```

**Parameters**

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| input | [RemoveLiquidityBuildCallInput](https://github.com/balancer/b-sdk/tree/main/src/entities/removeLiquidity/types.ts#L79) | Input with user defined slippage |

**Returns**

```typescript
RemoveLiquidityBuildCallOutput
```

[RemoveLiquidityBuildCallOutput](https://github.com/balancer/b-sdk/tree/main/src/entities/removeLiquidity/types.ts#L83) - Encoded call data for addLiquidity that user can submit.
___

## Swap

This class provides functionality to:
* Perform on-chain queries to see the result of a Swap operation
* Build a Swap transaction, with slippage, for a consumer to submit
* Supports Balancer v2 and v3

### Example

See the [swap guide](../../integration-guides/guides/swaps-with-sor-sdk.md) [swap example](https://github.com/balancer/b-sdk/tree/main/examples/swaps/swap.ts).

### Constructor

```typescript
const swap = new Swap(swapInput: SwapInput);
```

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| swapInput | [SwapInput](https://github.com/balancer/b-sdk/tree/main/src/entities/swap/types.ts#L8) | Swap input including path information. |

Note: `SwapInput` data is normally returned from an API SOR query but may be constructed manually.

### Methods

### query

Gets up to date swap result by querying onchain.

```typescript
query(
  rpcUrl?: string,
  block?: bigint,
): Promise<ExactInQueryOutput | ExactOutQueryOutput> 
```

**Parameters**

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| rpcUrl (optional) | string | RPC URL, e.g. Infura/Alchemy |
| block (optional) | bigint | Block no to perform the query |

**Returns**

```typescript
Promise<ExactInQueryOutput | ExactOutQueryOutput>
```

[ExactInQueryOutput](https://github.com/balancer/b-sdk/tree/main/src/entities/swap/types.ts#L44)
[ExactOutQueryOutput](https://github.com/balancer/b-sdk/tree/main/src/entities/swap/types.ts#L49)

The updated return for the given swap, either `expectedAmountOut` or `expectedAmountIn` depending on swap kind.
___

### buildCall

Builds the swap transaction using user defined slippage.

```typescript
buildCall(
  input: SwapBuildCallInput,
): SwapBuildOutputExactIn | SwapBuildOutputExactOut
```

**Parameters**

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| input | [SwapBuildCallInput](https://github.com/balancer/b-sdk/tree/main/src/entities/swap/types.ts#L21) | Input with user defined slippage |

**Returns**

```typescript
SwapBuildOutputExactIn | SwapBuildOutputExactOut
```

[SwapBuildOutputExactIn](https://github.com/balancer/b-sdk/tree/main/src/entities/swap/types.ts#L31)
[SwapBuildOutputExactOut](https://github.com/balancer/b-sdk/tree/main/src/entities/swap/types.ts#L35)

[RemoveLiquidityBuildCallOutput](https://github.com/balancer/b-sdk/tree/main/src/entities/removeLiquidity/types.ts#L83) - Encoded call data for swap that user can submit. Includes `minAmountOut` or `maxAmountIn` depending on swap kind.
___

### quote

Gives the combined return amount for all paths. Note - this always uses the original path amounts provided in constructor and does not get updated.

```typescript
public get quote(): TokenAmount
```

**Returns**

```typescript
TokenAmount
```

[TokenAmount](https://github.com/balancer/b-sdk/tree/main/src/entities/tokenAmount.ts) - Gives the combined return amount for all paths (output amount for givenIn, input amount for givenOut).
___

### inputAmount

```typescript
public get inputAmount(): TokenAmount
```

**Returns**

```typescript
TokenAmount
```

[TokenAmount](https://github.com/balancer/b-sdk/tree/main/src/entities/tokenAmount.ts) - Gives the combined input amount for all paths.
___

### outputAmount

```typescript
public get outputAmount(): TokenAmount
```

**Returns**

```typescript
TokenAmount
```

[TokenAmount](https://github.com/balancer/b-sdk/tree/main/src/entities/tokenAmount.ts) - Gives the combined output amount for all paths.
___

### queryCallData

```typescript
public queryCallData(): string
```

**Returns**

```typescript
string
```

Encoded query data for swap that a user can call to get an updated amount.
___

## PriceImpact

This class provides helper functions to calculate Price Impact for add/remove/swap actions.
* Supports Balancer v2 and v3

### Example

See the [price impact example](https://github.com/balancer/b-sdk/tree/main/examples/priceImpact/addLiquidity.ts).

### Methods

### addLiquiditySingleToken

Calculate price impact on add liquidity single token operations.

```typescript
addLiquiditySingleToken(
  input: AddLiquiditySingleTokenInput,
  poolState: PoolState,
): Promise<PriceImpactAmount> 
```

**Parameters**

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| input | [AddLiquiditySingleTokenInput](https://github.com/balancer/b-sdk/tree/main/src/entities/addLiquidity/types.ts#L27) | Same input used in the corresponding add liquidity operation |
| poolState | [PoolState](https://github.com/balancer/b-sdk/tree/main/src/entities/types.ts#L5) | Current state of pool that liquidity is being added to |

**Returns**

```typescript
Promise<PriceImpactAmount>
```

[PriceImpactAmount](https://github.com/balancer/b-sdk/tree/main/src/entities/priceImpactAmount.ts) - Price impact for operation.
___
### addLiquidityUnbalanced

Calculate price impact on add liquidity unbalanced operations.

```typescript
addLiquidityUnbalanced = async (
    input: AddLiquidityUnbalancedInput,
    poolState: PoolState,
): Promise<PriceImpactAmount>
```

**Parameters**

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| input | AddLiquidityUnbalancedInput | Same input used in the corresponding add liquidity operation |
| poolState | [PoolState](https://github.com/balancer/b-sdk/tree/main/src/entities/types.ts#L5) | Current state of pool that liquidity is being added to |

**Returns**

```typescript
Promise<PriceImpactAmount>
```

[PriceImpactAmount](https://github.com/balancer/b-sdk/tree/main/src/entities/priceImpactAmount.ts) - Price impact for operation.
___
### addLiquidityNested

Calculate price impact on add liquidity nested token operations.

```typescript
addLiquidityNested = async (
  input: AddLiquidityNestedInput,
  nestedPoolState: NestedPoolState,
): Promise<PriceImpactAmount>
```

**Parameters**

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| input | AddLiquidityNestedInput | Same input used in the corresponding add liquidity operation |
| nestedPoolState | [NestedPoolState](https://github.com/balancer/b-sdk/tree/main/src/entities/types.ts#L43) | Current state of nested pools |

**Returns**

```typescript
Promise<PriceImpactAmount>
```

[PriceImpactAmount](https://github.com/balancer/b-sdk/tree/main/src/entities/priceImpactAmount.ts) - Price impact for operation.
___

### removeLiquidity

Calculate price impact on remove liquidity operations.

```typescript
removeLiquidity = async (
  input:
      | RemoveLiquiditySingleTokenExactInInput
      | RemoveLiquidityUnbalancedInput,
  poolState: PoolState,
): Promise<PriceImpactAmount>
```

**Parameters**

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| input | [RemoveLiquiditySingleTokenExactInInput](https://github.com/balancer/b-sdk/tree/main/src/entities/removeLiquidity/types.ts#L35) | Same input used in the corresponding remove liquidity operation |
| input | [RemoveLiquidityUnbalancedInput](https://github.com/balancer/b-sdk/tree/main/src/entities/removeLiquidity/types.ts#L24) | Same input used in the corresponding remove liquidity operation |
| poolState | [PoolState](https://github.com/balancer/b-sdk/tree/main/src/entities/types.ts#L5) | Current state of pool that liquidity is being removed from |

**Returns**

```typescript
Promise<PriceImpactAmount>
```

[PriceImpactAmount](https://github.com/balancer/b-sdk/tree/main/src/entities/priceImpactAmount.ts) - Price impact for operation.
___

### removeLiquidityNested

Calculate price impact on remove liquidity single token nested operations.

```typescript
removeLiquidityNested = async (
  input: RemoveLiquidityNestedSingleTokenInput,
  nestedPoolState: NestedPoolState,
): Promise<PriceImpactAmount>
```

**Parameters**

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| input | [RemoveLiquidityNestedSingleTokenInput](https://github.com/balancer/b-sdk/tree/main/src/entities/removeLiquidityNested/types.ts#L15) | Same input used in the corresponding remove liquidity operation |
| nestedPoolState | [NestedPoolState](https://github.com/balancer/b-sdk/tree/main/src/entities/types.ts#L43) | Current state of nested pools |

**Returns**

```typescript
Promise<PriceImpactAmount>
```

[PriceImpactAmount](https://github.com/balancer/b-sdk/tree/main/src/entities/priceImpactAmount.ts) - Price impact for operation.
___

### swap

Calculate price impact on swap operations.

```typescript
swap = async (
  swapInput: SwapInput,
  rpcUrl?: string,
  block?: bigint,
): Promise<PriceImpactAmount>
```

**Parameters**

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| swapInput | [SwapInput](https://github.com/balancer/b-sdk/tree/main/src/entities/swap/types.ts#L8) | Swap input including path information. |
| rpcUrl (optional) | string | RPC URL, e.g. Infura/Alchemy |
| block (optional) | bigint | Block no to perform the query |

Note: `SwapInput` data is normally returned from an API SOR query but may be constructed manually.

**Returns**

```typescript
Promise<PriceImpactAmount>
```

[PriceImpactAmount](https://github.com/balancer/b-sdk/tree/main/src/entities/priceImpactAmount.ts) - Price impact for operation.
___

## BalancerApi

This class provides helper functions for interacting with the Balancer API.

### Example

See the examples for add/remove/swap linked above as these use BalancerApi to fetch required data.

### Constructor

```typescript
const balancerApi = new BalancerApi(balancerApiUrl: string, chainId: ChainId);
```

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| balancerApiUrl | string | Url of Balancer API |
| chainId | [ChainId](https://github.com/balancer/b-sdk/tree/main/src/utils/constants.ts#L54) | Chain that will be queried |

### Methods

### pools.fetchPoolState

Finds state of given pool.

```typescript
pools.fetchPoolState(id: string): Promise<PoolState> 
```

**Parameters**

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| id | string | ID of pool, v2=poolId, v3=address |

**Returns**

```typescript
Promise<PoolState>
```

[PoolState](https://github.com/balancer/b-sdk/tree/main/src/entities/types.ts#L5) - State of given pool.
___

### pools.fetchPoolStateWithBalances

Finds state of given pool including token balances and pool shares.

```typescript
fetchPoolStateWithBalances(
  id: string,
): Promise<PoolStateWithBalances> 
```

**Parameters**

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| id | string | ID of pool, v2=poolId, v3=address |

**Returns**

```typescript
Promise<PoolStateWithBalances>
```

[PoolStateWithBalances](https://github.com/balancer/b-sdk/tree/main/src/entities/types.ts#L13) - State of given pool including token balances and pool shares.
___

### nestedPools.fetchPoolState

Finds state of a set of nested pools.

```typescript
fetchNestedPoolState(id: string): Promise<NestedPoolState>
```

**Parameters**

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| id | string | ID of pool, v2=poolId, v3=address |

**Returns**

```typescript
Promise<NestedPoolState>
```

[NestedPoolState](https://github.com/balancer/b-sdk/tree/main/src/entities/types.ts#L43) - state of a set of nested pools.
___
### sorSwapPaths.fetchSorSwapPaths

Finds optimized swap paths for a given swap config.

```typescript
fetchSorSwapPaths(sorInput: SorInput): Promise<Path[]>
```

**Parameters**

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| sorInput | [SorInput](https://github.com/balancer/b-sdk/tree/main/src/data/providers/balancer-api/modules/sorSwapPaths/index.ts#L8) | Swap configs |

**Returns**

```typescript
Promise<Path[]>
```

[Path[]](https://github.com/balancer/b-sdk/tree/main/src/entities/swap/paths/types.ts#L6) - optimized swap paths for the given swap.
___

## Utils

Helper functions.

### calculateProportionalAmounts

Given pool balances (including BPT) and a reference token amount, it calculates all other amounts proportional to the reference amount.

### Example

See the [price impact example](https://github.com/balancer/b-sdk/tree/main/examples/priceImpact/addLiquidity.ts).

```typescript
calculateProportionalAmounts(
  pool: {
    address: Address;
    totalShares: HumanAmount;
    tokens: { 
      address: Address; 
      balance: HumanAmount; 
      decimals: number 
    }[];
  },
  referenceAmount: InputAmount,
): {
  tokenAmounts: InputAmount[];
  bptAmount: InputAmount;
}
```

**Parameters**

| Name               | Type          | Description   |
| -------------      | ------------- | ------------  |
| pool | See above | Pool state |
| referenceAmount | [InputAmount](https://github.com/balancer/b-sdk/tree/main/src/types.ts#L43) | Ref token amount |

**Returns**

```typescript
{
  tokenAmounts: InputAmount[];
  bptAmount: InputAmount;
}
```

Amounts proportional to the reference amount.
___

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>