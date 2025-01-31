---
order: 7
title: Boosted Pools
---

## Boosted Pools Intro

In V3, [Boosted Pools](/concepts/explore-available-balancer-pools/boosted-pool.md) are pools containing ERC4626 yield bearing tokens. These allow for highly capital efficient pools (up to 100%). For example a stable pool could be 100% boosted by containing stataDAI and stataUSDC.

The V3 Vault enables gas-efficient swaps by leveraging the underlying ERC4626 tokens (e.g., DAI and USDC in the previous 100% boosted token). This is accomplished through the use of [ERC4626 Liquidity Buffers](/concepts/vault/buffer.md), an internal mechanism of the Vault designed to optimize efficiency.

When a swap involves an underlying token, the Vault automatically utilizes the available liquidity buffer, bypassing the need to wrap or unwrap tokens through the lending protocol. This significantly reduces gas costs. If no suitable buffer is available, the Vault will default to wrapping or unwrapping tokens as needed to complete the swap.

Any type of pool can be boosted and any ERC4626 token can be used.

As an example, consider two pools:
1. weth/USDC
2. stataUSDC/stataDAI

We can now facilitate a gas efficient swap from weth to dai which would take the following steps:
1. Swap weth to USDC through pool 1
2. Use buffer to swap USDC to stataUSDC
3. Swap stataUSDC to stataDAI through pool 2
4. Use buffer to swap stataDAI to DAI

## Coding A Swap

The swapper has the responsibility to decide whether a specific swap route should use buffers. In the `SwapPathStep` struct the boolean, `isBuffer` should be set true and the `pool` param is the ERC4626 token address:

``` solidity
struct SwapPathStep {
    address pool;  // Should be ERC4626 token address
    IERC20 tokenOut;
    bool isBuffer;  // Should be set to true
}
```

In the case of trading DAI to USDC via a stataDAI/stataUSDC boosted pool the `SwapPathExactAmountIn` would look like:

```solidity
SwapPathExactAmountIn({
    tokenIn: address(DAI),
    steps: [
        SwapPathStep({   ------ Buffer/Wrap step, DAI > stataDAI
            pool: address(stataDAI),
            tokenOut: (address(stataDAI)),
            isBuffer: true
        }),
        SwapPathStep({  ----- Swap step, stataDAI > stataUSDC
            pool: address(boostedPool)
            tokenOut: address(stataUSDC),
            isBuffer: false
        }),
        SwapPathStep({  ---- Buffer/Unwrap step, stataUSDC > USDC
            pool: address(stataUSDC)
            tokenOut: address(USDC),
            isBuffer: true
        })
    ],
    exactAmountIn: myExactAmountIn // your defined amount
    minAmountOut: myMinAmountOut // min amount out
})
```

The trade will execute regardless of whether the Buffer has enough liquidity or not. Remember: If the buffer does not have enough liquidity it will simply additionally wrap or unwrap (and incur additional gas cost).

