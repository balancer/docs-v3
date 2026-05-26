# V3 Pool Deployments

Here is the current list of official Balancer Pool deployments:

![V3 Pools](/images/pool-deployments.svg)

Each entry has the protocol version (V2 or V3), the pool type name, the deployment date (i.e., the date on the deployment task: not necessarily when the contract was actually deployed on-chain), the pool version (e.g., v1, v2, v3, ...), and whether it is active or deprecated. In general, only the latest version will be "active."

For instance:
V3 Weighted Pool
2024-12-05 (v1, active)

From this, it is easy to navigate to the corresponding task in the deployments repo: [/v3/tasks/20241205-v3-weighted-pool/readme.md](https://github.com/balancer/balancer-deployments/blob/master/v3/tasks/20241205-v3-weighted-pool/readme.md)

Similarly, v2 tasks are under /v2. Each protocol version has /tasks and /deprecated directories for active and deprecated deployments, respectively.

In addition to a description of the contract, this readme contains a link to the commit in the repo it was produced from (at least for V3 deployments), and links to the deployed contract addresses on all networks.
