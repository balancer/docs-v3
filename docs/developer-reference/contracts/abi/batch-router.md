---
order: 2
title: Batch Router
---
# Batch Router ABI

```json
[
  {
    inputs: [],
    name: "SwapDeadline",
    type: "error",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "contract IERC20",
            name: "tokenIn",
            type: "address",
          },
          {
            components: [
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
            ],
            internalType: "struct IBatchRouter.SwapPathStep[]",
            name: "steps",
            type: "tuple[]",
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
        ],
        internalType: "struct IBatchRouter.SwapPathExactAmountIn[]",
        name: "paths",
        type: "tuple[]",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "querySwapExactIn",
    outputs: [
      {
        internalType: "uint256[]",
        name: "pathAmountsOut",
        type: "uint256[]",
      },
      {
        internalType: "address[]",
        name: "tokensOut",
        type: "address[]",
      },
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
        components: [
          {
            internalType: "contract IERC20",
            name: "tokenIn",
            type: "address",
          },
          {
            components: [
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
            ],
            internalType: "struct IBatchRouter.SwapPathStep[]",
            name: "steps",
            type: "tuple[]",
          },
          {
            internalType: "uint256",
            name: "maxAmountIn",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "exactAmountOut",
            type: "uint256",
          },
        ],
        internalType: "struct IBatchRouter.SwapPathExactAmountOut[]",
        name: "paths",
        type: "tuple[]",
      },
      {
        internalType: "bytes",
        name: "userData",
        type: "bytes",
      },
    ],
    name: "querySwapExactOut",
    outputs: [
      {
        internalType: "uint256[]",
        name: "pathAmountsIn",
        type: "uint256[]",
      },
      {
        internalType: "address[]",
        name: "tokensIn",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "amountsIn",
        type: "uint256[]",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        components: [
          {
            internalType: "contract IERC20",
            name: "tokenIn",
            type: "address",
          },
          {
            components: [
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
            ],
            internalType: "struct IBatchRouter.SwapPathStep[]",
            name: "steps",
            type: "tuple[]",
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
        ],
        internalType: "struct IBatchRouter.SwapPathExactAmountIn[]",
        name: "paths",
        type: "tuple[]",
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
    name: "swapExactIn",
    outputs: [
      {
        internalType: "uint256[]",
        name: "pathAmountsOut",
        type: "uint256[]",
      },
      {
        internalType: "address[]",
        name: "tokensOut",
        type: "address[]",
      },
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
        components: [
          {
            internalType: "contract IERC20",
            name: "tokenIn",
            type: "address",
          },
          {
            components: [
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
            ],
            internalType: "struct IBatchRouter.SwapPathStep[]",
            name: "steps",
            type: "tuple[]",
          },
          {
            internalType: "uint256",
            name: "maxAmountIn",
            type: "uint256",
          },
          {
            internalType: "uint256",
            name: "exactAmountOut",
            type: "uint256",
          },
        ],
        internalType: "struct IBatchRouter.SwapPathExactAmountOut[]",
        name: "paths",
        type: "tuple[]",
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
    name: "swapExactOut",
    outputs: [
      {
        internalType: "uint256[]",
        name: "pathAmountsIn",
        type: "uint256[]",
      },
      {
        internalType: "address[]",
        name: "tokensIn",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "amountsIn",
        type: "uint256[]",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
]
```