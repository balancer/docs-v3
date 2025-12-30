---
order: 6
title: LBP Migration Router Router API
---

### LBPMigrationRouter ([ILBPMigrationRouter](https://github.com/balancer/balancer-v3-monorepo/blob/cdb5d86cf458362538ada1ba24ff33506c74ed94/pkg/interfaces/contracts/pool-weighted/ILBPMigrationRouter.sol))

Specialized router for migrating liquidity from a Liquidity Bootstrapping Pool (LBP) to a new Weighted Pool with custom parameters. Note that migration is optional, and unsupported for some LBP types (e.g., FixedPrice).

**Use Case:** After an LBP concludes, the pool owner can migrate remaining liquidity to a standard weighted pool with the desired final weights and configuration.

#### Migrate Liquidity

```solidity
struct WeightedPoolParams {
    string name;
    string symbol;
    PoolRoleAccounts roleAccounts;     // Pool admin roles
    uint256 swapFeePercentage;
    address poolHooksContract;
    bool enableDonation;
    bool disableUnbalancedLiquidity;
    bytes32 salt;                      // For deterministic address
}

function migrateLiquidity(
    ILBPool lbp,
    address excessReceiver,
    WeightedPoolParams memory params
) external returns (
    IWeightedPool weightedPool,
    uint256[] memory exactAmountsIn,
    uint256 bptAmountOut
);
```

Migrates liquidity from an LBP to a newly created weighted pool.

**Requirements:**
- Caller must be the LBP owner
- LBP must have specified this router address on deployment

**Process:**
1. Validates caller is LBP owner
2. Creates new weighted pool with specified parameters
3. Exits all liquidity from the LBP
4. Initializes the new weighted pool with the exited tokens
5. Sends any excess tokens to `excessReceiver`
6. Returns new pool address and migration details

**Parameters:**
- `lbp`: Address of the Liquidity Bootstrapping Pool to migrate
- `excessReceiver`: Address to receive any excess tokens after migration
- `params`: Configuration for the new weighted pool

**Returns:**
- `weightedPool`: Address of the newly created weighted pool
- `exactAmountsIn`: Amounts used to initialize the new pool
- `bptAmountOut`: BPT received from the new pool

**Events:**
```solidity
event PoolMigrated(
    ILBPool indexed lbp,
    IWeightedPool weightedPool,
    uint256[] exactAmountsIn,
    uint256 bptAmountOut
);
```

**Query equivalent:**
```solidity
function queryMigrateLiquidity(
    ILBPool lbp,
    address sender,
    address excessReceiver,
    WeightedPoolParams memory params
) external returns (
    uint256[] memory exactAmountsIn,
    uint256 bptAmountOut
);
```

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>