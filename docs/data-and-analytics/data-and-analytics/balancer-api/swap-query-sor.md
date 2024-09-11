---
title: Swap - Query the Smart Order Router
---

# Swap - Query the Smart Order Router (SOR)

In this example we query for best paths to swap 1WETH to USDC. Note the use of human scaled amount.

```graphql
{
  sorGetSwapPaths(
    chain: MAINNET
    swapAmount: "1"
    swapType: EXACT_IN
    tokenIn: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2"
    tokenOut: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48"
  ) {
    swapAmountRaw
    returnAmountRaw
    priceImpact {
      priceImpact
      error
    }
  }
}
```