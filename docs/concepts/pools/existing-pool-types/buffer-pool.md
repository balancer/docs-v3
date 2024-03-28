---
order: 3
title: Buffer Pool
---

# Buffer Pool

- Buffer pools are special purpose pools
- Designed to trade two correlated assets. Specifically a STANDARD TOKEN & ERC4626 TOKEN
- Intention is to use liquidity of these to increase capital efficiency of boosted pools. 
- Buffer pools allow LPs in boosted pools to gain a higher underlying apr exposure as all their funds are boosted, not only a portion
- Creation is guarded behind Balancer governance (Authorizer)
- They are designed for DAOs to place liquidity in them to achieve capital efficiency for LPs in boosted Pools for users who user their platform. As an example. Aave might want to add liquidity to a DAI-waDAI Buffer pool to increase the yield LPs can get when LPing in a Aaave boosted Dai pool.
- Their intention is to facilitate trades without the need to wrap & unwrap tokens required to save gas, the buffer pool "holds" liquidity which trades want to allow LPs to gain higher capital efficiency
- It is only possible to add liquidity to buffer pools via addLiquidityCustom. 
- TODO: add section on different `onSwap` call contexts.

A buffer pool is a special purpose Balancer pool. It's intention is to allow LPs of boosted pools to gain more capital efficiency but still allow Trades on Balancer to swap tokens that are part of boosted pools without needing to wrap&unwrap them on every swap. 

The buffer tokens are kept in the Vault, ready for immediate swaps. This approach allows gas efficient swaps with boosted pool tokens.

Buffer pools can only be joined & exited proportionally.

Whenever a trade where the tokenIn amount is lower than the totalLiquidity of the pool, the pool will rebalance itself to support that given trade. This achieves great utilization of liquidity available in the pool. 

## Trade scenarios

Buffer pools behaviour is dependant on individual token liquidity, total pool liquidity & trade size. Based on these parameters it is determined if a trade can be faciliated & how or if no trade is possible.

| TradeInSize | BalanceTokenIn | BalanceTokenOut | CanBufferTrade | BufferAction              |
|-------------|----------------|-----------------|----------------|---------------------------|
| 10k         | 100k           | 100k            | yes            | nothing                   |
| 150k        | 100k           | 100k            | yes            | more precise counter swap |
| 30k         | 180k           | 20k             | yes            | do a 50/50 rebalance      |
| 150k        | 180k           | 20k             | yes            | more precise counter swap |
| 250k        | 100k           | 100k            | no             |                           |