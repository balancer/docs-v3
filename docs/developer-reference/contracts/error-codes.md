---
order: 4
---

# Error Codes

Balancer uses custom errors which provide a convenient and gas-efficient way to explain why an operation failed. Comments and context for the specific errors can be found in the tables below.

## IAuthentication

| Error           | Comment                                         |
| --------------- | ----------------------------------------------- |
| SenderNotAllowed| The sender does not have permission to call a function |

## IBasePoolFactory

| Error   | Comment                                         |
| ------- | ----------------------------------------------- |
| Disabled| Cannot create a pool after the factory was disabled |

## IERC20MultitokenErrors

| Error            | Comment                                         |
| ---------------- | ----------------------------------------------- |
| PoolTotalSupplyTooLow(uint256) | The total supply of a pool token can't be lower than the absolute minimum |

## IVaultErrors

| Error                           | Comment                                         |
| ------------------------------- | ----------------------------------------------- |
| PoolAlreadyRegistered(address)  | A pool has already been registered. `registerPool` may only be called once |
| PoolAlreadyInitialized(address) | A pool has already been initialized. `initialize` may only be called once |
| PoolNotRegistered(address)      | A pool has not been registered |
| PoolNotInitialized(address)     | A referenced pool has not been initialized |
| HookRegistrationFailed(address,address,address)     | A hook contract rejected a pool on registration |
| TokenAlreadyRegistered(IERC20)  | A token was already registered (i.e.,it is a duplicate in the pool) |
| MinTokens()                     | The token count is below the minimum allowed |
| MaxTokens()                     | The token count is above the maximum allowed |
| InvalidToken()                  | Invalid tokens (e.g.,zero) cannot be registered |
| InvalidTokenType()              | The token type given in a TokenConfig during pool registration is invalid |
| InvalidTokenConfiguration()     | The data in a TokenConfig struct is inconsistent or unsupported |
| InvalidTokenDecimals()          | Tokens with more than 18 decimals are not supported |
| TokensMismatch(address,address,address) | The token list passed into an operation does not match the pool tokens in the pool |
| BalanceNotSettled()            | A transient accounting operation completed with outstanding token deltas |
| VaultIsNotUnlocked()           | A user called a Vault function (swap,add/remove liquidity) outside the lock context |
| DynamicSwapFeeHookFailed()           | The pool has returned false to the beforeSwap hook, indicating the transaction should revert |
| BeforeSwapHookFailed()         | The pool has returned false to the beforeSwap hook, indicating the transaction should revert |
| AfterSwapHookFailed()          | The pool has returned false to the afterSwap hook, indicating the transaction should revert |
| BeforeInitializeHookFailed()   | The pool has returned false to the beforeInitialize hook, indicating the transaction should revert |
| AfterInitializeHookFailed()    | The pool has returned false to the afterInitialize hook, indicating the transaction should revert |
| BeforeAddLiquidityHookFailed() | The pool has returned false to the beforeAddLiquidity hook, indicating the transaction should revert |
| AfterAddLiquidityHookFailed()  | The pool has returned false to the afterAddLiquidity hook, indicating the transaction should revert |
| BeforeRemoveLiquidityHookFailed() | The pool has returned false to the beforeRemoveLiquidity hook, indicating the transaction should revert |
| AfterRemoveLiquidityHookFailed() | The pool has returned false to the afterRemoveLiquidity hook, indicating the transaction should revert |
| RouterNotTrusted()             | An unauthorized Router tried to call a permissioned function (i.e.,using the Vault's token allowance) |
| AmountGivenZero()               | The user tried to swap zero tokens |
| CannotSwapSameToken()           | The user attempted to swap a token for itself |
| TokenNotRegistered(IERC20)          | The user attempted to swap a token not in the pool |
| SwapLimit(uint256,uint256)     | An amount in or out has exceeded the limit specified in the swap request |
| HookAdjustedSwapLimit(uint256,uint256)     | A hook adjusted amount in or out has exceeded the limit specified in the swap request |
| TradeAmountTooSmall()       | The amount given or calculated for an operation is below the minimum limit |
| InvalidAddLiquidityKind()       | Add liquidity kind not supported |
| AmountInAboveMax(IERC20,uint256,uint256) | A required amountIn exceeds the maximum limit specified for the operation |
| HookAdjustedAmountInAboveMax(IERC20,uint256,uint256) | A hook adjusted amountIn exceeds the maximum limit specified for the operation |
| BptAmountOutBelowMin(uint256,uint256) | The BPT amount received from adding liquidity is below the minimum specified for the operation |
| DoesNotSupportAddLiquidityCustom() | Pool does not support adding liquidity with a customized input |
| DoesNotSupportDonation() | Pool does not support adding liquidity through donation |
| InvalidRemoveLiquidityKind()    | Remove liquidity kind not supported |
| AmountOutBelowMin(IERC20,uint256,uint256) | The actual amount out is below the minimum limit specified for the operation |
| HookAdjustedAmountOutBelowMin(IERC20,uint256,uint256) | The hook adjusted amount out is below the minimum limit specified for the operation |
| BptAmountInAboveMax(uint256,uint256) | The required BPT amount in exceeds the maximum limit specified for the operation |
| DoesNotSupportRemoveLiquidityCustom() | Pool does not support removing liquidity with a customized input |
| ProtocolFeesExceedTotalCollected() | Error raised when the sum of the parts (aggregate swap or yield fee) |
| SwapFeePercentageTooLow()     | Error raised when the swap fee percentage is less than the minimum allowed value |
| SwapFeePercentageTooHigh()     | Error raised when the swap fee percentage exceeds the maximum allowed value |
| FeePrecisionTooHigh()     | Primary fee percentages result in an aggregate fee that cannot be stored with the required precision |
| PercentageAboveMax()     | A given percentage is above the maximum (usually FixedPoint.ONE,or 1e18 wei) |
| QueriesDisabled()              | A user tried to execute a query operation when they were disabled |
| PoolInRecoveryMode(address)    | Cannot enable recovery mode when already enabled |
| PoolNotInRecoveryMode(address) | Cannot disable recovery mode when not enabled |
| SenderIsNotVault(address)      | Error indicating the sender is not the Vault (e.g.,someone is trying to call a permissioned function) |
| VaultPauseWindowDurationTooLarge() | The caller specified a pause window period longer than the maximum |
| PauseBufferPeriodDurationTooLarge() | The caller specified a buffer period longer than the maximum |
| VaultPaused()                  | A user tried to perform an operation while the Vault was paused |
| VaultNotPaused()               | Governance tried to unpause the Vault when it was not paused |
| VaultPauseWindowExpired()      | Governance tried to pause the Vault after the pause period expired |
| PoolPaused(address)            | A user tried to perform an operation involving a paused Pool |
| PoolNotPaused(address)         | Governance tried to unpause the Pool when it was not paused |
| PoolPauseWindowExpired(address)| Governance tried to pause a Pool after the pause period expired |
| BufferAlreadyInitialized(IERC4626)| Buffer for the given wrapped token was already initialized |
| BufferNotInitialized(IERC4626)| Buffer for the given wrapped token was not initialized |
| NotEnoughBufferShares()| The user is trying to remove more than their allocated shares from the buffer |
| WrongUnderlyingToken(IERC4626,address)| The wrapped token asset does not match the underlying token |
| InvalidUnderlyingToken(IERC4626)| A wrapped token reported the zero address as its underlying token asset |
| WrapAmountTooSmall(IERC4626)| The amount given to wrap/unwrap was too small,which can introduce rounding issues |
| VaultBuffersArePaused()| Buffer operation attempted while vault buffers are paused |
| BufferSharesInvalidReceiver()| Buffer shares were minted to an invalid address |
| BufferSharesInvalidOwner()| Buffer shares were burned from an invalid address |
| BufferTotalSupplyTooLow(uint256) | The total supply of a buffer can't be lower than the absolute minimum |
| NotEnoughUnderlying(IERC4626,uint256,uint256) | A wrap/unwrap operation consumed more or returned less underlying tokens than it should |
| NotEnoughWrapped(IERC4626,uint256,uint256) | A wrap/unwrap operation consumed more or returned less wrapped tokens than it should |
| DoesNotSupportUnbalancedLiquidity()         | Pool does not support adding / removing liquidity with an unbalanced input |
| CannotReceiveEth()             | The contract should not receive ETH |
| NotVaultDelegateCall()         | The Vault extension was called by an account directly; it can only be called by the Vault via delegatecall |
| WrongVaultExtensionDeployment()| The vault extension was configured with an incorrect Vault address |
| WrongProtocolFeeControllerDeployment()| The protocol fee controller was configured with an incorrect Vault address |
| WrongVaultAdminDeployment()    | The vault admin was configured with an incorrect Vault address |
| QuoteResultSpoofed()    | Quote reverted with a reserved error code |

## IProtocolFeeController

| Error                           | Comment                                         |
| -------------- | ----------------------------------------------- |
| ProtocolSwapFeePercentageTooHigh() | Error raised when the protocol swap fee percentage exceeds the maximum allowed value |
| ProtocolYieldFeePercentageTooHigh() | Error raised when the protocol yield fee percentage exceeds the maximum allowed value |
| PoolCreatorNotRegistered(address) | Error raised if there is no pool creator on a withdrawal attempt from the given pool |
| CallerIsNotPoolCreator(address,address) | Error raised if the wrong account attempts to withdraw pool creator fees |
| PoolCreatorFeePercentageTooHigh() | Error raised when the pool creator swap or yield fee percentage exceeds the maximum allowed value |

## ICompositeLiquidityRouter

| Error          | Comment                                         |
| -------------- | ----------------------------------------------- |
| WrongTokensOut(address[],address[]) | `tokensOut` array does not have all the tokens from `expectedTokensOut` |

## RouterCommon

| Error          | Comment                                         |
| -------------- | ----------------------------------------------- |
| EthTransfer    | Incoming ETH transfer from an address that is not WETH |
| InsufficientEth| The amount of ETH paid is insufficient to complete this operation |
| SwapDeadline   | The swap transaction was not mined before the specified deadline timestamp |

## BasePoolFactory

| Error           | Comment                                         |
| --------------- | ----------------------------------------------- |
| StandardPoolWithCreator()     | A pool creator was specified for a pool from a Balancer core pool type |

## BasePoolMath
| Error           | Comment                                         |
| --------------- | ----------------------------------------------- |
| InvariantRatioAboveMax()     | An add liquidity operation increased the invariant above the limit |
| InvariantRatioBelowMin()     | A remove liquidity operation decreased the invariant below the limit |

## StablePool

| Error           | Comment                                         |
| --------------- | ----------------------------------------------- |
| AmplificationFactorTooLow()     | The amplification factor is below the minimum of the range (1 - 5000) |
| AmplificationFactorTooHigh() | The amplification factor is above the maximum of the range (1 - 5000) |
| AmpUpdateDurationTooShort()     | The amplification change duration is too short |
| AmpUpdateRateTooFast() | The amplification change rate is too fast |
| AmpUpdateAlreadyStarted()     | Amplification update operations must be done one at a time |
| AmpUpdateNotStarted() | Cannot stop an amplification update before it starts |

## WeightedPool

| Error           | Comment                                         |
| --------------- | ----------------------------------------------- |
| MinWeight()     | Indicates that one of the pool tokens' weight is below the minimum allowed |
| NormalizedWeightInvariant() | Indicates that the sum of the pool tokens' weights is not FP 1 |
| WeightedPoolBptRateUnsupported | Weighted Pools cannot safely use themselves as rate providers (especially nested) |

## EVMCallCodeHelpers

| Error           | Comment                                         |
| --------------- | ----------------------------------------------- |
| NotStaticCall() | Indicates a state-changing transaction was initiated in a context that only allows static calls |

## InputHelpers

| Error                 | Comment                                         |
| --------------------- | ----------------------------------------------- |
| InputLengthMismatch() | Arrays passed to a function and intended to be parallel have different lengths |
| MultipleNonZeroInputs() | Multiple non-zero inputs were provided |
| AllZeroInputs()       | All inputs provided were zero |
| TokensNotSorted()     | Tokens provided are not in sorted order |

## WordCodec
| Error           | Comment                                         |
| --------------- | ----------------------------------------------- |
| CodecOverflow() | Function called with an invalid value |
| OutOfBounds()   | Function called with an invalid bitLength or offset |

## FixedPoint
| Error         | Comment             |
| ------------- | ------------------- |
| ZeroDivision()| Attempted division by zero |

## LogExpMath

| Error                 | Comment                                         |
| --------------------- | ----------------------------------------------- |
| BaseOutOfBounds()     | This error is thrown when a base is not within an acceptable range |
| ExponentOutOfBounds() | This error is thrown when a exponent is not within an acceptable range |
| ProductOutOfBounds()  | This error is thrown when the exponent * ln(base) is not within an acceptable range |
| InvalidExponent()     | This error is thrown when an exponent used in the exp function is not within an acceptable range |
| OutOfBounds()         | This error is thrown when a variable or result is not within the acceptable bounds defined in the function |

## StableMath
| Error                         | Comment                                         |
| ----------------------------- | ----------------------------------------------- |
| StableInvariantDidNotConverge()| The iterations to calculate the invariant didn't converge |
| StableComputeBalanceDidNotConverge()| The iterations to calculate the balance didn't converge |

## WeightedMath 

| Error                 | Comment                                         |
| --------------------- | ----------------------------------------------- |
| MaxOutRatio()         | User attempted to extract a disproportionate amountOut of tokens from a pool |
| MaxInRatio()          | User attempted to add a disproportionate amountIn of tokens to a pool |
| ZeroInvariant()       | Error thrown when the calculated invariant is zero, indicating an issue with the invariant calculation |

## Enumerable Map
| Error           | Comment                                         |
| --------------- | ----------------------------------------------- |
| IndexOutOfBounds() | An index is beyond the current bounds of the set |
| KeyNotFound()   | This error is thrown when attempting to retrieve an entry that is not present in the map |

## (Transient) Enumerable Set

| Error           | Comment                                         |
| --------------- | ----------------------------------------------- |
| IndexOutOfBounds() | An index is beyond the current bounds of the set |
| ElementNotFound()   | An element that is not present in the set |

## ReentrancyGuardTransient
| Error           | Comment                                         |
| --------------- | ----------------------------------------------- |
| ReentrancyGuardReentrantCall() | Unauthorized reentrant call |

## BalancerPoolToken
| Error                         | Comment                                         |
| ----------------------------- | ----------------------------------------------- |
| ERC2612ExpiredSignature(uint256) | Permit deadline has expired |
| ERC2612InvalidSigner(address,address) | Mismatched signature |

## VaultFactory

| Error                 | Comment                                         |
| --------------------- | ----------------------------------------------- |
| VaultAddressMismatch()| The given salt does not match the generated address when attempting to create the Vault |
| InvalidBytecode(string) | The bytecode for the given contract does not match the expected bytecode |

## FactoryWidePauseWindow
| Error                             | Comment                                         |
| --------------------------------- | ----------------------------------------------- |
| PoolPauseWindowDurationOverflow() | The factory deployer gave a duration that would overflow the Unix timestamp |

## PackedTokenBalance
| Error             | Comment                                         |
| ----------------- | ----------------------------------------------- |
| BalanceOverflow() | One of the balances is above the maximum value that can be stored |

## RevertCodec
| Error             | Comment                                         |
| ----------------- | ----------------------------------------------- |
| Result(bytes) | On success of the primary operation in a `quoteAndRevert`,this error is thrown with the return data |
| ErrorSelectorNotFound() | Handle the "reverted without a reason" case (i.e.,no return data) |

## TransientStorageHelpers
| Error             | Comment                                         |
| ----------------- | ----------------------------------------------- |
| TransientIndexOutOfBounds() | An index is out of bounds on an array operation (e.g.,at) |

## ERC20TestToken
| Error             | Comment                                         |
| ----------------- | ----------------------------------------------- |
| ZeroTransfer | A zero value transfer occurred (test tokens revert here to ensure the Vault supports tokens that prohibit zero value transfers) |

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>
