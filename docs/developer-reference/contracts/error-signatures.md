---
order: 4
---

# Error signatures

Catalogue for decoding custom error signatures into their associated error names

## Vault

| Error Name                           | Inputs                                                                                 | Error Signature |
| ------------------------------------ | -------------------------------------------------------------------------------------- | --------------- |
| AddressEmptyCode                     | address target                                                                         | `0x9996b315`    |
| AddressInsufficientBalance           | address account                                                                        | `0xcd786059`    |
| AfterAddLiquidityHookFailed          |                                                                                        | `0xe1249165`    |
| AfterInitializeHookFailed            |                                                                                        | `0x0f23dbc6`    |
| AfterRemoveLiquidityHookFailed       |                                                                                        | `0x1d3391d8`    |
| AfterSwapHookFailed                  |                                                                                        | `0x15a29dec`    |
| AllZeroInputs                        |                                                                                        | `0x7e46bddc`    |
| AmountGivenZero                      |                                                                                        | `0x57a456b7`    |
| AmountInAboveMax                     | address tokenIn, uint256 amountIn, uint256 maxAmountIn                                 | `0x8eda85e4`    |
| AmountOutBelowMin                    | address tokenOut, uint256 amountOut, uint256 minAmountOut                              | `0x2f785e46`    |
| BalanceNotSettled                    |                                                                                        | `0x20f1d86d`    |
| BalanceOverflow                      |                                                                                        | `0x89560ca1`    |
| BeforeAddLiquidityHookFailed         |                                                                                        | `0x0b2eb652`    |
| BeforeInitializeHookFailed           |                                                                                        | `0x60612925`    |
| BeforeRemoveLiquidityHookFailed      |                                                                                        | `0x2aaf8866`    |
| BeforeSwapHookFailed                 |                                                                                        | `0xe91e17e7`    |
| BptAmountInAboveMax                  | uint256 amountIn, uint256 maxAmountIn                                                  | `0x31d38e0b`    |
| BptAmountOutBelowMin                 | uint256 amountOut, uint256 minAmountOut                                                | `0x8d261d5d`    |
| BufferAlreadyInitialized             | address wrappedToken                                                                   | `0x1690fa40`    |
| BufferNotInitialized                 | address wrappedToken                                                                   | `0x85f41299`    |
| BufferSharesInvalidOwner             |                                                                                        | `0x586d06df`    |
| BufferSharesInvalidReceiver          |                                                                                        | `0xdbe6b10e`    |
| BufferTotalSupplyTooLow              | uint256 totalSupply                                                                    | `0x34bdbfaa`    |
| CannotReceiveEth                     |                                                                                        | `0xf2238896`    |
| CannotSwapSameToken                  |                                                                                        | `0xa54b181d`    |
| DoesNotSupportAddLiquidityCustom     |                                                                                        | `0x4876c0bc`    |
| DoesNotSupportDonation               |                                                                                        | `0xefe0265d`    |
| DoesNotSupportRemoveLiquidityCustom  |                                                                                        | `0xcf0a95c0`    |
| DoesNotSupportUnbalancedLiquidity    |                                                                                        | `0xd4f5779c`    |
| DynamicSwapFeeHookFailed             |                                                                                        | `0x53f976d4`    |
| ERC20InsufficientAllowance           | address spender, uint256 allowance, uint256 needed                                     | `0xfb8f41b2`    |
| ERC20InsufficientBalance             | address sender, uint256 balance, uint256 needed                                        | `0xe450d38c`    |
| ERC20InvalidApprover                 | address approver                                                                       | `0xe602df05`    |
| ERC20InvalidReceiver                 | address receiver                                                                       | `0xec442f05`    |
| ERC20InvalidSender                   | address sender                                                                         | `0x96c6fd1e`    |
| ERC20InvalidSpender                  | address spender                                                                        | `0x94280d62`    |
| FailedInnerCall                      |                                                                                        | `0x1425ea42`    |
| FeePrecisionTooHigh                  |                                                                                        | `0x833fb3ce`    |
| HookAdjustedAmountInAboveMax         | address tokenIn, uint256 amountIn, uint256 maxAmountIn                                 | `0xcefa3afa`    |
| HookAdjustedAmountOutBelowMin        | address tokenOut, uint256 amountOut, uint256 minAmountOut                              | `0xfbd8a724`    |
| HookAdjustedSwapLimit                | uint256 amount, uint256 limit                                                          | `0xcc0e4a99`    |
| HookRegistrationFailed               | address poolHooksContract, address pool, address poolFactory                           | `0xfa93d814`    |
| InputLengthMismatch                  |                                                                                        | `0xaaad13f7`    |
| InvalidAddLiquidityKind              |                                                                                        | `0x6c02b395`    |
| InvalidRemoveLiquidityKind           |                                                                                        | `0x137a9a39`    |
| InvalidToken                         |                                                                                        | `0xc1ab6dc1`    |
| InvalidTokenConfiguration            |                                                                                        | `0xdf450632`    |
| InvalidTokenDecimals                 |                                                                                        | `0x686d3607`    |
| InvalidTokenType                     |                                                                                        | `0xa1e9dd9d`    |
| InvalidUnderlyingToken               | address wrappedToken                                                                   | `0xd407f9c5`    |
| InvariantRatioAboveMax               | uint256 invariantRatio, uint256 maxInvariantRatio                                      | `0x3e8960dc`    |
| InvariantRatioBelowMin               | uint256 invariantRatio, uint256 minInvariantRatio                                      | `0xe31c95be`    |
| IssuedSharesBelowMin                 | uint256 issuedShares, uint256 minIssuedShares                                          | `0xda0cb07e`    |
| MaxTokens                            |                                                                                        | `0x707bdf58`    |
| MinTokens                            |                                                                                        | `0x5ed4ba8f`    |
| MultipleNonZeroInputs                |                                                                                        | `0x6b8c3be5`    |
| NotEnoughBufferShares                |                                                                                        | `0x98c5dbd6`    |
| NotEnoughUnderlying                  | address wrappedToken, uint256 expectedUnderlyingAmount, uint256 actualUnderlyingAmount | `0x1c6a5375`    |
| NotEnoughWrapped                     | address wrappedToken, uint256 expectedWrappedAmount, uint256 actualWrappedAmount       | `0x1149424d`    |
| NotStaticCall                        |                                                                                        | `0x67f84ab2`    |
| NotVaultDelegateCall                 |                                                                                        | `0x9fd25b36`    |
| PauseBufferPeriodDurationTooLarge    |                                                                                        | `0x9ea4efee`    |
| PercentageAboveMax                   |                                                                                        | `0x746e5940`    |
| PoolAlreadyInitialized               | address pool                                                                           | `0x218e3747`    |
| PoolAlreadyRegistered                | address pool                                                                           | `0xdb771c80`    |
| PoolInRecoveryMode                   | address pool                                                                           | `0x346d7607`    |
| PoolNotInRecoveryMode                | address pool                                                                           | `0xef029adf`    |
| PoolNotInitialized                   | address pool                                                                           | `0x4bdace13`    |
| PoolNotPaused                        | address pool                                                                           | `0xfdcd6894`    |
| PoolNotRegistered                    | address pool                                                                           | `0x9e51bd5c`    |
| PoolPauseWindowExpired               | address pool                                                                           | `0xeb5a1217`    |
| PoolPaused                           | address pool                                                                           | `0xd971f597`    |
| PoolTotalSupplyTooLow                | uint256 totalSupply                                                                    | `0xd38d20fc`    |
| ProtocolFeesExceedTotalCollected     |                                                                                        | `0x4c69ac5d`    |
| QueriesDisabled                      |                                                                                        | `0x7a198886`    |
| QueriesDisabledPermanently           |                                                                                        | `0x069f8cbc`    |
| QuoteResultSpoofed                   |                                                                                        | `0x28f95541`    |
| ReentrancyGuardReentrantCall         |                                                                                        | `0x3ee5aeb5`    |
| RouterNotTrusted                     |                                                                                        | `0xe5d185cf`    |
| SafeCastOverflowedIntToUint          | int256 value                                                                           | `0xa8ce4432`    |
| SafeCastOverflowedUintToInt          | uint256 value                                                                          | `0x24775e06`    |
| SafeERC20FailedOperation             | address token                                                                          | `0x5274afe7`    |
| SenderIsNotVault                     | address sender                                                                         | `0x089676d5`    |
| SwapFeePercentageTooHigh             |                                                                                        | `0x7f47834b`    |
| SwapFeePercentageTooLow              |                                                                                        | `0xbfb20688`    |
| SwapLimit                            | uint256 amount, uint256 limit                                                          | `0xe2ea151b`    |
| TokenAlreadyRegistered               | address token                                                                          | `0x4f4b634e`    |
| TokenNotRegistered                   | address token                                                                          | `0xddef98d7`    |
| TokensMismatch                       | address pool, address expectedToken, address actualToken                               | `0xffe261a1`    |
| TradeAmountTooSmall                  |                                                                                        | `0x1ed4d118`    |
| VaultBuffersArePaused                |                                                                                        | `0x0f27df09`    |
| VaultIsNotUnlocked                   |                                                                                        | `0xc09ba736`    |
| VaultNotPaused                       |                                                                                        | `0xf7ff4dca`    |
| VaultPauseWindowDurationTooLarge     |                                                                                        | `0xcc0e8fe5`    |
| VaultPauseWindowExpired              |                                                                                        | `0x0e4460b7`    |
| VaultPaused                          |                                                                                        | `0xda9f8b34`    |
| WrapAmountTooSmall                   | address wrappedToken                                                                   | `0x18fe7385`    |
| WrongProtocolFeeControllerDeployment |                                                                                        | `0x1bbe95c7`    |
| WrongUnderlyingToken                 | address wrappedToken, address underlyingToken                                          | `0x36b18d09`    |
| WrongVaultAdminDeployment            |                                                                                        | `0x82cc28b6`    |
| WrongVaultExtensionDeployment        |                                                                                        | `0x1ab9d9d0`    |
| ZeroDivision                         |                                                                                        | `0x0a0c22c7`    |

## VaultAdmin

| Error Name                           | Inputs                                                                                 | Error Signature |
| ------------------------------------ | -------------------------------------------------------------------------------------- | --------------- |
| AfterAddLiquidityHookFailed          |                                                                                        | `0xe1249165`    |
| AfterInitializeHookFailed            |                                                                                        | `0x0f23dbc6`    |
| AfterRemoveLiquidityHookFailed       |                                                                                        | `0x1d3391d8`    |
| AfterSwapHookFailed                  |                                                                                        | `0x15a29dec`    |
| AmountGivenZero                      |                                                                                        | `0x57a456b7`    |
| AmountInAboveMax                     | address tokenIn, uint256 amountIn, uint256 maxAmountIn                                 | `0x8eda85e4`    |
| AmountOutBelowMin                    | address tokenOut, uint256 amountOut, uint256 minAmountOut                              | `0x2f785e46`    |
| BalanceNotSettled                    |                                                                                        | `0x20f1d86d`    |
| BalanceOverflow                      |                                                                                        | `0x89560ca1`    |
| BeforeAddLiquidityHookFailed         |                                                                                        | `0x0b2eb652`    |
| BeforeInitializeHookFailed           |                                                                                        | `0x60612925`    |
| BeforeRemoveLiquidityHookFailed      |                                                                                        | `0x2aaf8866`    |
| BeforeSwapHookFailed                 |                                                                                        | `0xe91e17e7`    |
| BptAmountInAboveMax                  | uint256 amountIn, uint256 maxAmountIn                                                  | `0x31d38e0b`    |
| BptAmountOutBelowMin                 | uint256 amountOut, uint256 minAmountOut                                                | `0x8d261d5d`    |
| BufferAlreadyInitialized             | address wrappedToken                                                                   | `0x1690fa40`    |
| BufferNotInitialized                 | address wrappedToken                                                                   | `0x85f41299`    |
| BufferSharesInvalidOwner             |                                                                                        | `0x586d06df`    |
| BufferSharesInvalidReceiver          |                                                                                        | `0xdbe6b10e`    |
| BufferTotalSupplyTooLow              | uint256 totalSupply                                                                    | `0x34bdbfaa`    |
| CannotReceiveEth                     |                                                                                        | `0xf2238896`    |
| CannotSwapSameToken                  |                                                                                        | `0xa54b181d`    |
| CodecOverflow                        |                                                                                        | `0xe4337c05`    |
| DoesNotSupportAddLiquidityCustom     |                                                                                        | `0x4876c0bc`    |
| DoesNotSupportDonation               |                                                                                        | `0xefe0265d`    |
| DoesNotSupportRemoveLiquidityCustom  |                                                                                        | `0xcf0a95c0`    |
| DoesNotSupportUnbalancedLiquidity    |                                                                                        | `0xd4f5779c`    |
| DynamicSwapFeeHookFailed             |                                                                                        | `0x53f976d4`    |
| ERC20InsufficientAllowance           | address spender, uint256 allowance, uint256 needed                                     | `0xfb8f41b2`    |
| ERC20InsufficientBalance             | address sender, uint256 balance, uint256 needed                                        | `0xe450d38c`    |
| ERC20InvalidApprover                 | address approver                                                                       | `0xe602df05`    |
| ERC20InvalidReceiver                 | address receiver                                                                       | `0xec442f05`    |
| ERC20InvalidSender                   | address sender                                                                         | `0x96c6fd1e`    |
| ERC20InvalidSpender                  | address spender                                                                        | `0x94280d62`    |
| FeePrecisionTooHigh                  |                                                                                        | `0x833fb3ce`    |
| HookAdjustedAmountInAboveMax         | address tokenIn, uint256 amountIn, uint256 maxAmountIn                                 | `0xcefa3afa`    |
| HookAdjustedAmountOutBelowMin        | address tokenOut, uint256 amountOut, uint256 minAmountOut                              | `0xfbd8a724`    |
| HookAdjustedSwapLimit                | uint256 amount, uint256 limit                                                          | `0xcc0e4a99`    |
| HookRegistrationFailed               | address poolHooksContract, address pool, address poolFactory                           | `0xfa93d814`    |
| InvalidAddLiquidityKind              |                                                                                        | `0x6c02b395`    |
| InvalidRemoveLiquidityKind           |                                                                                        | `0x137a9a39`    |
| InvalidToken                         |                                                                                        | `0xc1ab6dc1`    |
| InvalidTokenConfiguration            |                                                                                        | `0xdf450632`    |
| InvalidTokenDecimals                 |                                                                                        | `0x686d3607`    |
| InvalidTokenType                     |                                                                                        | `0xa1e9dd9d`    |
| InvalidUnderlyingToken               | address wrappedToken                                                                   | `0xd407f9c5`    |
| IssuedSharesBelowMin                 | uint256 issuedShares, uint256 minIssuedShares                                          | `0xda0cb07e`    |
| MaxTokens                            |                                                                                        | `0x707bdf58`    |
| MinTokens                            |                                                                                        | `0x5ed4ba8f`    |
| NotEnoughBufferShares                |                                                                                        | `0x98c5dbd6`    |
| NotEnoughUnderlying                  | address wrappedToken, uint256 expectedUnderlyingAmount, uint256 actualUnderlyingAmount | `0x1c6a5375`    |
| NotEnoughWrapped                     | address wrappedToken, uint256 expectedWrappedAmount, uint256 actualWrappedAmount       | `0x1149424d`    |
| NotStaticCall                        |                                                                                        | `0x67f84ab2`    |
| NotVaultDelegateCall                 |                                                                                        | `0x9fd25b36`    |
| OutOfBounds                          |                                                                                        | `0xb4120f14`    |
| PauseBufferPeriodDurationTooLarge    |                                                                                        | `0x9ea4efee`    |
| PercentageAboveMax                   |                                                                                        | `0x746e5940`    |
| PoolAlreadyInitialized               | address pool                                                                           | `0x218e3747`    |
| PoolAlreadyRegistered                | address pool                                                                           | `0xdb771c80`    |
| PoolInRecoveryMode                   | address pool                                                                           | `0x346d7607`    |
| PoolNotInRecoveryMode                | address pool                                                                           | `0xef029adf`    |
| PoolNotInitialized                   | address pool                                                                           | `0x4bdace13`    |
| PoolNotPaused                        | address pool                                                                           | `0xfdcd6894`    |
| PoolNotRegistered                    | address pool                                                                           | `0x9e51bd5c`    |
| PoolPauseWindowExpired               | address pool                                                                           | `0xeb5a1217`    |
| PoolPaused                           | address pool                                                                           | `0xd971f597`    |
| PoolTotalSupplyTooLow                | uint256 totalSupply                                                                    | `0xd38d20fc`    |
| ProtocolFeesExceedTotalCollected     |                                                                                        | `0x4c69ac5d`    |
| QueriesDisabled                      |                                                                                        | `0x7a198886`    |
| QueriesDisabledPermanently           |                                                                                        | `0x069f8cbc`    |
| QuoteResultSpoofed                   |                                                                                        | `0x28f95541`    |
| ReentrancyGuardReentrantCall         |                                                                                        | `0x3ee5aeb5`    |
| RouterNotTrusted                     |                                                                                        | `0xe5d185cf`    |
| SafeCastOverflowedUintDowncast       | uint8 bits, uint256 value                                                              | `0x6dfcc650`    |
| SafeCastOverflowedUintToInt          | uint256 value                                                                          | `0x24775e06`    |
| SenderIsNotVault                     | address sender                                                                         | `0x089676d5`    |
| SenderNotAllowed                     |                                                                                        | `0x23dada53`    |
| SwapFeePercentageTooHigh             |                                                                                        | `0x7f47834b`    |
| SwapFeePercentageTooLow              |                                                                                        | `0xbfb20688`    |
| SwapLimit                            | uint256 amount, uint256 limit                                                          | `0xe2ea151b`    |
| TokenAlreadyRegistered               | address token                                                                          | `0x4f4b634e`    |
| TokenNotRegistered                   | address token                                                                          | `0xddef98d7`    |
| TokensMismatch                       | address pool, address expectedToken, address actualToken                               | `0xffe261a1`    |
| TradeAmountTooSmall                  |                                                                                        | `0x1ed4d118`    |
| VaultBuffersArePaused                |                                                                                        | `0x0f27df09`    |
| VaultIsNotUnlocked                   |                                                                                        | `0xc09ba736`    |
| VaultNotPaused                       |                                                                                        | `0xf7ff4dca`    |
| VaultPauseWindowDurationTooLarge     |                                                                                        | `0xcc0e8fe5`    |
| VaultPauseWindowExpired              |                                                                                        | `0x0e4460b7`    |
| VaultPaused                          |                                                                                        | `0xda9f8b34`    |
| WrapAmountTooSmall                   | address wrappedToken                                                                   | `0x18fe7385`    |
| WrongProtocolFeeControllerDeployment |                                                                                        | `0x1bbe95c7`    |
| WrongUnderlyingToken                 | address wrappedToken, address underlyingToken                                          | `0x36b18d09`    |
| WrongVaultAdminDeployment            |                                                                                        | `0x82cc28b6`    |
| WrongVaultExtensionDeployment        |                                                                                        | `0x1ab9d9d0`    |
| ZeroDivision                         |                                                                                        | `0x0a0c22c7`    |

## VaultExtension

| Error Name                           | Inputs                                                                                 | Error Signature |
| ------------------------------------ | -------------------------------------------------------------------------------------- | --------------- |
| AddressEmptyCode                     | address target                                                                         | `0x9996b315`    |
| AddressInsufficientBalance           | address account                                                                        | `0xcd786059`    |
| AfterAddLiquidityHookFailed          |                                                                                        | `0xe1249165`    |
| AfterInitializeHookFailed            |                                                                                        | `0x0f23dbc6`    |
| AfterRemoveLiquidityHookFailed       |                                                                                        | `0x1d3391d8`    |
| AfterSwapHookFailed                  |                                                                                        | `0x15a29dec`    |
| AmountGivenZero                      |                                                                                        | `0x57a456b7`    |
| AmountInAboveMax                     | address tokenIn, uint256 amountIn, uint256 maxAmountIn                                 | `0x8eda85e4`    |
| AmountOutBelowMin                    | address tokenOut, uint256 amountOut, uint256 minAmountOut                              | `0x2f785e46`    |
| BalanceNotSettled                    |                                                                                        | `0x20f1d86d`    |
| BalanceOverflow                      |                                                                                        | `0x89560ca1`    |
| BeforeAddLiquidityHookFailed         |                                                                                        | `0x0b2eb652`    |
| BeforeInitializeHookFailed           |                                                                                        | `0x60612925`    |
| BeforeRemoveLiquidityHookFailed      |                                                                                        | `0x2aaf8866`    |
| BeforeSwapHookFailed                 |                                                                                        | `0xe91e17e7`    |
| BptAmountInAboveMax                  | uint256 amountIn, uint256 maxAmountIn                                                  | `0x31d38e0b`    |
| BptAmountOutBelowMin                 | uint256 amountOut, uint256 minAmountOut                                                | `0x8d261d5d`    |
| BufferAlreadyInitialized             | address wrappedToken                                                                   | `0x1690fa40`    |
| BufferNotInitialized                 | address wrappedToken                                                                   | `0x85f41299`    |
| BufferSharesInvalidOwner             |                                                                                        | `0x586d06df`    |
| BufferSharesInvalidReceiver          |                                                                                        | `0xdbe6b10e`    |
| BufferTotalSupplyTooLow              | uint256 totalSupply                                                                    | `0x34bdbfaa`    |
| CannotReceiveEth                     |                                                                                        | `0xf2238896`    |
| CannotSwapSameToken                  |                                                                                        | `0xa54b181d`    |
| CodecOverflow                        |                                                                                        | `0xe4337c05`    |
| DoesNotSupportAddLiquidityCustom     |                                                                                        | `0x4876c0bc`    |
| DoesNotSupportDonation               |                                                                                        | `0xefe0265d`    |
| DoesNotSupportRemoveLiquidityCustom  |                                                                                        | `0xcf0a95c0`    |
| DoesNotSupportUnbalancedLiquidity    |                                                                                        | `0xd4f5779c`    |
| DynamicSwapFeeHookFailed             |                                                                                        | `0x53f976d4`    |
| ERC20InsufficientAllowance           | address spender, uint256 allowance, uint256 needed                                     | `0xfb8f41b2`    |
| ERC20InsufficientBalance             | address sender, uint256 balance, uint256 needed                                        | `0xe450d38c`    |
| ERC20InvalidApprover                 | address approver                                                                       | `0xe602df05`    |
| ERC20InvalidReceiver                 | address receiver                                                                       | `0xec442f05`    |
| ERC20InvalidSender                   | address sender                                                                         | `0x96c6fd1e`    |
| ERC20InvalidSpender                  | address spender                                                                        | `0x94280d62`    |
| ErrorSelectorNotFound                |                                                                                        | `0xa7285689`    |
| FailedInnerCall                      |                                                                                        | `0x1425ea42`    |
| FeePrecisionTooHigh                  |                                                                                        | `0x833fb3ce`    |
| HookAdjustedAmountInAboveMax         | address tokenIn, uint256 amountIn, uint256 maxAmountIn                                 | `0xcefa3afa`    |
| HookAdjustedAmountOutBelowMin        | address tokenOut, uint256 amountOut, uint256 minAmountOut                              | `0xfbd8a724`    |
| HookAdjustedSwapLimit                | uint256 amount, uint256 limit                                                          | `0xcc0e4a99`    |
| HookRegistrationFailed               | address poolHooksContract, address pool, address poolFactory                           | `0xfa93d814`    |
| InputLengthMismatch                  |                                                                                        | `0xaaad13f7`    |
| InvalidAddLiquidityKind              |                                                                                        | `0x6c02b395`    |
| InvalidRemoveLiquidityKind           |                                                                                        | `0x137a9a39`    |
| InvalidToken                         |                                                                                        | `0xc1ab6dc1`    |
| InvalidTokenConfiguration            |                                                                                        | `0xdf450632`    |
| InvalidTokenDecimals                 |                                                                                        | `0x686d3607`    |
| InvalidTokenType                     |                                                                                        | `0xa1e9dd9d`    |
| InvalidUnderlyingToken               | address wrappedToken                                                                   | `0xd407f9c5`    |
| IssuedSharesBelowMin                 | uint256 issuedShares, uint256 minIssuedShares                                          | `0xda0cb07e`    |
| MaxTokens                            |                                                                                        | `0x707bdf58`    |
| MinTokens                            |                                                                                        | `0x5ed4ba8f`    |
| NotEnoughBufferShares                |                                                                                        | `0x98c5dbd6`    |
| NotEnoughUnderlying                  | address wrappedToken, uint256 expectedUnderlyingAmount, uint256 actualUnderlyingAmount | `0x1c6a5375`    |
| NotEnoughWrapped                     | address wrappedToken, uint256 expectedWrappedAmount, uint256 actualWrappedAmount       | `0x1149424d`    |
| NotStaticCall                        |                                                                                        | `0x67f84ab2`    |
| NotVaultDelegateCall                 |                                                                                        | `0x9fd25b36`    |
| OutOfBounds                          |                                                                                        | `0xb4120f14`    |
| PauseBufferPeriodDurationTooLarge    |                                                                                        | `0x9ea4efee`    |
| PercentageAboveMax                   |                                                                                        | `0x746e5940`    |
| PoolAlreadyInitialized               | address pool                                                                           | `0x218e3747`    |
| PoolAlreadyRegistered                | address pool                                                                           | `0xdb771c80`    |
| PoolInRecoveryMode                   | address pool                                                                           | `0x346d7607`    |
| PoolNotInRecoveryMode                | address pool                                                                           | `0xef029adf`    |
| PoolNotInitialized                   | address pool                                                                           | `0x4bdace13`    |
| PoolNotPaused                        | address pool                                                                           | `0xfdcd6894`    |
| PoolNotRegistered                    | address pool                                                                           | `0x9e51bd5c`    |
| PoolPauseWindowExpired               | address pool                                                                           | `0xeb5a1217`    |
| PoolPaused                           | address pool                                                                           | `0xd971f597`    |
| PoolTotalSupplyTooLow                | uint256 totalSupply                                                                    | `0xd38d20fc`    |
| ProtocolFeesExceedTotalCollected     |                                                                                        | `0x4c69ac5d`    |
| QueriesDisabled                      |                                                                                        | `0x7a198886`    |
| QueriesDisabledPermanently           |                                                                                        | `0x069f8cbc`    |
| QuoteResultSpoofed                   |                                                                                        | `0x28f95541`    |
| ReentrancyGuardReentrantCall         |                                                                                        | `0x3ee5aeb5`    |
| Result                               | bytes result                                                                           | `0x5ab64fb8`    |
| RouterNotTrusted                     |                                                                                        | `0xe5d185cf`    |
| SafeCastOverflowedUintToInt          | uint256 value                                                                          | `0x24775e06`    |
| SenderIsNotVault                     | address sender                                                                         | `0x089676d5`    |
| SwapFeePercentageTooHigh             |                                                                                        | `0x7f47834b`    |
| SwapFeePercentageTooLow              |                                                                                        | `0xbfb20688`    |
| SwapLimit                            | uint256 amount, uint256 limit                                                          | `0xe2ea151b`    |
| TokenAlreadyRegistered               | address token                                                                          | `0x4f4b634e`    |
| TokenNotRegistered                   | address token                                                                          | `0xddef98d7`    |
| TokensMismatch                       | address pool, address expectedToken, address actualToken                               | `0xffe261a1`    |
| TokensNotSorted                      |                                                                                        | `0x6e8f1947`    |
| TradeAmountTooSmall                  |                                                                                        | `0x1ed4d118`    |
| VaultBuffersArePaused                |                                                                                        | `0x0f27df09`    |
| VaultIsNotUnlocked                   |                                                                                        | `0xc09ba736`    |
| VaultNotPaused                       |                                                                                        | `0xf7ff4dca`    |
| VaultPauseWindowDurationTooLarge     |                                                                                        | `0xcc0e8fe5`    |
| VaultPauseWindowExpired              |                                                                                        | `0x0e4460b7`    |
| VaultPaused                          |                                                                                        | `0xda9f8b34`    |
| WrapAmountTooSmall                   | address wrappedToken                                                                   | `0x18fe7385`    |
| WrongProtocolFeeControllerDeployment |                                                                                        | `0x1bbe95c7`    |
| WrongUnderlyingToken                 | address wrappedToken, address underlyingToken                                          | `0x36b18d09`    |
| WrongVaultAdminDeployment            |                                                                                        | `0x82cc28b6`    |
| WrongVaultExtensionDeployment        |                                                                                        | `0x1ab9d9d0`    |

## VaultFactory

| Error Name                   | Inputs                          | Error Signature |
| ---------------------------- | ------------------------------- | --------------- |
| Create2EmptyBytecode         |                                 | `0x4ca249dc`    |
| Create2FailedDeployment      |                                 | `0x741752c2`    |
| Create2InsufficientBalance   | uint256 balance, uint256 needed | `0xe4bbecac`    |
| InvalidBytecode              | string contractName             | `0xc7f4796e`    |
| OwnableInvalidOwner          | address owner                   | `0x1e4fbdf7`    |
| OwnableUnauthorizedAccount   | address account                 | `0x118cdaa7`    |
| ReentrancyGuardReentrantCall |                                 | `0x3ee5aeb5`    |
| VaultAddressMismatch         |                                 | `0xb4c1be7b`    |
| VaultAlreadyDeployed         | address vault                   | `0xe254a88b`    |

## BatchRouter

| Error Name                     | Inputs                    | Error Signature |
| ------------------------------ | ------------------------- | --------------- |
| AddressEmptyCode               | address target            | `0x9996b315`    |
| AddressInsufficientBalance     | address account           | `0xcd786059`    |
| ErrorSelectorNotFound          |                           | `0xa7285689`    |
| EthTransfer                    |                           | `0x0540ddf6`    |
| FailedInnerCall                |                           | `0x1425ea42`    |
| InputLengthMismatch            |                           | `0xaaad13f7`    |
| InsufficientEth                |                           | `0xa01a9df6`    |
| ReentrancyGuardReentrantCall   |                           | `0x3ee5aeb5`    |
| SafeCastOverflowedUintDowncast | uint8 bits, uint256 value | `0x6dfcc650`    |
| SafeERC20FailedOperation       | address token             | `0x5274afe7`    |
| SenderIsNotVault               | address sender            | `0x089676d5`    |
| SwapDeadline                   |                           | `0xe08b8af0`    |
| TransientIndexOutOfBounds      |                           | `0x0f4ae0e4`    |

## BufferRouter

| Error Name                     | Inputs                    | Error Signature |
| ------------------------------ | ------------------------- | --------------- |
| AddressEmptyCode               | address target            | `0x9996b315`    |
| AddressInsufficientBalance     | address account           | `0xcd786059`    |
| ErrorSelectorNotFound          |                           | `0xa7285689`    |
| EthTransfer                    |                           | `0x0540ddf6`    |
| FailedInnerCall                |                           | `0x1425ea42`    |
| InputLengthMismatch            |                           | `0xaaad13f7`    |
| InsufficientEth                |                           | `0xa01a9df6`    |
| ReentrancyGuardReentrantCall   |                           | `0x3ee5aeb5`    |
| SafeCastOverflowedUintDowncast | uint8 bits, uint256 value | `0x6dfcc650`    |
| SafeERC20FailedOperation       | address token             | `0x5274afe7`    |
| SenderIsNotVault               | address sender            | `0x089676d5`    |
| SwapDeadline                   |                           | `0xe08b8af0`    |

## WeightedPool

| Error Name                     | Inputs                                | Error Signature |
| ------------------------------ | ------------------------------------- | --------------- |
| BaseOutOfBounds                |                                       | `0x022701e0`    |
| ECDSAInvalidSignature          |                                       | `0xf645eedf`    |
| ECDSAInvalidSignatureLength    | uint256 length                        | `0xfce698f7`    |
| ECDSAInvalidSignatureS         | bytes32 s                             | `0xd78bce0c`    |
| ERC2612ExpiredSignature        | uint256 deadline                      | `0x62791302`    |
| ERC2612InvalidSigner           | address signer, address owner         | `0x4b800e46`    |
| ExponentOutOfBounds            |                                       | `0xd8317311`    |
| InputLengthMismatch            |                                       | `0xaaad13f7`    |
| InvalidAccountNonce            | address account, uint256 currentNonce | `0x752d88c0`    |
| InvalidExponent                |                                       | `0xd4794efd`    |
| InvalidShortString             |                                       | `0xb3512b0c`    |
| InvalidToken                   |                                       | `0xc1ab6dc1`    |
| MaxInRatio                     |                                       | `0x340a4533`    |
| MaxOutRatio                    |                                       | `0x64590b9f`    |
| MinWeight                      |                                       | `0xbd393583`    |
| NormalizedWeightInvariant      |                                       | `0x39cf114e`    |
| ProductOutOfBounds             |                                       | `0xa2f9f7e3`    |
| SenderIsNotVault               | address sender                        | `0x089676d5`    |
| StringTooLong                  | string str                            | `0x305a27a9`    |
| WeightedPoolBptRateUnsupported |                                       | `0x18e79a20`    |
| ZeroDivision                   |                                       | `0x0a0c22c7`    |
| ZeroInvariant                  |                                       | `0x26543689`    |

## WeightedPoolFactory

| Error Name                      | Inputs                          | Error Signature |
| ------------------------------- | ------------------------------- | --------------- |
| Create2EmptyBytecode            |                                 | `0x4ca249dc`    |
| Create2FailedDeployment         |                                 | `0x741752c2`    |
| Create2InsufficientBalance      | uint256 balance, uint256 needed | `0xe4bbecac`    |
| Disabled                        |                                 | `0x75884cda`    |
| IndexOutOfBounds                |                                 | `0x4e23d035`    |
| PoolPauseWindowDurationOverflow |                                 | `0x68755a11`    |
| SenderNotAllowed                |                                 | `0x23dada53`    |
| StandardPoolWithCreator         |                                 | `0x61ee1764`    |

## Gyro2CLPPool

| Error Name                  | Inputs                                | Error Signature |
| --------------------------- | ------------------------------------- | --------------- |
| AssetBoundsExceeded         |                                       | `0x03ba4186`    |
| ECDSAInvalidSignature       |                                       | `0xf645eedf`    |
| ECDSAInvalidSignatureLength | uint256 length                        | `0xfce698f7`    |
| ECDSAInvalidSignatureS      | bytes32 s                             | `0xd78bce0c`    |
| ERC2612ExpiredSignature     | uint256 deadline                      | `0x62791302`    |
| ERC2612InvalidSigner        | address signer, address owner         | `0x4b800e46`    |
| InvalidAccountNonce         | address account, uint256 currentNonce | `0x752d88c0`    |
| InvalidShortString          |                                       | `0xb3512b0c`    |
| SenderIsNotVault            | address sender                        | `0x089676d5`    |
| SqrtParamsWrong             |                                       | `0x0579e1da`    |
| StringTooLong               | string str                            | `0x305a27a9`    |
| ZeroDivision                |                                       | `0x0a0c22c7`    |

## Gyro2CLPPoolFactory

| Error Name                      | Inputs                          | Error Signature |
| ------------------------------- | ------------------------------- | --------------- |
| CodeDeploymentFailed            |                                 | `0xfef82207`    |
| Create2EmptyBytecode            |                                 | `0x4ca249dc`    |
| Create2FailedDeployment         |                                 | `0x741752c2`    |
| Create2InsufficientBalance      | uint256 balance, uint256 needed | `0xe4bbecac`    |
| Disabled                        |                                 | `0x75884cda`    |
| IndexOutOfBounds                |                                 | `0x4e23d035`    |
| PoolPauseWindowDurationOverflow |                                 | `0x68755a11`    |
| SenderNotAllowed                |                                 | `0x23dada53`    |
| StandardPoolWithCreator         |                                 | `0x61ee1764`    |
| SupportsOnlyTwoTokens           |                                 | `0x34e77320`    |

## CompositeLiquidityRouter

| Error Name                     | Inputs                                                    | Error Signature |
| ------------------------------ | --------------------------------------------------------- | --------------- |
| AddressEmptyCode               | address target                                            | `0x9996b315`    |
| AddressInsufficientBalance     | address account                                           | `0xcd786059`    |
| AmountInAboveMax               | address tokenIn, uint256 amountIn, uint256 maxAmountIn    | `0x8eda85e4`    |
| AmountOutBelowMin              | address tokenOut, uint256 amountOut, uint256 minAmountOut | `0x2f785e46`    |
| BufferNotInitialized           | address wrappedToken                                      | `0x85f41299`    |
| ErrorSelectorNotFound          |                                                           | `0xa7285689`    |
| EthTransfer                    |                                                           | `0x0540ddf6`    |
| FailedInnerCall                |                                                           | `0x1425ea42`    |
| InputLengthMismatch            |                                                           | `0xaaad13f7`    |
| InsufficientEth                |                                                           | `0xa01a9df6`    |
| ReentrancyGuardReentrantCall   |                                                           | `0x3ee5aeb5`    |
| SafeCastOverflowedUintDowncast | uint8 bits, uint256 value                                 | `0x6dfcc650`    |
| SafeERC20FailedOperation       | address token                                             | `0x5274afe7`    |
| SenderIsNotVault               | address sender                                            | `0x089676d5`    |
| SwapDeadline                   |                                                           | `0xe08b8af0`    |
| WrongTokensOut                 | address[] expectedTokensOut, address[] tokensOut          | `0x94ae280c`    |

## GyroECLPPool

| Error Name                   | Inputs                                | Error Signature |
| ---------------------------- | ------------------------------------- | --------------- |
| AssetBoundsExceeded          |                                       | `0x03ba4186`    |
| DerivedDsqWrong              |                                       | `0xfb154af0`    |
| DerivedTauAlphaNotNormalized |                                       | `0xc196e496`    |
| DerivedTauAlphaYWrong        |                                       | `0xec13362c`    |
| DerivedTauBetaNotNormalized  |                                       | `0x25bbd708`    |
| DerivedTauBetaYWrong         |                                       | `0xfa40768d`    |
| DerivedTauXWrong             |                                       | `0x4071c5a8`    |
| DerivedUWrong                |                                       | `0xf84d4b44`    |
| DerivedVWrong                |                                       | `0xcfb498d5`    |
| DerivedWWrong                |                                       | `0x83446b36`    |
| DerivedZWrong                |                                       | `0x12e3e411`    |
| ECDSAInvalidSignature        |                                       | `0xf645eedf`    |
| ECDSAInvalidSignatureLength  | uint256 length                        | `0xfce698f7`    |
| ECDSAInvalidSignatureS       | bytes32 s                             | `0xd78bce0c`    |
| ERC2612ExpiredSignature      | uint256 deadline                      | `0x62791302`    |
| ERC2612InvalidSigner         | address signer, address owner         | `0x4b800e46`    |
| InvalidAccountNonce          | address account, uint256 currentNonce | `0x752d88c0`    |
| InvalidShortString           |                                       | `0xb3512b0c`    |
| InvariantDenominatorWrong    |                                       | `0xd1c17993`    |
| MaxAssetsExceeded            |                                       | `0x2da2a5e5`    |
| MaxInvariantExceeded         |                                       | `0xdc10196f`    |
| MulOverflow                  |                                       | `0x0cde6c26`    |
| RotationVectorCWrong         |                                       | `0x658639aa`    |
| RotationVectorNotNormalized  |                                       | `0xa26d8c2e`    |
| RotationVectorSWrong         |                                       | `0xa9587a74`    |
| SafeCastOverflowedIntToUint  | int256 value                          | `0xa8ce4432`    |
| SafeCastOverflowedUintToInt  | uint256 value                         | `0x24775e06`    |
| SenderIsNotVault             | address sender                        | `0x089676d5`    |
| StretchingFactorWrong        |                                       | `0x77dfa312`    |
| StringTooLong                | string str                            | `0x305a27a9`    |
| ZeroDivision                 |                                       | `0x0a0c22c7`    |

## GyroECLPPoolFactory

| Error Name                      | Inputs                          | Error Signature |
| ------------------------------- | ------------------------------- | --------------- |
| CodeDeploymentFailed            |                                 | `0xfef82207`    |
| Create2EmptyBytecode            |                                 | `0x4ca249dc`    |
| Create2FailedDeployment         |                                 | `0x741752c2`    |
| Create2InsufficientBalance      | uint256 balance, uint256 needed | `0xe4bbecac`    |
| Disabled                        |                                 | `0x75884cda`    |
| IndexOutOfBounds                |                                 | `0x4e23d035`    |
| PoolPauseWindowDurationOverflow |                                 | `0x68755a11`    |
| SenderNotAllowed                |                                 | `0x23dada53`    |
| StandardPoolWithCreator         |                                 | `0x61ee1764`    |
| SupportsOnlyTwoTokens           |                                 | `0x34e77320`    |

## LiquidityBootstrappingPool

| Error Name                     | Inputs                                     | Error Signature |
| ------------------------------ | ------------------------------------------ | --------------- |
| AddingLiquidityNotAllowed      |                                            | `0x3eee08c7`    |
| BaseOutOfBounds                |                                            | `0x022701e0`    |
| ECDSAInvalidSignature          |                                            | `0xf645eedf`    |
| ECDSAInvalidSignatureLength    | uint256 length                             | `0xfce698f7`    |
| ECDSAInvalidSignatureS         | bytes32 s                                  | `0xd78bce0c`    |
| ERC2612ExpiredSignature        | uint256 deadline                           | `0x62791302`    |
| ERC2612InvalidSigner           | address signer, address owner              | `0x4b800e46`    |
| ExponentOutOfBounds            |                                            | `0xd8317311`    |
| GradualUpdateTimeTravel        | uint256 resolvedStartTime, uint256 endTime | `0x7d0356f3`    |
| InputLengthMismatch            |                                            | `0xaaad13f7`    |
| InvalidAccountNonce            | address account, uint256 currentNonce      | `0x752d88c0`    |
| InvalidExponent                |                                            | `0xd4794efd`    |
| InvalidShortString             |                                            | `0xb3512b0c`    |
| InvalidToken                   |                                            | `0xc1ab6dc1`    |
| InvalidTokenConfiguration      |                                            | `0xdf450632`    |
| MaxInRatio                     |                                            | `0x340a4533`    |
| MaxOutRatio                    |                                            | `0x64590b9f`    |
| MinWeight                      |                                            | `0xbd393583`    |
| NormalizedWeightInvariant      |                                            | `0x39cf114e`    |
| NotImplemented                 |                                            | `0xd6234725`    |
| OwnableInvalidOwner            | address owner                              | `0x1e4fbdf7`    |
| OwnableUnauthorizedAccount     | address account                            | `0x118cdaa7`    |
| ProductOutOfBounds             |                                            | `0xa2f9f7e3`    |
| RemovingLiquidityNotAllowed    |                                            | `0xf38b5770`    |
| SenderIsNotVault               | address sender                             | `0x089676d5`    |
| StringTooLong                  | string str                                 | `0x305a27a9`    |
| SwapOfProjectTokenIn           |                                            | `0x1269438a`    |
| SwapsDisabled                  |                                            | `0xfdf79845`    |
| WeightedPoolBptRateUnsupported |                                            | `0x18e79a20`    |
| ZeroDivision                   |                                            | `0x0a0c22c7`    |
| ZeroInvariant                  |                                            | `0x26543689`    |

## LiquidityBootstrappingPoolFactory

| Error Name                      | Inputs                                     | Error Signature |
| ------------------------------- | ------------------------------------------ | --------------- |
| CodeDeploymentFailed            |                                            | `0xfef82207`    |
| Create2EmptyBytecode            |                                            | `0x4ca249dc`    |
| Create2FailedDeployment         |                                            | `0x741752c2`    |
| Create2InsufficientBalance      | uint256 balance, uint256 needed            | `0xe4bbecac`    |
| Disabled                        |                                            | `0x75884cda`    |
| GradualUpdateTimeTravel         | uint256 resolvedStartTime, uint256 endTime | `0x7d0356f3`    |
| IndexOutOfBounds                |                                            | `0x4e23d035`    |
| InvalidOwner                    |                                            | `0x49e27cff`    |
| InvalidTrustedRouter            |                                            | `0x0307417b`    |
| MinWeight                       |                                            | `0xbd393583`    |
| NormalizedWeightInvariant       |                                            | `0x39cf114e`    |
| PoolPauseWindowDurationOverflow |                                            | `0x68755a11`    |
| ReentrancyGuardReentrantCall    |                                            | `0x3ee5aeb5`    |
| SenderNotAllowed                |                                            | `0x23dada53`    |
| StandardPoolWithCreator         |                                            | `0x61ee1764`    |

## StablePoolFactory

| Error Name                      | Inputs                          | Error Signature |
| ------------------------------- | ------------------------------- | --------------- |
| CodeDeploymentFailed            |                                 | `0xfef82207`    |
| Create2EmptyBytecode            |                                 | `0x4ca249dc`    |
| Create2FailedDeployment         |                                 | `0x741752c2`    |
| Create2InsufficientBalance      | uint256 balance, uint256 needed | `0xe4bbecac`    |
| Disabled                        |                                 | `0x75884cda`    |
| IndexOutOfBounds                |                                 | `0x4e23d035`    |
| MaxTokens                       |                                 | `0x707bdf58`    |
| PoolPauseWindowDurationOverflow |                                 | `0x68755a11`    |
| SenderNotAllowed                |                                 | `0x23dada53`    |
| StandardPoolWithCreator         |                                 | `0x61ee1764`    |

## StablePool

| Error Name                         | Inputs                                | Error Signature |
| ---------------------------------- | ------------------------------------- | --------------- |
| AmpUpdateAlreadyStarted            |                                       | `0x2f301e7e`    |
| AmpUpdateDurationTooShort          |                                       | `0xcd6b022a`    |
| AmpUpdateNotStarted                |                                       | `0x4673a675`    |
| AmpUpdateRateTooFast               |                                       | `0x1c708b92`    |
| AmplificationFactorTooHigh         |                                       | `0x9b80d390`    |
| AmplificationFactorTooLow          |                                       | `0xab923323`    |
| ECDSAInvalidSignature              |                                       | `0xf645eedf`    |
| ECDSAInvalidSignatureLength        | uint256 length                        | `0xfce698f7`    |
| ECDSAInvalidSignatureS             | bytes32 s                             | `0xd78bce0c`    |
| ERC2612ExpiredSignature            | uint256 deadline                      | `0x62791302`    |
| ERC2612InvalidSigner               | address signer, address owner         | `0x4b800e46`    |
| InvalidAccountNonce                | address account, uint256 currentNonce | `0x752d88c0`    |
| InvalidShortString                 |                                       | `0xb3512b0c`    |
| SafeCastOverflowedUintDowncast     | uint8 bits, uint256 value             | `0x6dfcc650`    |
| SenderIsNotVault                   | address sender                        | `0x089676d5`    |
| SenderNotAllowed                   |                                       | `0x23dada53`    |
| StableComputeBalanceDidNotConverge |                                       | `0xdcbda05c`    |
| StableInvariantDidNotConverge      |                                       | `0x010ca320`    |
| StringTooLong                      | string str                            | `0x305a27a9`    |
| ZeroDivision                       |                                       | `0x0a0c22c7`    |

## StableSurgeHook

| Error Name                     | Inputs                    | Error Signature |
| ------------------------------ | ------------------------- | --------------- |
| InputLengthMismatch            |                           | `0xaaad13f7`    |
| InvalidPercentage              |                           | `0x1f3b85d3`    |
| SafeCastOverflowedUintDowncast | uint8 bits, uint256 value | `0x6dfcc650`    |
| SenderIsNotVault               | address sender            | `0x089676d5`    |
| SenderNotAllowed               |                           | `0x23dada53`    |
| VaultNotSet                    |                           | `0xc8e28160`    |

## ReClammPool

| Error Name                       | Inputs                                     | Error Signature |
| -------------------------------- | ------------------------------------------ | --------------- |
| AmountOutGreaterThanBalance      |                                            | `0xb413e252`    |
| BalanceRatioExceedsTolerance     |                                            | `0x4f512cb0`    |
| BaseOutOfBounds                  |                                            | `0x022701e0`    |
| DailyPriceShiftExponentTooHigh   |                                            | `0x2b5b4f35`    |
| ECDSAInvalidSignature            |                                            | `0xf645eedf`    |
| ECDSAInvalidSignatureLength      | uint256 length                             | `0xfce698f7`    |
| ECDSAInvalidSignatureS           | bytes32 s                                  | `0xd78bce0c`    |
| ERC2612ExpiredSignature          | uint256 deadline                           | `0x62791302`    |
| ERC2612InvalidSigner             | address signer, address owner              | `0x4b800e46`    |
| ExponentOutOfBounds              |                                            | `0xd8317311`    |
| InvalidAccountNonce              | address account, uint256 currentNonce      | `0x752d88c0`    |
| InvalidCenterednessMargin        |                                            | `0x7304fac7`    |
| InvalidExponent                  |                                            | `0xd4794efd`    |
| InvalidInitialPrice              |                                            | `0xb3cd5c66`    |
| InvalidShortString               |                                            | `0xb3512b0c`    |
| InvalidStartTime                 | uint256 resolvedStartTime, uint256 endTime | `0xc9767706`    |
| InvalidStartTime                 |                                            | `0xb290253c`    |
| InvalidToken                     |                                            | `0xc1ab6dc1`    |
| NotImplemented                   |                                            | `0xd6234725`    |
| PoolNotInitialized               |                                            | `0x486aa307`    |
| PoolOutsideTargetRange           |                                            | `0x03d95ab4`    |
| PriceRatioDeltaBelowMin          | uint256 fourthRootPriceRatioDelta          | `0x467614dc`    |
| PriceRatioNotUpdating            |                                            | `0x771cef4f`    |
| PriceRatioUpdateDurationTooShort |                                            | `0x33f1d0aa`    |
| PriceRatioUpdateTooFast          |                                            | `0x570bf22e`    |
| ProductOutOfBounds               |                                            | `0xa2f9f7e3`    |
| ReClammPoolBptRateUnsupported    |                                            | `0x56b7fcdb`    |
| SafeCastOverflowedUintDowncast   | uint8 bits, uint256 value                  | `0x6dfcc650`    |
| SenderIsNotVault                 | address sender                             | `0x089676d5`    |
| SenderNotAllowed                 |                                            | `0x23dada53`    |
| StringTooLong                    | string str                                 | `0x305a27a9`    |
| VaultIsNotLocked                 |                                            | `0xe4575fe4`    |
| VaultNotSet                      |                                            | `0xc8e28160`    |
| WrongInitializationPrices        |                                            | `0xf67c277c`    |
| ZeroDivision                     |                                            | `0x0a0c22c7`    |

## ReClammPoolFactory

| Error Name                      | Inputs                          | Error Signature |
| ------------------------------- | ------------------------------- | --------------- |
| CodeDeploymentFailed            |                                 | `0xfef82207`    |
| Create2EmptyBytecode            |                                 | `0x4ca249dc`    |
| Disabled                        |                                 | `0x75884cda`    |
| FailedDeployment                |                                 | `0xb06ebf3d`    |
| IndexOutOfBounds                |                                 | `0x4e23d035`    |
| InsufficientBalance             | uint256 balance, uint256 needed | `0xcf479181`    |
| InvalidTokenType                |                                 | `0xa1e9dd9d`    |
| MaxTokens                       |                                 | `0x707bdf58`    |
| PoolPauseWindowDurationOverflow |                                 | `0x68755a11`    |
| SafeCastOverflowedUintDowncast  | uint8 bits, uint256 value       | `0x6dfcc650`    |
| SenderNotAllowed                |                                 | `0x23dada53`    |
| StandardPoolWithCreator         |                                 | `0x61ee1764`    |
| VaultNotSet                     |                                 | `0xc8e28160`    |

## WrappedBalancerPoolTokenFactory

| Error Name                     | Inputs               | Error Signature |
| ------------------------------ | -------------------- | --------------- |
| BalancerPoolTokenNotRegistered |                      | `0x916f5d0e`    |
| WrappedBPTAlreadyExists        | address wrappedToken | `0x957f7dce`    |

## WrappedBalancerPoolToken

| Error Name                  | Inputs                                             | Error Signature |
| --------------------------- | -------------------------------------------------- | --------------- |
| AddressEmptyCode            | address target                                     | `0x9996b315`    |
| AddressInsufficientBalance  | address account                                    | `0xcd786059`    |
| ECDSAInvalidSignature       |                                                    | `0xf645eedf`    |
| ECDSAInvalidSignatureLength | uint256 length                                     | `0xfce698f7`    |
| ECDSAInvalidSignatureS      | bytes32 s                                          | `0xd78bce0c`    |
| ERC20InsufficientAllowance  | address spender, uint256 allowance, uint256 needed | `0xfb8f41b2`    |
| ERC20InsufficientBalance    | address sender, uint256 balance, uint256 needed    | `0xe450d38c`    |
| ERC20InvalidApprover        | address approver                                   | `0xe602df05`    |
| ERC20InvalidReceiver        | address receiver                                   | `0xec442f05`    |
| ERC20InvalidSender          | address sender                                     | `0x96c6fd1e`    |
| ERC20InvalidSpender         | address spender                                    | `0x94280d62`    |
| ERC2612ExpiredSignature     | uint256 deadline                                   | `0x62791302`    |
| ERC2612InvalidSigner        | address signer, address owner                      | `0x4b800e46`    |
| FailedInnerCall             |                                                    | `0x1425ea42`    |
| InvalidAccountNonce         | address account, uint256 currentNonce              | `0x752d88c0`    |
| InvalidShortString          |                                                    | `0xb3512b0c`    |
| SafeERC20FailedOperation    | address token                                      | `0x5274afe7`    |
| StringTooLong               | string str                                         | `0x305a27a9`    |
| VaultIsUnlocked             |                                                    | `0xbe18e309`    |

## AggregatorBatchRouter

| Error Name                     | Inputs                                                     | Error Signature |
| ------------------------------ | ---------------------------------------------------------- | --------------- |
| AddressEmptyCode               | address target                                             | `0x9996b315`    |
| AddressInsufficientBalance     | address account                                            | `0xcd786059`    |
| EthTransfer                    |                                                            | `0x0540ddf6`    |
| FailedInnerCall                |                                                            | `0x1425ea42`    |
| InsufficientEth                |                                                            | `0xa01a9df6`    |
| InsufficientFunds              | address token, uint256 senderCredits, uint256 senderDebits | `0x5c54305e`    |
| OperationNotSupported          |                                                            | `0x29a270f5`    |
| ReentrancyGuardReentrantCall   |                                                            | `0x3ee5aeb5`    |
| SafeCastOverflowedUintDowncast | uint8 bits, uint256 value                                  | `0x6dfcc650`    |
| SafeERC20FailedOperation       | address token                                              | `0x5274afe7`    |
| SenderIsNotVault               | address sender                                             | `0x089676d5`    |
| SwapDeadline                   |                                                            | `0xe08b8af0`    |
| TransientIndexOutOfBounds      |                                                            | `0x0f4ae0e4`    |
