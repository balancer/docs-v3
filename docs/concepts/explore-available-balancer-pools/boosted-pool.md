---
order: 5
title: Boosted Pool
---
# Boosted Pools

## Overview

Boosted Pools refer to any pool, which has a yield-bearing token as part of its tokens. This can range from 25% of a pools tokens up to 100% of a pools token being a yield bearing asset. Boosted pools are not tied to particular trading math but will be most likely utilizing [Stable Math](/concepts/explore-available-balancer-pools/stable-pool/stable-math.html) due to how well stable math works for correlated assets. 

### Advantages of Boosted pools

The main advantage for boosted pools in the balancer ecosystem are:

#### 100% yield bearing possibility
Balancer V3 boosted pools allow for 100% of an LP position to be considered boosted, meaning to be a yield bearing token. Prominent examples are bb-a-USD which is a StablePool containing Aave yield bearing DAI (`aDAI`), Aave yield bearing USDC (`aUSDC`) and Aave yield bearing USDT (`aUSDT`). Balancer V3 is architected to have the pool communicate it's reserves always in the base assets `DAI`, `USDC`, `USDT`. From a user perspective you simply get a Stablecoin pool with 100% yield bearing components. Any drawbacks such as complicated swap-paths, expensive wrapping & unwrapping, liquidity exploration via aggregators is solved on a higher level Balancer V3 smart contract architecture.

#### gas efficient swaps between boosted pool's base assets
Boosted pools heavily rely on the Vault's concept of [liquidity buffers](concepts/vault/buffer.html#erc4626-liquidity-buffers) to facility gas-efficient swaps across boosted pools. This keeps LPs in 100% boosted pool positions while still being able to earn swap fees for base-asset to base-asset trades. 

#### Boosted pools are "plug&play" for ERC4626 Vaults
Any token that complies with the ERC4626 standard can easily become an asset within a boosted pool and can be swapped on balancer gas efficiently while keeping swap prices competitive due to [liquidity buffers](concepts/vault/buffer.html#erc4626-liquidity-buffers).

#### Great way for a DAO to facility liquidity for their token product
Boosted pools are a great way to bring LSTs and yield bearing tokens to market. As a DAO you can fund [liquidity buffers](concepts/vault/buffer.html#erc4626-liquidity-buffers) with yield-bearing asset - base-asset and allow your users to participate from the upside 100% boosted pools offer, while offering the same "entry" price to your LST or yield-bearing token, a user would get when entering natively.

### Examples