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

## IERC20Multitoken

| Error            | Comment                                         |
| ---------------- | ----------------------------------------------- |
| TotalSupplyTooLow| The total supply of a pool token can't be lower than the absolute minimum |

## IRouter

| Error          | Comment                                         |
| -------------- | ----------------------------------------------- |
| EthTransfer    | Incoming ETH transfer from an address that is not WETH |
| InsufficientEth| The amount of ETH paid is insufficient to complete this operation |
| ExitBelowMin   | The actual bptAmountOut is below the minimum limit specified in the exit |
| SwapDeadline   | The swap transaction was not mined before the specified deadline timestamp |

## IVaultErrors

| Error                           | Comment                                         |
| ------------------------------- | ----------------------------------------------- |
| PoolAlreadyRegistered(address)  | A pool has already been registered. `registerPool` may only be called once |
| PoolAlreadyInitialized(address) | A pool has already been initialized. `initialize` may only be called once |
| PoolNotRegistered(address)      | A pool has not been registered |
| PoolNotInitialized(address)     | A referenced pool has not been initialized |
| TokenAlreadyRegistered(IERC20)  | A token was already registered (i.e., it is a duplicate in the pool) |
| MinTokens()                     | The token count is below the minimum allowed |
| MaxTokens()                     | The token count is above the maximum allowed |
| InvalidToken()                  | Invalid tokens (e.g., zero) cannot be registered |
| InvalidTokenType()              | The token type given in a TokenConfig during pool registration is invalid |
| InvalidTokenConfiguration()     | The data in a TokenConfig struct is inconsistent or unsupported |
| TokensMismatch(address, address, address) | The token list passed into an operation does not match the pool tokens in the pool |
| BalanceNotSettled()            | A transient accounting operation completed with outstanding token deltas |
| WrongLocker(address, address)  | In transient accounting, a locker is attempting to execute an operation out of order |
| NoLocker()                     | A user called a Vault function (swap, add/remove liquidity) outside the lock context |
| LockerOutOfBounds(uint256)     | The caller attempted to access a Locker at an invalid index |
| BeforeSwapHookFailed()         | The pool has returned false to the beforeSwap hook, indicating the transaction should revert |
| AfterSwapHookFailed()          | The pool has returned false to the afterSwap hook, indicating the transaction should revert |
| BeforeInitializeHookFailed()   | The pool has returned false to the beforeInitialize hook, indicating the transaction should revert |
| AfterInitializeHookFailed()    | The pool has returned false to the afterInitialize hook, indicating the transaction should revert |
| BeforeAddLiquidityHookFailed() | The pool has returned false to the beforeAddLiquidity hook, indicating the transaction should revert |
| AfterAddLiquidityHookFailed()  | The pool has returned false to the afterAddLiquidity hook, indicating the transaction should revert |
| BeforeRemoveLiquidityHookFailed() | The pool has returned false to the beforeRemoveLiquidity hook, indicating the transaction should revert |
| AfterRemoveLiquidityHookFailed() | The pool has returned false to the afterRemoveLiquidity hook, indicating the transaction should revert |
| RouterNotTrusted()             | An unauthorized Router tried to call a permissioned function (i.e., using the Vault's token allowance) |
| AmountGivenZero()               | The user tried to swap zero tokens |
| CannotSwapSameToken()           | The user attempted to swap a token for itself |
| TokenNotRegistered()            | The user attempted to swap a token not in the pool |
| SwapLimit(uint256, uint256)     | An amount in or out has exceeded the limit specified in the swap request |
| InvalidAddLiquidityKind()       | Add liquidity kind not supported |
| AmountInAboveMax(IERC20, uint256, uint256) | A required amountIn exceeds the maximum limit specified for the operation |
| BptAmountOutBelowMin(uint256, uint256) | The BPT amount received from adding liquidity is below the minimum specified for the operation |
| DoesNotSupportAddLiquidityCustom() | Pool does not support adding liquidity with a customized input |
| InvalidRemoveLiquidityKind()    | Remove liquidity kind not supported |
| AmountOutBelowMin(IERC20, uint256, uint256) | The actual amount out is below the minimum limit specified for the operation |
| BptAmountInAboveMax(uint256, uint256) | The required BPT amount in exceeds the maximum limit specified for the operation |
| DoesNotSupportRemoveLiquidityCustom() | Pool does not support removing liquidity with a customized input |
| ProtocolSwapFeePercentageTooHigh() | Error raised when the protocol swap fee percentage exceeds the maximum allowed value |
| ProtocolYieldFeePercentageTooHigh() | Error raised when the protocol yield fee percentage exceeds the maximum allowed value |
| SwapFeePercentageTooHigh()     | Error raised when the swap fee percentage exceeds the maximum allowed value |
| QueriesDisabled()              | A user tried to execute a query operation when they were disabled |
| PoolInRecoveryMode(address)    | Cannot enable recovery mode when already enabled |
| PoolNotInRecoveryMode(address) | Cannot disable recovery mode when not enabled |
| SenderIsNotVault(address)      | Error indicating the sender is not the Vault (e.g., someone is trying to call a permissioned function) |
| VaultPauseWindowDurationTooLarge() | The caller specified a pause window period longer than the maximum |
| PauseBufferPeriodDurationTooLarge() | The caller specified a buffer period longer than the maximum |
| VaultPaused()                  | A user tried to perform an operation while the Vault was paused |
| VaultNotPaused()               | Governance tried to unpause the Vault when it was not paused |
| VaultPauseWindowExpired()      | Governance tried to pause the Vault after the pause period expired |
| PoolPaused(address)            | A user tried to perform an operation involving a paused Pool |
| PoolNotPaused(address)         | Governance tried to unpause the Pool when it was not paused |
| PoolPauseWindowExpired(address)| Governance tried to pause a Pool after the pause period expired |
| SenderIsNotPauseManager(address) | The caller is not the registered pause manager for the pool |
| UserDataNotSupported()         | Optional User Data should be empty in the current add / remove liquidity kind |
| CannotReceiveEth()             | The contract should not receive ETH |
| NotVaultDelegateCall()         | The Vault extension was called by an account directly; it can only be called by the Vault via delegatecall |
| OperationNotSupported()        | Error thrown when a function is not supported |
| WrongVaultExtensionDeployment()| The vault extension was configured with an incorrect Vault address |
| WrongVaultAdminDeployment()    | The vault admin was configured with an incorrect Vault address |

## WeightedPool

| Error           | Comment                                         |
| --------------- | ----------------------------------------------- |
| MinWeight()     | Indicates that one of the pool tokens' weight is below the minimum allowed |
| NormalizedWeightInvariant() | Indicates that the sum of the pool tokens' weights is not FP 1 |

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
| StableGetBalanceDidNotConverge()| The iterations to calculate the balance didn't converge |

## Weighted 

| Error                 | Comment                                         |
| --------------------- | ----------------------------------------------- |
| MinBPTInForTokenOut() | User Attempted to burn less BPT than allowed for a specific amountOut |
| MaxOutBptForTokenIn() | User attempted to mint more BPT than allowed for a specific amountIn |
| MaxOutRatio()         | User attempted to extract a disproportionate amountOut of tokens from a pool |
| MaxInRatio()          | User attempted to add a disproportionate amountIn of tokens to a pool |
| ZeroInvariant()       | Error thrown when the calculated invariant is zero, indicating an issue with the invariant calculation |

## Enumerable Map
| Error           | Comment                                         |
| --------------- | ----------------------------------------------- |
| IndexOutOfBounds() | An index is beyond the current bounds of the set |
| KeyNotFound()   | This error is thrown when attempting to retrieve an entry that is not present in the map |

## Enumerable Set

| Error           | Comment                                         |
| --------------- | ----------------------------------------------- |
| IndexOutOfBounds() | An index is beyond the current bounds of the set |
| ElementNotFound()   | An element that is not present in the set |

## BalancerPoolToken
| Error                         | Comment                                         |
| ----------------------------- | ----------------------------------------------- |
| ERC2612ExpiredSignature(uint256) | Permit deadline has expired |
| ERC2612InvalidSigner(address, address) | Mismatched signature |

## VaultFactory

| Error                 | Comment                                         |
| --------------------- | ----------------------------------------------- |
| VaultAlreadyCreated() | Vault has already been deployed, so this factory is disabled |
| VaultAddressMismatch()| The given salt does not match the generated address when attempting to create the Vault |

## ERC4626BufferPoolFactory

| Error                             | Comment                                         |
| --------------------------------- | ----------------------------------------------- |
| IncompatibleWrappedToken(address) | The wrapped token does not conform to the Vault's requirement for ERC4626-compatibility |

## FactoryWidePauseWindow
| Error                             | Comment                                         |
| --------------------------------- | ----------------------------------------------- |
| PoolPauseWindowDurationOverflow() | The factory deployer gave a duration that would overflow the Unix timestamp |

## PackedTokenBalance
| Error             | Comment                                         |
| ----------------- | ----------------------------------------------- |
| BalanceOverflow() | One of the balances is above the maximum value that can be stored |





<style scoped>
table {
    display: table;
    width: 100%;
}
</style>
