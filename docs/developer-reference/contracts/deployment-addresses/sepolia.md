

# Sepolia Deployment Addresses

::: info More Details
For more information on specific deployments as well as changelogs for different contract versions, please see the [deployment tasks](https://github.com/balancer/balancer-deployments/tree/master/tasks).
:::

## Pool Factories

| Name             | Address                                    | Deployment |
|------------------|--------------------------------------------|------------|
| StablePoolFactory| 0x4b4b45Edf6Ca26ae894377Cf4FeD1FA9F82D85C6 | 7          |
| MockStablePool   | 0x75457Be6462C35d23aBA13e43825079733acB27E | 7          |
| WeightedPoolFactory| 0x765ce16dbb3D7e89a9beBc834C5D6894e7fAA93c | 7          |
| MockWeightedPool   | 0x83a6375b50046256d47816Ff80B96975B0e589Cc | 7          |


## Core


| Name                 | Address                                    | Deployment |
|----------------------|--------------------------------------------|------------|
| ProtocolFeeController| 0x99f2D91EBA577e4Bf7175E72B3Ef2B6dDb1FaBe3 | 7          |
| VaultAdmin           | 0x33156628B220fC3812b325Cd977CEB6523c01E2a | 7          |
| VaultExtension       | 0x2ed7a4eca0689C16A67E01dd25509fa231C148c2 | 7          |
| Vault                | 0x7966FE92C59295EcE7FB5D9EfDB271967BFe2fbA | 7          |
| Router               | 0xDd10aDF05379D7C0Ee4bC9c72ecc5C01c40E25b8 | 7          |
| BatchRouter          | 0x48341a762AD5470f96F4B553681696d1e5eeac0A | 7          |
| VaultExplorer        | 0x7f1D444Be59798feD1db893C75e6eC977449A9cD | 7          |


## Authorization


## Gauges and Governance



## Ungrouped Active/Current Contracts
    
| Name                    | Address                                    | Deployment |
|-------------------------|--------------------------------------------|------------|
| FeeTakingHookExample     | 0xAD41a3ef49F2bdf7c02ab67e6a82b99121d0Bd98 | 7          |
| ExitFeeHookExample       | 0x301EDe5Fd4f9d7266B09c3A2E38F97776447154B | 7          |
| DirectionalFeeHookExample| 0xaf2692484AaE97c797686CaA468fb1B3E77F0bDC | 7          |
| LotteryHookExample       | 0x2371cB9AB7B498D7CD173cf30828ebc1430F1482 | 7          |


    
# Deprecated Contracts

These deployments were in use at some point, and may still be in active operation, for example in the case of pools created with old factories.  In general it's better to interact with newer versions when possible.

#### If you can only find the contract you are looking for in the deprecated section and it is not an old pool, try checking the deployments tasks to find it or ask in the Discord before using a deprecated contract.


    
<style scoped>
table {
    display: table;
    width: 100%;
}
table th:first-of-type, td:first-of-type {
    width: 30%;
}
table th:nth-of-type(2) {
    width: 40%;
}
td {
    max-width: 0;
    overflow: hidden;
}
</style>

