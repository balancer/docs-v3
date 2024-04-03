---
order: 4
title: Integrate a Custom AMM with Subgraph
---

# Integrating a Custom AMM with Subgraph

For those interested in integrating a custom AMM with the Balancer toolkit, including its API and SDK, the first essential step involves integrating your AMM with the Subgraph.

::: tip Subgraph Documentation

For a comprehensive guide on working with Subgraphs, also check out [The Graph's documentation](https://thegraph.com/docs/en/).

:::

## Understanding the Balancer Subgraphs

Balancer has two types of Subgraphs for each network:

- **Vault Subgraph**: Indexes events related to the Balancer Vault, such as swaps, liquidity provision, pool tokens balances, etc. Essential for detailed pool token information.
- **Pools Subgraph**: Indexes pool factories and their parameters, playing a critical role in making custom AMMs liquidity visible within the Balancer ecosystem.

Balancer chose to split its Subgraph into two to enhance developer experience and speed up the performance. This split makes the developer's job of adding and working with the code much simpler, especially with the Pools Subgraph, which has a clear and easy-to-understand setup.

This approach also addresses a well-known challenge with Subgraphs - the long time it often takes to sync them. Since the Pools Subgraph only deals with pool factories and their params, it holds less data than the Vault Subgraph. This means it can sync faster, leading to quicker integrations and a smoother experience for developers.

## Integrating with the Pools Subgraph

### Step 1: Forking and Cloning the Subgraph Repository

Begin by forking the [Subgraph repository](https://github.com/balancer/balancer-subgraph-v3) and cloning it to your local development environment.

### Step 2: Installing Dependencies

Ensure your environment is prepared with:

- **Node.js (Version 18 or higher)**: Required for executing the integration scripts.
- **pnpm**: The package manager used for handling project dependencies.

### Step 3: Adding a New Pool Factory via CLI

Navigate to the `subgraphs/pools` directory and run the following command:

```bash
pnpm run add-pool
```

This command launches a CLI designed to facilitate the addition of a new factory.

#### Network Selection

The tool first asks for the network where the new pool factory will be added, ensuring correct indexing within the Subgraph.

#### Factory Address Input

You are then prompted to provide the address of your pool factory. For contracts verified on Etherscan, the CLI automatically retrieves the necessary ABIs.

#### Event Selection

After ABI retrieval, select the event emitted upon creating a new pool. This step is crucial for indexing your pools.

#### Defining Pool Type

Finally, define the name of your pool type. Assuming a new type named "Custom," this differentiates your pools from existing types like "Weighted" and "Stable."

### Completion

Following these steps adds your pool factory to the Subgraph Manifest. A new folder (e.g., `mappings/custom/index.ts`) is created for the event handler that indexes new pools from your factory.

Integrating your custom AMM with the Subgraph is a foundational step towards making your liquidity pools accessible and visible through the Balancer protocol.

---
