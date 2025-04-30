---
order: 5
title: Boosted Pool
---
# Boosted Pools

## Overview

Boosted Pools are a type of liquidity pool in which some or all of the tokens can generate yield. The yield-bearing tokens can constitute anywhere from 25% to 100% of the pool's total tokens. While the operation of Boosted Pools is not restricted to a specific trading algorithm, they often employ [Stable Math](/concepts/explore-available-balancer-pools/stable-pool/stable-math.html). This is due to the effectiveness of Stable Math in handling assets that are highly correlated.

### Advantages of Boosted pools

The main advantage of boosted pools in the Balancer ecosystem are:

#### 100% yield bearing possibility
Balancer v3 boosted pools allow for 100% of an LP position to be considered boosted, meaning held in a yield-bearing token. For example StablePools could contain yield-bearing assets from lending protocols such as Aave's yield bearing DAI (`aDAI`), Aave yield-bearing USDC (`aUSDC`), Aave yield-bearing USDT (`aUSDT`) or a yield-bearing Morpho Vault such as Steakhouse USDC (`steakUSDC`). The Balancer BatchRouter can handle user requests to trade among all these assets in a seamless and gas efficient manner (e.g., depositing and withdrawing underlying tokens DAI, USDC and USDT). The front end or aggregator can construct a batch swap with everything the router needs to perform the operations, including interacting with liquidity buffers (see below), and only wrapping or unwrapping when absolutely necessary.

#### Gas efficient swaps between boosted pool's base assets
Boosted pools leverage the Vault's [liquidity buffers](/concepts/vault/buffer.html#erc4626-liquidity-buffers) concept to facilitate gas-efficient swaps between boosted pools. This allows LPs to maintain 100% boosted pool positions and still earn swap fees from base-asset to base-asset trades.

#### Boosted pools are "plug and play" for ERC4626 Vaults
Any token that complies with the ERC4626 standard can easily become an asset within a boosted pool and can be swapped on Balancer gas efficiently while keeping swap prices competitive due to [liquidity buffers](/concepts/vault/buffer.html#erc4626-liquidity-buffers).

#### Great way for a DAO to facilitate liquidity for their token product
Boosted pools are an excellent method for introducing LSTs and yield-bearing tokens to the market. As a DAO, you can fund [liquidity buffers](/concepts/vault/buffer.html#erc4626-liquidity-buffers) with yield-bearing assets and base assets, allowing your users to benefit from the advantages of 100% boosted pools. This also provides the same "entry" price for your LST or yield-bearing token that a user would get when entering natively.
