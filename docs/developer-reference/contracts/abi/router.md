---
order: 1
title: Router
---
# Router ABI

```json
[
    {
        "type": "constructor",
        "inputs": [
            {
                "name": "vault",
                "type": "address",
                "internalType": "contract IVault"
            },
            {
                "name": "weth",
                "type": "address",
                "internalType": "contract IWETH"
            },
            {
                "name": "permit2",
                "type": "address",
                "internalType": "contract IPermit2"
            }
        ],
        "stateMutability": "nonpayable"
    },
    { "type": "receive", "stateMutability": "payable" },
    {
        "type": "function",
        "name": "addLiquidityCustom",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "maxAmountsIn",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            {
                "name": "minBptAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            { "name": "wethIsEth", "type": "bool", "internalType": "bool" },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            {
                "name": "amountsIn",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            {
                "name": "bptAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            { "name": "returnData", "type": "bytes", "internalType": "bytes" }
        ],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "addLiquidityHook",
        "inputs": [
            {
                "name": "params",
                "type": "tuple",
                "internalType": "struct IRouter.AddLiquidityHookParams",
                "components": [
                    {
                        "name": "sender",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "pool",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "maxAmountsIn",
                        "type": "uint256[]",
                        "internalType": "uint256[]"
                    },
                    {
                        "name": "minBptAmountOut",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "kind",
                        "type": "uint8",
                        "internalType": "enum AddLiquidityKind"
                    },
                    {
                        "name": "wethIsEth",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "userData",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "name": "amountsIn",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            {
                "name": "bptAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            { "name": "returnData", "type": "bytes", "internalType": "bytes" }
        ],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "addLiquidityProportional",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "maxAmountsIn",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            {
                "name": "exactBptAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            { "name": "wethIsEth", "type": "bool", "internalType": "bool" },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            {
                "name": "amountsIn",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "addLiquiditySingleTokenExactOut",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "tokenIn",
                "type": "address",
                "internalType": "contract IERC20"
            },
            {
                "name": "maxAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "exactBptAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            { "name": "wethIsEth", "type": "bool", "internalType": "bool" },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            { "name": "amountIn", "type": "uint256", "internalType": "uint256" }
        ],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "addLiquidityUnbalanced",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "exactAmountsIn",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            {
                "name": "minBptAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            { "name": "wethIsEth", "type": "bool", "internalType": "bool" },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            {
                "name": "bptAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "initialize",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "tokens",
                "type": "address[]",
                "internalType": "contract IERC20[]"
            },
            {
                "name": "exactAmountsIn",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            {
                "name": "minBptAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            { "name": "wethIsEth", "type": "bool", "internalType": "bool" },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            {
                "name": "bptAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "initializeHook",
        "inputs": [
            {
                "name": "params",
                "type": "tuple",
                "internalType": "struct IRouter.InitializeHookParams",
                "components": [
                    {
                        "name": "sender",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "pool",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "tokens",
                        "type": "address[]",
                        "internalType": "contract IERC20[]"
                    },
                    {
                        "name": "exactAmountsIn",
                        "type": "uint256[]",
                        "internalType": "uint256[]"
                    },
                    {
                        "name": "minBptAmountOut",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "wethIsEth",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "userData",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "name": "bptAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "multicall",
        "inputs": [
            { "name": "data", "type": "bytes[]", "internalType": "bytes[]" }
        ],
        "outputs": [
            { "name": "results", "type": "bytes[]", "internalType": "bytes[]" }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "permitBatchAndCall",
        "inputs": [
            {
                "name": "permitBatch",
                "type": "tuple[]",
                "internalType": "struct IRouter.PermitApproval[]",
                "components": [
                    {
                        "name": "token",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "owner",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "spender",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "amount",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "nonce",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "deadline",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "name": "permitSignatures",
                "type": "bytes[]",
                "internalType": "bytes[]"
            },
            {
                "name": "permit2Batch",
                "type": "tuple",
                "internalType": "struct IAllowanceTransfer.PermitBatch",
                "components": [
                    {
                        "name": "details",
                        "type": "tuple[]",
                        "internalType": "struct IAllowanceTransfer.PermitDetails[]",
                        "components": [
                            {
                                "name": "token",
                                "type": "address",
                                "internalType": "address"
                            },
                            {
                                "name": "amount",
                                "type": "uint160",
                                "internalType": "uint160"
                            },
                            {
                                "name": "expiration",
                                "type": "uint48",
                                "internalType": "uint48"
                            },
                            {
                                "name": "nonce",
                                "type": "uint48",
                                "internalType": "uint48"
                            }
                        ]
                    },
                    {
                        "name": "spender",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "sigDeadline",
                        "type": "uint256",
                        "internalType": "uint256"
                    }
                ]
            },
            {
                "name": "permit2Signature",
                "type": "bytes",
                "internalType": "bytes"
            },
            {
                "name": "multicallData",
                "type": "bytes[]",
                "internalType": "bytes[]"
            }
        ],
        "outputs": [
            { "name": "results", "type": "bytes[]", "internalType": "bytes[]" }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "queryAddLiquidityCustom",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "maxAmountsIn",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            {
                "name": "minBptAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            {
                "name": "amountsIn",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            {
                "name": "bptAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            { "name": "returnData", "type": "bytes", "internalType": "bytes" }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "queryAddLiquidityHook",
        "inputs": [
            {
                "name": "params",
                "type": "tuple",
                "internalType": "struct IRouter.AddLiquidityHookParams",
                "components": [
                    {
                        "name": "sender",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "pool",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "maxAmountsIn",
                        "type": "uint256[]",
                        "internalType": "uint256[]"
                    },
                    {
                        "name": "minBptAmountOut",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "kind",
                        "type": "uint8",
                        "internalType": "enum AddLiquidityKind"
                    },
                    {
                        "name": "wethIsEth",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "userData",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "name": "amountsIn",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            {
                "name": "bptAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            { "name": "returnData", "type": "bytes", "internalType": "bytes" }
        ],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "queryAddLiquidityProportional",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "maxAmountsIn",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            {
                "name": "exactBptAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            {
                "name": "amountsIn",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "queryAddLiquiditySingleTokenExactOut",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "tokenIn",
                "type": "address",
                "internalType": "contract IERC20"
            },
            {
                "name": "exactBptAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            { "name": "amountIn", "type": "uint256", "internalType": "uint256" }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "queryAddLiquidityUnbalanced",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "exactAmountsIn",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            {
                "name": "bptAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "queryRemoveLiquidityCustom",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "maxBptAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "minAmountsOut",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            {
                "name": "bptAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountsOut",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            { "name": "returnData", "type": "bytes", "internalType": "bytes" }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "queryRemoveLiquidityHook",
        "inputs": [
            {
                "name": "params",
                "type": "tuple",
                "internalType": "struct IRouter.RemoveLiquidityHookParams",
                "components": [
                    {
                        "name": "sender",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "pool",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "minAmountsOut",
                        "type": "uint256[]",
                        "internalType": "uint256[]"
                    },
                    {
                        "name": "maxBptAmountIn",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "kind",
                        "type": "uint8",
                        "internalType": "enum RemoveLiquidityKind"
                    },
                    {
                        "name": "wethIsEth",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "userData",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "name": "bptAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountsOut",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            { "name": "returnData", "type": "bytes", "internalType": "bytes" }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "queryRemoveLiquidityProportional",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "exactBptAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            {
                "name": "amountsOut",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "queryRemoveLiquidityRecovery",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "exactBptAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "amountsOut",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "queryRemoveLiquidityRecoveryHook",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            { "name": "sender", "type": "address", "internalType": "address" },
            {
                "name": "exactBptAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "amountsOut",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "queryRemoveLiquiditySingleTokenExactIn",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "exactBptAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "tokenOut",
                "type": "address",
                "internalType": "contract IERC20"
            },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            {
                "name": "amountOut",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "queryRemoveLiquiditySingleTokenExactOut",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "tokenOut",
                "type": "address",
                "internalType": "contract IERC20"
            },
            {
                "name": "exactAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            {
                "name": "bptAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "querySwapHook",
        "inputs": [
            {
                "name": "params",
                "type": "tuple",
                "internalType": "struct IRouter.SwapSingleTokenHookParams",
                "components": [
                    {
                        "name": "sender",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "kind",
                        "type": "uint8",
                        "internalType": "enum SwapKind"
                    },
                    {
                        "name": "pool",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "tokenIn",
                        "type": "address",
                        "internalType": "contract IERC20"
                    },
                    {
                        "name": "tokenOut",
                        "type": "address",
                        "internalType": "contract IERC20"
                    },
                    {
                        "name": "amountGiven",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "limit",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "deadline",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "wethIsEth",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "userData",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ]
            }
        ],
        "outputs": [
            { "name": "", "type": "uint256", "internalType": "uint256" }
        ],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "querySwapSingleTokenExactIn",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "tokenIn",
                "type": "address",
                "internalType": "contract IERC20"
            },
            {
                "name": "tokenOut",
                "type": "address",
                "internalType": "contract IERC20"
            },
            {
                "name": "exactAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            {
                "name": "amountCalculated",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "querySwapSingleTokenExactOut",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "tokenIn",
                "type": "address",
                "internalType": "contract IERC20"
            },
            {
                "name": "tokenOut",
                "type": "address",
                "internalType": "contract IERC20"
            },
            {
                "name": "exactAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            {
                "name": "amountCalculated",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "removeLiquidityCustom",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "maxBptAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "minAmountsOut",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            { "name": "wethIsEth", "type": "bool", "internalType": "bool" },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            {
                "name": "bptAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountsOut",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            { "name": "returnData", "type": "bytes", "internalType": "bytes" }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "removeLiquidityHook",
        "inputs": [
            {
                "name": "params",
                "type": "tuple",
                "internalType": "struct IRouter.RemoveLiquidityHookParams",
                "components": [
                    {
                        "name": "sender",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "pool",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "minAmountsOut",
                        "type": "uint256[]",
                        "internalType": "uint256[]"
                    },
                    {
                        "name": "maxBptAmountIn",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "kind",
                        "type": "uint8",
                        "internalType": "enum RemoveLiquidityKind"
                    },
                    {
                        "name": "wethIsEth",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "userData",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ]
            }
        ],
        "outputs": [
            {
                "name": "bptAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "amountsOut",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            { "name": "returnData", "type": "bytes", "internalType": "bytes" }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "removeLiquidityProportional",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "exactBptAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "minAmountsOut",
                "type": "uint256[]",
                "internalType": "uint256[]"
            },
            { "name": "wethIsEth", "type": "bool", "internalType": "bool" },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            {
                "name": "amountsOut",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "removeLiquidityRecovery",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "exactBptAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "amountsOut",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "removeLiquidityRecoveryHook",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            { "name": "sender", "type": "address", "internalType": "address" },
            {
                "name": "exactBptAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "outputs": [
            {
                "name": "amountsOut",
                "type": "uint256[]",
                "internalType": "uint256[]"
            }
        ],
        "stateMutability": "nonpayable"
    },
    {
        "type": "function",
        "name": "removeLiquiditySingleTokenExactIn",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "exactBptAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "tokenOut",
                "type": "address",
                "internalType": "contract IERC20"
            },
            {
                "name": "minAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            { "name": "wethIsEth", "type": "bool", "internalType": "bool" },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            {
                "name": "amountOut",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "removeLiquiditySingleTokenExactOut",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "maxBptAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "tokenOut",
                "type": "address",
                "internalType": "contract IERC20"
            },
            {
                "name": "exactAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            { "name": "wethIsEth", "type": "bool", "internalType": "bool" },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            {
                "name": "bptAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            }
        ],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "swapSingleTokenExactIn",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "tokenIn",
                "type": "address",
                "internalType": "contract IERC20"
            },
            {
                "name": "tokenOut",
                "type": "address",
                "internalType": "contract IERC20"
            },
            {
                "name": "exactAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "minAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "deadline",
                "type": "uint256",
                "internalType": "uint256"
            },
            { "name": "wethIsEth", "type": "bool", "internalType": "bool" },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            { "name": "", "type": "uint256", "internalType": "uint256" }
        ],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "swapSingleTokenExactOut",
        "inputs": [
            { "name": "pool", "type": "address", "internalType": "address" },
            {
                "name": "tokenIn",
                "type": "address",
                "internalType": "contract IERC20"
            },
            {
                "name": "tokenOut",
                "type": "address",
                "internalType": "contract IERC20"
            },
            {
                "name": "exactAmountOut",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "maxAmountIn",
                "type": "uint256",
                "internalType": "uint256"
            },
            {
                "name": "deadline",
                "type": "uint256",
                "internalType": "uint256"
            },
            { "name": "wethIsEth", "type": "bool", "internalType": "bool" },
            { "name": "userData", "type": "bytes", "internalType": "bytes" }
        ],
        "outputs": [
            { "name": "", "type": "uint256", "internalType": "uint256" }
        ],
        "stateMutability": "payable"
    },
    {
        "type": "function",
        "name": "swapSingleTokenHook",
        "inputs": [
            {
                "name": "params",
                "type": "tuple",
                "internalType": "struct IRouter.SwapSingleTokenHookParams",
                "components": [
                    {
                        "name": "sender",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "kind",
                        "type": "uint8",
                        "internalType": "enum SwapKind"
                    },
                    {
                        "name": "pool",
                        "type": "address",
                        "internalType": "address"
                    },
                    {
                        "name": "tokenIn",
                        "type": "address",
                        "internalType": "contract IERC20"
                    },
                    {
                        "name": "tokenOut",
                        "type": "address",
                        "internalType": "contract IERC20"
                    },
                    {
                        "name": "amountGiven",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "limit",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "deadline",
                        "type": "uint256",
                        "internalType": "uint256"
                    },
                    {
                        "name": "wethIsEth",
                        "type": "bool",
                        "internalType": "bool"
                    },
                    {
                        "name": "userData",
                        "type": "bytes",
                        "internalType": "bytes"
                    }
                ]
            }
        ],
        "outputs": [
            { "name": "", "type": "uint256", "internalType": "uint256" }
        ],
        "stateMutability": "payable"
    },
    {
        "type": "error",
        "name": "AddressEmptyCode",
        "inputs": [
            { "name": "target", "type": "address", "internalType": "address" }
        ]
    },
    {
        "type": "error",
        "name": "AddressInsufficientBalance",
        "inputs": [
            { "name": "account", "type": "address", "internalType": "address" }
        ]
    },
    { "type": "error", "name": "EthTransfer", "inputs": [] },
    {
        "type": "error",
        "name": "ExitBelowMin",
        "inputs": [
            { "name": "amount", "type": "uint256", "internalType": "uint256" },
            { "name": "limit", "type": "uint256", "internalType": "uint256" }
        ]
    },
    { "type": "error", "name": "FailedInnerCall", "inputs": [] },
    { "type": "error", "name": "InsufficientEth", "inputs": [] },
    { "type": "error", "name": "ReentrancyGuardReentrantCall", "inputs": [] },
    {
        "type": "error",
        "name": "SafeERC20FailedOperation",
        "inputs": [
            { "name": "token", "type": "address", "internalType": "address" }
        ]
    },
    {
        "type": "error",
        "name": "SenderIsNotVault",
        "inputs": [
            { "name": "sender", "type": "address", "internalType": "address" }
        ]
    },
    { "type": "error", "name": "SwapDeadline", "inputs": [] }
]

```