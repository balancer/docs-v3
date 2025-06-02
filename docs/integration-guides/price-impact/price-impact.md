# Price Impact

Price Impact refers to the change in the price of a token caused by a trade. It is particularly relevant when swapping tokens but is also indirectly connected to adding/removing liquidity.

The [Balancer Frontend](https://balancer.fi/pools) calculates and displays Price Impact using different methods depending on the action being taken and some more detail for each is given below.

## Swaps

Price impact for swaps is calculated using a simple market-based formula that compares the USD value of tokens going in versus tokens coming out.

The main price impact calculation for swaps uses the [calcMarketPriceImpact](https://github.com/balancer/frontend-monorepo/blob/2e07683bcfcfbe60027d460eed7944341647470e/packages/lib/modules/price-impact/price-impact.utils.ts#L53) function. This implements a simple but effective calculation:

1. It compares the USD value of the input token versus the USD value of the output token
2. Uses the formula: `priceImpact = 1 - (usdOut / usdIn)`
3. Only considers negative differences (positive differences are treated as 0)
4. Returns the absolute value as a percentage

Note: The calculation is specifically designed for swaps and uses current market prices rather than pool-specific mathematical models.

## Adds/Removes

The [Balancer SDK](https://github.com/balancer/b-sdk/blob/main/src/entities/priceImpact/index.ts) is used to calcuate the PI for add/remove operations. The core of price impact calculation in the SDK is the "ABA method." This approach measures price impact by comparing initial and final state after a round-trip operation. (For more details checkout the [deepwiki](https://deepwiki.com/balancer/b-sdk/3.5-price-impact-calculation))

Note: Proporitonal add/remove liquidity operations have zero price impact by design.

The SDK's PriceImpact class provides static methods for calculating price impact across different operation types:

| Method                          | Operation Type                   | Description                                                                 |
|----------------------------------|----------------------------------|-----------------------------------------------------------------------------|
| `addLiquiditySingleToken`        | Adding a single token            | Calculates impact when adding a single token type to a pool                |
| `addLiquidityUnbalanced`         | Unbalanced liquidity addition    | Calculates impact when adding multiple tokens in non-proportional amounts |
| `addLiquidityUnbalancedBoosted`  | Boosted pool unbalanced addition | Handles unbalanced addition for pools with ERC4626 tokens                  |
| `addLiquidityNested`             | Nested pool addition             | Calculates composite impact when adding to pools containing other pools    |
| `removeLiquidity`                | Removing liquidity               | Calculates impact when removing liquidity from a pool                      |
| `removeLiquidityNested`          | Nested pool removal              | Calculates impact when removing from nested pool structures                |

The psuedo code example showing how PI is calculated for an unbalanced boosted pool add action is shown below ([full code](https://github.com/balancer/frontend-monorepo/blob/07efb962d0f8da94ffb68a9c3a62052216560aa3/packages/lib/modules/pool/actions/add-liquidity/handlers/BoostedUnbalancedAddLiquidityV3.handler.ts#L25)):

```typescript
import {
  PriceImpact,
  PriceImpactAmount,
} from '@balancer/sdk'

export class BoostedUnbalancedAddLiquidityV3Handler extends BaseUnbalancedAddLiquidityHandler {
  public async getPriceImpact(humanAmountsIn: HumanTokenAmountWithAddress[]): Promise<number> {
    if (areEmptyAmounts(humanAmountsIn)) {
      // Avoid price impact calculation when there are no amounts in
      return 0
    }

    const addLiquidityInput = this.constructSdkInput(humanAmountsIn)

    const priceImpactABA: PriceImpactAmount = await PriceImpact.addLiquidityUnbalancedBoosted(
      addLiquidityInput,
      this.helpers.boostedPoolState
    )

    return priceImpactABA.decimal
  }

  protected constructSdkInput(
    humanAmountsIn: HumanTokenAmountWithAddress[],
    userAddress?: Address
  ): AddLiquidityUnbalancedInput {
    const amountsIn = this.helpers.toSdkInputAmounts(humanAmountsIn)

    return {
      chainId: this.helpers.chainId,
      rpcUrl: getRpcUrl(this.helpers.chainId),
      amountsIn,
      kind: AddLiquidityKind.Unbalanced,
      sender: getSender(userAddress),
    }
  }
}
```