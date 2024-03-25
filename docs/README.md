---
home: true
title: Home
heroText: Balancer V3 Docs
heroImage: /images/backgrounds/main.svg
homeImage: /images/hero-circles.png

columns:
  - header: Pool creators
    description: Build your own AMM by implementing just 2 functions or extend a working AMM with custom hooks.
    cards:
      - title: Build a custom AMM
        content: Build a custom AMM on Balancer and benefit from your pool being fully integrated in the DeFi ecosystem
        link: "concepts/guides/create-custom-amm-with-novel-invariant.html"
      - title: Enhance pools with Hooks
        content: Hooks allow time-tested Balancer pools to be enhanced with functionalities your protocol requires
        link: "/concepts/pools/hooks.html"
      - title: Earn a portion of pool revenue
        content: Balancer allows pool creators to participate from the success of a pool by sharing part of it's revenue.
        link: "/concepts/overview/basics"
  - header: Builders
    description: Using additional technologies such as SDK, API and Subgraph to interact & fetch data from Balancer.
    cards:
      - title: Understand the architecture
        content: Be it Queries, batchSwaps or transient accounting. Balancers liquidity is readily available.
        link: "/concepts/overview/architecture"
      - title: Add liquidity to earn swap fees.
        content: The guide shows various approached to adding liquidity to a pool.
        link: "/guides//add-liquidity-to-pool.html"
      - title: Make a swap to exchange tokens
        content: Explore how the optimal trade paths leads to best trade execution.
        link: "/concepts/guides/swaps-with-sor-sdk.html"


footer:
---

<HomeCards :columns="$frontmatter.columns" />

## More Resources

**Github Repos**

- [Smart Contracts](https://github.com/balancer/balancer-v2-monorepo)
- [Deployments](https://github.com/balancer/balancer-deployments)
- [SDK](https://github.com/balancer/balancer-sdk)
- [Smart Order Router](https://github.com/balancer/balancer-sor)
- [Frontend](https://github.com/balancer/frontend-v2)
- [Subgraph](https://github.com/balancer/balancer-subgraph-v2)

**Analytics & Dashboards**

- [DefiLlama](https://defillama.com/protocol/balancer)
- [Analytics](https://balancer.defilytica.com/)
- [Dune dashboards](https://dune.com/browse/dashboards?team=balancer)
