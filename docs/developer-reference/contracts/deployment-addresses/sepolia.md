# Sepolia Deployment Addresses

## Pool Factories

| Name                | Address                                    |
| ------------------- | ------------------------------------------ |
| StablePoolFactory   | 0xd67F485C07D258B3e93835a3799d862ffcB55923 |
| MockStablePool      | 0x7373C5b9610d43466395617c428eCAA5b47ac5AA |
| WeightedPoolFactory | 0x7532d5a3bE916e4a4D900240F49F0BABd4FD855C |
| MockWeightedPool    | 0xFc253B433B7225AC7736EAbDF4115F7252aECb91 |

## Core

| Name                     | Address                                    |
| ------------------------ | ------------------------------------------ |
| ProtocolFeeController    | 0xa731C23D7c95436Baaae9D52782f966E1ed07cc8 |
| VaultAdmin               | 0x35fFB749B273bEb20F40f35EdeB805012C539864 |
| VaultExtension           | 0x0E8B07657D719B86e06bF0806D6729e3D528C9A9 |
| Vault                    | 0xbA1333333333a1BA1108E8412f11850A5C319bA9 |
| Router                   | 0x0BF61f706105EA44694f2e92986bD01C39930280 |
| BatchRouter              | 0xC85b652685567C1B074e8c0D4389f83a2E458b1C |
| BufferRouter             | 0xb5F3A41515457CC6E2716c62a011D260441CcfC9 |
| CompositeLiquidityRouter | 0xc6674C0c7694E9b990eAc939E74F8cc3DD39B4b0 |
| VaultExplorer            | 0xEB15EBBF9C1a4D7D243d57dE447Df0b97C40c324 |

## Authorization

## Gauges and Governance

## Ungrouped Active/Current Contracts

| Name                      | Address                                    |
| ------------------------- | ------------------------------------------ |
| FeeTakingHookExample      | 0x790ae803b6c0467C6A4cbDc6d6d712DE34CfdB76 |
| ExitFeeHookExample        | 0x2Aa9D4066DAe16ef001765efF2cA8F41Bde0b019 |
| DirectionalFeeHookExample | 0xD9e535a65eb38F962B84f7BBD2bf60293bA54058 |
| LotteryHookExample        | 0x0E85194F9eD75F0EFf2b89B73b6AD3053be03853 |

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
