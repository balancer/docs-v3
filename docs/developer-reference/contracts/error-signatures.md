---
order: 4
---

# Error signatures

| Error Name | Parameters | Error Signature |
| --- | --- | --- |
| PoolAlreadyRegistered | address pool | `0x8bd46f89` |
| PoolAlreadyInitialized | address pool | `0x8d399135` |
| PoolNotRegistered | address pool | `0xe162b9a1` |
| PoolNotInitialized | address pool | `0x0df59b25` |
| HookRegistrationFailed | address poolHooksContract, address pool, address poolFactory | `0xc3e7a50e` |
| TokenAlreadyRegistered | IERC20 token | `0x02a00296` |
| MinTokens |  | `0x144c854a` |
| MaxTokens |  | `0x9b286d4d` |
| InvalidToken |  | `0x8bc6b79a` |
| InvalidTokenType |  | `0x85915cf0` |
| InvalidTokenConfiguration |  | `0x31316a47` |
| TokensMismatch | address pool, address expectedToken, address actualToken | `0x6f14ef15` |
| BalanceNotSettled |  | `0x6c98e9ed` |
| VaultIsNotUnlocked |  | `0xd1c62eb7` |
| DynamicSwapFeeHookFailed |  | `0x8a47a7a4` |
| BeforeSwapHookFailed |  | `0x33ebeda8` |
| AfterSwapHookFailed |  | `0x6bba8321` |
| BeforeInitializeHookFailed |  | `0x2ff3b3e0` |
| AfterInitializeHookFailed |  | `0x5082db7e` |
| BeforeAddLiquidityHookFailed |  | `0x13b4de1f` |
| AfterAddLiquidityHookFailed |  | `0x1f11c6e8` |
| BeforeRemoveLiquidityHookFailed |  | `0x0e192f45` |
| AfterRemoveLiquidityHookFailed |  | `0x8c038be8` |
| RouterNotTrusted |  | `0x694a59f2` |
| AmountGivenZero |  | `0xb3c1f187` |
| CannotSwapSameToken |  | `0x0d3ef36e` |
| TokenNotRegistered | IERC20 token | `0x379df7a5` |
| SwapLimit | uint256 amount, uint256 limit | `0x1b8a1b97` |
| HookAdjustedSwapLimit | uint256 amount, uint256 limit | `0x4ccdc100` |
| InvalidAddLiquidityKind |  | `0x537d5fc4` |
| AmountInAboveMax | IERC20 token, uint256 amount, uint256 limit | `0x07a83b17` |
| HookAdjustedAmountInAboveMax | IERC20 token, uint256 amount, uint256 limit | `0xb4b74ef6` |
| BptAmountOutBelowMin | uint256 amount, uint256 limit | `0x17346ee0` |
| DoesNotSupportAddLiquidityCustom |  | `0x587cae70` |
| DoesNotSupportDonation |  | `0x260f7e17` |
| InvalidRemoveLiquidityKind |  | `0x7f7e2ac4` |
| AmountOutBelowMin | IERC20 token, uint256 amount, uint256 limit | `0x7d7130d2` |
| HookAdjustedAmountOutBelowMin | IERC20 token, uint256 amount, uint256 limit | `0x4635a39b` |
| BptAmountInAboveMax | uint256 amount, uint256 limit | `0x3b998e8c` |
| DoesNotSupportRemoveLiquidityCustom |  | `0xe2d00b62` |
| ProtocolFeesExceedTotalCollected |  | `0xe64f8d47` |
| SwapFeePercentageTooLow |  | `0xdbb72f4a` |
| SwapFeePercentageTooHigh |  | `0xc925d7a1` |
| FeePrecisionTooHigh |  | `0xa42e89dc` |
| QueriesDisabled |  | `0xf59f6765` |
| PoolInRecoveryMode | address pool | `0xe2ce51d3` |
| PoolNotInRecoveryMode | address pool | `0x24849cf3` |
| SenderIsNotVault | address sender | `0x4773d3d1` |
| VaultPauseWindowDurationTooLarge |  | `0x70fba371` |
| PauseBufferPeriodDurationTooLarge |  | `0x7c39f6b6` |
| VaultPaused |  | `0x94ff1b0a` |
| VaultNotPaused |  | `0x1c190c29` |
| VaultPauseWindowExpired |  | `0xf4dcd02d` |
| PoolPaused | address pool | `0x73b2c12a` |
| PoolNotPaused | address pool | `0xf9783e7e` |
| PoolPauseWindowExpired | address pool | `0xb94f73ee` |
| UserDataNotSupported |  | `0x2d35a2b1` |
| DoesNotSupportUnbalancedLiquidity |  | `0x5c645ae6` |
| CannotReceiveEth |  | `0x8a7fb40e` |
| NotVaultDelegateCall |  | `0xd8d9f3e0` |
| OperationNotSupported |  | `0x9f3ae0a3` |
| WrongVaultExtensionDeployment |  | `0x8456cb59` |
| WrongProtocolFeeControllerDeployment |  | `0xf71cc7b1` |
| WrongVaultAdminDeployment |  | `0x0a66f52d` |
| QuoteResultSpoofed |  | `0xe74c0ecf` |
| NotEnoughBufferShares |  | `0xdff0a4bb` |
| WrongWrappedTokenAsset | address token | `0x77ab82b3` |
| WrongUnderlyingAmount | address wrappedToken | `0x6a07620f` |
| WrongWrappedAmount | address wrappedToken | `0x8ab83c36` |
| WrapAmountTooSmall | address wrappedToken | `0x92c1dbac` |
| VaultBuffersArePaused |  | `0xa456b12c` |
| ProtocolSwapFeePercentageTooHigh |  | `0x1e1d8966` |
| ProtocolYieldFeePercentageTooHigh |  | `0x5b4823d2` |
| PoolCreatorNotRegistered | address pool | `0xd45b08d3` |
| CallerIsNotPoolCreator | address caller | `0x8cf39e3a` |
| PoolCreatorFeePercentageTooHigh |  | `0x836f7f92` |
| TotalSupplyTooLow | uint256 amount, uint256 limit | `0x526e36e6` |
| Disabled |  | `0x657ba18e` |
| SenderNotAllowed |  | `0x5802aade` |
| ExitHookFeeAboveLimit | uint256 fee, uint256 limit | `0x2656e014` |
| PoolDoesNotSupportDonation |  | `0xc49a7c23` |
| AmplificationFactorTooLow |  | `0x87f0d889` |
| AmplificationFactorTooHigh |  | `0x11897312` |
| AmpUpdateDurationTooShort |  | `0xb84d7d1d` |
| AmpUpdateRateTooFast |  | `0xc6efc60e` |
| AmpUpdateAlreadyStarted |  | `0x100d1013` |
| AmpUpdateNotStarted |  | `0xb02a9d34` |
| StandardPoolWithCreator |  | `0xaab61791` |
| MinWeight |  | `0x278ee3fa` |
| NormalizedWeightInvariant |  | `0xe7d61931` |
| NotStaticCall |  | `0xb370c5ee` |
| PoolPauseWindowDurationOverflow |  | `0x4a84a207` |
| InputLengthMismatch |  | `0x9e93c2b5` |
| MultipleNonZeroInputs |  | `0x5200c18f` |
| AllZeroInputs |  | `0x9e29a0f3` |
| TokensNotSorted |  | `0x885ce7da` |
| BalanceOverflow |  | `0x3b92a109` |
| Result | bytes result | `0x8c6e31e6` |
| UnexpectedCallSuccess |  | `0xe6b3e7b3` |
| ErrorSelectorNotFound |  | `0x275f4d09` |
| TransientIndexOutOfBounds |  | `0x5acba2d6` |
| CodecOverflow |  | `0xbf57988a` |
| OutOfBounds |  | `0x2630ff3d` |
| ZeroDivision |  | `0x11801f77` |
| BaseOutOfBounds |  | `0x283468d4` |
| ExponentOutOfBounds |  | `0xb0dd9e34` |
| ProductOutOfBounds |  | `0x34b5117d` |
| InvalidExponent |  | `0x8de26d1e` |
| OutOfBounds |  | `0x2630ff3d` |
| StableInvariantDidNotConverge |  | `0x165463a8` |
| StableGetBalanceDidNotConverge |  | `0x472a7075` |
| MinBPTInForTokenOut |  | `0xc85c8b1e` |
| MaxOutBptForTokenIn |  | `0x9e370e9e` |
| MaxOutRatio |  | `0x1732d25b` |
| MaxInRatio |  | `0x158d8c7d` |
| IndexOutOfBounds |  | `0xe2d34134` |
| KeyNotFound |  | `0xc1e47035` |
| IndexOutOfBounds |  | `0xe2d34134` |
| ElementNotFound |  | `0x0982bb23` |
| ReentrancyGuardReentrantCall |  | `0xd7ce3fac` |
| IndexOutOfBounds |  | `0xe2d34134` |
| ElementNotFound |  | `0x0982bb23` |
| EthTransfer |  | `0x9c3c0d41` |
| InsufficientEth |  | `0x3b39ba4f` |
| SwapDeadline |  | `0x6a3a3c96` |
| InvalidSize | uint256 currentValue, uint256 expectedSize | `0xa0f9c6a0` |
| InvalidPercentage | uint256 value | `0xc5b9e4ed` |