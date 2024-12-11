# Mainnet Deployment Addresses

## Pool Factories

| Name                | Address                                    |
| ------------------- | ------------------------------------------ |
| StablePoolFactory   | 0xB9d01CA61b9C181dA1051bFDd28e1097e920AB14 |
| MockStablePool      | 0x89Ef89Fd9a6ec73bcE588F309C1F65C406d2891C |
| WeightedPoolFactory | 0x201efd508c8DfE9DE1a13c2452863A78CB2a86Cc |
| MockWeightedPool    | 0x527d0E14acc53FB040DeBeae1cAb973D23FB3568 |

## Core

| Name                     | Address                                    |
| ------------------------ | ------------------------------------------ |
| ProtocolFeeController    | 0xa731C23D7c95436Baaae9D52782f966E1ed07cc8 |
| VaultAdmin               | 0x35fFB749B273bEb20F40f35EdeB805012C539864 |
| VaultExtension           | 0x0E8B07657D719B86e06bF0806D6729e3D528C9A9 |
| Vault                    | 0xbA1333333333a1BA1108E8412f11850A5C319bA9 |
| Router                   | 0x5C6fb490BDFD3246EB0bB062c168DeCAF4bD9FDd |
| BatchRouter              | 0x136f1EFcC3f8f88516B9E94110D56FDBfB1778d1 |
| BufferRouter             | 0x9179C06629ef7f17Cb5759F501D89997FE0E7b45 |
| CompositeLiquidityRouter | 0x1CD776897ef4f647bf8241Ec69549e4A9cb1D608 |
| VaultExplorer            | 0x774cB66e2B2dB59A9daF175e9b2B7A142E17EB94 |

## Authorization

## Gauges and Governance

## Ungrouped Active/Current Contracts

| Name                      | Address | Deployment |
| ------------------------- | ------- | ---------- |
| FeeTakingHookExample      |         | 11         |
| ExitFeeHookExample        |         | 11         |
| DirectionalFeeHookExample |         | 11         |
| LotteryHookExample        |         | 11         |

# Deprecated Contracts

These deployments were in use at some point, and may still be in active operation, for example in the case of pools created with old factories. In general it's better to interact with newer versions when possible.

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
