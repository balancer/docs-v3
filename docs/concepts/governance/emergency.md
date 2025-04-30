# Emergency subDAO

## Concept

The [Emergency DAO](https://dao.curve.fi/emergencymembers) is an idea pioneered by Curve that empowers a small group to
“kill” pools and gauges in the event of malicious activity and/or potential loss of funds. The subDAO is further
authorized to pause pools when needed. The Balancer emergency subDAO was established after the
following [vote](https://vote.balancer.fi/#/proposal/0x63fab7ab9ef5b9579dabb82058b8ea309e39c766d435438b55fff8db7c1f69fd).

## Members

The Balancer Emergency subDAO is a 4-of-7 multisig with the following members as appointed
by [this vote](https://forum.balancer.fi/t/form-the-emergency-subdao/3197):

| Person      | Address                                      |
|:------------|:---------------------------------------------|
| Mike B      | `0xF01Cc7154e255D20489E091a5aEA10Bc136696a8` |
| Zen Dragon  | `0x7c2eA10D3e5922ba3bBBafa39Dc0677353D2AF17` |
| Juani       | `0xB5485e0F543eE6e01e221A57e58ED95268215Ac9` |
| Hypernative | `0x202B1AA0d702898CA474aB6ED31d53BA309308D9` |
| Franz       | `0x89c7D6ABA9Cd18D8A93571E583EEAc58Da75acE6` |
| Daniel      | `0x606681E47afC7869482660eCD61bd45B53523D83` |
| Xeonus      | `0x7019Be4E4eB74cA5F61224FeAf687d2b43998516` |

## Multisigs

The Balancer Emergency subDAO operates through the following multisigs which are authorized to perform emergency actions

| Gauge     | Address                                                                                                                                                                                    |
|:----------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Ethereum  | <span class="address-link">[0xA29F61256e948F3FB707b4b3B138C5cCb9EF9888](https://app.safe.global/home?safe=eth:0xA29F61256e948F3FB707b4b3B138C5cCb9EF9888)</span>                                    |
| Polygon   | <span class="address-link">[0x3c58668054c299bE836a0bBB028Bee3aD4724846](https://app.safe.global/home?safe=matic:0x3c58668054c299bE836a0bBB028Bee3aD4724846)</span>                                 |
| Arbitrum  | <span class="address-link">[0xf404C5a0c02397f0908A3524fc5eb84e68Bbe60D](https://app.safe.global/home?safe=arb1:0xf404C5a0c02397f0908A3524fc5eb84e68Bbe60D)</span>                                     |
| Optimism  | <span class="address-link">[0xd4c87b33afcE39F1E3F4aF1ce8fFFF7241d9128B](https://app.safe.global/home?safe=oeth:0xd4c87b33afcE39F1E3F4aF1ce8fFFF7241d9128B)</span>                         |
| Gnosis    | <span class="address-link">[0xd6110A7756080a4e3BCF4e7EBBCA8E8aDFBC9962](https://app.safe.global/home?safe=gno:0xd6110A7756080a4e3BCF4e7EBBCA8E8aDFBC9962)</span>                                   |
| Avalanche | <span class="address-link">[0x308f8d3536261C32c97D2f85ddc357f5cCdF33F0](https://app.safe.global/transactions/queue?safe=avax:0x308f8d3536261C32c97D2f85ddc357f5cCdF33F0)</span>            |
| zkEVM     | <span class="address-link">[0x79b131498355daa2cC740936fcb9A7dF76A86223](https://zksafe.quickswap.exchange/transactions/queue?safe=zkEVM:0x79b131498355daa2cC740936fcb9A7dF76A86223)</span> |
| Base      | <span class="address-link">[0x183C55A0dc7A7Da0f3581997e764D85Fd9E9f63a](https://app.safe.global/transactions/queue?safe=base:0x183C55A0dc7A7Da0f3581997e764D85Fd9E9f63a)</span>            |
| Fraxtal   | <span class="address-link">[0xC66d0Ba27b8309D27cCa70064dfb40b73DB6de9E](https://safe.mainnet.frax.com/home?safe=fraxtal:0xC66d0Ba27b8309D27cCa70064dfb40b73DB6de9E)</span>                 |
| Mode      | <span class="address-link">[0x66C4b8Ba38a7B57495b7D0581f25784E629516c2](https://safe.optimism.io/home?safe=mode:0x66C4b8Ba38a7B57495b7D0581f25784E629516c2)</span>                         |

## Specifications

As per [this vote](https://forum.balancer.fi/t/form-the-emergency-subdao/3197)

| Call          | Contract(s)                                                                                      | Purpose                                                                              |
|:--------------|:-------------------------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------|
| killGauge     | Gauge contracts                                                                                  | To stop all distribution of BAL to a gauge.                                          |
| denylistToken | [ProtocolFeeWithdrawer](https://etherscan.io/address/0x5ef4c5352882b10893b70DbcaA0C000965bd23c5) | Instructs the ProtocolFeeWithdrawer to blacklist fee collection of a specific token. |

As per [BIP-139](https://forum.balancer.fi/t/bip-139-update-emergency-subdao-permissions/4174)
The Emergency DAO Multisigs are authorized to make the following calls to protocol contracts:

| Call               | Contract(s)            | Purpose                                                                                                                               |
|:-------------------|:-----------------------|:--------------------------------------------------------------------------------------------------------------------------------------|
| enableRecoveryMode | Pool contracts         | for Pools to provide a simple way to exit pools proportionally at the cost of disabling protocol fees(swaps, joins, etc. still work). |
| disable            | Pool factory contracts | to shutdown pool factories. This is to prevent further pools from being created, existing pools remain unaffected.                    |

As per [BIP-353](https://forum.balancer.fi/t/bip-353-grant-permissions-for-composable-stable-pool-factory-v5/4974) the
Emergency DAO multisig are authorized to make the following calls to protocol contracts:

| Call                | Contract(s)    | Purpose                                                        |
|:--------------------|:---------------|:---------------------------------------------------------------|
| disableRecoveryMode | Pool contracts | Remove a pool from recovery mode, restoring normal operations. |

As
per [BIP-794](https://forum.balancer.fi/t/bip-794-enable-composable-stable-pool-pause-functionality-to-hypernative/6306)
the Emergency DAO multisig was further authorized to install safe modules managed by Hypernative to
pause [Balancer v2 composable stable](https://docs-v2.balancer.fi/concepts/pools/composable-stable.html) v6 pools in an
event of an exploit:

| Call  | Contract(s)    | Purpose                                                                     |
|:------|:---------------|:----------------------------------------------------------------------------|
| pause | Pool contracts | Pauses a specific Balancer v2 pool based on the Composable v6 pool factory. |
