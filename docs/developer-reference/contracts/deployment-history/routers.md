# V3 Router Deployments

Here is the current list of official Balancer Router deployments:

![V3 Pools](/images/router-deployments.svg)

Each entry has the protocol version (V2 or V3), the router name, the deployment date (i.e., the date on the deployment task: not necessarily when the contract was actually deployed on-chain), the router version (e.g., v1, v2, v3, ...), and whether it is active or deprecated. In general, only the latest version will be "active."

For instance, here is the **original** V3 Router (since deprecated and replaced by V2):
V3 Router
2024-12-05 (v1, deprecated)

From this, it is easy to navigate to the corresponding task in the deployments repo: [/v3/deprecated/20241205-v3-router/readme.md](https://github.com/balancer/balancer-deployments/blob/master/v3/deprecated/20241205-v3-router/readme.md)

Similarly, v2 tasks are under /v2. Each protocol version has /tasks and /deprecated directories for active and deprecated deployments, respectively.

The current V3 Router is:

V3 Router V2
2025-03-07 (v2, active)

The corresponding task in the deployments repo is: [/v3/tasks/20250307-v3-router-v2/readme.md](https://github.com/balancer/balancer-deployments/blob/master/v3/tasks/20250307-v3-router-v2/readme.md)

Since it is "active," we look under /tasks.

In addition to a description of the contract, this readme contains a link to the commit in the repo it was produced from (at least for V3 deployments), and links to the deployed contract addresses on all networks.
