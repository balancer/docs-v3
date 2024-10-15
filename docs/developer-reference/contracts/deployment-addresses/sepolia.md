

# Sepolia Deployment Addresses

::: info More Details
Balancer v3 is in active development. This page shows the latest version of deployed contracts.
:::

## Pool Factories

| Name             | Address                                    | Deployment |
|------------------|--------------------------------------------|------------|
| StablePoolFactory| 0x088F634B55C19A3138fd919098fB1320c4aBa6D0 | 9          |
| MockStablePool   | 0x47e7cC04016BC65358e8638Ea32a1d35e13ef8CB | 9          |
| WeightedPoolFactory| 0x209e6cE55A89A39329C9666a5B8b371e84572aE8 | 9          |
| MockWeightedPool   | 0x78e1c96103f0A76394BE4dC19eB684e0f87D7d5f | 9          |


## Core


| Name                 | Address                                    | Deployment |
|----------------------|--------------------------------------------|------------|
| ProtocolFeeController| 0x89530f8Abde4d55eD9Ad053949DA9Cac74F8AF14 | 9          |
| VaultAdmin           | 0xa91b39DAeF308666a1e8E34BCacE2C3a899AaE78 | 9          |
| VaultExtension       | 0xdE8EfE5C22EC8D34a6f6EA1E4AFd49d432a1d5d5 | 9          |
| Vault                | 0x30AF3689547354f82C70256894B07C9D0f067BB6 | 9          |
| Router               | 0x77eDc69766409C599F06Ef0B551a0990CBfe13A7 | 9          |
| BatchRouter          | 0x16Cf31c5c4f92ad6185D583080C84FEeb6074c78 | 9          |
| CompositeLiquidityRouter| 0x89cA59Bc46c00D90C496Fc99f16668b00Dd6B5CC | 9          |
| VaultExplorer        | 0x84B15F8dCE31aFA9507b7161e95f20C24aC4C1cd | 9          |


## Authorization

## Gauges and Governance

## Ungrouped Active/Current Contracts
    
| Name                    | Address                                    | Deployment |
|-------------------------|--------------------------------------------|------------|
| FeeTakingHookExample     | 0x0546b036a2A006d3f3730F028528Bf4EaBeb2009 | 9          |
| ExitFeeHookExample       | 0x0BA07700fDB18ff14D075e03A863ede2954e3fA2 | 9          |
| DirectionalFeeHookExample| 0x00C1f8dd270480375661B9a2fD100a407e6dCEDa | 9          |
| LotteryHookExample       | 0x506C90680336D65ebDC203Cf1283381e72b26e07 | 9          |


    
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

