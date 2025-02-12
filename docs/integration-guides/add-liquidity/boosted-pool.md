---
order: 3
title: Boosted pools
---

# Add liquidity to a boosted pool

The Router interface for unbalanced adds to a pool with boosted tokens is:
```solidity
/**
 * @notice Add arbitrary amounts of tokens to an ERC4626 pool through the buffer.
 * @dev An "ERC4626 pool" contains IERC4626 yield-bearing tokens (e.g., waDAI). Ensure that any buffers associated
 * with the wrapped tokens in the ERC4626 pool have been initialized before initializing or adding liquidity to
 * the "parent" pool, and also make sure limits are set properly.
 *
 * @param pool Address of the liquidity pool
 * @param wrapUnderlying Flags indicating whether the corresponding token should be wrapped or
 * used as a standard ERC20
 * @param exactAmountsIn Exact amounts of underlying/wrapped tokens in, sorted in token registration order
 * @param minBptAmountOut Minimum amount of pool tokens to be received
 * @param wethIsEth If true, incoming ETH will be wrapped to WETH and outgoing WETH will be unwrapped to ETH
 * @param userData Additional (optional) data required for adding liquidity
 * @return bptAmountOut Actual amount of pool tokens received
 */
function addLiquidityUnbalancedToERC4626Pool(
    address pool,
    bool[] memory wrapUnderlying,
    uint256[] memory exactAmountsIn,
    uint256 minBptAmountOut,
    bool wethIsEth,
    bytes memory userData
) external payable returns (uint256 bptAmountOut);
```
* `wrapUnderlying` tells the Vault if it should convert an underlying token to the ERC4626 version before liquidity is added to the pool. _Note: these boolean values must be sent in same sorted order the vault stores the tokens on chain_
* `exactAmountsIn` defines the exact amounts of each token to add to the pool. _Note: these must be sent sorted in alphanumeric order_
* `minBptAmountOut` defines the minimum amount of BPT to receive. If the amount is less than this (e.g. because of slippage) the transaction will revert
* If `wethIsEth` is set to `true`, the Router will deposit the `exactAmountIn` of `ETH` into the `WETH` contract. So, the transaction must be sent with the appropriate `value` amount
* `userData` allows additional parameters to be provided for custom pool types. In most cases it is not required and a value of `0x` can be provided.


## Javascript With SDK
This example demonstrates the full flow for adding liquidity to a boosted pool. The SDK provides functionality to easily fetch pool data from the [Balancer Pools API](https://docs.balancer.fi/guides/API/) and create a transaction with user defined slippage protection. 

```typescript
import {
  AddLiquidityBoostedUnbalancedInput,
  AddLiquidityKind,
  AddLiquidityBoostedV3,
  BalancerApi,
  ChainId,
  Slippage,
  InputAmount,
  permit2Abi,
  Permit2Helper
} from "@balancer/sdk";

// User defined
const chainId = ChainId.MAINNET;
const userAccount = privateKeyToAccount('PRIVATE_KEY');
const rpcUrl = 'RPC_END_POINT'
const pool = 'POOL_ADDRESS';
const amountsIn: InputAmount[] = [
  {
    address: "POOL_TOKEN_A",
    decimals: 18,
    rawAmount: 1000000000000000000n,
  },
  {
    address: "POOL_TOKEN_B",
    decimals: 6,
    rawAmount: 10000000000n,
  },
];
const slippage = Slippage.fromPercentage('1'); // 1%

// Approve permit2 contract to spend tokens
for (const token of amountsIn) {
    await client.writeContract({
        address: token.address,
        abi: erc20Abi,
        functionName: "approve",
        args: [PERMIT2[chainId], token.rawAmount],
        account
    });
}

// API can be used to fetch relevant pool data
const balancerApi = new BalancerApi(
    'https://api-v3.balancer.fi/',
    chainId,
);
const poolState = await balancerApi.pools.fetchPoolState(pool);

// Construct the AddLiquidityInput, in this case an AddLiquidityUnbalanced for a boosted pool
const addLiquidityInput: AddLiquidityBoostedUnbalancedInput = {
    amountsIn,
    chainId,
    rpcUrl,
    kind: AddLiquidityKind.Unbalanced,
};

// Query addLiquidity to get the amount of BPT out
const addLiquidity = new AddLiquidityBoostedV3();
const queryOutput = await addLiquidity.query(addLiquidityInput, poolState);

console.log(`Expected BPT Out: ${queryOutput.bptOut.amount.toString()}`);

const queryOutputWithSlippage = {...queryOutput, slippage }

// Use helper to create the necessary permit2 signatures
const permit2 = await Permit2Helper.signAddLiquidityBoostedApproval({
    ...queryOutputWithSlippage,
    client,
    owner: userAccount,
});

// Applies slippage to the BPT out amount and constructs the call
const call = addLiquidity.buildCallWithPermit2({
    queryOutputWithSlippage,
    permit2,
});

console.log(`Min BPT Out: ${call.minBptOut.amount.toString()}`);

const hash = await client.sendTransaction({
    account: userAccount,
    data: call.callData,
    to: call.to,
    value: call.value,
});
```

### Install the Balancer SDK

The [Balancer SDK](https://github.com/balancer/b-sdk) is a Typescript/Javascript library for interfacing with the Balancer protocol and can be installed with:

::: code-tabs#shell
@tab pnpm

```bash
pnpm add @balancer/sdk
```

@tab yarn

```bash
yarn add @balancer/sdk
```

@tab npm
```bash
npm install @balancer/sdk
```
:::

The four main helper classes we use from the SDK are:
* `BalancerApi` - to simplify retrieving pool data from the Pools API
* `AddLiquidity` - to build addLiquidity queries and transactions
* `Slippage` - to simplify creating limits with user defined slippage
* `Permit2Helper` - to simplify creating permit2 signatures for token approvals 

### Fetching Pool Data

In this example we use the BalancerApi `fetchPoolState` function to fetch the pool data required for the addLiquidityUnbalanced `poolState` parameter. 
```typescript
const balancerApi = new BalancerApi(
    'https://api-v3.balancer.fi/',
    chainId,
);
const poolState = await balancerApi.pools.fetchPoolState(pool);
```
To see the full query used to fetch pool state refer to the code [here](https://github.com/balancer/b-sdk/blob/41d2623743ab7fa466ed4d0f5f5c7e5aa16b7d91/src/data/providers/balancer-api/modules/pool-state/index.ts#L7).

### Queries and safely setting slippage limits

[Router queries](../../concepts/router/queries.md) allow for simulation of operations without execution. In this example, when the `query` function is called: 

```typescript
const queryOutput = await addLiquidity.query(addLiquidityInput, poolState);
// queryOutput.bptOut
```
The Routers [queryAddLiquidityUnbalanced](../../developer-reference/contracts/router-api.md#queryaddliquidityunbalanced) function is used to find the amount of BPT that would be received, `bptOut`.

In the next step `buildCallWithPermit2` uses `bptOut` from the query and user defined `slippage` to calculate the `minBptAmountOut`:
```typescript
const call = addLiquidity.buildCallWithPermit2({
    queryOutputWithSlippage,
    permit2
});
```

In the full example above, we defined our slippage as `Slippage.fromPercentage('1')`, meaning that we if we do not receive at least 99% of our expected `bptOut`, the transaction should revert.
Internally, the SDK subtracts 1% from the query output, as shown in `Slippage.applyTo` below:

```typescript
/**
 * Applies slippage to an amount in a given direction
 *
 * @param amount amount to apply slippage to
 * @param direction +1 adds the slippage to the amount, and -1 will remove the slippage from the amount
 * @returns
 */
public applyTo(amount: bigint, direction: 1 | -1 = 1): bigint {
    return MathSol.mulDownFixed(
        amount,
        BigInt(direction) * this.amount + WAD,
    );
}
```

### Constructing the call

The output of the `buildCallWithPermit2` function provides all that is needed to submit the addLiquidity transaction:
* `to` - the address of the Router
* `callData` - the encoded call data
* `value` - the native asset value to be sent

It also returns the `minBptOut` amount which can be useful to display/validation purposes before the transaction is sent.

## Javascript Without SDK

The following Viem and Ethers snippets demonstrate how to perform an add liquidity unbalanced operation. To achieve this, we use two Router functions:

* [`addLiquidityUnbalanced`](../../developer-reference/contracts/router-api.md#addliquidityunbalanced) - Add liquidity to a pool, unbalanced.
* [`queryAddLiquidityUnbalanced`](../../developer-reference/contracts/router-api.md#queryaddliquidityunbalanced) - The [router query](../../concepts/router/queries.md) used to simulate an add liquidity unbalanced operation. It returns the exact amount of BPT that would be received.

**Resources**:
* [Router ABI](../../developer-reference/contracts/router-api.md)
* [Router deployment addresses](../../reference/contracts)

::: code-tabs#shell
@tab Viem
```typescript
// Query operation
const client = createPublicClient({
  transport: http(RPC_URL),
  chain: sepolia,
});

const { result: bptAmountOut } = await client.simulateContract({
  address: routerAddress,
  abi: routerAbi,
  functionName: "queryAddLiquidityUnbalanced",
  args: [
    "0x1e5b830439fce7aa6b430ca31a9d4dd775294378", // pool address
    [100000000000000000n, 100000000000000000n], // token amounts in raw form
    0n, // minBptOut set to 0 when querying
    "0x", // userData, set to 0x in most scenarios
  ],
});

// Sending transaction
const walletClient = createWalletClient({
  chain: sepolia,
  transport: http(RPC_URL),
});

const hash = await walletClient.writeContract({
  address: routerAddress,
  abi: routerAbi,
  functionName: "addLiquidityUnbalanced",
  args: [
    "0x1e5b830439fce7aa6b430ca31a9d4dd775294378", // pool address
    [100000000000000000n, 100000000000000000n], // token amounts in raw form
    900000000000000000n, // minBptOut must be set appropriately
    false, // wethIsEth for Eth wrapping
    "0x", // userData, set to 0x in most scenarios
  ],
  account: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
});
```

@tab Ethers

```typescript
// Query operation
const provider = new JsonRpcProvider(RPC_URL);

const router = new Contract(
  routerAddress,
  routerAbi,
  provider
);

const bptAmountOut = await router.queryAddLiquidityUnbalanced.staticCall(
  "0x1e5b830439fce7aa6b430ca31a9d4dd775294378", // pool address
  [100000000000000000n, 100000000000000000n], // token amounts in raw form
  0n, // minBptOut set to 0 when querying
  "0x" // userData, set to 0x in most scenarios
);

// Sending transaction
const tx = await router.addLiquidityUnbalanced(
  "0x1e5b830439fce7aa6b430ca31a9d4dd775294378", // pool address
  [100000000000000000n, 100000000000000000n], // token amounts in raw form
  900000000000000000n, // minBptOut must be set appropriately
  false, // wethIsEth for Eth wrapping
  "0x" // userData, set to 0x in most scenarios
);
```
:::

## Solidity

The following code snippet shows how to add liquidity from a smart contract.

::: warning Queries should not be used onchain to set minAmountOut due to possible manipulation via frontrunning.
:::

```solidity
pragma solidity ^0.8.4;

// TODO - Assume there will be interface type package? Needs updated when released.
import "@balancer-labs/...../IRouter.sol";

contract AddLiquidityUnbalanced {
    IRouter public router;

    constructor(IRouter _router) {
      router = _router;
    }

    function addLiquidityUnbalanced(
        address pool,
        uint256[] memory exactAmountsIn,
        uint256 minBptAmountOut,
        bool wethIsEth,
        bytes memory userData
    ) external override {
        router.addLiquidityUnbalanced(
          pool,
          exactAmountsIn,
          minBptAmountOut,
          wethIsEth,
          userData
        );
    }
}
```
