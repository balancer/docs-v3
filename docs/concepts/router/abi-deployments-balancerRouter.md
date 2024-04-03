---
order: 4
title: Balancer Router Deployments & ABI
---

// TODO - Update before launch

## Deployments

| Network  | Address                                      |
|----------|----------------------------------------------|
| Sepolia  | TODO  |
| Mainnet  | TODO                                         |


## ABI

```json
[
  {
    inputs: [
      {
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "limit",
        type: "uint256",
      },
    ],
    name: "ExitBelowMin",
    type: "error",
  },
  {
    inputs: [],
    name: "SwapDeadline",
    type: "error",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "maxAmountsIn",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "minBptAmountOut",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "wethIsEth",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "addLiquidityCustom",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amountsIn",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "bptAmountOut",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "returnData",
        type: "bytes",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "tokenIn",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "maxAmountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "exactBptAmountOut",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "wethIsEth",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "addLiquiditySingleTokenExactOut",
    outputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "exactAmountsIn",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "minBptAmountOut",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "wethIsEth",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "addLiquidityUnbalanced",
    outputs: [
      {
        internalType: "uint256",
        name: "bptAmountOut",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "contract IERC20[]",
        name: "tokens",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "exactAmountsIn",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "minBptAmountOut",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "wethIsEth",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "initialize",
    outputs: [
      {
        internalType: "uint256",
        name: "bptAmountOut",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "maxAmountsIn",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "minBptAmountOut",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "queryAddLiquidityCustom",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amountsIn",
        type: "uint256[]",
      },
      {
        internalType: "uint256",
        name: "bptAmountOut",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "returnData",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "tokenIn",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "exactBptAmountOut",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "queryAddLiquiditySingleTokenExactOut",
    outputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "uint256[]",
        name: "exactAmountsIn",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "queryAddLiquidityUnbalanced",
    outputs: [
      {
        internalType: "uint256",
        name: "bptAmountOut",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "maxBptAmountIn",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "minAmountsOut",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "queryRemoveLiquidityCustom",
    outputs: [
      {
        internalType: "uint256",
        name: "bptAmountIn",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "amountsOut",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "returnData",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "exactBptAmountIn",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "queryRemoveLiquidityProportional",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amountsOut",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "exactBptAmountIn",
        type: "uint256",
      },
    ],
    name: "queryRemoveLiquidityRecovery",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amountsOut",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "exactBptAmountIn",
        type: "uint256",
      },
      {
        internalType: "contract IERC20",
        name: "tokenOut",
        type: "address",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "queryRemoveLiquiditySingleTokenExactIn",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "tokenOut",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "exactAmountOut",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "queryRemoveLiquiditySingleTokenExactOut",
    outputs: [
      {
        internalType: "uint256",
        name: "bptAmountIn",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "tokenIn",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "tokenOut",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "exactAmountIn",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "querySwapSingleTokenExactIn",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "tokenIn",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "tokenOut",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "exactAmountOut",
        type: "uint256",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "querySwapSingleTokenExactOut",
    outputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "maxBptAmountIn",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "minAmountsOut",
        type: "uint256[]",
      },
      {
        internalType: "bool",
        name: "wethIsEth",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "removeLiquidityCustom",
    outputs: [
      {
        internalType: "uint256",
        name: "bptAmountIn",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "amountsOut",
        type: "uint256[]",
      },
      {
        internalType: "bytes",
        name: "returnData",
        type: "bytes",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "exactBptAmountIn",
        type: "uint256",
      },
      {
        internalType: "uint256[]",
        name: "minAmountsOut",
        type: "uint256[]",
      },
      {
        internalType: "bool",
        name: "wethIsEth",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "removeLiquidityProportional",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amountsOut",
        type: "uint256[]",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "exactBptAmountIn",
        type: "uint256",
      },
    ],
    name: "removeLiquidityRecovery",
    outputs: [
      {
        internalType: "uint256[]",
        name: "amountsOut",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "exactBptAmountIn",
        type: "uint256",
      },
      {
        internalType: "contract IERC20",
        name: "tokenOut",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "minAmountOut",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "wethIsEth",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "removeLiquiditySingleTokenExactIn",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "maxBptAmountIn",
        type: "uint256",
      },
      {
        internalType: "contract IERC20",
        name: "tokenOut",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "exactAmountOut",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "wethIsEth",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "removeLiquiditySingleTokenExactOut",
    outputs: [
      {
        internalType: "uint256",
        name: "bptAmountIn",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "tokenIn",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "tokenOut",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "exactAmountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "minAmountOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "wethIsEth",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "swapSingleTokenExactIn",
    outputs: [
      {
        internalType: "uint256",
        name: "amountOut",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address",
        name: "pool",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "tokenIn",
        type: "address",
      },
      {
        internalType: "contract IERC20",
        name: "tokenOut",
        type: "address",
      },
      {
        internalType: "uint256",
        name: "exactAmountOut",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "maxAmountIn",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "deadline",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "wethIsEth",
        type: "bool",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "swapSingleTokenExactOut",
    outputs: [
      {
        internalType: "uint256",
        name: "amountIn",
        type: "uint256",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
]
```