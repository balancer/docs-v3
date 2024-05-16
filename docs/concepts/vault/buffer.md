---
title: Liquidity Buffers
order: 9
---

::: info
This page is a work in progress
:::

# Liquidty Buffers

Liquidity Buffers, an internal mechanism of the Vault, facilitate liquidity for pairs of mainToken and wrappedToken. An example of such a pair is DAI and waDAI (wrapped Aave DAI). The Vault provides additional liquidity, enabling the entry into wrapped Token positions without the need to wrap or unwrap tokens, thereby avoiding higher gas costs.

Liquidity buffers operate on a linear curve, incorporating the exchange rate. For instance, the product of waDAI and the exchange rate equals DAI. The exchange rate is retrieved from the ERC4626 Vault during every buffer Swap.

A significant benefit of the Vault's liquidity buffers is that Liquidity Providers (LPs) can now provide liquidity in positions of 100% boosted pools. These pools contain two yield-bearing assets, such as waDAI and waUSDC.

It's important to note that Liquidity Buffers are not Balancer Pools. They are a concept internal to the Vault and only function with Tokens that comply with the ERC4626 Standard.

:::info
If your organization is a DAO and you're seeking to enhance liquidity for your wrapped Token pair, Balancer Liquidity Buffers can be a valuable tool. By providing POL to these buffers, you can enable LPs of your token to gain increased access to yield-bearing tokens. This arrangement allows LPs to concentrate on boosted pools, while your DAO contributes POL to the buffer.
:::

## Adding liquidity to a buffer
You can add liquidity to a buffer for a specific token pair. This is done by invoking the `addLiquidityToBuffer` function, where you designate the ERC4626 Token as the buffer reference. You also specify the amounts of both the wrapped and underlying tokens that you want to add to the buffer. It's important to note that a buffer can still function with zero liquidity. It can be used to wrap and unwrap assets, meaning that even an empty buffer can facilitate the creation of swap paths through the Vault.

## Removing liquidity from a buffer 
After you've added liquidity to a buffer, you have the option to remove it. This is done by invoking the function `removeLiquidityFromBuffer`. This function will subsequently burn a specified amount of your bufferShares and return the corresponding amount of tokens that you had previously provided.

## Using a buffer to swap. 
The swapper has the responsibility to decide whether a specific swap route should use Buffers by indicating if a given `pool` is a buffer. Rember: You can always use a buffer even it is does not have liquidity (instead it will simply wrap or unwrap). This is done by setting the boolean entry in the `SwapPathStep` struct.

The `pool` param in this particular case is the wrapped Tokens entrypoint. Meaning the address where a user would call deposit in. In the case of Aave it would the waUSDC. 
``` solidity
struct SwapPathStep {
    address pool;
    IERC20 tokenOut;
    // if true, pool is a yield-bearing token buffer. Used to wrap/unwrap tokens if pool doesn't have
    // enough liquidity
    bool isBuffer;
}
```

The availability of sufficient liquidity in the buffer affects the gas cost of the swap. If the buffer lacks enough liquidity, the gas cost increases. This is because the Vault has to get the additional liquidity from the lending protocol, which involves either depositing into or withdrawing from it.

### Swapping with a buffer with enough liquidity
Buffers aim to streamline the majority of trades by eliminating the need to wrap or unwrap the swapper's tokens. Instead, they route these tokens through the Balancer trade paths. In the case of trading DAI to USDC via (DAI-waDAI Buffer, waDAI - waUSDC Boosted pool, USDC-waUSDC Buffer)
```solidity
// SwapPathStep for Buffer trade of DAI to waDAI
SwapPathStep({
    pool: address(waDAI), // the address where the Vault calls `deposit` or `mint` depending on SWAP_TYPE and Buffer liquidity
    tokenOut: IERC20(address(waDAI)),
    isBuffer: true
})

// SwapPathStep for Buffer trade of waUSDC to USDC
SwapPathStep({
    pool: address(waDAI), // the address where the Vault calls `deposit` or `mint` depending on SWAP_TYPE and Buffer liquidity
    tokenOut: IERC20(address(USDC)),
    isBuffer: true
})
```

The trade will execute regardless if the Buffer has enough liquidity or not. Remember: If the buffer does not have enough liquidity it will simply additionally wrap& unwrap (and incur additional gas cost).

### Swapping DAI to USDC via 3 hops.
Let's consider a swap from 10k DAI to USDC. the exchangeRate of 1waDAI - DAI is 1.1 & exchangeRate for waUSDC - USDC is 1.1. Involved pools & Buffers are:
- DAI - waDAI Buffer
- waDAI - waUSDC Boosted Pool (100% boosted)
- USDC - waUSDC Buffer

Considering these three pools only, the way to swap through them is via a batchSwap from 

1. Swap DAI to waDAI via the DAI - waDAI Buffer
2. Swap waDAI to waUSDC via the waDAI - waUSDC 100% Boosted pool
3. swap waUSDC to USDC via the USDC - waUSDC Buffer

#### Balances with enough buffer liquidity available

Balances of pool & buffers before the batchswap:

| DAIBufferBalance         | waDAIBufferBalance         |
| --------                 | --------                   |
| 110k DAI                 | 91k waDAI                  | 

| BoostedPool waDAI Balance| BoostedPool waUSDC Balance |
| --------                 | --------                   |
| 900k waDAI               | 900k waUSDC                | 

| USDCBufferBalance        | waUSDCBufferBalance        |
| --------                 | --------                   |
| 100k USDC                | 91k waUSDC                 | 

Balances of pool & buffers after the batchswap:

| DAIBufferBalance         | waDAIBufferBalance                                      |
| ------------------------ | ------------------------------------------------------- |
| 120k DAI <span style="color:green">(+10k DAI)</span>                | 81909.1 waDAI  <span style="color:red">(-9090.9 DAI)</span>            |

| BoostedPool waDAI Balance| BoostedPool waUSDC Balance                              |
| ------------------------ | ------------------------------------------------------- |
| 909090.9 waDAI  <span style="color:green">(+9090.9 waDAI)</span>          | 890909.1 waUSDC <span style="color:red">(-9090.9 waUSDC)</span>           |

| USDCBufferBalance        | waUSDCBufferBalance                                     |
| ------------------------ | ------------------------------------------------------- |
| 90000 USDC <span style="color:red">(-10k USDC)</span>               | 100090.9 waUSDC <span style="color:green">(+9090.9 waUSDC)</span>            |

The liquidiy Buffer faciliated a trade from DAI to USDC. After the trade it is more imbalanced towards DAI. 


### Balances without enough buffer liquidity available

| DAIBufferBalance     | waDAIBufferBalance      |
| --------             | --------                |
| 110k DAI             | 81910 waDAI             | 


### Swapping with a buffer without enough liquidity

USDC to DAI. Use it in context how people will leverage it. Speak to one buffer. 



Also add complicated example:
DAI-WETH (bbausd and usdc-eth). 

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>