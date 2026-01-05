---
order: 6
title: LBP Migration Router API
---

# LBP Migration Router API

The LBP Migration Router can be used to interact with Balancer onchain via state changing operations or used to query operations in an off-chain context.

Specialized router for migrating liquidity from a Liquidity Bootstrapping Pool (LBP) to a new Weighted Pool with custom parameters. Note that migration is optional, and unsupported for some LBP types (e.g., FixedPrice).

**Use Case:** After an LBP concludes, the pool owner can migrate remaining liquidity to a standard weighted pool with the desired final weights and configuration.

## State-changing functions

### `migrateLiquidity`

```solidity
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

Migrates liquidity from an LBP to a newly created weighted pool with custom parameters.

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

| Name           | Type                 | Description                                                    |
|----------------|----------------------|----------------------------------------------------------------|
| lbp            | ILBPool              | Address of the Liquidity Bootstrapping Pool to migrate         |
| excessReceiver | address              | Address to receive any excess tokens after migration           |
| params         | WeightedPoolParams   | Configuration for the new weighted pool                        |

**Returns:**

| Name          | Type             | Description                                            |
|---------------|------------------|--------------------------------------------------------|
| weightedPool  | IWeightedPool    | Address of the newly created weighted pool             |
| exactAmountsIn | uint256[] memory | Amounts used to initialize the pool, sorted in token registration order |
| bptAmountOut  | uint256          | BPT received from the new pool                         |

**Events:**

```solidity
event PoolMigrated(
    ILBPool indexed lbp,
    IWeightedPool weightedPool,
    uint256[] exactAmountsIn,
    uint256 bptAmountOut
);
```

Emitted when a pool is successfully migrated from an LBP to a new weighted pool.

## Queries

### `queryMigrateLiquidity`

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

Simulates a liquidity migration to estimate results before execution.

**Parameters:**

| Name           | Type               | Description                                            |
|----------------|--------------------|--------------------------------------------------------|
| lbp            | ILBPool            | Liquidity Bootstrapping Pool                           |
| sender         | address            | Sender address                                         |
| excessReceiver | address            | Address to receive any excess tokens after migration   |
| params         | WeightedPoolParams | Parameters for creating the new weighted pool          |

**Returns:**

| Name           | Type             | Description                                                         |
|----------------|------------------|---------------------------------------------------------------------|
| exactAmountsIn | uint256[] memory | The amounts of tokens used to initialize the pool, sorted in token registration order |
| bptAmountOut   | uint256          | The amount of BPT tokens received from the weighted pool after migration |

## Data Structures

### `WeightedPoolParams`

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
```

Configuration parameters for creating a new weighted pool.

**Fields:**

| Name                       | Type             | Description                                                       |
|----------------------------|------------------|-------------------------------------------------------------------|
| name                       | string           | Name of the new weighted pool                                     |
| symbol                     | string           | Symbol of the new weighted pool                                   |
| roleAccounts               | PoolRoleAccounts | Pool admin roles (pause manager, swap fee manager, pool creator)  |
| swapFeePercentage          | uint256          | Swap fee percentage for the new pool                              |
| poolHooksContract          | address          | Address of the pool hooks contract (optional)                     |
| enableDonation             | bool             | Whether to enable donation functionality                          |
| disableUnbalancedLiquidity | bool             | Whether to disable unbalanced liquidity operations                |
| salt                       | bytes32          | Salt for deterministic address generation (CREATE2)               |

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>
