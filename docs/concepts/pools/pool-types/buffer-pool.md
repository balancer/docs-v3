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