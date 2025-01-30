---
title: Liquidity Buffers
order: 9
---

::: info
This page is a work in progress
:::

# ERC4626 Liquidity Buffers

Liquidity Buffers, an internal mechanism of the Vault, facilitate liquidity for pairs of an ERC4626 `asset` (underlying token like DAI) and the ERC4626 Vault Token (like waDAI). The Balancer Vault provides additional liquidity, enabling the entry into the ERC4626 Vault Token positions without the need to wrap or unwrap tokens through the lending protocol, thereby avoiding higher gas costs.

ERC4626 liquidity buffers trade on a `previewDeposit` & `previewMint` basis. Meaning given an amount of 100 DAI, the liquidity buffer gives out waDAI based on the return value from `previewDeposit(100 DAI)`.

A significant benefit of the Vault's liquidity buffers is that Liquidity Providers (LPs) can now provide liquidity in positions of [100% boosted pools](/concepts/explore-available-balancer-pools/boosted-pool.html) (two yield-bearing assets) while simultaneously adding gas efficient batch swap routes.

It's important to note that ERC4626 liquidity buffers are not Balancer Pools. They are a concept internal to the Vault and only function with tokens that comply with the ERC4626 Standard.

:::info
If your organization is a DAO and you're seeking to enhance liquidity for your ERC4626 compliant token, Balancer's ERC4626 liquidity buffers can be a valuable tool. By providing POL to these buffers, you can enable LPs of your token to gain increased access to yield-bearing tokens. This arrangement allows LPs to concentrate on [boosted pools](/concepts/explore-available-balancer-pools/boosted-pool.html), while your DAO contributes POL to the buffer.
:::

## Adding liquidity to a buffer

Liquidity can be added to a buffer for a specific token pair. Buffers must be initialized before use, by invoking the `initializeBuffer` function in the [Buffer Router](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/BufferRouter.sol). Initialization is the only operation that can be done "unbalanced," and sets the initial proportions of wrapped and underlying tokens. Thereafter, liquidity can only be added and removed proportionally. This is for simplicity and security reasons, as allowing ongoing unbalanced adds/removes would mean supporting implicit wrap/unwrap operations (in the same way unbalanced liquidity operations on pools involve an implicit swap).

it is strongly recommended to initialize ERC4626 buffers _before_ deploying any pools with corresponding wrapped tokens. To ensure the pools work as intended, buffers should be created and funded by sponsors prior to deploying pools designed to use them.

Note that from an economic perspective, there is no intrinsic benefit to being an LP in a buffer. Buffers aren’t pools, so there are no swap fees, no yield participation (compared to simply HODLing), and no connection to the LM system. Funding them is permissionless, but who would do it?

The general idea is that funding parties would be DAO partners (starting with the Balancer DAO) who are motivated to support the platform and promote use of their protocol or yield-bearing token. Immediate access to Balancer liquidity and gas-efficient trades for community members should be enough to entice DAOs and lending protocols to contribute. They would be potentially sacrificing yield on a relatively small position, in hopes that the UX improvement and gas savings for retail users will attract disproportionately greater trade volume and TVL.

Note also that since buffers are not pools, buffer liquidity is not tokenized. Instead of receiving BPT in return for a buffer deposit, the system calculates buffer "shares," and maintains internal accounting of the total shares issued, and the share balance per LP. An important consequence of this is that these shares cannot be transferred. Only the account (or contract) that added liquidity will be able to remove it, so if a contract is involved in providing liquidity, care must be taken to ensure that contract supports all necessary operations.

Providing liquidity to buffers has no benefit for retail users, who should not be calling these functions. (Accordingly, there is no UI for them.)

```solidity
/**
 * @notice Adds liquidity for the first time to an internal ERC4626 buffer in the Vault.
 * @dev Calling this method binds the wrapped token to its underlying asset internally; the asset in the wrapper
 * cannot change afterwards, or every other operation on that wrapper (add / remove / wrap / unwrap) will fail.
 * To avoid unexpected behavior, always initialize buffers before creating or initializing any pools that contain
 * the wrapped tokens to be used with them.
 *
 * @param wrappedToken Address of the wrapped token that implements IERC4626
 * @param exactAmountUnderlyingIn Amount of underlying tokens that will be deposited into the buffer
 * @param exactAmountWrappedIn Amount of wrapped tokens that will be deposited into the buffer
 * @param minIssuedShares Minimum amount of shares to receive from the buffer, expressed in underlying token
 * native decimals
 * @return issuedShares the amount of tokens sharesOwner has in the buffer, denominated in underlying tokens
 * (This is the BPT of the Vault's internal ERC4626 buffer.)
 */
function initializeBuffer(
    IERC4626 wrappedToken,
    uint256 exactAmountUnderlyingIn,
    uint256 exactAmountWrappedIn,
    uint256 minIssuedShares
) external returns (uint256 issuedShares);
```

Thereafter, additional liquidity can be added by invoking the `addLiquidityToBuffer` function in the [Buffer Router](https://github.com/balancer/balancer-v3-monorepo/blob/main/pkg/vault/contracts/BufferRouter.sol), where you designate the ERC4626 Token as the buffer reference. Note that for security reasons, liquidity can only be added (or removed) proportionally. It's important to note that a buffer can still function with zero liquidity. It can be used to wrap and unwrap assets, meaning that even an empty buffer can facilitate swaps through the Vault.

```solidity
/**
 * @notice Adds liquidity proportionally to an internal ERC4626 buffer in the Vault.
 * @dev Requires the buffer to be initialized beforehand. Restricting adds to proportional simplifies the Vault
 * code, avoiding rounding issues and minimum amount checks. It is possible to add unbalanced by interacting
 * with the wrapper contract directly.
 *
 * @param wrappedToken Address of the wrapped token that implements IERC4626
 * @param maxAmountUnderlyingIn Maximum amount of underlying tokens to add to the buffer. It is expressed in
 * underlying token native decimals
 * @param maxAmountWrappedIn Maximum amount of wrapped tokens to add to the buffer. It is expressed in wrapped
 * token native decimals
 * @param exactSharesToIssue The amount of shares that `sharesOwner` wants to add to the buffer, in underlying
 * token decimals
 * @return amountUnderlyingIn Amount of underlying tokens deposited into the buffer
 * @return amountWrappedIn Amount of wrapped tokens deposited into the buffer
 */
function addLiquidityToBuffer(
    IERC4626 wrappedToken,
    uint256 maxAmountUnderlyingIn,
    uint256 maxAmountWrappedIn,
    uint256 exactSharesToIssue
) external returns (uint256 amountUnderlyingIn, uint256 amountWrappedIn);
```

## Removing liquidity from a buffer

After you've added liquidity to a buffer, you have the option to remove a specified amount based on the share amount. This is done by invoking the function `removeLiquidityFromBuffer` on the Vault. This function will subsequently burn a specified amount of your bufferShares and return the corresponding amount of tokens that you had previously provided.

Note that in contrast to adding liquidity, removing liquidity depends critically on knowing the identity of the sender - otherwise, a malicious actor could withdraw liquidity belonging to another address. Since the Router must be trusted to send the correct sender to the Vault, removing liquidity through the Router would require governance to grant permission to that Router to perform the operation. This is not ideal, as it's a potential vector to lock funds (if governance revoked the permission), or even steal funds (if governance approved a malicious Router).

In order to keep it permissionless, `removeLiquidityFromBuffer` was moved to the Vault, where it can be called directly (with no ambiguity about the sender), avoiding this issue.

```solidity
/**
 * @notice Removes liquidity from an internal ERC4626 buffer in the Vault.
 * @dev Only proportional exits are supported, and the sender has to be the owner of the shares.
 * This function unlocks the Vault just for this operation; it does not work with a Router as an entrypoint.
 *
 * Pre-conditions:
 * - The buffer needs to be initialized.
 * - sharesOwner is the original msg.sender, it needs to be checked in the Router. That's why
 *   this call is authenticated; only routers approved by the DAO can remove the liquidity of a buffer.
 * - The buffer needs to have some liquidity and have its asset registered in `_bufferAssets` storage.
 *
 * @param wrappedToken Address of the wrapped token that implements IERC4626
 * @param sharesToRemove Amount of shares to remove from the buffer. Cannot be greater than sharesOwner's total shares. It is expressed in underlying token native decimals
 * @param minAmountUnderlyingOutRaw Minimum amount of underlying tokens to receive from the buffer. It is expressed in underlying token native decimals
 * @param minAmountWrappedOutRaw Minimum amount of wrapped tokens to receive from the buffer. It is expressed in
 * wrapped token native decimals
 * @return removedUnderlyingBalanceRaw Amount of underlying tokens returned to the user
 * @return removedWrappedBalanceRaw Amount of wrapped tokens returned to the user
 */
function removeLiquidityFromBuffer(
    IERC4626 wrappedToken,
    uint256 sharesToRemove,
    uint256 minAmountUnderlyingOutRaw,
    uint256 minAmountWrappedOutRaw
) external returns (uint256 removedUnderlyingBalanceRaw, uint256 removedWrappedBalanceRaw);
```

## Using a buffer to swap.

The swapper has the responsibility to decide whether a specific swap route should use Buffers by indicating if a given `pool` is a buffer. Remember: You can always use a buffer even it is does not have liquidity (instead it will simply wrap or unwrap). This is done by setting the boolean entry in the `SwapPathStep` struct.

The `pool` param in this particular case is the wrapped Tokens entrypoint, meaning the address on which the user would call deposit. In the case of Aave, this would be waUSDC.

```solidity
struct SwapPathStep {
    address pool;
    IERC20 tokenOut;
    // If true, pool is an ERC4626 buffer. Used to wrap/unwrap tokens if pool doesn't have enough liquidity.
    bool isBuffer;
}
```

The availability of sufficient liquidity in the buffer affects the gas cost of the swap. If the buffer lacks enough liquidity, the gas cost increases. This is because the Vault has to get the additional liquidity from the lending protocol, which involves either depositing into or withdrawing from it.

Buffers aim to streamline the majority of trades by eliminating the need to wrap or unwrap the swapper's tokens. Instead, they route these tokens through the Balancer trade paths.

In the case of trading DAI to USDC via (DAI-waDAI Buffer, waDAI - waUSDC Boosted pool, USDC-waUSDC Buffer) for a 3 hop trade the `SwapPathExactAmountIn` would look like:

```solidity
struct SwapPathExactAmountIn {
        IERC20 tokenIn;
        // For each step:
        // If tokenIn == pool, use removeLiquidity SINGLE_TOKEN_EXACT_IN.
        // If tokenOut == pool, use addLiquidity UNBALANCED.
        SwapPathStep[] steps;
        uint256 exactAmountIn;
        uint256 minAmountOut;
    }
```

```solidity
SwapPathExactAmountIn({
    tokenIn: address(DAI),
    steps: [
        SwapPathStep({
            pool: address(waDAI), // the address where the Vault calls `deposit` or `mint` depending on SWAP_TYPE and Buffer liquidity
            tokenOut: IERC20(address(waDAI)),
            isBuffer: true
        }),
        SwapPathStep({
            pool: address(boostedPool)
            tokenOut: IERC20(address(waUSDC)),
            isBuffer: false
        }),
        SwapPathStep({
            pool: address(waUSDC)
            tokenOut: IERC20(address(USDC)),
            isBuffer: true
        })
    ],
    exactAmountIn: uint256(myExactAmountIn) // your defined amount
    minAmountOut: uint256(myMinAmountOut) // your calculated min amount out
})
```

The trade will execute regardless of whether the Buffer has enough liquidity or not. Remember: If the buffer does not have enough liquidity it will simply additionally wrap or unwrap (and incur additional gas cost).

### Swapping DAI to USDC via 3 hops.

Let's consider a swap from 10k DAI to USDC. The exchangeRate of 1waDAI - DAI is 1.1 & exchangeRate for waUSDC - USDC is 1.1. Involved pools & Buffers are:

- DAI - waDAI Buffer
- waDAI - waUSDC Boosted Pool (100% boosted)
- USDC - waUSDC Buffer

Considering these three pools only, the way to swap through them is via a `swapExactIn` operation on the BatchRouter.

1. Swap DAI to waDAI via the DAI - waDAI Buffer
2. Swap waDAI to waUSDC via the waDAI - waUSDC 100% Boosted pool
3. swap waUSDC to USDC via the USDC - waUSDC Buffer

#### Balances with enough buffer liquidity available

Balances of pool & buffers before the batch swap:

| DAIBufferBalance before Swap | DAIBufferBalance after Swap                          | waDAIBufferBalance before Swap | waDAIBufferBalance after Swap                                |
| ---------------------------- | ---------------------------------------------------- | ------------------------------ | ------------------------------------------------------------ |
| 110k DAI                     | 120k DAI <span style="color:green">(+10k DAI)</span> | 91k waDAI                      | 81909.1 waDAI <span style="color:red">(-9090.9 waDAI)</span> |

| BoostedPool waDAI Balance before Swap | BoostedPool waDAI Balance after Swap                            | BoostedPool waUSDC Balance before Swap | BoostedPool waUSDC Balance after Swap                           |
| ------------------------------------- | --------------------------------------------------------------- | -------------------------------------- | --------------------------------------------------------------- |
| 900k waDAI                            | 909090.9 waDAI <span style="color:green">(+9090.9 waDAI)</span> | 900k waUSDC                            | 890909.1 waUSDC <span style="color:red">(-9090.9 waUSDC)</span> |

| USDCBufferBalance before Swap | USDCBufferBalance after Swap                          | waUSDCBufferBalance before Swap | waUSDCBufferBalance after Swap                                    |
| ----------------------------- | ----------------------------------------------------- | ------------------------------- | ----------------------------------------------------------------- |
| 100k USDC                     | 90000 USDC <span style="color:red">(-10k USDC)</span> | 91k waUSDC                      | 100090.9 waUSDC <span style="color:green">(+9090.9 waUSDC)</span> |

#### Balances without enough buffer liquidity available in DAI - waDAI buffer

Consider now an EXACT_IN trade of 60k DAI to USDC. The DAI - waDAI buffer does not have enough liquidity to support the trade from its reserves, so it calls into the waDAI contract to wrap DAI to waDAI (amount) and additionally rebalances the buffer to balanced reserves. The exchangeRate of 1waDAI - DAI is 1.1 & exchangeRate for waUSDC - USDC is 1.1.

With the incoming 60000 DAI the buffer wraps 63000 DAI in total as it:

- Needs to give out 54545 waDAI to faciliate the 60k USDC out trade eventually
- Needs to be balances based on the 1 waDAI = 1.1 DAI exchange rate

Wrapping 63000 DAI gives 57272 waDAI out. The final waDAIBufferBalances after the swap are calculated as 40000 initialBalance + 57272 waDAI from wrapping - 54545 waDAI to faciliate the trade.

| DAIBufferBalance before Swap | DAIBufferBalance after Swap                          | waDAIBufferBalance before Swap | waDAIBufferBalance after Swap                              |
| ---------------------------- | ---------------------------------------------------- | ------------------------------ | ---------------------------------------------------------- |
| 50k DAI                      | 47000 DAI <span style="color:red">(-3000 DAI)</span> | 40k waDAI                      | 42727 waDAI <span style="color:green">(+2727 waDAI)</span> |

| BoostedPool waDAI Balance before Swap | BoostedPool waDAI Balance after Swap                               | BoostedPool waUSDC Balance before Swap | BoostedPool waUSDC Balance after Swap                              |
| ------------------------------------- | ------------------------------------------------------------------ | -------------------------------------- | ------------------------------------------------------------------ |
| 900k waDAI                            | 954545.45 waDAI <span style="color:green">(+54545.45 waDAI)</span> | 900k waUSDC                            | 845454.55 waUSDC <span style="color:red">(-54545.45 waUSDC)</span> |

| USDCBufferBalance before Swap | USDCBufferBalance after Swap                            | waUSDCBufferBalance before Swap | waUSDCBufferBalance after Swap                                       |
| ----------------------------- | ------------------------------------------------------- | ------------------------------- | -------------------------------------------------------------------- |
| 100k USDC                     | 40000 USDC <span style="color:red">(-60000 USDC)</span> | 91k waUSDC                      | 145545.45 waUSDC <span style="color:green">(+54545.45 waUSDC)</span> |

Even though the DAI - waDAI buffer did not have enough liquidity the trade was successfully routed via Balancer. The difference now is that the Vault utilized the buffer internal wrapping capability to wrap DAI into waDAI & rebalanced itself.

<style scoped>
table {
    display: table;
    width: 100%;
}
</style>
