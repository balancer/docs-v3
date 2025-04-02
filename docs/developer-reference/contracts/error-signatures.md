---
order: 4
---

# Error signatures

Catalogue for decoding custom error signatures into their associated error names

| Error Name                           | Parameters                                                   | Error Signature |
| ------------------------------------ | ------------------------------------------------------------ | --------------- |
| AfterAddLiquidityHookFailed          |                                                              | `0x1f11c6e8`    |
| AfterInitializeHookFailed            |                                                              | `0x5082db7e`    |
| AfterRemoveLiquidityHookFailed       |                                                              | `0x8c038be8`    |
| AfterSwapHookFailed                  |                                                              | `0x6bba8321`    |
| AllZeroInputs                        |                                                              | `0x9e29a0f3`    |
| AmountGivenZero                      |                                                              | `0xb3c1f187`    |
| AmountInAboveMax                     | IERC20 token, uint256 amount, uint256 limit                  | `0x07a83b17`    |
| AmountOutBelowMin                    | IERC20 token, uint256 amount, uint256 limit                  | `0x7d7130d2`    |
| AmpUpdateAlreadyStarted              |                                                              | `0x100d1013`    |
| AmpUpdateDurationTooShort            |                                                              | `0xb84d7d1d`    |
| AmpUpdateNotStarted                  |                                                              | `0xb02a9d34`    |
| AmpUpdateRateTooFast                 |                                                              | `0xc6efc60e`    |
| AmplificationFactorTooHigh           |                                                              | `0x11897312`    |
| AmplificationFactorTooLow            |                                                              | `0x87f0d889`    |
| BalanceNotSettled                    |                                                              | `0x6c98e9ed`    |
| BalanceOverflow                      |                                                              | `0x3b92a109`    |
| BaseOutOfBounds                      |                                                              | `0x283468d4`    |
| BeforeAddLiquidityHookFailed         |                                                              | `0x13b4de1f`    |
| BeforeInitializeHookFailed           |                                                              | `0x2ff3b3e0`    |
| BeforeRemoveLiquidityHookFailed      |                                                              | `0x0e192f45`    |
| BeforeSwapHookFailed                 |                                                              | `0x33ebeda8`    |
| BptAmountInAboveMax                  | uint256 amount, uint256 limit                                | `0x3b998e8c`    |
| BptAmountOutBelowMin                 | uint256 amount, uint256 limit                                | `0x17346ee0`    |
| CallerIsNotPoolCreator               | address caller                                               | `0x8cf39e3a`    |
| CannotReceiveEth                     |                                                              | `0x8a7fb40e`    |
| CannotSwapSameToken                  |                                                              | `0x0d3ef36e`    |
| CodecOverflow                        |                                                              | `0xbf57988a`    |
| Disabled                             |                                                              | `0x657ba18e`    |
| DoesNotSupportAddLiquidityCustom     |                                                              | `0x587cae70`    |
| DoesNotSupportDonation               |                                                              | `0x260f7e17`    |
| DoesNotSupportRemoveLiquidityCustom  |                                                              | `0xe2d00b62`    |
| DoesNotSupportUnbalancedLiquidity    |                                                              | `0x5c645ae6`    |
| DynamicSwapFeeHookFailed             |                                                              | `0x8a47a7a4`    |
| ElementNotFound                      |                                                              | `0x0982bb23`    |
| ElementNotFound                      |                                                              | `0x0982bb23`    |
| ErrorSelectorNotFound                |                                                              | `0x275f4d09`    |
| EthTransfer                          |                                                              | `0x9c3c0d41`    |
| ExitHookFeeAboveLimit                | uint256 fee, uint256 limit                                   | `0x2656e014`    |
| ExponentOutOfBounds                  |                                                              | `0xb0dd9e34`    |
| FeePrecisionTooHigh                  |                                                              | `0xa42e89dc`    |
| HookAdjustedAmountInAboveMax         | IERC20 token, uint256 amount, uint256 limit                  | `0xb4b74ef6`    |
| HookAdjustedAmountOutBelowMin        | IERC20 token, uint256 amount, uint256 limit                  | `0x4635a39b`    |
| HookAdjustedSwapLimit                | uint256 amount, uint256 limit                                | `0x4ccdc100`    |
| HookRegistrationFailed               | address poolHooksContract, address pool, address poolFactory | `0xc3e7a50e`    |
| IndexOutOfBounds                     |                                                              | `0xe2d34134`    |
| IndexOutOfBounds                     |                                                              | `0xe2d34134`    |
| IndexOutOfBounds                     |                                                              | `0xe2d34134`    |
| InputLengthMismatch                  |                                                              | `0x9e93c2b5`    |
| InsufficientEth                      |                                                              | `0x3b39ba4f`    |
| InvalidAddLiquidityKind              |                                                              | `0x537d5fc4`    |
| InvalidExponent                      |                                                              | `0x8de26d1e`    |
| InvalidPercentage                    | uint256 value                                                | `0xc5b9e4ed`    |
| InvalidRemoveLiquidityKind           |                                                              | `0x7f7e2ac4`    |
| InvalidSize                          | uint256 currentValue, uint256 expectedSize                   | `0xa0f9c6a0`    |
| InvalidToken                         |                                                              | `0x8bc6b79a`    |
| InvalidTokenConfiguration            |                                                              | `0x31316a47`    |
| InvalidTokenType                     |                                                              | `0x85915cf0`    |
| KeyNotFound                          |                                                              | `0xc1e47035`    |
| MaxInRatio                           |                                                              | `0x158d8c7d`    |
| MaxOutBptForTokenIn                  |                                                              | `0x9e370e9e`    |
| MaxOutRatio                          |                                                              | `0x1732d25b`    |
| MaxTokens                            |                                                              | `0x9b286d4d`    |
| MinBPTInForTokenOut                  |                                                              | `0xc85c8b1e`    |
| MinTokens                            |                                                              | `0x144c854a`    |
| MinWeight                            |                                                              | `0x278ee3fa`    |
| MultipleNonZeroInputs                |                                                              | `0x5200c18f`    |
| NormalizedWeightInvariant            |                                                              | `0xe7d61931`    |
| NotEnoughBufferShares                |                                                              | `0xdff0a4bb`    |
| NotStaticCall                        |                                                              | `0xb370c5ee`    |
| NotVaultDelegateCall                 |                                                              | `0xd8d9f3e0`    |
| OperationNotSupported                |                                                              | `0x9f3ae0a3`    |
| OutOfBounds                          |                                                              | `0x2630ff3d`    |
| OutOfBounds                          |                                                              | `0x2630ff3d`    |
| PauseBufferPeriodDurationTooLarge    |                                                              | `0x7c39f6b6`    |
| PoolAlreadyInitialized               | address pool                                                 | `0x8d399135`    |
| PoolAlreadyRegistered                | address pool                                                 | `0x8bd46f89`    |
| PoolCreatorFeePercentageTooHigh      |                                                              | `0x836f7f92`    |
| PoolCreatorNotRegistered             | address pool                                                 | `0xd45b08d3`    |
| PoolDoesNotSupportDonation           |                                                              | `0xc49a7c23`    |
| PoolInRecoveryMode                   | address pool                                                 | `0xe2ce51d3`    |
| PoolNotInRecoveryMode                | address pool                                                 | `0x24849cf3`    |
| PoolNotInitialized                   | address pool                                                 | `0x0df59b25`    |
| PoolNotPaused                        | address pool                                                 | `0xf9783e7e`    |
| PoolNotRegistered                    | address pool                                                 | `0xe162b9a1`    |
| PoolPauseWindowDurationOverflow      |                                                              | `0x4a84a207`    |
| PoolPauseWindowExpired               | address pool                                                 | `0xb94f73ee`    |
| PoolPaused                           | address pool                                                 | `0x73b2c12a`    |
| ProductOutOfBounds                   |                                                              | `0x34b5117d`    |
| ProtocolFeesExceedTotalCollected     |                                                              | `0xe64f8d47`    |
| ProtocolSwapFeePercentageTooHigh     |                                                              | `0x1e1d8966`    |
| ProtocolYieldFeePercentageTooHigh    |                                                              | `0x5b4823d2`    |
| QueriesDisabled                      |                                                              | `0xf59f6765`    |
| QuoteResultSpoofed                   |                                                              | `0xe74c0ecf`    |
| ReentrancyGuardReentrantCall         |                                                              | `0xd7ce3fac`    |
| Result                               | bytes result                                                 | `0x8c6e31e6`    |
| RouterNotTrusted                     |                                                              | `0x694a59f2`    |
| SenderIsNotVault                     | address sender                                               | `0x4773d3d1`    |
| SenderNotAllowed                     |                                                              | `0x5802aade`    |
| StableGetBalanceDidNotConverge       |                                                              | `0x472a7075`    |
| StableInvariantDidNotConverge        |                                                              | `0x165463a8`    |
| StandardPoolWithCreator              |                                                              | `0xaab61791`    |
| SwapDeadline                         |                                                              | `0x6a3a3c96`    |
| SwapFeePercentageTooHigh             |                                                              | `0xc925d7a1`    |
| SwapFeePercentageTooLow              |                                                              | `0xdbb72f4a`    |
| SwapLimit                            | uint256 amount, uint256 limit                                | `0x1b8a1b97`    |
| TokenAlreadyRegistered               | IERC20 token                                                 | `0x02a00296`    |
| TokenNotRegistered                   | IERC20 token                                                 | `0x379df7a5`    |
| TokensMismatch                       | address pool, address expectedToken, address actualToken     | `0x6f14ef15`    |
| TokensNotSorted                      |                                                              | `0x885ce7da`    |
| TotalSupplyTooLow                    | uint256 amount, uint256 limit                                | `0x526e36e6`    |
| TransientIndexOutOfBounds            |                                                              | `0x5acba2d6`    |
| UnexpectedCallSuccess                |                                                              | `0xe6b3e7b3`    |
| UserDataNotSupported                 |                                                              | `0x2d35a2b1`    |
| VaultBuffersArePaused                |                                                              | `0xa456b12c`    |
| VaultIsNotUnlocked                   |                                                              | `0xd1c62eb7`    |
| VaultNotPaused                       |                                                              | `0x1c190c29`    |
| VaultPauseWindowDurationTooLarge     |                                                              | `0x70fba371`    |
| VaultPauseWindowExpired              |                                                              | `0xf4dcd02d`    |
| VaultPaused                          |                                                              | `0x94ff1b0a`    |
| WrapAmountTooSmall                   | address wrappedToken                                         | `0x92c1dbac`    |
| WrongProtocolFeeControllerDeployment |                                                              | `0xf71cc7b1`    |
| WrongUnderlyingAmount                | address wrappedToken                                         | `0x6a07620f`    |
| WrongVaultAdminDeployment            |                                                              | `0x0a66f52d`    |
| WrongVaultExtensionDeployment        |                                                              | `0x8456cb59`    |
| WrongWrappedAmount                   | address wrappedToken                                         | `0x8ab83c36`    |
| WrongWrappedTokenAsset               | address token                                                | `0x77ab82b3`    |
| ZeroDivision                         |                                                              | `0x11801f77`    |
