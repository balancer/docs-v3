# Gnosis Deployment Addresses

## Active Contracts

::: info More Details
For more information on specific deployments as well as changelogs for different contract versions, please see the [deployment tasks](https://github.com/balancer/balancer-deployments/tree/master/v3/tasks).
:::

### Core Contracts

<DeploymentAddresses chain="gnosis" :active="true" group="core" />

### Routers

<DeploymentAddresses chain="gnosis" :active="true" group="routers" />

### Pool Factories

<DeploymentAddresses chain="gnosis" :active="true" group="poolfactory" />

### Hooks and Peripherals

<DeploymentAddresses chain="gnosis" :active="true" group="hooksAndPeripherals" />

### Authorization Contracts

<DeploymentAddresses chain="gnosis" :active="true" group="authorizations" />

### Gauges and Governance

<DeploymentAddresses chain="gnosis" :active="true" group="gaugesgovernance" />

## Deprecated Contracts

These deployments were in use at some point, and may still be in active operation, for example in the case of pools created with old factories. In general it's better to interact with newer versions when possible.

::: warning Note
If you can only find the contract you are looking for in the deprecated section and it is not an old pool, try checking the deployments tasks to find it or ask in the Discord before using a deprecated contract.
:::

### Core Contracts

<DeploymentAddresses chain="gnosis" :active="false" group="core" />

### Pool Factories

<DeploymentAddresses chain="gnosis" :active="false" group="poolfactory" />

### Routers

<DeploymentAddresses chain="arbitrum" :active="false" group="routers" />

### Authorization Contracts

<DeploymentAddresses chain="gnosis" :active="false" group="authorizations" />

### Gauges and Governance

<DeploymentAddresses chain="gnosis" :active="false" group="gaugesgovernance" />
