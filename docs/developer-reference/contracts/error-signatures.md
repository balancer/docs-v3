---
order: 4
---

# Error signatures

Catalogue for decoding custom error signatures into their associated error names

# Extracted Errors

| Signature                                         | Selector     | Parameters                                                                              | Contract                        |
| ------------------------------------------------- | ------------ | --------------------------------------------------------------------------------------- | ------------------------------- |
| `SwapInsufficientPayment()`                       | `0xf70282c3` |                                                                                         | AggregatorRouter                |
| `InconsistentState(string,)`                      | `0xa6e9b1ec` | string contractName, address contractAddress                                            | BalancerContractRegistry        |
| `NotStaticCall()`                                 | `0x67f84ab2` |                                                                                         | CompositeLiquidityRouter        |
| `ElementNotFound()`                               | `0x66af5392` |                                                                                         | CompositeLiquidityRouter        |
| `WrongTokensOut(address[],)`                      | `0x9576d209` | address[] expectedTokensOut, address[] tokensOut                                        | CompositeLiquidityRouter        |
| `OrderNotValid(string)`                           | `0xc8fc2725` | string reason                                                                           | CowSwapFeeBurner                |
| `PollTryNextBlock(string)`                        | `0xd05f3065` | string reason                                                                           | CowSwapFeeBurner                |
| `PollTryAtBlock(uint256,)`                        | `0x40ab5b5b` | uint256 blockNumber, string reason                                                      | CowSwapFeeBurner                |
| `PollTryAtEpoch(uint256,)`                        | `0xd87ea590` | uint256 timestamp, string reason                                                        | CowSwapFeeBurner                |
| `PollNever(string)`                               | `0x981b64cd` | string reason                                                                           | CowSwapFeeBurner                |
| `InvalidOrderParameters(string)`                  | `0x8d8a6110` | string reason                                                                           | CowSwapFeeBurner                |
| `OrderHasUnexpectedStatus(OrderStatus)`           | `0x3ba126d8` | OrderStatus actualStatus                                                                | CowSwapFeeBurner                |
| `InterfaceIsSignatureVerifierMuxer()`             | `0x32798566` |                                                                                         | CowSwapFeeBurner                |
| `SupportsOnlyTwoTokens()`                         | `0x34e77320` |                                                                                         | GyroECLPPoolFactory             |
| `InvalidTrustedRouter()`                          | `0x0307417b` |                                                                                         | LBPoolFactory                   |
| `InvalidOwner()`                                  | `0x49e27cff` |                                                                                         | LBPoolFactory                   |
| `ContractAddressAlreadyRegistered(ContractType,)` | `0xef27fbb5` | ContractType contractType, address contractAddress                                      | MevCaptureHook                  |
| `ContractNameAlreadyRegistered(ContractType,)`    | `0xdecd1563` | ContractType contractType, string contractName                                          | MevCaptureHook                  |
| `ContractNameInUseAsAlias(string,)`               | `0xedcd5939` | string contractName, address contractAddress                                            | MevCaptureHook                  |
| `ContractAliasInUseAsName(ContractType,)`         | `0xc5949bff` | ContractType contractType, string contractName                                          | MevCaptureHook                  |
| `ContractNameNotRegistered(string)`               | `0xcd3599f9` | string contractName                                                                     | MevCaptureHook                  |
| `ContractAddressNotRegistered(address)`           | `0xf5b5d364` | address contractAddress                                                                 | MevCaptureHook                  |
| `ContractAlreadyDeprecated(address)`              | `0x1f118c35` | address contractAddress                                                                 | MevCaptureHook                  |
| `ZeroContractAddress()`                           | `0xb4d92c53` |                                                                                         | MevCaptureHook                  |
| `InvalidContractName()`                           | `0x830c907e` |                                                                                         | MevCaptureHook                  |
| `InvalidContractAlias()`                          | `0x907f9fd9` |                                                                                         | MevCaptureHook                  |
| `InvalidBalancerContractRegistry()`               | `0x5c84f39b` |                                                                                         | MevCaptureHook                  |
| `MevCaptureHookNotRegisteredInPool(address)`      | `0x7501acd8` | address pool                                                                            | MevCaptureHook                  |
| `MevSwapFeePercentageAboveMax(uint256,)`          | `0x803c3422` | uint256 feePercentage, uint256 maxFeePercentage                                         | MevCaptureHook                  |
| `MevTaxExemptSenderAlreadyAdded(address)`         | `0x106fa5a4` | address sender                                                                          | MevCaptureHook                  |
| `SenderNotRegisteredAsMevTaxExempt(address)`      | `0x01147f3f` | address sender                                                                          | MevCaptureHook                  |
| `MevCaptureHookNotRegisteredForPool(pool)`        | `0x289d5eb6` | pool                                                                                    | MevCaptureHook                  |
| `SqrtParamsWrong()`                               | `0x0579e1da` |                                                                                         | MockGyro2CLPPool                |
| `AssetBoundsExceeded()`                           | `0x03ba4186` |                                                                                         | MockGyroECLPPool                |
| `RotationVectorSWrong()`                          | `0xa9587a74` |                                                                                         | MockGyroECLPPool                |
| `RotationVectorCWrong()`                          | `0x658639aa` |                                                                                         | MockGyroECLPPool                |
| `RotationVectorNotNormalized()`                   | `0xa26d8c2e` |                                                                                         | MockGyroECLPPool                |
| `DerivedTauAlphaNotNormalized()`                  | `0xc196e496` |                                                                                         | MockGyroECLPPool                |
| `DerivedTauBetaNotNormalized()`                   | `0x25bbd708` |                                                                                         | MockGyroECLPPool                |
| `StretchingFactorWrong()`                         | `0x77dfa312` |                                                                                         | MockGyroECLPPool                |
| `DerivedTauAlphaYWrong()`                         | `0xec13362c` |                                                                                         | MockGyroECLPPool                |
| `DerivedTauBetaYWrong()`                          | `0xfa40768d` |                                                                                         | MockGyroECLPPool                |
| `DerivedTauXWrong()`                              | `0x4071c5a8` |                                                                                         | MockGyroECLPPool                |
| `DerivedUWrong()`                                 | `0xf84d4b44` |                                                                                         | MockGyroECLPPool                |
| `DerivedVWrong()`                                 | `0xcfb498d5` |                                                                                         | MockGyroECLPPool                |
| `DerivedWWrong()`                                 | `0x83446b36` |                                                                                         | MockGyroECLPPool                |
| `DerivedZWrong()`                                 | `0x12e3e411` |                                                                                         | MockGyroECLPPool                |
| `InvariantDenominatorWrong()`                     | `0xd1c17993` |                                                                                         | MockGyroECLPPool                |
| `MaxAssetsExceeded()`                             | `0x2da2a5e5` |                                                                                         | MockGyroECLPPool                |
| `MaxInvariantExceeded()`                          | `0xdc10196f` |                                                                                         | MockGyroECLPPool                |
| `DerivedDsqWrong()`                               | `0xfb154af0` |                                                                                         | MockGyroECLPPool                |
| `AddOverflow()`                                   | `0xa7f965e3` |                                                                                         | MockGyroECLPPool                |
| `SubOverflow()`                                   | `0x8a5d6af4` |                                                                                         | MockGyroECLPPool                |
| `MulOverflow()`                                   | `0x0cde6c26` |                                                                                         | MockGyroECLPPool                |
| `DivInterval()`                                   | `0xe03f5d57` |                                                                                         | MockGyroECLPPool                |
| `OwnableUnauthorizedAccount(address)`             | `0x118cdaa7` | address account                                                                         | MockLBPool                      |
| `OwnableInvalidOwner(address)`                    | `0x1e4fbdf7` | address owner                                                                           | MockLBPool                      |
| `MaxOutRatio()`                                   | `0x64590b9f` |                                                                                         | MockLBPool                      |
| `MaxInRatio()`                                    | `0x340a4533` |                                                                                         | MockLBPool                      |
| `ZeroInvariant()`                                 | `0x26543689` |                                                                                         | MockLBPool                      |
| `MinWeight()`                                     | `0xbd393583` |                                                                                         | MockLBPool                      |
| `NormalizedWeightInvariant()`                     | `0x39cf114e` |                                                                                         | MockLBPool                      |
| `WeightedPoolBptRateUnsupported()`                | `0x18e79a20` |                                                                                         | MockLBPool                      |
| `SwapsDisabled()`                                 | `0xfdf79845` |                                                                                         | MockLBPool                      |
| `RemovingLiquidityNotAllowed()`                   | `0xf38b5770` |                                                                                         | MockLBPool                      |
| `AddingLiquidityNotAllowed()`                     | `0x3eee08c7` |                                                                                         | MockLBPool                      |
| `SwapOfProjectTokenIn()`                          | `0x1269438a` |                                                                                         | MockLBPool                      |
| `NotImplemented()`                                | `0xd6234725` |                                                                                         | MockLBPool                      |
| `GradualUpdateTimeTravel(uint256,)`               | `0x9845c98f` | uint256 resolvedStartTime, uint256 endTime                                              | MockLBPool                      |
| `OutOfBounds()`                                   | `0xb4120f14` |                                                                                         | MockStablePool                  |
| `ZeroDivision()`                                  | `0x0a0c22c7` |                                                                                         | MockStablePool                  |
| `BaseOutOfBounds()`                               | `0x022701e0` |                                                                                         | MockStablePool                  |
| `ExponentOutOfBounds()`                           | `0xd8317311` |                                                                                         | MockStablePool                  |
| `ProductOutOfBounds()`                            | `0xa2f9f7e3` |                                                                                         | MockStablePool                  |
| `InvalidExponent()`                               | `0xd4794efd` |                                                                                         | MockStablePool                  |
| `SafeCastOverflowedUintDowncast(uint8,)`          | `0xf3fd8e96` | uint8 bits, uint256 value                                                               | MockStablePool                  |
| `SafeCastOverflowedIntToUint(int256)`             | `0xa8ce4432` | int256 value                                                                            | MockStablePool                  |
| `SafeCastOverflowedIntDowncast(uint8,)`           | `0xfcaa9e1d` | uint8 bits, int256 value                                                                | MockStablePool                  |
| `SafeCastOverflowedUintToInt(uint256)`            | `0x24775e06` | uint256 value                                                                           | MockStablePool                  |
| `StableInvariantDidNotConverge()`                 | `0x010ca320` |                                                                                         | MockStablePool                  |
| `StableComputeBalanceDidNotConverge()`            | `0xdcbda05c` |                                                                                         | MockStablePool                  |
| `AmplificationFactorTooLow()`                     | `0xab923323` |                                                                                         | MockStablePool                  |
| `AmplificationFactorTooHigh()`                    | `0x9b80d390` |                                                                                         | MockStablePool                  |
| `AmpUpdateDurationTooShort()`                     | `0xcd6b022a` |                                                                                         | MockStablePool                  |
| `AmpUpdateRateTooFast()`                          | `0x1c708b92` |                                                                                         | MockStablePool                  |
| `AmpUpdateAlreadyStarted()`                       | `0x2f301e7e` |                                                                                         | MockStablePool                  |
| `AmpUpdateNotStarted()`                           | `0x4673a675` |                                                                                         | MockStablePool                  |
| `VaultNotSet()`                                   | `0xc8e28160` |                                                                                         | MockStablePool                  |
| `SenderNotAllowed()`                              | `0x23dada53` |                                                                                         | MockWrappedBalancerPoolToken    |
| `ProtocolSwapFeePercentageTooHigh()`              | `0x7e6eb7fb` |                                                                                         | MockWrappedBalancerPoolToken    |
| `ProtocolYieldFeePercentageTooHigh()`             | `0xa7849e8e` |                                                                                         | MockWrappedBalancerPoolToken    |
| `PoolCreatorNotRegistered(address)`               | `0x8bcbf353` | address pool                                                                            | MockWrappedBalancerPoolToken    |
| `CallerIsNotPoolCreator(address,)`                | `0xa4c7f8b0` | address caller, address pool                                                            | MockWrappedBalancerPoolToken    |
| `PoolCreatorFeePercentageTooHigh()`               | `0x0370da74` |                                                                                         | MockWrappedBalancerPoolToken    |
| `PoolAlreadyRegistered(address)`                  | `0xdb771c80` | address pool                                                                            | MockWrappedBalancerPoolToken    |
| `PoolAlreadyInitialized(address)`                 | `0x218e3747` | address pool                                                                            | MockWrappedBalancerPoolToken    |
| `PoolNotRegistered(address)`                      | `0x9e51bd5c` | address pool                                                                            | MockWrappedBalancerPoolToken    |
| `PoolNotInitialized(address)`                     | `0x4bdace13` | address pool                                                                            | MockWrappedBalancerPoolToken    |
| `HookRegistrationFailed(address,,)`               | `0x55d8ee18` | address poolHooksContract, address pool, address poolFactory                            | MockWrappedBalancerPoolToken    |
| `TokenAlreadyRegistered(IERC20)`                  | `0xcbc7ea2c` | IERC20 token                                                                            | MockWrappedBalancerPoolToken    |
| `MinTokens()`                                     | `0x5ed4ba8f` |                                                                                         | MockWrappedBalancerPoolToken    |
| `MaxTokens()`                                     | `0x707bdf58` |                                                                                         | MockWrappedBalancerPoolToken    |
| `InvalidToken()`                                  | `0xc1ab6dc1` |                                                                                         | MockWrappedBalancerPoolToken    |
| `InvalidTokenType()`                              | `0xa1e9dd9d` |                                                                                         | MockWrappedBalancerPoolToken    |
| `InvalidTokenConfiguration()`                     | `0xdf450632` |                                                                                         | MockWrappedBalancerPoolToken    |
| `InvalidTokenDecimals()`                          | `0x686d3607` |                                                                                         | MockWrappedBalancerPoolToken    |
| `TokensMismatch(address,,)`                       | `0x21e13332` | address pool, address expectedToken, address actualToken                                | MockWrappedBalancerPoolToken    |
| `BalanceNotSettled()`                             | `0x20f1d86d` |                                                                                         | MockWrappedBalancerPoolToken    |
| `VaultIsNotUnlocked()`                            | `0xc09ba736` |                                                                                         | MockWrappedBalancerPoolToken    |
| `DynamicSwapFeeHookFailed()`                      | `0x53f976d4` |                                                                                         | MockWrappedBalancerPoolToken    |
| `BeforeSwapHookFailed()`                          | `0xe91e17e7` |                                                                                         | MockWrappedBalancerPoolToken    |
| `AfterSwapHookFailed()`                           | `0x15a29dec` |                                                                                         | MockWrappedBalancerPoolToken    |
| `BeforeInitializeHookFailed()`                    | `0x60612925` |                                                                                         | MockWrappedBalancerPoolToken    |
| `AfterInitializeHookFailed()`                     | `0x0f23dbc6` |                                                                                         | MockWrappedBalancerPoolToken    |
| `BeforeAddLiquidityHookFailed()`                  | `0x0b2eb652` |                                                                                         | MockWrappedBalancerPoolToken    |
| `AfterAddLiquidityHookFailed()`                   | `0xe1249165` |                                                                                         | MockWrappedBalancerPoolToken    |
| `BeforeRemoveLiquidityHookFailed()`               | `0x2aaf8866` |                                                                                         | MockWrappedBalancerPoolToken    |
| `AfterRemoveLiquidityHookFailed()`                | `0x1d3391d8` |                                                                                         | MockWrappedBalancerPoolToken    |
| `RouterNotTrusted()`                              | `0xe5d185cf` |                                                                                         | MockWrappedBalancerPoolToken    |
| `AmountGivenZero()`                               | `0x57a456b7` |                                                                                         | MockWrappedBalancerPoolToken    |
| `CannotSwapSameToken()`                           | `0xa54b181d` |                                                                                         | MockWrappedBalancerPoolToken    |
| `TokenNotRegistered(IERC20)`                      | `0x59674a0c` | IERC20 token                                                                            | MockWrappedBalancerPoolToken    |
| `SwapLimit(uint256,)`                             | `0xf5834282` | uint256 amount, uint256 limit                                                           | MockWrappedBalancerPoolToken    |
| `HookAdjustedSwapLimit(uint256,)`                 | `0xd2bc61be` | uint256 amount, uint256 limit                                                           | MockWrappedBalancerPoolToken    |
| `TradeAmountTooSmall()`                           | `0x1ed4d118` |                                                                                         | MockWrappedBalancerPoolToken    |
| `InvalidAddLiquidityKind()`                       | `0x6c02b395` |                                                                                         | MockWrappedBalancerPoolToken    |
| `AmountInAboveMax(IERC20,,)`                      | `0xbbf5adfb` | IERC20 tokenIn, uint256 amountIn, uint256 maxAmountIn                                   | MockWrappedBalancerPoolToken    |
| `HookAdjustedAmountInAboveMax(IERC20,,)`          | `0x4121da70` | IERC20 tokenIn, uint256 amountIn, uint256 maxAmountIn                                   | MockWrappedBalancerPoolToken    |
| `BptAmountOutBelowMin(uint256,)`                  | `0xf9ee35ac` | uint256 amountOut, uint256 minAmountOut                                                 | MockWrappedBalancerPoolToken    |
| `DoesNotSupportAddLiquidityCustom()`              | `0x4876c0bc` |                                                                                         | MockWrappedBalancerPoolToken    |
| `DoesNotSupportDonation()`                        | `0xefe0265d` |                                                                                         | MockWrappedBalancerPoolToken    |
| `InvalidRemoveLiquidityKind()`                    | `0x137a9a39` |                                                                                         | MockWrappedBalancerPoolToken    |
| `AmountOutBelowMin(IERC20,,)`                     | `0xf22ae62c` | IERC20 tokenOut, uint256 amountOut, uint256 minAmountOut                                | MockWrappedBalancerPoolToken    |
| `HookAdjustedAmountOutBelowMin(IERC20,,)`         | `0x7d8a66e4` | IERC20 tokenOut, uint256 amountOut, uint256 minAmountOut                                | MockWrappedBalancerPoolToken    |
| `BptAmountInAboveMax(uint256,)`                   | `0xf1b8af4d` | uint256 amountIn, uint256 maxAmountIn                                                   | MockWrappedBalancerPoolToken    |
| `DoesNotSupportRemoveLiquidityCustom()`           | `0xcf0a95c0` |                                                                                         | MockWrappedBalancerPoolToken    |
| `ProtocolFeesExceedTotalCollected()`              | `0x4c69ac5d` |                                                                                         | MockWrappedBalancerPoolToken    |
| `SwapFeePercentageTooLow()`                       | `0xbfb20688` |                                                                                         | MockWrappedBalancerPoolToken    |
| `SwapFeePercentageTooHigh()`                      | `0x7f47834b` |                                                                                         | MockWrappedBalancerPoolToken    |
| `FeePrecisionTooHigh()`                           | `0x833fb3ce` |                                                                                         | MockWrappedBalancerPoolToken    |
| `PercentageAboveMax()`                            | `0x746e5940` |                                                                                         | MockWrappedBalancerPoolToken    |
| `QueriesDisabled()`                               | `0x7a198886` |                                                                                         | MockWrappedBalancerPoolToken    |
| `QueriesDisabledPermanently()`                    | `0x069f8cbc` |                                                                                         | MockWrappedBalancerPoolToken    |
| `PoolInRecoveryMode(address)`                     | `0x346d7607` | address pool                                                                            | MockWrappedBalancerPoolToken    |
| `PoolNotInRecoveryMode(address)`                  | `0xef029adf` | address pool                                                                            | MockWrappedBalancerPoolToken    |
| `SenderIsNotVault(address)`                       | `0x089676d5` | address sender                                                                          | MockWrappedBalancerPoolToken    |
| `VaultPauseWindowDurationTooLarge()`              | `0xcc0e8fe5` |                                                                                         | MockWrappedBalancerPoolToken    |
| `PauseBufferPeriodDurationTooLarge()`             | `0x9ea4efee` |                                                                                         | MockWrappedBalancerPoolToken    |
| `VaultPaused()`                                   | `0xda9f8b34` |                                                                                         | MockWrappedBalancerPoolToken    |
| `VaultNotPaused()`                                | `0xf7ff4dca` |                                                                                         | MockWrappedBalancerPoolToken    |
| `VaultPauseWindowExpired()`                       | `0x0e4460b7` |                                                                                         | MockWrappedBalancerPoolToken    |
| `PoolPaused(address)`                             | `0xd971f597` | address pool                                                                            | MockWrappedBalancerPoolToken    |
| `PoolNotPaused(address)`                          | `0xfdcd6894` | address pool                                                                            | MockWrappedBalancerPoolToken    |
| `PoolPauseWindowExpired(address)`                 | `0xeb5a1217` | address pool                                                                            | MockWrappedBalancerPoolToken    |
| `BufferAlreadyInitialized(IERC4626)`              | `0xee44489a` | IERC4626 wrappedToken                                                                   | MockWrappedBalancerPoolToken    |
| `BufferNotInitialized(IERC4626)`                  | `0x92998560` | IERC4626 wrappedToken                                                                   | MockWrappedBalancerPoolToken    |
| `NotEnoughBufferShares()`                         | `0x98c5dbd6` |                                                                                         | MockWrappedBalancerPoolToken    |
| `WrongUnderlyingToken(IERC4626,)`                 | `0xb7b30c89` | IERC4626 wrappedToken, address underlyingToken                                          | MockWrappedBalancerPoolToken    |
| `InvalidUnderlyingToken(IERC4626)`                | `0x4c089bd4` | IERC4626 wrappedToken                                                                   | MockWrappedBalancerPoolToken    |
| `WrapAmountTooSmall(IERC4626)`                    | `0x1a53f97f` | IERC4626 wrappedToken                                                                   | MockWrappedBalancerPoolToken    |
| `VaultBuffersArePaused()`                         | `0x0f27df09` |                                                                                         | MockWrappedBalancerPoolToken    |
| `BufferSharesInvalidReceiver()`                   | `0xdbe6b10e` |                                                                                         | MockWrappedBalancerPoolToken    |
| `BufferSharesInvalidOwner()`                      | `0x586d06df` |                                                                                         | MockWrappedBalancerPoolToken    |
| `BufferTotalSupplyTooLow(uint256)`                | `0x34bdbfaa` | uint256 totalSupply                                                                     | MockWrappedBalancerPoolToken    |
| `NotEnoughUnderlying(IERC4626,,)`                 | `0x6135b79b` | IERC4626 wrappedToken, uint256 expectedUnderlyingAmount, uint256 actualUnderlyingAmount | MockWrappedBalancerPoolToken    |
| `NotEnoughWrapped(IERC4626,,)`                    | `0x4d3a6ff3` | IERC4626 wrappedToken, uint256 expectedWrappedAmount, uint256 actualWrappedAmount       | MockWrappedBalancerPoolToken    |
| `IssuedSharesBelowMin(uint256,)`                  | `0x2b557e52` | uint256 issuedShares, uint256 minIssuedShares                                           | MockWrappedBalancerPoolToken    |
| `DoesNotSupportUnbalancedLiquidity()`             | `0xd4f5779c` |                                                                                         | MockWrappedBalancerPoolToken    |
| `CannotReceiveEth()`                              | `0xf2238896` |                                                                                         | MockWrappedBalancerPoolToken    |
| `NotVaultDelegateCall()`                          | `0x9fd25b36` |                                                                                         | MockWrappedBalancerPoolToken    |
| `WrongVaultExtensionDeployment()`                 | `0x1ab9d9d0` |                                                                                         | MockWrappedBalancerPoolToken    |
| `WrongProtocolFeeControllerDeployment()`          | `0x1bbe95c7` |                                                                                         | MockWrappedBalancerPoolToken    |
| `WrongVaultAdminDeployment()`                     | `0x82cc28b6` |                                                                                         | MockWrappedBalancerPoolToken    |
| `QuoteResultSpoofed()`                            | `0x28f95541` |                                                                                         | MockWrappedBalancerPoolToken    |
| `ERC20InsufficientBalance(address,,)`             | `0x46b62d07` | address sender, uint256 balance, uint256 needed                                         | MockWrappedBalancerPoolToken    |
| `ERC20InvalidSender(address)`                     | `0x96c6fd1e` | address sender                                                                          | MockWrappedBalancerPoolToken    |
| `ERC20InvalidReceiver(address)`                   | `0xec442f05` | address receiver                                                                        | MockWrappedBalancerPoolToken    |
| `ERC20InsufficientAllowance(address,,)`           | `0x19c4e051` | address spender, uint256 allowance, uint256 needed                                      | MockWrappedBalancerPoolToken    |
| `ERC20InvalidApprover(address)`                   | `0xe602df05` | address approver                                                                        | MockWrappedBalancerPoolToken    |
| `ERC20InvalidSpender(address)`                    | `0x94280d62` | address spender                                                                         | MockWrappedBalancerPoolToken    |
| `ERC721InvalidOwner(address)`                     | `0x89c62b64` | address owner                                                                           | MockWrappedBalancerPoolToken    |
| `ERC721NonexistentToken(uint256)`                 | `0x7e273289` | uint256 tokenId                                                                         | MockWrappedBalancerPoolToken    |
| `ERC721IncorrectOwner(address,,)`                 | `0x1fd83a0b` | address sender, uint256 tokenId, address owner                                          | MockWrappedBalancerPoolToken    |
| `ERC721InvalidSender(address)`                    | `0x73c6ac6e` | address sender                                                                          | MockWrappedBalancerPoolToken    |
| `ERC721InvalidReceiver(address)`                  | `0x64a0ae92` | address receiver                                                                        | MockWrappedBalancerPoolToken    |
| `ERC721InsufficientApproval(address,)`            | `0xc5c75308` | address operator, uint256 tokenId                                                       | MockWrappedBalancerPoolToken    |
| `ERC721InvalidApprover(address)`                  | `0xa9fbf51f` | address approver                                                                        | MockWrappedBalancerPoolToken    |
| `ERC721InvalidOperator(address)`                  | `0x5b08ba18` | address operator                                                                        | MockWrappedBalancerPoolToken    |
| `ERC1155InsufficientBalance(address,,,)`          | `0x629a1555` | address sender, uint256 balance, uint256 needed, uint256 tokenId                        | MockWrappedBalancerPoolToken    |
| `ERC1155InvalidSender(address)`                   | `0x01a83514` | address sender                                                                          | MockWrappedBalancerPoolToken    |
| `ERC1155InvalidReceiver(address)`                 | `0x57f447ce` | address receiver                                                                        | MockWrappedBalancerPoolToken    |
| `ERC1155MissingApprovalForAll(address,)`          | `0x0c8eb49c` | address operator, address owner                                                         | MockWrappedBalancerPoolToken    |
| `ERC1155InvalidApprover(address)`                 | `0x3e31884e` | address approver                                                                        | MockWrappedBalancerPoolToken    |
| `ERC1155InvalidOperator(address)`                 | `0xced3e100` | address operator                                                                        | MockWrappedBalancerPoolToken    |
| `ERC1155InvalidArrayLength(uint256,)`             | `0xa2201a5e` | uint256 idsLength, uint256 valuesLength                                                 | MockWrappedBalancerPoolToken    |
| `SafeERC20FailedOperation(address)`               | `0x5274afe7` | address token                                                                           | MockWrappedBalancerPoolToken    |
| `SafeERC20FailedDecreaseAllowance(address,,)`     | `0xadfaa852` | address spender, uint256 currentAllowance, uint256 requestedDecrease                    | MockWrappedBalancerPoolToken    |
| `AddressInsufficientBalance(address)`             | `0xcd786059` | address account                                                                         | MockWrappedBalancerPoolToken    |
| `AddressEmptyCode(address)`                       | `0x9996b315` | address target                                                                          | MockWrappedBalancerPoolToken    |
| `FailedInnerCall()`                               | `0x1425ea42` |                                                                                         | MockWrappedBalancerPoolToken    |
| `ECDSAInvalidSignature()`                         | `0xf645eedf` |                                                                                         | MockWrappedBalancerPoolToken    |
| `ECDSAInvalidSignatureLength(uint256)`            | `0xfce698f7` | uint256 length                                                                          | MockWrappedBalancerPoolToken    |
| `ECDSAInvalidSignatureS(bytes32)`                 | `0xd78bce0c` | bytes32 s                                                                               | MockWrappedBalancerPoolToken    |
| `MathOverflowedMulDiv()`                          | `0x227bc153` |                                                                                         | MockWrappedBalancerPoolToken    |
| `InvalidAccountNonce(address,)`                   | `0x8361cddf` | address account, uint256 currentNonce                                                   | MockWrappedBalancerPoolToken    |
| `StringTooLong(string)`                           | `0x305a27a9` | string str                                                                              | MockWrappedBalancerPoolToken    |
| `InvalidShortString()`                            | `0xb3512b0c` |                                                                                         | MockWrappedBalancerPoolToken    |
| `StringsInsufficientHexLength(uint256,)`          | `0x6a76f42b` | uint256 value, uint256 length                                                           | MockWrappedBalancerPoolToken    |
| `ERC2612ExpiredSignature(uint256)`                | `0x62791302` | uint256 deadline                                                                        | MockWrappedBalancerPoolToken    |
| `ERC2612InvalidSigner(address,)`                  | `0x6d795e03` | address signer, address owner                                                           | MockWrappedBalancerPoolToken    |
| `VaultIsUnlocked()`                               | `0xbe18e309` |                                                                                         | MockWrappedBalancerPoolToken    |
| `InvalidMigrationSource()`                        | `0xb82fd5bf` |                                                                                         | ProtocolFeeController           |
| `InvalidFeeRecipient()`                           | `0x768dc598` |                                                                                         | ProtocolFeeSweeper              |
| `InvalidTargetToken()`                            | `0x8562eb45` |                                                                                         | ProtocolFeeSweeper              |
| `InvalidProtocolFeeBurner()`                      | `0x31ec2736` |                                                                                         | ProtocolFeeSweeper              |
| `UnsupportedProtocolFeeBurner(address)`           | `0x38553f6c` | address protocolFeeBurner                                                               | ProtocolFeeSweeper              |
| `ProtocolFeeBurnerAlreadyAdded(address)`          | `0x6fe47af6` | address protocolFeeBurner                                                               | ProtocolFeeSweeper              |
| `ProtocolFeeBurnerNotAdded(address)`              | `0xbca5ab34` | address protocolFeeBurner                                                               | ProtocolFeeSweeper              |
| `BurnerDidNotConsumeAllowance()`                  | `0xc5bc8d51` |                                                                                         | ProtocolFeeSweeper              |
| `Result(bytes)`                                   | `0x5ab64fb8` | bytes result                                                                            | Router                          |
| `ErrorSelectorNotFound()`                         | `0xa7285689` |                                                                                         | Router                          |
| `TransientIndexOutOfBounds()`                     | `0x0f4ae0e4` |                                                                                         | Router                          |
| `ReentrancyGuardReentrantCall()`                  | `0x3ee5aeb5` |                                                                                         | Router                          |
| `EthTransfer()`                                   | `0x0540ddf6` |                                                                                         | Router                          |
| `InsufficientEth()`                               | `0xa01a9df6` |                                                                                         | Router                          |
| `SwapDeadline()`                                  | `0xe08b8af0` |                                                                                         | Router                          |
| `AllowanceExpired(uint256)`                       | `0xd81b2f2e` | uint256 deadline                                                                        | Router                          |
| `InsufficientAllowance(uint256)`                  | `0xf96fb071` | uint256 amount                                                                          | Router                          |
| `ExcessiveInvalidation()`                         | `0x24d35a26` |                                                                                         | Router                          |
| `InvalidAmount(uint256)`                          | `0x3728b83d` | uint256 maxAmount                                                                       | Router                          |
| `LengthMismatch()`                                | `0xff633a38` |                                                                                         | Router                          |
| `InputLengthMismatch()`                           | `0xaaad13f7` |                                                                                         | StableSurgePoolFactory          |
| `MultipleNonZeroInputs()`                         | `0x6b8c3be5` |                                                                                         | StableSurgePoolFactory          |
| `AllZeroInputs()`                                 | `0x7e46bddc` |                                                                                         | StableSurgePoolFactory          |
| `TokensNotSorted()`                               | `0x6e8f1947` |                                                                                         | StableSurgePoolFactory          |
| `Create2InsufficientBalance(uint256,)`            | `0x2174c919` | uint256 balance, uint256 needed                                                         | StableSurgePoolFactory          |
| `Create2EmptyBytecode()`                          | `0x4ca249dc` |                                                                                         | StableSurgePoolFactory          |
| `Create2FailedDeployment()`                       | `0x741752c2` |                                                                                         | StableSurgePoolFactory          |
| `IndexOutOfBounds()`                              | `0x4e23d035` |                                                                                         | StableSurgePoolFactory          |
| `Disabled()`                                      | `0x75884cda` |                                                                                         | StableSurgePoolFactory          |
| `StandardPoolWithCreator()`                       | `0x61ee1764` |                                                                                         | StableSurgePoolFactory          |
| `PoolPauseWindowDurationOverflow()`               | `0x68755a11` |                                                                                         | StableSurgePoolFactory          |
| `CodeDeploymentFailed()`                          | `0xfef82207` |                                                                                         | StableSurgePoolFactory          |
| `InvalidPercentage()`                             | `0x1f3b85d3` |                                                                                         | StableSurgePoolFactory          |
| `PoolTotalSupplyTooLow(uint256)`                  | `0xd38d20fc` | uint256 totalSupply                                                                     | VaultAdmin                      |
| `BalanceOverflow()`                               | `0x89560ca1` |                                                                                         | VaultAdmin                      |
| `CodecOverflow()`                                 | `0xe4337c05` |                                                                                         | VaultAdmin                      |
| `InvariantRatioAboveMax(uint256,)`                | `0xcaf4fc23` | uint256 invariantRatio, uint256 maxInvariantRatio                                       | VaultExtension                  |
| `InvariantRatioBelowMin(uint256,)`                | `0xfc71e4a1` | uint256 invariantRatio, uint256 minInvariantRatio                                       | VaultExtension                  |
| `VaultAddressMismatch()`                          | `0xb4c1be7b` |                                                                                         | VaultFactory                    |
| `InvalidBytecode(string)`                         | `0xc7f4796e` | string contractName                                                                     | VaultFactory                    |
| `VaultAlreadyDeployed(address)`                   | `0xe254a88b` | address vault                                                                           | VaultFactory                    |
| `WrappedBPTAlreadyExists(address)`                | `0x957f7dce` | address wrappedToken                                                                    | WrappedBalancerPoolTokenFactory |
| `BalancerPoolTokenNotRegistered()`                | `0x916f5d0e` |                                                                                         | WrappedBalancerPoolTokenFactory |
