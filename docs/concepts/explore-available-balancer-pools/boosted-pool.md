---
order: 5
title: Boosted Pool
---
# Boosted Pools

## Overview

Boosted Pools are a type of liquidity pool in which a portion or all of the tokens can generate yield. The yield-bearing tokens can constitute anywhere from 25% to 100% of the pool's total tokens. While the operation of Boosted Pools is not restricted to a specific trading algorithm, they often employ [Stable Math](/concepts/explore-available-balancer-pools/stable-pool/stable-math.html). This is due to the effectiveness of Stable Math in handling assets that have a high correlation.

### Advantages of Boosted pools

The main advantage for boosted pools in the balancer ecosystem are:

#### 100% yield bearing possibility
Balancer V3 boosted pools allow for 100% of an LP position to be considered boosted, meaning to be a yield bearing token. Prominent examples are bb-a-USD which is a StablePool containing Aave yield bearing DAI (`aDAI`), Aave yield bearing USDC (`aUSDC`) and Aave yield bearing USDT (`aUSDT`). Balancer V3 is architected to have the pool communicate it's reserves always in the base assets `DAI`, `USDC`, `USDT`. From a user perspective you simply get a Stablecoin pool with 100% yield bearing components. Any drawbacks such as complicated swap-paths, expensive wrapping & unwrapping, liquidity exploration via aggregators is solved on a higher level Balancer V3 smart contract architecture.

#### gas efficient swaps between boosted pool's base assets
Boosted pools leverage the Vault's [liquidity buffers](concepts/vault/buffer.html#erc4626-liquidity-buffers) concept to facilitate gas-efficient swaps between boosted pools. This allows LPs to maintain 100% boosted pool positions and still earn swap fees from base-asset to base-asset trades.

#### Boosted pools are "plug&play" for ERC4626 Vaults
Any token that complies with the ERC4626 standard can easily become an asset within a boosted pool and can be swapped on balancer gas efficiently while keeping swap prices competitive due to [liquidity buffers](concepts/vault/buffer.html#erc4626-liquidity-buffers).

#### Great way for a DAO to facility liquidity for their token product
Boosted pools are an excellent method for introducing LSTs and yield-bearing tokens to the market. As a DAO, you can fund [liquidity buffers](concepts/vault/buffer.html#erc4626-liquidity-buffers) with yield-bearing assets and base assets, allowing your users to benefit from the advantages of 100% boosted pools. This also provides the same "entry" price for your LST or yield-bearing token that a user would get when entering natively."

### Examples

:::info
Once V3 launches this will be updated.
:::