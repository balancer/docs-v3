---
order: 4
title: BPT as Collateral
---
# Price Oracles for BPT as Collateral

## Introduction

Liquidity provider (LP) tokens represent proportional ownership in a pool of assets. In the Balancer ecosystem, these are known as BPT (Balancer Pool Tokens). When users add liquidity to a Balancer pool by depositing tokens, they receive corresponding Balancer Pool Tokens in return. These tokens represent their proportional share of the liquidity pool.

With the rising popularity of lending protocol partners like [AAVE](https://aave.com/), there's growing interest in using these tokens as collateral, allowing users to borrow against their staked liquidity. However, LP tokens pose unique challenges for oracle design and risk management. Their value depends on both the underlying assets and the pool composition and parameters, making them potentially vulnerable to manipulation.

Balancer's radical flexibility is a major benefit for builders - yet presents unique challenges for oracle building. Balancer supports not only arbitrary pool types, but also yield-bearing tokens with rate providers, and offers hooks that can alter swap fees, adjust swap results, or otherwise affect pool balances during operations.

Flash loans - either explicit using Balancer V2 or other platforms, or implicit in Balancer's batch operations - are especially dangerous, and could be used to temporarily distort pool balances and pricing, inflating the apparent BPT value. The risk is not theoretical! Naive oracle implementations have been exploited many times in recent years: [Alpha Homora](https://blog.alphaventuredao.io/alpha-homora-v2-post-mortem/) lost over $38 million when an attacker manipulated LP token pricing to over-collateralize a loan, while [Harvest Finance](https://medium.com/harvest-finance/harvest-flashloan-economic-attack-post-mortem-3cf900d65217) saw $24 million drained through a similar manipulation of stablecoin Curve pools. These examples highlight the critical need for manipulation-resistant oracles when integrating LP tokens into lending systems.

One defense against implicit flash loans is the [WrappedBalancerPoolToken](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/WrappedBalancerPoolToken.sol), and its associated factory. This factory deploys wrapped versions of arbitrary BPT, which are freely interchangeable with "raw" BPT - but only when the Vault is locked (i.e., when there is no ongoing operation). This ensures that the BPT balance of the caller is "real," and not flash loaned: at least not from Balancer V3. (It could still be an externally flash loaned from another source.) It's one layer of "Swiss cheese" security, but not necessarily sufficient by itself.

Note that at least for the case of oracles used in lending protocols, this concern is adequately addressed using either deposit limits in the native protocols, or alternatively setting the `shouldRevertIfVaultUnlocked` flag on the oracle itself, which reverts if anything requiring TVL calculation happens during a transaction (i.e., when the Vault is unlocked).

While "balance verification" is important for some operations (e.g., nested pools), what we really want is a reliable way to derive a reliable, non-manipulable price for a Balancer Pool Token: on-chain, and available during Vault operations. This enables many advanced use cases, including our target of BPT as collateral.

To do this, we require externally derived, true market prices, as anything internal and calculated purely on-chain could be front-run and manipulated. The current interface uses Chainlink oracles for this, but is easily adaptable to other protocols. There is unlikely to be a Chainlink oracle for the BPT itself (or we could just use that), so our pricing algorithm must operate using price feeds for the constituent tokens. It must incorporate the total pool value and supply - yet _not_ the actual token balances, which are manipulable.

## Overview

Instead of using the actual balances to derive the overall price, Balancer BPT oracles compute _theoretical_ balances which satisfy two constraints:

* The "pool constraint": the theoretical balance invariant must equal the real balance invariant, so that the value of the pool is equivalent and can legitimately be scaled by the supply.
* The "price constraint": the token prices derived from the theoretical balances must be proportional to the oracle prices, so that the internal token prices correctly reflect the current state of the market.

See [this page](./bpt-oracles-contracts.md) for references to the BPT Oracle contracts.

## Usage with Rate Providers

In practical usage with different kinds of pools, there are some subtleties. For boosted pools, or other pools where tokens have rate providers, it's very important to choose a compatible price feed. There are several cases:

1) Regular tokens, no rate providers. This is the simplest case (e.g., BAL/WETH or WETH/USDC). We just need price feeds corresponding to the USD prices of ETH, BAL, and USDC. Of course, the price feeds could also have some other reference (e.g., EUR), as long as they are all consistent.

2) Boosted pools with yield-bearing tokens (e.g., wstETH/USDC, or waWETH/waUSDC). Here we would typically have rate providers that converted the wrapped tokens to the underlying value tokens: wstETH -> ETH, waWETH -> ETH, waUSDC -> USDC. Since calculations use "live balances," which incorporate the rates, balances are always expressed in underlying tokens. Therefore, the price feeds should also correspond to the underlying tokens: ETH and USDC, in this case, same as in the "regular token" case above.

3) Pools with double-wrapped tokens, such as waWstETH. What to use here depends on the details of the rate provider. Essentially, the price feed needs to match the target of the rate provider. If the rate provider itself converts waWstETH -> WETH, then the price feed should just be the regular underlying WETH/ETH price (since WETH is pegged 1-to-1 to ETH by definition). However, if the rate provider converts waWstETH -> wstETH, you would need a price feed for wstETH: not ETH.

4) Pools with RWA / commodity tokens, like XAUt. Here the rate provider is already effectively a price feed, converting XAUt -> USD directly. If you combined this rate provider with an XAUt price feed, it would do the conversion twice. So in this case, you would need a "constant price" price feed, that always returned 1.

## Mathematical Derivation

### Stable Pools

We begin with a system of n+1 equations: n "gradient" equations (relating the internal prices to the oracle prices), plus the invariant equation. So, that's n+1 equations with n unknowns: the theoretical token balances we are trying to find. We can linearize the gradient equations by introducing k̃, a sort of scaling factor that converts internal to external prices. Since by definition the prices are proportional, we can define k̃ as this constant of proportionality.

We can then solve this system of linear gradient equations, and express the theoretical balances xⱼ in terms of k̃.

Then the real magic happens - we can substitute those xⱼ expressions into the invariant equation, and reduce the system to a single equation in k̃. On chain, this equation can be solved using Newton's method. Once we have k̃, we can compute the theoretical balances, sum the product of each token balance and oracle price to get the total pool value, then divide by the total supply to derive the final BPT price.

With x̃ representing the vector of theoretical token balances, the pool constraint can be expressed mathematically as:

```
F(x̃) = D; or F(x̃, D) = 0
```

This means that the theoretical balances must reproduce the real invariant.

The price constraint can be expressed mathematically as:

```
∇f(x̃) = k̃ · ρ
```

This means that the internal prices must match (i.e., be proportional to) the oracle prices. ρ (rho) is a "critical boundary" constraint on k̃. We can derive a minimum valid value of k̃ from the oracle prices and degree of price curvature: at this value or below, the "T curve" (described below) goes to infinity and the equation is no longer soluble.

To calculate ρ:

1. Compute the amplification coefficient: a = A × n^(2n); A is the amplification parameter of the Stable Pool
2. Compute the scaled prices: rᵢ = pᵢ / a for each token; these are the market prices "normalized" by the pool state
3. Since k̃ must be greater than 1/rₙ for each token, the final lower bound is given by: ρ = 1 / min(r₁, r₂, ..., rₙ)

Given these constraints, the key is to find k̃. To understand how, we start with the invariant equation for the pool:

```
f(x₁, x₂, ..., xₙ) = D
```

This is some function which, operating on the real balances, produces a single invariant value D, representing the total value of the pool. The details vary, but the Balancer Vault requires this to be defined for every pool type. So far, we have implemented oracles for both Weighted and Stable Balancer pools. (ReCLAMM pools should also work, as they are fundamentally Weighted pools, just incorporating virtual balances. See the ReClamm Pools section below.)

The partial derivative ∂f/∂xⱼ represents how much the invariant changes per unit of token j, and the ratio of these partial derivatives represents the internal spot price of one token in terms of another. For instance, ∂f/∂x₂ / ∂f/∂x₁ would be the spot price of token 2 in terms of token 1.

The n gradient equations look like:

```
∂F/∂x₁ = k̃ · p₁<br>
∂F/∂x₂ = k̃ · p₂<br>
...<br>
∂F/∂xₙ = k̃ · p₂
```

We now apply the second constraint, substituting the x expressions into the pool constraint F(x̃, D) = 0. Since all the x expressions are functions of k̃, we now have a single equation in terms of k̃: one equation, one unknown.

After a lot of algebra, the single equation can be written as:

```
T(k̃)^(n+1) · P(k̃) = α
```

where:

```
T(k̃) = Σ(1/(k̃rᵢ - 1)) - 1
```

from the gradient equations, where the r values are the scaled prices described above;

```
P(k̃) = ∏(k̃rᵢ - 1)
```

also from the gradient equations; and

```
α = a·c^(n+1)
```

a constant derived from the pool parameters, where:

```
a = A·n^(2n);<br>
b = a - n^n; and<br>
c = b/a
```

Unfortunately this "T equation" is non-linear in `k̃`, so it must be solved numerically. On-chain, we use Newton's method to find the root (= the value of k̃ that satisfies both constraints). In the mathematical paper referenced below, we prove that given the specified starting point, it will converge to the correct solution. There may be many roots, especially with higher numbers of tokens. The correct one is the smallest non-negative root, closest to the origin.

In summary:

* Oracle prices tell us what the "fair" relative prices should be
* The gradient condition ensures that internal AMM prices correspond to these fair prices
* The invariant condition ensures that the theoretical balances are valid for the pool, and correctly represent the value
* `k̃` is the common scaling parameter: the "knob" we adjust to make both conditions true simultaneously
* Once we find the right k̃, we can calculate the fair balances `x̃ⱼ`, and price the LP token

See [this page](./bpt-oracles-example.md) for a numerical example.

### Weighted Pools

Weighted and Stable Pools use the same general algorithm. While the complex StableSwap invariant requires Newton's method to find the scaling parameter k̃, then calculate effective balances and total value, the power-law invariant of the Weighted Pool allows us to solve the gradient and invariant conditions simultaneously, giving us:

```
TVL = k × Π((Pᵢ/Wᵢ)^Wᵢ)
```

in one step.

In particular, "mapping" the weighted pool solution onto the equivalent terms used above:

* The theoretical balances `x̃ᵢ = (TVL × Wᵢ)/Pᵢ`, where TVL is the total pool value (referred to as `Bᵢ` in the WeightedLPOracle code docs).
* The Weighted invariant `D = Π(Bᵢ^Wᵢ)`, computed directly using theoretical balances and weights (referred to as k in the WeightedLPOracle code docs).
* The scaling parameter `k̃` is in the Weighted case simply equal to the TVL (`C` in the code docs).

So, positing a normalization constant `C` such that `C = (Pᵢ × Bᵢ / Wᵢ)` for every token, the gradient "price constraint" is:

```
Bᵢ = (C × Wᵢ)/Pᵢ
```

This set of balances align the pool's spot price with external prices provided by the feeds.

We can then substitute this directly into the invariant (no complex polynomials here):

```
D = Π((C × Wᵢ/Pᵢ)^Wᵢ) = C × Π((Wᵢ/Pᵢ)^Wᵢ)
```

And then solve for C directly:

```
C = k × Π((Pᵢ/Wᵢ)^Wᵢ) = TVL = Total pool value
```

The price is then simply TVL / totalSupply.

### ReCLAMM Pools

The same principle can be applied to a ReCLAMM pool, which is in practice a 50/50 weighted pool with virtual balances that concentrate the liquidity in a specified price range.

The ReCLAMM invariant is

```
D = (Ra + Va)(Rb + Vb)
```

where `Ri` represents real balances and `Vi` represents virtual balances.

On the other hand, the spot price of the pool is:

```
P = Tb / Ta = (Rb + Vb) / (Ra + Va)
```

So we can express the invariant in terms of price:

```
D = P (Ra + Va)^2 = (Rb + Vb)^2 / P
```

Isolating total balances:

```
sqrt(D / P) = Ta
sqrt(D * P) = Tb
```

So

```
Ra = Ta - Va = sqrt(D / P) - Va
Rb = Tb - Vb = sqrt(D * P) - Vb
```

With the given price feeds `Pᵢ`, we can find the theoretical real balances `x̃ᵢ = [Ra', Rb']`, and compute the TVL:

```
TVL = Σ (x̃ᵢ × Pᵢ) = Ra' × Pa + Rb' × Pb
```

#### Practical constraints

The calculated `Ra'` and `Rb'` in the step above can be negative, or above the maximum real balance. Therefore it needs to be capped on both ends:
```
Ra' = max(0, Ra');
Ra' = min(Ra', Ra_max)
```

To calculate maximum real balances, we can evaluate the invariant at the edges. In particular, `Ra` is `Ra_max` when `Rb = 0`, and vice versa:

```
D = (Ra_max + Va)(Vb)
D = (Va)(Rb_max + Vb)
```

Isolating max real balances:

```
Ra_max = D / Vb - Va
Rb_max = D / Va - Vb
```

### E-CLP Pools (Elliptic Concentrated Liquidity Pools)

E-CLP pools use a concentrated liquidity mechanism based on an elliptical curve constraint, allowing liquidity to be concentrated within a specified price range [α, β]. Unlike Weighted Pools which use simple power-law invariants or Stable Pools which use polynomial invariants, E-CLPs leverage geometric transformations to map between price space and balance space.

The pool's invariant constraint defines an ellipse in the (x, y) balance space, rotated and stretched according to the pool parameters. The key parameters are:

* **α (alpha)**: The lower bound of the concentrated price range
* **β (beta)**: The upper bound of the concentrated price range  
* **τ(α) and τ(β)**: Derived points on the ellipse corresponding to the price bounds
* **A**: A transformation matrix that maps the unit circle to the pool's ellipse

Given oracle prices P₁ and P₂ for the two tokens, the relative price is r = P₁/P₂. The TVL calculation depends on where this relative price falls within the concentrated range:

**Case 1: r < α (Below the lower price bound)**

When the market price is below the pool's concentrated range, the pool holds only token 1. The effective balance width in price space is:

```
b_P = (A⁻¹·τ(β))_x - (A⁻¹·τ(α))_x
```

And the total value locked is:

```
TVL = b_P × P₁ × invariant
```

**Case 2: r > β (Above the upper price bound)**

When the market price is above the pool's concentrated range, the pool holds only token 2. The effective balance width is:

```
b_P = (A⁻¹·τ(α))_y - (A⁻¹·τ(β))_y
```

And the total value locked is:

```
TVL = b_P × P₂ × invariant
```

**Case 3: α ≤ r ≤ β (Within the concentrated range)**

When the market price is within the pool's range, both tokens are present. We compute the point τ(r) on the ellipse corresponding to the current price ratio, then calculate the effective balance vector:

```
v_x = (A⁻¹·τ(β))_x - (A⁻¹·τ(r))_x
v_y = (A⁻¹·τ(α))_y - (A⁻¹·τ(r))_y
```

The total value is then the scalar product of the price vector and the balance vector:

```
TVL = (P₁ × v_x + P₂ × v_y) × invariant
```

In summary:

* The `τ` function maps price ratios to points on the ellipse curve, establishing the "fair" position on the curve given market prices
* The `A⁻¹` transformation converts points from the ellipse to effective balance space
* The three cases handle the geometric reality that outside the `[α, β]` range, the pool is single-sided
* Unlike Weighted Pools where TVL can be computed directly, or Stable Pools where Newton's method solves for a scaling parameter, E-CLP uses geometric projections to determine the effective balances
* The invariant serves as a scaling factor, similar to its role in other pool types

The final BPT price is simply TVL / totalSupply.

This approach is resistant to price manipulation within the pool because it relies entirely on external oracle prices to determine the theoretical position on the ellipse, then uses only the pool's invariant (total supply) to scale the result. The geometric constraints of the ellipse ensure consistency between internal and external pricing.

## References

See the [contracts](./bpt-oracles-contracts.md) page for practical examples of using the oracles.

For a more detailed mathematical description of how this is applied to Stable Pools, see the [Pricing Stable Pool BPTs](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/oracles/docs/StableOracle.md) document in the V3 monorepo.

True math nerds can review the [Pricing StableSwap pools](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/oracles/docs/pricing_stableSwap_pools.pdf) paper by Sergio A. Yuhjtman, our resident mathematician.

This paper goes much deeper into the mathematics, providing a rigorous theoretical backing for the computation methods described in the docs.

It reviews the mathematical properties of the StableSwap function, especially the upper/lower price bounds.

It analyzes Newton's method, proving that the function `G(k)` is convex (which ensures convergence), and justifies the choice of starting point `k₀`. Newton's method is iterative, converging on the final value of `k̃`  by refining subsequent guesses, so it is important for performance to start in the right place. The paper proves the existence, uniqueness, and guaranteed monotonic convergence on `k̃`  from `k₀`.

Finally, it analyzes edge cases, and proves that the boundary condition `k̃rᵢ - 1 > 0` always holds under all supported conditions (i.e., balances, invariant, and amplification parameter are all > 0, and there are at least two tokens).