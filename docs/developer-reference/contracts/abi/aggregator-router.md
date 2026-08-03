---
order: 6
title: Aggregator Router
---
# Aggregator Router ABI

```json
[
  {
    "inputs": [
      {
        "internalType": "contract IVault",
        "name": "vault",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "routerVersion",
        "type": "string"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "CannotReceiveEth",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "EthTransfer",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "ReentrancyGuardReentrantCall",
    "type": "error"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      }
    ],
    "name": "SenderIsNotVault",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SwapDeadline",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "SwapInsufficientPayment",
    "type": "error"
  },
  {
    "inputs": [],
    "name": "getSender",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getVault",
    "outputs": [
      {
        "internalType": "contract IVault",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "enum SwapKind",
            "name": "kind",
            "type": "uint8"
          },
          {
            "internalType": "address",
            "name": "pool",
            "type": "address"
          },
          {
            "internalType": "contract IERC20",
            "name": "tokenIn",
            "type": "address"
          },
          {
            "internalType": "contract IERC20",
            "name": "tokenOut",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amountGiven",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "limit",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "wethIsEth",
            "type": "bool"
          },
          {
            "internalType": "bytes",
            "name": "userData",
            "type": "bytes"
          }
        ],
        "internalType": "struct IRouter.SwapSingleTokenHookParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "querySwapHook",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "pool",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "tokenIn",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "tokenOut",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "exactAmountIn",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "userData",
        "type": "bytes"
      }
    ],
    "name": "querySwapSingleTokenExactIn",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountCalculated",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "pool",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "tokenIn",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "tokenOut",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "exactAmountOut",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "sender",
        "type": "address"
      },
      {
        "internalType": "bytes",
        "name": "userData",
        "type": "bytes"
      }
    ],
    "name": "querySwapSingleTokenExactOut",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "amountCalculated",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "pool",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "tokenIn",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "tokenOut",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "exactAmountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "minAmountOut",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "userData",
        "type": "bytes"
      }
    ],
    "name": "swapSingleTokenExactIn",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "pool",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "tokenIn",
        "type": "address"
      },
      {
        "internalType": "contract IERC20",
        "name": "tokenOut",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "exactAmountOut",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "maxAmountIn",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "deadline",
        "type": "uint256"
      },
      {
        "internalType": "bytes",
        "name": "userData",
        "type": "bytes"
      }
    ],
    "name": "swapSingleTokenExactOut",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "sender",
            "type": "address"
          },
          {
            "internalType": "enum SwapKind",
            "name": "kind",
            "type": "uint8"
          },
          {
            "internalType": "address",
            "name": "pool",
            "type": "address"
          },
          {
            "internalType": "contract IERC20",
            "name": "tokenIn",
            "type": "address"
          },
          {
            "internalType": "contract IERC20",
            "name": "tokenOut",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "amountGiven",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "limit",
            "type": "uint256"
          },
          {
            "internalType": "uint256",
            "name": "deadline",
            "type": "uint256"
          },
          {
            "internalType": "bool",
            "name": "wethIsEth",
            "type": "bool"
          },
          {
            "internalType": "bytes",
            "name": "userData",
            "type": "bytes"
          }
        ],
        "internalType": "struct IRouter.SwapSingleTokenHookParams",
        "name": "params",
        "type": "tuple"
      }
    ],
    "name": "swapSingleTokenHook",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "version",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "stateMutability": "payable",
    "type": "receive"
  }
]
```
