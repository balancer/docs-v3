---
order: 3
---

# Impermanent Loss

Impermanent Loss, sometimes referred to as divergent loss, is simply the opportunity cost of adding liquidity into an AMM pool vs. holding the individual tokens.

Impermanent loss occurs when the prices of two assets diverge in price after initial liquidity provision. For example, if all assets in a pool increase by 20%, there is no impermanent loss. However, if only one asset increases in value by 20%, uncorrelated with the other tokens, there will be some impermanent loss. It is "impermanent" because it can be reversed; e.g., if the asset returned to its initial value, or the other tokens also increased 20%. For a basic example of impermanent loss followed by a reversal, see the next page.

<!-- prettier-ignore -->
$
IL ={\frac {PoolValue}{HodlValue}}-1
$

![Impermanent Loss - Relationship shown based on a two token pool with one asset and one stable coin. ](/images/impermanent-loss.png)

::: tabs

@tab 50/50 Pools

# 50/50 Pools

We will start with a simple 50/50 pool featuring COMP/WETH. We want to deposit $5,000 worth of each token, for a total value of $10,000. At initial investment time, WETH is priced at $2,000, and COMP is $250, so we deposit 2.5 WETH and 20 COMP.

Some time later, we find that COMP has doubled to $500, while WETH has increased 15%, to $2,300. Although the value of the position has gone up along with the tokens, any uncorrelated deviation from the initial prices will result in some level of impermanent loss: we are missing out on some portion of the theoretical gains.

_Here we calculate the invariant from the value function:_

<!-- prettier-ignore-start -->
$$ V= \prod_t B_t^{W_t} \\\$$
$$$$
$$ B_{i-WETH} = 2.5 \ W_{i-WETH}=0.5 $$
$$ B_{i-COMP} = 20 \ W_{i-COMP}=0.5 \\$$
$$$$
$$ Initial \ Invariant: V = B_{i-WETH}^{W_{i-WETH}} * B_{i-COMP}^{W_{i-COMP}} \\$$
$$ V = 2.5^{0.5} * 20^{0.5} = 7.0710678 \\$$
$$$$
$$ After \ Arbitrage: 2.5 \ WETH \ and \ 20 \ COMP \ yields: $$
$$(2.5*1.15)^{0.5} * (20*2)^{0.5} = 10.723805 $$
$$$$

Our gains will be determined by the invariant ratio, this value can be used for our token balances as well.

$$Invariant \ Ratio_{LP} = {\frac{10.723805}{7.0710678}} = 1.51657509$$
$$Ratio_{HODL} = (1.15*0.5) + (2*0.5) = 1.575$$
$$$$

Here we can consider the USD values to be the same in the numerator and denominator therefore not needed to determine the ratio between the two.

$$IL = {\frac{Invariant \ Ratio_{LP}}{Ratio_{HODL}}} = {\frac{1.51657509}{1.575}} - 1 = -0.03709518$$
$$ IL = -3.709518\%$$
$$$$

For the new token balances we consider the invariant ratio compared to the price action of the individual asset. This proportion will yield the new balance of each token in relation to the initial join amount.

$$ New \ Token \ Balance: B_{t'}= B_{t} *{\frac{Ratio_{LP}}{Price \ Action_{t}}}$$
$$ WETH: 2.5 * {\frac{1.5657509}{1.15}} = 3.2969 $$
$$ COMP: 20 * {\frac{1.5657509}{2}} = 15.1657509 $$
$$$$

_**Please note these calculations can take place over any time frame. These occurred in roughly 12 days between June 25th and July 7th, 2021. This same price action could just as well take place over the course of 1 year. With 4% or more in swap fees or liquidity mining incentives, the LP position would become the more attractive option.**_

These calculations are depicted by the following tables.

**Initial Liquidity Position Amount: $10,000.00**
$$ \begin{array} {|r|r|}\hline Token & Initial \ Value($) & Balance & USD \ Amount & Weight \\ \hline WETH & 2,000 & 2.5 & 5,000 & 0.5 \\ \hline COMP & 250 & 20 & 5,000 & 0.5 \\ \hline  \end{array} $$

**HODL Total: $15,750.00**
$$ \begin{array} {|r|r|}\hline Token & Initial \ Value($) & Balance & USD \ Amount & Weight \\ \hline WETH & 2,300 & 2.5 & 5,750 & 0.5 \\ \hline COMP & 500 & 20 & 10,000 & 0.5 \\ \hline  \end{array} $$

**LP Total $15,165.75; with 4% Annual yield $15,772.38**
$$ \begin{array} {|r|r|}\hline Token & Initial \ Value($) & Balance & USD \ Amount & Weight \\ \hline WETH & 2,300 & 3.2969 & 7,582.87 & 0.5 \\ \hline COMP & 500 & 15.16575 & 7,582.87545 & 0.5 \\ \hline  \end{array} $$

In our prior example, COMP and WETH went through uncorrelated price changes, and we observed the potential loss of value through impermanent loss. Now, if the prices continue to change, we will look at an example where WETH goes up to $3,000.00, while COMP decreases to $375.00. Perhaps surprisingly, this leads to a 50% gain in both assets relative to our original Liquidity Position.

$$ V=20^{0.5}*2.5^{0.5}=7.071068 $$
$$ V_2= (20*1.5)^{0.5}*(2.5*1.5)^{0.5}=10.6066017 $$
$$ Invariant\ Ratio= {\frac {V_2}{V}}={\frac {10.6066017}{7.071068}}=1.5 $$
$$$$

Therefore, because the invariant ratio matches the price ratio, there will be no impermanent loss.

$$ IL = {\frac{Invariant \ Ratio_{LP}}{Ratio_{HOD}}} = {\frac{1.5}{1.5}} - 1 = 0 \ or \ 0.00\%$$
$$$$

This calculation will be performed from the impermanent loss state to the current state, in order to prove that the “loss” is indeed reversible under the proper conditions.

**Initially:**
$$ 3.2969 \ WETH \ at \ 2,300.00 \ each \ and \ 15.16575 \ COMP \ at \ 500.00 \ each $$
$$ V = 15.16575^{0.5}* 3.2969^{0.5} = 7.071068 $$

**After Price Change:**
$$ V_{2} = (15.16575 * 0.75)^{0.5} * (3.2969 * 1.30435)^{0.5} = 6.9937835 $$
$$ Invariant \ Ratio = {\frac{V_{2}}{V}} = {\frac{6.99378335}{7.071068}} = 0.9890703 $$
$$$$

New Token Balances can be calculated as follows:

$$ New\ Token\ Balances:B_{t'}*{\frac {Ratio_{LP}}{Price\ Action_t}} $$ 
$$ WETH:3.2969*{\frac {0.9890703}{1.30435}}=2.5 $$
$$ COMP: 15.16575*{\frac {0.9890703}{0.75}}=20 $$
$$$$

<!-- prettier-ignore-end -->

These balances match our initial liquidity position, meaning overall we lost nothing to impermanent loss. The price action is still in our favor by 50% for both assets as we hold the same initial number of each. Also, we would have likely collected swap fees from traders, making our gains slightly larger.

This shows that even large impermanent losses can always be reversed through subsequent price action. This can occur countless times as the asset prices in a pool fluctuate. It is important to understand the assets you are holding and how comfortable you are with volatility. In theory, great volatility will be coupled with large swap volumes, making the swap fees and gains for liquidity providers increase. Weighing the risk of impermanent loss against the accumulation of swap fees or “volatility farming” is the game a liquidity provider is playing over the long term.

@tab 80/20 Pools

# 80/20 Pools

Here we will examine how disproportionate pool weights affect the calculation of impermanent loss, using the same scenario described above, but for an 80/20 vs. a 50/50 pool.

<!-- prettier-ignore-start -->
#### COMP WETH 80/20
To illustrate the benefits of uneven pool weights, we calculate impermanent loss under conditions favoring COMP. We will hold 1 WETH @ $2000.00 and 32 COMP @ $250.00. ($8,000 in COMP and $2,000 in WETH: same $10,000 total as before).
$$ B_{i-WETH} = 1 \ \ W_{i-WETH} = 0.2 $$
$$ B_{i-COMP}= 32 \ \ W_{i-COMP} = 0.8 $$
$$$$
$$ Initial \ Invariant \ = 1^{0.2} * 32^{0.8} = 16.00 $$
$$ After \ Arbitrage: \ 1 \ WETH \ and \ 32 \ COMP \ yields: $$
$$ (1*1.15)^{0.2} * (32 * 2)^{0.8} = 28.647290182 $$
$$$$
Our gains will then be determined by the invariant ratio. This can be used for our token balances as well.
$$ Invariant \ Ratio_{LP} = {\frac{28.647290182}{16}} = 1.7904556364 $$
$$ Ratio_{HODL} = (1.15 * 0.2) + (2 * 0.8) = 1.83 $$
$$$$
Here we can consider the USD values to be the same in the numerator and denominator, so we don't need to determine their ratio.
$$ IL = {\frac{Invariant \ Ratio_{LP}}{Ratio_{HODL}}} = {\frac{1.17904556364}{1.83}} = -0.02160893 \ or \ 2.160894\%$$
$$$$
While impermanent loss still occurs in this scenario, the losses are nearly cut in half compared to the 50/50 pool (reduced by a factor of 0.5825, to be precise). When dealing with very large liquidity positions, these small amounts can make a large difference in value. Ultimately, this weighting strategy can protect liquidity providers from impermanent loss: or actually increase their exposure, depending on their token choices. Of course, if prices return to their initial values, or move proportionally, at a certain point the “losses” will revert to zero regardless of the weights.


<!-- prettier-ignore-end -->

@tab Multi-token Pools

# Multi-token Pools
Balancer's multi-token pools are one of our unique features. Below is an example of how impermanent loss on one of these pools can occur, including details on volatility and stable coins.
#### Advanced Example – Multi-token Pool
Below we show an example of a multi-token pool, and how impermanent loss can occur and then be reversed. We will look at a Polygon pool: 25% USDC, 25% WMATIC, 25% BAL, 25% WETH. Initially we will assume we joined with $10,000 in USD, distributed evenly over all the assets.


<!-- prettier-ignore-start -->
##### Initial Conditions:
$$ USDC \ at \ $1.00 = 2500 \ USDC \ \ \ WMATIC \ at \ $1.25 = 2,000 \ WMATIC $$
$$ BAL \ at \ $25.00 = 100 BAL \ \ \ WETH \ at \ $2,500.00 = 1.0 \ WETH $$
$$$$
We will assume USDC stays at a constant value, BAL increases by 15% to $28.75, WMATIC decreases by 4% to $1.20, and WETH increases 50% to $3,750.00.
$$ V_{initial} = 2500^{0.25} * 2,000^{0.25} * 100^{0.25} * 1^{0.25} = 149.534878 $$
$$ V_{2} = (2,500)^{0.25} * (2,000 * 0.96)^{0.25} * (100 * 1.15)^{0.25} * (1 * 1.5)^{0.25} = 169.631923 $$
$$$$
$$ Invariant \ Ratio = {\frac{V_{2}}{V_{initial}}} = {\frac{169.31923}{149.534878}} = 1.13439704 $$
$$ Ratio_{HODL} = (1 * 0.25) + (0.96 * 0.25) + (1.15 * 0.25) + (1.5 * 0.25) = 1.1525 $$
$$$$
$$ IL = {\frac{Invariant \ Ratio_{LP}}{Ratio_{HODL}}} = {\frac{1.13439704}{1.1525}} - 1 = 0.0157076 \ or \ 1.57076\% $$
##### New Token Balances can be calculated as follows:
$$ New \ Token \ Balances \ B_{t'} = B_{t} * {\frac{Ratio_{LP}}{Price \ Action_{t}}} $$
$$$$
$$ USDC = 2,500 * {\frac{1.13439704}{1}} = 2,836 \ USDC $$
$$ WMATIC  = 2,000 * {\frac{1.13439704}{0.96}} = 2,363.327 \ WMATIC $$
$$ BAL = 100 * {\frac{1.13439704}{1.15}} = 98.643 \ BAL $$
$$ WMATIC = 1 * {\frac{1.13439704}{1.5}} = 0.7562647 \ WETH $$
Since the pool contains a stable coin (USDC), impermanent loss is nearly inevitable unless all tokens return to their initial value at the time of liquidity provision. Therefore, Liquidity Providers for the pool above or any pool combining stable and non-stable assets should mostly be concerned with volatility and earning a return from swap fees or liquidity mining incentives. They are essentially positioning themselves with the expectations of this type of price pattern:
![Price Chart for mid-July 2022 COMP](/images/Multi-token-chart.png)

##### One may provide liquidity to a pool in which USDC and an asset (X) at 14.01 are present in mid-July. Then by the time the chart comes to an end the price is still 14.01 after going through stages of upward and downward price changes. This will yield an amount of swap fees to be collected as profit as well as 0% impermanent loss.

At any point when all prices revert to their initial values, arbitragers will bring the tokens back to their initial balances. With a stable token present, this means no gains can be made without impermanent loss or swap fees.

$$$$
$$ V_{current} = 2,836^{0.25} * 2,363.327^{0.25} * 98.643^{0.25} * 0.7562647^{0.25} = 149.53489 $$
$$ V_{2}= (2,836)^{0.25} * (2,363.327 * 1.04167)^{0.25} * (98.643 * 0.8696)^{0.25} * $$
$$(0.7562647 * 0.67)^{0.25} = 131.8204$$
$$ The \ values \ above \ were \ shortened \ for \ formatting $$
$$$$
$$ {\frac{131.8204}{149.53489}} = 0.881536 \ The \ calculations \ below \ will \ yield \ the \ $$
$$ initial \ token \ balances \ therefore \ IL = 0\%$$
$$$$
$$ USDC = 2,836 * {\frac{0.881536}{1}} = 2,500 \ USDC $$
$$ WMATIC = 2,363.327 * {\frac{0.881536}{1.04167}} = 2,000 \ WMATIC $$
$$ BAL = 98.643 * {\frac{0.881536}{0.8696}} = 100 \ BAL $$
$$ WETH = 0.7562647 * {\frac{0.881536}{0.6667}} = 1 \ WETH $$

<!-- prettier-ignore-end -->

:::