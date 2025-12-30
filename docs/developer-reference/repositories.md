---
title: Balancer Repositories
order: 5
---
A comprehensive catalog of all public Balancer repositories (82 total) organized by purpose and version. See [below](#repository-statistics) for statistics and specific guidance.

---

# Active Repositories

## Forkable Templates

These repos are designed to be forked and used for new development by partners. They include the essentials for developing particular products, without the "noise" associated with the core repositories used by the Balancer team.

### [scaffold-balancer-v3](https://github.com/balancer/scaffold-balancer-v3)
**Status:** Actively maintained (February 2025) • 104 stars • 103 forks

A comprehensive starter kit for building on Balancer V3. Accelerates the process of creating custom pools and hooks contracts with a local fork environment and frontend playground. Includes example implementations of custom AMMs, dynamic swap fee hooks, lottery hooks, and exit fee hooks. Built on Scaffold-ETH 2 framework with integrated testing utilities and live examples at scaffold.balancer.fi.

**Repository:** https://github.com/balancer/scaffold-balancer-v3  
**Primary Use:** Creating and testing custom pools and hooks for Balancer V3

### [custom-pool-v3](https://github.com/balancer/custom-pool-v3)
**Status:** Active template (June 2025) • 1 star • 2 forks

Example template for creating external custom pools for Balancer V3. Provides a foundation for developers to extend and create new pool types with novel invariants.

**Repository:** https://github.com/balancer/custom-pool-v3  
**Primary Use:** Building custom AMM pool types for V3

### [weighted-stable-pool-v3](https://github.com/balancer/weighted-stable-pool-v3)
**Status:** Active template (April 2025) • 0 stars • 1 fork

Example template combining weighted and stable pool mechanics for Balancer V3. Demonstrates how to create hybrid pool types.

**Repository:** https://github.com/balancer/weighted-stable-pool-v3  
**Primary Use:** Building hybrid pool implementations for V3

### [balancer-v3-sdk-examples](https://github.com/balancer/balancer-v3-sdk-examples)
**Status:** Active template (April 2025) • 0 stars • 0 forks

Collection of example scripts demonstrating how to use the Balancer SDK to perform pool operations using TypeScript for V3 pools.

**Repository:** https://github.com/balancer/balancer-v3-sdk-examples  
**Primary Use:** Learning SDK integration patterns for V3

### [pool-operation-examples-v3](https://github.com/balancer/pool-operation-examples-v3)
**Status:** Active template (March 2025) • 0 stars • 3 forks

Example scripts showing how to perform various pool operations on Balancer V3, including swaps, adds, and removes with working code samples.

**Repository:** https://github.com/balancer/pool-operation-examples-v3  
**Primary Use:** Learning pool operation mechanics for V3

### [balancer-v3-foundry-starter](https://github.com/balancer/balancer-v3-foundry-starter)
**Status:** Active template (July 2025) • 0 stars • 1 fork

Minimal Foundry-based starter template for Balancer V3 development with basic setup and configuration.

**Repository:** https://github.com/balancer/balancer-v3-foundry-starter  
**Primary Use:** Quick start for Foundry-based V3 projects

### [balancer-v2-foundry-starter](https://github.com/balancer/balancer-v2-foundry-starter)
**Status:** Active template (February 2025) • 0 stars • 0 forks

Minimal Foundry-based starter template for Balancer V2 development with basic setup and configuration.

**Repository:** https://github.com/balancer/balancer-v2-foundry-starter  
**Primary Use:** Quick start for Foundry-based V2 projects

---

## Core Repositories

These are official Balancer Team repos, and reflect the current state of the codebase (which may be ahead of deployed code).

### Balancer V3 Core

#### [balancer-v3-monorepo](https://github.com/balancer/balancer-v3-monorepo)
**Status:** Actively maintained (December 2024) • 120 stars • 98 forks • GPL-3.0

The main monorepo for Balancer V3 protocol containing the Vault, pool implementations, routers, and core infrastructure. This is the primary development repository for V3 with all smart contracts and testing infrastructure.

**Repository:** https://github.com/balancer/balancer-v3-monorepo  
**Primary Use:** Core V3 protocol development

#### [balancer-v3-erc4626-tests](https://github.com/balancer/balancer-v3-erc4626-tests)
**Status:** Actively maintained (December 2024) • 3 stars • 2 forks

Fork testing suite for ERC4626 token integrations with Balancer V3 pools, ensuring compatibility with yield-bearing token standards.

**Repository:** https://github.com/balancer/balancer-v3-erc4626-tests  
**Primary Use:** Testing ERC4626 compatibility

#### [docs-v3](https://github.com/balancer/docs-v3)
**Status:** Actively maintained (December 2024) • 5 stars • 22 forks • Vue

Official documentation for Balancer V3, including developer guides, concepts, integration instructions, and API references.

**Repository:** https://github.com/balancer/docs-v3  
**Primary Use:** V3 protocol documentation

#### [balancer-subgraph-v3](https://github.com/balancer/balancer-subgraph-v3)
**Status:** Actively maintained (December 2024) • 3 stars • 9 forks • MIT

The Graph protocol subgraph for indexing Balancer V3 data including pools, swaps, liquidity positions, and protocol analytics.

**Repository:** https://github.com/balancer/balancer-subgraph-v3  
**Primary Use:** V3 data indexing

#### [balancer-maths](https://github.com/balancer/balancer-maths)
**Status:** Actively maintained (December 2024) • 10 stars • 5 forks

Mathematical libraries and implementations for Balancer V3 pool calculations, including weighted math, stable math, and other invariant calculations with comprehensive test coverage.

**Repository:** https://github.com/balancer/balancer-maths  
**Primary Use:** Pool math reference and validation

#### [ReCLAMM](https://github.com/balancer/reclamm)
**Status:** Actively maintained (December 2024) • 3 stars • 4 forks

Readjusting Concentrated Liquidity AMM (ReCLAMM) implementation for Balancer V3, providing advanced concentrated liquidity features.

**Repository:** https://github.com/balancer/reclamm  
**Primary Use:** Advanced concentrated liquidity features

#### [balancer-angstrom](https://github.com/balancer/balancer-angstrom)
**Status:** Active development (October 2024) • 1 star • 2 forks

Angstrom Router and Hook implementation for Balancer, providing preferential trading access to specific nodes for Angstrom pools within a given block.

**Repository:** https://github.com/balancer/balancer-angstrom  
**Primary Use:** Specialized routing for Angstrom integration

#### [pools-manager](https://github.com/balancer/pools-manager)
**Status:** Active development (October 2024) • 0 stars • 1 fork

Pool management utilities and contracts for Balancer V3, providing tools for pool administration and governance.

**Repository:** https://github.com/balancer/pools-manager  
**Primary Use:** Pool administration tools

#### [pool-math-simulator](https://github.com/balancer/pool-math-simulator)
**Status:** Actively maintained (December 2024) • 0 stars • 1 fork

Simulator for testing and validating pool mathematical operations and invariants, useful for pool developers to verify calculations.

**Repository:** https://github.com/balancer/pool-math-simulator  
**Primary Use:** Math validation and testing

#### [balancer-v3-dex-screener-api](https://github.com/balancer/balancer-v3-dex-screener-api)
**Status:** Active (October 2024) • 1 star • 0 forks

API implementation for DEX Screener integration with Balancer V3 pools, providing data endpoints for aggregators.

**Repository:** https://github.com/balancer/balancer-v3-dex-screener-api  
**Primary Use:** DEX aggregator integration

### Balancer V2 Core

#### [balancer-v2-monorepo](https://github.com/balancer/balancer-v2-monorepo)
**Status:** Maintained (December 2024) • 349 stars • 416 forks • GPL-3.0

The main monorepo for Balancer V2 protocol, containing the Vault, pool implementations, and core contracts. Still actively maintained for V2 deployments, updates, and ongoing production use.

**Repository:** https://github.com/balancer/balancer-v2-monorepo  
**Primary Use:** V2 protocol maintenance and development

#### [balancer-subgraph-v2](https://github.com/balancer/balancer-subgraph-v2)
**Status:** Maintained (March 2025) • 118 stars • 103 forks • MIT

The Graph protocol subgraph for indexing Balancer V2 data including pools, swaps, transactions, users, and protocol analytics.

**Repository:** https://github.com/balancer/balancer-subgraph-v2  
**Primary Use:** V2 data indexing

#### [docs](https://github.com/balancer/docs)
**Status:** Maintained (September 2024) • 46 stars • 118 forks • Vue

Official documentation for Balancer V2, covering protocol concepts, pool types, integration guides, and developer resources. Note that new development on V2 is discouraged, in favor of V3. Note that BAL minting and the liquidity mining architecture and infrastructure will always be on V2.

**Repository:** https://github.com/balancer/docs  
**Primary Use:** V2 protocol documentation

### Smart Order Router & Routing

#### [balancer-sor](https://github.com/balancer/balancer-sor)
**Status:** Active (February 2025) • 258 stars • 144 forks

Smart Order Router for V2: off-chain linear optimization of routing orders across pools for best price execution. Supports multi-hop swaps, split routes, and price optimization across the entire pool ecosystem.

**Repository:** https://github.com/balancer/balancer-sor  
**Primary Use:** V2 trade routing optimization

### CoW Protocol Integration

#### [cow-amm](https://github.com/balancer/cow-amm)
**Status:** Active (December 2024) • 12 stars • 14 forks • GPL-3.0

Balancer CoW AMM: an automated portfolio manager and liquidity provider that allows swaps to be executed via the CoW Protocol. Uses V1-based pools with CoW Protocol settlement, providing MEV protection and batch auction benefits.

**Repository:** https://github.com/balancer/cow-amm  
**Primary Use:** CoW Protocol pool integration

#### [cow-amm-subgraph](https://github.com/balancer/cow-amm-subgraph)
**Status:** Active (December 2024) • 0 stars • 0 forks

Subgraph for indexing Balancer CoW AMM data and tracking CoW Protocol settlements.

**Repository:** https://github.com/balancer/cow-amm-subgraph  
**Primary Use:** CoW AMM data indexing

### Frontend Applications

#### [frontend-monorepo](https://github.com/balancer/frontend-monorepo)
**Status:** Actively maintained (December 2024) • 28 stars • 35 forks • MIT

Main frontend monorepo containing the official Balancer web application and shared packages for user interfaces across the Balancer ecosystem. This is the current production frontend.

**Repository:** https://github.com/balancer/frontend-monorepo  
**Primary Use:** Official Balancer UI (current)

#### [pool-creator](https://github.com/balancer/pool-creator)
**Status:** Actively maintained (October 2024) • 16 stars • 5 forks • MIT

User-friendly interface for creating and initializing Balancer pools with guided workflows and step-by-step configuration.

**Repository:** https://github.com/balancer/pool-creator  
**Primary Use:** Pool creation UI

#### [marketing-site](https://github.com/balancer/marketing-site)
**Status:** Active (July 2024) • 1 star • 6 forks • Vue

Marketing and informational website for Balancer Protocol, separate from the main application interface.

**Repository:** https://github.com/balancer/marketing-site  
**Primary Use:** Marketing website

### SDK & Developer Tools

#### [b-sdk](https://github.com/balancer/b-sdk)
**Status:** Actively maintained (December 2024) • 36 stars • 73 forks • MIT

Current TypeScript SDK for interacting with Balancer protocol, providing high-level abstractions for pool operations, queries, and integrations across V2 and V3.

**Repository:** https://github.com/balancer/b-sdk  
**Primary Use:** TypeScript integration library (current)

#### [balpy](https://github.com/balancer/balpy)
**Status:** Maintained (August 2024) • 66 stars • 45 forks • GPL-3.0

Python tools for interacting with Balancer Protocol V2, providing Pythonic interfaces for pool queries, swaps, and analytics.

**Repository:** https://github.com/balancer/balpy  
**Primary Use:** Python integration library

#### [code-review](https://github.com/balancer/code-review)
**Status:** Actively maintained (December 2024) • 20 stars • 14 forks

Code review tools and utilities for Balancer smart contract development, including linting and static analysis configurations.

**Repository:** https://github.com/balancer/code-review  
**Primary Use:** Development tooling and code quality

### Backend Services

#### [backend](https://github.com/balancer/backend)
**Status:** Actively maintained (December 2024) • 46 stars • 22 forks • MIT

Backend services for the Balancer protocol, including API endpoints, data aggregation, and off-chain computations for the UI.

**Repository:** https://github.com/balancer/backend  
**Primary Use:** API and backend services

### Deployment & Infrastructure

#### [balancer-deployments](https://github.com/balancer/balancer-deployments)
**Status:** Actively maintained (December 2024) • 68 stars • 57 forks • GPL-3.0

Comprehensive collection of deployed contract addresses, ABIs, and deployment artifacts across all networks for both V2 and V3. Essential reference for integrators.

**Repository:** https://github.com/balancer/balancer-deployments  
**Primary Use:** Contract addresses and ABIs reference

#### [gauges-subgraph](https://github.com/balancer/gauges-subgraph)
**Status:** Actively maintained (December 2024) • 3 stars • 18 forks

Subgraph for tracking Balancer liquidity gauge data, including veBAL voting, gauge weights, and rewards distribution.

**Repository:** https://github.com/balancer/gauges-subgraph  
**Primary Use:** Gauge and incentive tracking

#### [data-checks](https://github.com/balancer/data-checks)
**Status:** Active (May 2024) • 0 stars • 1 fork

Data validation and integrity checking tools for Balancer infrastructure.

**Repository:** https://github.com/balancer/data-checks  
**Primary Use:** Data validation utilities

### Metadata & Configuration

#### [metadata](https://github.com/balancer/metadata)
**Status:** Actively maintained (December 2024) • 2 stars • 28 forks

Public metadata repository for Balancer protocol, including token lists, pool metadata, logos, and configuration data.

**Repository:** https://github.com/balancer/metadata  
**Primary Use:** Protocol metadata management

#### [tokenlists](https://github.com/balancer/tokenlists)
**Status:** Actively maintained (December 2024) • 35 stars • 265 forks • MIT

Curated token lists for the Balancer protocol, following the TokenLists standard for verified tokens across networks.

**Repository:** https://github.com/balancer/tokenlists  
**Primary Use:** Token list management

#### [blocklist](https://github.com/balancer/blocklist)
**Status:** Maintained (July 2025) • 0 stars • 0 forks

Addresses and entities blocked from interacting with Balancer frontends for compliance and security purposes.

**Repository:** https://github.com/balancer/blocklist  
**Primary Use:** Compliance management

#### [brand-assets](https://github.com/balancer/brand-assets)
**Status:** Active (March 2024) • 5 stars • 9 forks

Official Balancer brand assets including logos, colors, and design guidelines.

**Repository:** https://github.com/balancer/brand-assets  
**Primary Use:** Brand and marketing assets

#### [assets](https://github.com/balancer/assets)
**Status:** Active (June 2023) • 27 stars • 82 forks

Token and pool asset management, including icons and metadata for frontend display.

**Repository:** https://github.com/balancer/assets  
**Primary Use:** Token icons and visual assets

### Subgraphs & Data

#### [dune-spellbook](https://github.com/balancer/dune-spellbook)
**Status:** Maintained (June 2024) • 7 stars • 1.4k forks • Other

SQL views and spells for Dune Analytics to query Balancer protocol data.

**Repository:** https://github.com/balancer/dune-spellbook  
**Primary Use:** Dune Analytics integration

### Governance & DAO

#### [snapshot-spaces](https://github.com/balancer/snapshot-spaces)
**Status:** Forked (May 2021) • 1 star • 2k forks • MIT

Forked Snapshot Spaces configuration for Balancer governance voting.

**Repository:** https://github.com/balancer/snapshot-spaces  
**Primary Use:** Governance voting configuration

### Cross-chain & Bridges

#### [lz-v1-endpoint](https://github.com/balancer/lz-v1-endpoint)
**Status:** Active (July 2024) • 0 stars • 547 forks

LayerZero V1 endpoint contracts for BAL token bridge infrastructure enabling cross-chain BAL transfers.

**Repository:** https://github.com/balancer/lz-v1-endpoint  
**Primary Use:** BAL token bridging

#### [lz_gauges](https://github.com/balancer/lz_gauges)
**Status:** Active (August 2023) • 0 stars • 18 forks

LayerZero-based gauge contracts for cross-chain liquidity incentives.

**Repository:** https://github.com/balancer/lz_gauges  
**Primary Use:** Cross-chain gauges

### Utilities

#### [permit2](https://github.com/balancer/permit2)
**Status:** Forked (March 2024) • 0 stars • 269 forks • MIT

Forked Uniswap Permit2 contracts for next-generation token approvals mechanism.

**Repository:** https://github.com/balancer/permit2  
**Primary Use:** Token approval infrastructure

---

# Legacy Repositories

These are repos associated with past versions of Balancer or discontinued products.

## Balancer V1

### [balancer-core](https://github.com/balancer/balancer-core)
**Status:** Legacy (June 2024) • 340 stars • 166 forks • GPL-3.0

Original Balancer V1 protocol implementation (Bronze release, 2020). Contains the core pool logic and factory contracts for the first version of Balancer. Emphasized code clarity for audit and verification.

**Repository:** https://github.com/balancer/balancer-core  
**Primary Use:** Historical reference - V1 (deprecated)

**Note:** V1 launched in 2020. The protocol planned three releases (Bronze, Silver, Gold), though only Bronze was fully realized before V2 development began in 2021.

### [balancer-sor-v1](https://github.com/balancer/balancer-sor-v1)
**Status:** Legacy (August 2021) • 3 stars • 6 forks

Legacy Smart Order Router for Balancer V1 pools, providing routing optimization for V1.

**Repository:** https://github.com/balancer/balancer-sor-v1  
**Primary Use:** Historical reference - V1 SOR

### [balancer-subgraph](https://github.com/balancer/balancer-subgraph)
**Status:** Legacy (December 2021) • 70 stars • 58 forks • MIT

Original subgraph for Balancer V1, tracking pools, swaps, transactions, and users on V1.

**Repository:** https://github.com/balancer/balancer-subgraph  
**Primary Use:** Historical reference - V1 subgraph

### [frontend-v1](https://github.com/balancer/frontend-v1)
**Status:** Legacy (October 2024) • 74 stars • 71 forks • GPL-3.0

V1 pool management interface for creating and managing V1 pools.

**Repository:** https://github.com/balancer/frontend-v1  
**Primary Use:** Historical reference - V1 UI

### [swap-frontend-v1](https://github.com/balancer/swap-frontend-v1)
**Status:** Legacy (May 2021) • 21 stars • 41 forks • GPL-3.0

Original swap interface for Balancer V1 protocol.

**Repository:** https://github.com/balancer/swap-frontend-v1  
**Primary Use:** Historical reference - V1 swap UI

### [docs-v1](https://github.com/balancer/docs-v1)
**Status:** Legacy (November 2021) • 13 stars • 37 forks

Documentation for Balancer V1 protocol.

**Repository:** https://github.com/balancer/docs-v1  
**Primary Use:** Historical reference - V1 docs

### [balancer-registry](https://github.com/balancer/balancer-registry)
**Status:** Legacy (February 2021) • 14 stars • 25 forks

Registry contracts for V1 pool discovery and metadata.

**Repository:** https://github.com/balancer/balancer-registry  
**Primary Use:** Historical reference - V1 registry

### [exchange-proxy](https://github.com/balancer/exchange-proxy)
**Status:** Legacy (November 2020) • 21 stars • 28 forks • GPL-3.0

Exchange proxy contract for V1 multi-hop trading.

**Repository:** https://github.com/balancer/exchange-proxy  
**Primary Use:** Historical reference - V1 proxy

### [configurable-rights-pool](https://github.com/balancer/configurable-rights-pool)
**Status:** Legacy (October 2020) • 34 stars • 25 forks • GPL-3.0

Smart pool implementation with configurable rights for V1.

**Repository:** https://github.com/balancer/configurable-rights-pool  
**Primary Use:** Historical reference - V1 smart pools

### [bactions-proxy](https://github.com/balancer/bactions-proxy)
**Status:** Legacy (May 2021) • 10 stars • 14 forks • GPL-3.0

Batch actions proxy for efficient V1 pool operations.

**Repository:** https://github.com/balancer/bactions-proxy  
**Primary Use:** Historical reference - V1 batch actions

### [balancer-examples](https://github.com/balancer/balancer-examples)
**Status:** Template (June 2022) • 10 stars • 10 forks • Template badge

Template repository with various examples of how to integrate with Balancer V2 by interacting with existing pools and designing custom pool types. Includes liquidity provision examples and pool interaction patterns.

**Repository:** https://github.com/balancer/balancer-examples  
**Primary Use:** V2 integration examples and templates

### [metastable-rate-providers](https://github.com/balancer/metastable-rate-providers)
**Status:** Maintained (January 2025) • 1 star • 17 forks • GPL-3.0

Rate provider adaptors used by MetaStable pools to interface with various yield-bearing tokens and protocols.

**Repository:** https://github.com/balancer/metastable-rate-providers  
**Primary Use:** MetaStable pool rate provider integrations

### [frontend-v2](https://github.com/balancer/frontend-v2)
**Status:** Maintained (August 2025) • 195 stars • 296 forks • MIT

Previous version of the Balancer frontend application for V2 protocol. Now superseded by frontend-monorepo but still maintained for legacy support.

**Repository:** https://github.com/balancer/frontend-v2  
**Primary Use:** Legacy V2 UI

#### [balancer-sdk](https://github.com/balancer/balancer-sdk)
**Status:** Maintained (November 2024) • 83 stars • 95 forks • MIT

Previous SDK providing access to methods and utilities for interacting with Balancer V2 Protocol. Now being migrated to b-sdk.

**Repository:** https://github.com/balancer/balancer-sdk  
**Primary Use:** TypeScript integration library (legacy)

## Deprecated / Archived

### [docs-v2-archive](https://github.com/balancer/docs-v2-archive)
**Status:** Archived (February 2023) • 7 stars • 13 forks

Archived version of V2 documentation, superseded by current docs repository.

**Repository:** https://github.com/balancer/docs-v2-archive  
**Primary Use:** Historical V2 documentation

### [docs-developers](https://github.com/balancer/docs-developers)
**Status:** Archived (January 2023) • 15 stars • 21 forks

Archived developer documentation, now integrated into main docs.

**Repository:** https://github.com/balancer/docs-developers  
**Primary Use:** Historical developer docs

### [DeFi-Pulse-Adapters](https://github.com/balancer/DeFi-Pulse-Adapters)
**Status:** Forked (June 2020) • 2 stars • 501 forks • AGPL-3.0

Forked DeFi Pulse adapters for tracking Balancer TVL metrics.

**Repository:** https://github.com/balancer/DeFi-Pulse-Adapters  
**Primary Use:** TVL tracking (historical)

### [sor-benchmark](https://github.com/balancer/sor-benchmark)
**Status:** Archived (November 2023) • 1 star • 0 forks

Benchmarking tools for testing and comparing Smart Order Router performance across different scenarios.

**Repository:** https://github.com/balancer/sor-benchmark  
**Primary Use:** SOR performance testing

### [frontend-e2e](https://github.com/balancer/frontend-e2e)
**Status:** Archived (May 2023) • 2 stars • 4 forks

End-to-end testing suite for frontend applications with automated test scenarios.

**Repository:** https://github.com/balancer/frontend-e2e  
**Primary Use:** Frontend testing automation

### [helpers](https://github.com/balancer/helpers)
**Status:** Archived (June 2023) • 1 star • 1 fork

Collection of helper contracts and JavaScript code for common data dependencies in Balancer development.

**Repository:** https://github.com/balancer/helpers  
**Primary Use:** Utility functions and helpers

### [balancer-api](https://github.com/balancer/balancer-api)
**Status:** Deprecated (August 2024) • 17 stars • 15 forks • MIT • **DEPRECATED**

Previous API implementation, now deprecated in favor of the current backend services.

**Repository:** https://github.com/balancer/balancer-api  
**Primary Use:** Legacy API (deprecated)

### [balancer-rewards-api](https://github.com/balancer/balancer-rewards-api)
**Status:** Archived (October 2021) • 5 stars • 11 forks

API for querying Balancer rewards and incentive distributions (historical).

**Repository:** https://github.com/balancer/balancer-rewards-api  
**Primary Use:** Historical rewards API

### [authorizer-subgraph](https://github.com/balancer/authorizer-subgraph)
**Status:** Archived (March 2023) • 0 stars • 3 forks

Subgraph for tracking Balancer protocol authorizer and permission management.

**Repository:** https://github.com/balancer/authorizer-subgraph  
**Primary Use:** Authorization tracking

### [subgraph-split-testing](https://github.com/balancer/subgraph-split-testing)
**Status:** Archived (August 2022) • 1 star • 103 forks • MIT

Experimental split version of the Balancer V2 subgraph separating core and analytical data.

**Repository:** https://github.com/balancer/subgraph-split-testing  
**Primary Use:** Subgraph architecture testing

### [dune_queries](https://github.com/balancer/dune_queries)
**Status:** Archived (September 2021) • 2 stars • 6 forks

Collection of SQL queries for analyzing Balancer data on Dune Analytics.

**Repository:** https://github.com/balancer/dune_queries  
**Primary Use:** Analytics queries

### [bal-mining-scripts](https://github.com/balancer/bal-mining-scripts)
**Status:** Archived (December 2023) • 86 stars • 81 forks • GPL-3.0

Scripts for BAL token mining and liquidity mining reward calculations (historical program).

**Repository:** https://github.com/balancer/bal-mining-scripts  
**Primary Use:** Historical liquidity mining

### [erc20-redeemable](https://github.com/balancer/erc20-redeemable)
**Status:** Archived (April 2023) • 81 stars • 38 forks • Vue

Interface for redeeming ERC20 tokens, used for historical token distributions.

**Repository:** https://github.com/balancer/erc20-redeemable  
**Primary Use:** Token redemption UI

### [balancer-bounties](https://github.com/balancer/balancer-bounties)
**Status:** Archived (September 2021) • 3 stars • 15 forks • Vue

Previous bug bounty platform interface hosted at bounties.balancer.finance (now on Immunefi).

**Repository:** https://github.com/balancer/balancer-bounties  
**Primary Use:** Historical bounty platform

### [projects](https://github.com/balancer/projects)
**Status:** Archived (August 2021) • 2 stars • 149 forks

Project management and coordination repository.

**Repository:** https://github.com/balancer/projects  
**Primary Use:** Project tracking

### [opco-monorepo](https://github.com/balancer/opco-monorepo)
**Status:** Archived (November 2022) • 0 stars • 0 forks

Operating company monorepo for organizational infrastructure.

**Repository:** https://github.com/balancer/opco-monorepo  
**Primary Use:** Internal operations

### [linear-pools](https://github.com/balancer/linear-pools)
**Status:** Archived (June 2023) • 7 stars • 6 forks • GPL-3.0

Linear pool implementations for yield-bearing tokens, allowing integration with lending protocols.

**Repository:** https://github.com/balancer/linear-pools  
**Primary Use:** Linear pool reference

### [scaffold-balancer](https://github.com/balancer/scaffold-balancer)
**Status:** Archived (May 2023) • 5 stars • 7 forks • MIT

Previous scaffold template for Balancer V2 development, superseded by scaffold-balancer-v3.

**Repository:** https://github.com/balancer/scaffold-balancer  
**Primary Use:** V2 scaffold (superseded)

### [ipfs-push](https://github.com/balancer/ipfs-push)
**Status:** Archived (September 2021) • 3 stars • 11 forks

Utilities for pushing content to IPFS for decentralized storage.

**Repository:** https://github.com/balancer/ipfs-push  
**Primary Use:** IPFS deployment tools

### [frontend-v3](https://github.com/balancer/frontend-v3)
**Status:** Archived (October 2024) • 8 stars • 12 forks • MIT

Deprecated frontend application that was moved into the frontend-monorepo.

**Repository:** https://github.com/balancer/frontend-v3  
**Primary Use:** Historical - superseded by frontend-monorepo

### [yield-tokens](https://github.com/balancer/yield-tokens)
**Status:** Archived (August 2024) • 0 stars • 2 forks

Service for getting yield-bearing tokens APRs.

**Repository:** https://github.com/balancer/yield-tokens  
**Primary Use:** Historical yield token APR service

### [b-sdk-api](https://github.com/balancer/b-sdk-api)
**Status:** Archived (September 2023) • 0 stars • 0 forks

Bridge service between Balancer API and b-sdk package.

**Repository:** https://github.com/balancer/b-sdk-api  
**Primary Use:** Historical API bridge

### [pebbles](https://github.com/balancer/pebbles)
**Status:** Archived (January 2023) • 3 stars • 10 forks • HTML

Experimental "grug stack" project.

**Repository:** https://github.com/balancer/pebbles  
**Primary Use:** Historical experimental project

### [balancer-exchange](https://github.com/balancer/balancer-exchange)
**Status:** Archived (March 2021) • 95 stars • 102 forks • GPL-3.0

Exchange dapp for token swaps on Balancer V1/V2.

**Repository:** https://github.com/balancer/balancer-exchange  
**Primary Use:** Historical exchange interface

### [pool-management](https://github.com/balancer/pool-management)
**Status:** Archived (August 2020) • 22 stars • 42 forks • GPL-3.0

Pool management dapp for creating and managing pools.

**Repository:** https://github.com/balancer/pool-management  
**Primary Use:** Historical pool management interface

---

# Repository Statistics

## By Version:
- **V3 Repositories:** 10 core development + 7 templates = **17 total**
- **V2 Repositories:** 3 core + SOR + 3 maintained legacy = **7 total**
- **V1 Repositories:** **10 legacy** (deprecated, historical reference only)
- **Shared/Infrastructure:** **32 repos** (frontend, SDK, backend, deployment, metadata, governance, cross-chain, utilities)
- **Archived/Deprecated:** **26 repos** (19 original + 6 newly added + metastable-rate-providers)

**Total: 82 public repositories**

## By Category:
- **Forkable Templates:** 7 repositories (6 V3 + 1 V2)
- **Core Protocol (V2 + V3):** 14 repositories (10 V3 + 3 V2 + 1 SOR)
- **CoW Protocol Integration:** 2 repositories
- **Frontend Applications:** 3 active + 2 archived = 5 repositories
- **SDK & Developer Tools:** 3 active + 1 archived = 4 repositories
- **Backend & API:** 1 active + 1 archived = 2 repositories
- **Subgraphs & Analytics:** 3 repositories (v2, v3, dune)
- **Deployment & Infrastructure:** 3 repositories
- **Metadata & Assets:** 5 repositories
- **Governance & DAO:** 1 repository
- **Cross-chain & Bridges:** 2 repositories
- **Utilities:** 2 repositories (permit2 + 1 archived)
- **Legacy V1:** 10 repositories
- **Legacy V2 (maintained but superseded):** 3 repositories
- **Archived/Deprecated:** 26 repositories

## By Development Activity:
- **Highly Active (Dec 2024 updates):** ~18 repositories
- **Active (2024-2025 updates):** ~24 repositories  
- **Maintained but Legacy (V2/superseded):** 3 repositories
- **V1 Legacy (no development):** 10 repositories
- **Archived/Deprecated (no development):** 26 repositories

---

# Version Timeline

- **V1:** Launched 2020 (Bronze release)
  - Revolutionary constant function market maker
  - Up to 8 tokens per pool with flexible weights
  - Now deprecated but foundational to DeFi

- **V2:** Launched 2021
  - Introduced the Vault architecture
  - Protocol-level flash loans
  - Asset Managers for capital efficiency
  - Currently in production alongside V3

- **V3:** Launched 2024
  - Hooks system for extensibility
  - Improved gas efficiency
  - Native yield support (ERC4626)
  - Enhanced router architecture
  - Currently the primary focus of development

---

# Notes for Integrators

1. **For New Projects:** Start with V3 using scaffold-balancer-v3 template
2. **For V2 Integration:** Use b-sdk or balancer-sdk with balancer-v2-monorepo as reference
3. **For Smart Contracts:** Reference balancer-deployments for current addresses across all networks
4. **For Data Queries:** Use appropriate subgraph (v2 or v3) or Dune Analytics integration
5. **For Pool Math:** balancer-maths provides reference implementations and test cases
6. **For Routing:** balancer-sor for V2, integrated router for V3

---

# Template Strategy

Templates (marked with template badge or in templates section) are specifically designed to be forked and customized by developers building on Balancer. They include:
- Complete working examples
- Testing infrastructure
- Deployment scripts
- Documentation
- Frontend integration (where applicable)

Core repositories are maintained by the Balancer team for protocol development and should be referenced but not directly forked for custom development.

---

# Monorepo Structure

Both V2 and V3 use monorepo structures:
- **V2 Monorepo:** Contains vault, multiple pool types, helpers, solidity utils
- **V3 Monorepo:** Contains vault, pools, routers, hooks, utilities

Each package within the monorepos is independently versioned and published to npm.

---

# Documentation Strategy

Separate documentation repositories exist for each major version:
- **V1:** docs-v1 (archived)
- **V2:** docs (maintained at docs.balancer.fi)
- **V3:** docs-v3 (active at docs-v3.balancer.fi)

This reflects the architectural differences between versions and allows parallel documentation maintenance.

---

*Last updated: December 2025*  
*Repository count: 82 public repositories*  
*Based on: GitHub organization scan and repository metadata*
