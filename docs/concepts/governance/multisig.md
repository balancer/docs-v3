# Multisig

::: tip Multisig Permissions

The core of Balancer smart contracts are immutable and do not use proxies or other upgrade mechanisms. The Multisig does **not** have custody of, nor control over, funds from liquidity providers that lie inside Balancer Protocol contracts. Balancer V2 was designed so that even if a multisig goes rogue, all the liquidity is safe and can be withdrawn by their rightful owners. Specific permissions can be found in the article below.
:::

## Hierarchical Safe System

As of [BIP-882](https://forum.balancer.fi/t/bip-882-transitioning-onchain-operations-of-the-balancer-dao-to-balancer-onchain-limited/6859), Balancer operates through a hierarchical safe system with clear separation of responsibilities. This structure supports the transition of on-chain operations to [Balancer Onchain Limited](./corporate-structure.md).

### Top-Level Safes

These safes handle governance, treasury management, and high-level operational control.

| Name                      | Address                                                                                                                        | Threshold | Signer Set                                    | Purpose                                               |
|---------------------------|--------------------------------------------------------------------------------------------------------------------------------|-----------|-----------------------------------------------|-------------------------------------------------------|
| DAO Multi-sig             | [0x10A19e7eE7d7F8a52822f6817de8ea18204F2e4f](https://app.safe.global/home?safe=eth:0x10A19e7eE7d7F8a52822f6817de8ea18204F2e4f) | 6/11      | [DAO Signers](#dao-multisig-signer-set)       | DAO administrative permissions                        |
| Treasury Safe             | [0x0EFcCBb9E2C09Ea29551879bd9Da32362b32fc89](https://app.safe.global/home?safe=eth:0x0EFcCBb9E2C09Ea29551879bd9Da32362b32fc89) | 5/7       | [Treasury Council](#treasury-council)         | Main treasury holding all assets and DeFi strategies  |
| Balancer OpCo Ltd Safe    | [0x3B8910F378034FD6E103Df958863e5c684072693](https://app.safe.global/home?safe=eth:0x3B8910F378034FD6E103Df958863e5c684072693) | 3/4       | [Foundation Directors](#foundation-directors) | Operational funding, dividends to Balancer Foundation |
| Balancer Onchain Ltd Safe | [0x16b0056636Fcc85f92C49cD49a24bc519d4A1941](https://app.safe.global/home?safe=eth:0x16b0056636Fcc85f92C49cD49a24bc519d4A1941) | 3/4       | [Foundation Directors](#foundation-directors) | Central hub for on-chain operations, fee collection   |
| BizDev Safe               | [0xF3B4829C8B9E2910C2396538F49a12b0c2475a7e](https://app.safe.global/home?safe=eth:0xF3B4829C8B9E2910C2396538F49a12b0c2475a7e) | 3/5       | [BizDev Team](#bizdev-team)                   | Third-party incentives and partnership funds          |
| Operator Safe             | [0xBeF27037bC6311b96635E5e9Af3A73EBF6Ca8878](https://app.safe.global/home?safe=eth:0xBeF27037bC6311b96635E5e9Af3A73EBF6Ca8878) | 3/5       | [MAXYZ Operator](#operator)                   | Executes on-chain operations                          |

#### Treasury Safe Multi-Chain Deployment

The Treasury Safe is deployed at the same address across multiple chains to hold ecosystem assets and execute DeFi strategies:

| Chain | Address |
|-------|---------|
| Ethereum | [0x0EFcCBb9E2C09Ea29551879bd9Da32362b32fc89](https://app.safe.global/home?safe=eth:0x0EFcCBb9E2C09Ea29551879bd9Da32362b32fc89) |
| Gnosis | [0x0EFcCBb9E2C09Ea29551879bd9Da32362b32fc89](https://app.safe.global/home?safe=gno:0x0EFcCBb9E2C09Ea29551879bd9Da32362b32fc89) |
| Arbitrum | [0x0EFcCBb9E2C09Ea29551879bd9Da32362b32fc89](https://app.safe.global/home?safe=arb1:0x0EFcCBb9E2C09Ea29551879bd9Da32362b32fc89) |

### Operational Multisigs

All operational multisigs use a standardized **1/2 threshold** configuration with:
- Balancer Onchain Ltd Safe (Foundation Directors)
- Operator Safe (MAXYZ Service Provider)

This configuration enables efficient execution with proper oversight.

| Name | Purpose | Chains | Address |
|------|---------|--------|---------|
| Protocol Fees Multisig | Fee collection | [MAINNET](https://app.safe.global/home?safe=eth:0x7c68c42De679ffB0f16216154C996C354cF1161B), [ARBI](https://app.safe.global/home?safe=arb1:0x7c68c42De679ffB0f16216154C996C354cF1161B), [POLYGON](https://app.safe.global/home?safe=matic:0x7c68c42De679ffB0f16216154C996C354cF1161B) | `0x7c68c42De679ffB0f16216154C996C354cF1161B` |
| Mainnet Fee Setter | Default pool owner for Mainnet fees | [MAINNET](https://app.safe.global/home?safe=eth:0xf4A80929163C5179Ca042E1B292F5EFBBE3D89e6) | `0xf4A80929163C5179Ca042E1B292F5EFBBE3D89e6` |
| LM Multisig (Omni-sig) | Gauge management, liquidity mining | [MAINNET](https://app.safe.global/home?safe=eth:0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e) | `0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e` |
| Aura Locker Safe | vlAURA management | [MAINNET](https://app.safe.global/home?safe=eth:0x9a5BDF08a6969A4bDb7724beE3c6d8964BDc0B28) | `0x9a5BDF08a6969A4bDb7724beE3c6d8964BDc0B28` |

### Chain-Specific DAO Multisigs

These multisigs hold administrative permissions on their respective chains, including:

- **Authorizer Admin**: Control over protocol parameters and permissions
- **Gauge Controller**: Adding/removing liquidity gauges for BAL emissions
- **veBAL Allowlisting**: Managing pool eligibility for veBAL voting incentives
- **Protocol Fee Configuration**: Setting swap and yield fee percentages

All chain-specific DAO multisigs use the [DAO Signer Set](#dao-multisig-signer-set) with a 6/11 threshold.

| Chain | Address |
|-------|---------|
| Ethereum | [0x10A19e7eE7d7F8a52822f6817de8ea18204F2e4f](https://app.safe.global/home?safe=eth:0x10A19e7eE7d7F8a52822f6817de8ea18204F2e4f) |
| Arbitrum | [0xaF23DC5983230E9eEAf93280e312e57539D098D0](https://app.safe.global/home?safe=arb1:0xaF23DC5983230E9eEAf93280e312e57539D098D0) |
| Polygon | [0xeE071f4B516F69a1603dA393CdE8e76C40E5Be85](https://app.safe.global/home?safe=matic:0xeE071f4B516F69a1603dA393CdE8e76C40E5Be85) |
| Optimism | [0x043f9687842771b3dF8852c1E9801DCAeED3f6bc](https://app.safe.global/home?safe=oeth:0x043f9687842771b3dF8852c1E9801DCAeED3f6bc) |
| Gnosis | [0x2a5AEcE0bb9EfFD7608213AE1745873385515c18](https://app.safe.global/home?safe=gno:0x2a5AEcE0bb9EfFD7608213AE1745873385515c18) |
| Avalanche | [0x17b11FF13e2d7bAb2648182dFD1f1cfa0E4C7cf3](https://app.safe.global/home?safe=avax:0x17b11FF13e2d7bAb2648182dFD1f1cfa0E4C7cf3) |
| Base | [0xC40DCFB13651e64C8551007aa57F9260827B6462](https://app.safe.global/home?safe=base:0xC40DCFB13651e64C8551007aa57F9260827B6462) |
| Fraxtal | [0x4f22C2784Cbd2B24a172566491Ee73fee1A63c2e](https://safe.mainnet.frax.com/home?safe=fraxtal:0x4f22C2784Cbd2B24a172566491Ee73fee1A63c2e) |
| Mode | [0x4f22C2784Cbd2B24a172566491Ee73fee1A63c2e](https://safe.optimism.io/home?safe=mode:0x4f22C2784Cbd2B24a172566491Ee73fee1A63c2e) |

### Chain-Specific Operational Multisigs

| Name | Chain | Address |
|------|-------|---------|
| Optimism Fees + LM | [OPTIMISM](https://app.safe.global/home?safe=oeth:0x09Df1626110803C7b3b07085Ef1E053494155089) | `0x09Df1626110803C7b3b07085Ef1E053494155089` |
| Gnosis Chain Fees + LM | [GNOSIS](https://app.safe.global/home?safe=gno:0x14969B55a675d13a1700F71A37511bc22D90155a) | `0x14969B55a675d13a1700F71A37511bc22D90155a` |
| Avalanche Ops | [AVAX](https://app.safe.global/home?safe=avax:0x326A7778DB9B741Cb2acA0DE07b9402C7685dAc6) | `0x326A7778DB9B741Cb2acA0DE07b9402C7685dAc6` |
| Base Ops | [BASE](https://app.safe.global/home?safe=base:0x326A7778DB9B741Cb2acA0DE07b9402C7685dAc6) | `0x326A7778DB9B741Cb2acA0DE07b9402C7685dAc6` |
| Fraxtal Ops | [FRAXTAL](https://safe.mainnet.frax.com/home?safe=fraxtal:0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e) | `0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e` |
| Mode Ops | [MODE](https://safe.optimism.io/home?safe=mode:0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e) | `0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e` |

## Context

Since its inception, the long term vision for the Balancer Protocol is to be fully governed by BAL token holders, while token ownership is aimed to be widely spread across the Balancer community.

Protocol governance is a highly complex and rapidly evolving topic. The Balancer community has taken a thoughtful approach to decentralization, with each step taken with due care and learning from others' experiences.

Balancer V2 contracts allow for some tweaking of core protocol parameters. As a placeholder for future on-chain governance, such limited admin powers have been granted to multisigs. The eventual goal remains moving entire governance and execution on-chain.

## Current State of Operations

As of [BIP-882](https://forum.balancer.fi/t/bip-882-transitioning-onchain-operations-of-the-balancer-dao-to-balancer-onchain-limited/6859), all on-chain operational responsibilities have transitioned from the Balancer DAO to Balancer Onchain Limited. This provides:

1. **Legal Clarity**: A formal entity for on-chain operations helps manage regulatory and legal risks
2. **Operational Efficiency**: Centralized operations under a dedicated entity with clear service provider relationships
3. **Enhanced Oversight**: The Treasury Council provides robust checks and balances
4. **Risk Management**: Proper legal structure and self-insurance fund protect participants

Multisigs do NOT have decision-making power. Their role is to enact on-chain the decisions BAL holders make via off-chain voting and assist community members in the governance process.

All Balancer Multisigs are deployed using [Safe](https://safe.global/) (formerly Gnosis Safe), the most battle-tested multisig contract on Ethereum.

The [Balancer Multisig Ops Repo](https://github.com/BalancerMaxis/Multisig-ops) describes all multisigs and operations as well as the external touch-points available.

## Signer Groups

### DAO Multisig Signer Set

The DAO Multisig Signer Set is reserved for major changes to protocol operations and management of treasury funds. **Requires 6/11 signers.**

As of [BIP-907](https://forum.balancer.fi/t/bip-907-dao-multisig-signer-set-update/), the signer set has been updated to reflect current ecosystem participation:

| Signer | Association | Address |
|--------|-------------|---------|
| [0xMaki](https://twitter.com/0xMaki) | LayerZero, AURA, DCV | `0x285b7EEa81a5B66B62e7276a24c1e0F83F7409c1` |
| [Ernesto](https://twitter.com/eboadom) | BGD | `0xA39a62304d8d43B35114ad7bd1258B0E50e139b3` |
| [Mounir](https://twitter.com/mounibec) | Paraswap | `0x0951FF0835302929d6c0162b3d2495A85e38ec3A` |
| [Stefan](https://twitter.com/StefanDGeorge) | Gnosis | `0x9F7dfAb2222A473284205cdDF08a677726d786A0` |
| [bonustrack87](https://twitter.com/bonustrack87) | Snapshot | `0x9BE6ff2A1D5139Eda96339E2644dC1F05d803600` |
| [David Gerai](https://twitter.com/davgarai) | Raft | `0xAc1aA53108712d7f38093A67d380aD54B562a650` |
| [gosuto](https://twitter.com/gosaborern) | Balancer Contributor | `0x11e450c72c2258ec792d5f64a263ecb18e8c0f06` |
| [elbagococina](https://twitter.com/elbagococina) | Karpatkey | `0x6578183A203b41C419b93DF9121b5e3b26561aC5` |
| [netto.eth](https://twitter.com/nettofc) | Blockful/ENS | `0x235f00a6e9416b114780f0b97afcb40f623f65b4` |
| [MikeB](https://twitter.com/MikeB_Eng) | former Balancer Maxis | `0xF01Cc7154e255D20489E091a5aEA10Bc136696a8` |
| [hubert](https://twitter.com/hubert_LL) | StakeDAO | `0x02e4De712d99f4B1b1e12aa3675D8b0A582caA5D` |

Beyond current signers, [BIP-16](https://forum.balancer.fi/t/bip-16-update-dao-Multisig-replacement-list/3361) established a group of backup signers who can replace current signers without further governance.

### Treasury Council

The Treasury Council oversees the Treasury Safe and administers the self-insurance fund. Established by [BIP-882](https://forum.balancer.fi/t/bip-882-transitioning-onchain-operations-of-the-balancer-dao-to-balancer-onchain-limited/6859), it replaces the previous Ecosystem Council. **Requires 5/7 signers.**

| Member | Address |
|--------|---------|
| 0xDanko | `0x122AFb4667C5f80e45721a42C7c81e9140C62FA4` |
| Xeonus | `0xaa5af0dd9c52c773d36cdbc509a0b2a1ded4c196` |
| danielmk | `0x606681E47afC7869482660eCD61bd45B53523D83` |
| mendesfabio | `0x90347b9CC81a4a28aAc74E8B134040d5ce2eaB6D` |
| solarcurve | `0x512fce9B07Ce64590849115EE6B32fd40eC0f5F3` |
| gosuto | `0x11e450c72c2258ec792d5f64a263ecb18e8c0f06` |
| notsoformal | `0xd17a9f089862351af82fa782435fac0f9e17786c` |

The Treasury Council has authority to:
- Object to Corporate Resolutions or activities not deemed in the ecosystem's best interests
- Oversee distributions, liquidations, or other material actions proposed by Directors
- Ensure alignment with Balancer governance resolutions
- Administer the self-insurance fund

### Foundation Directors

Foundation Directors control the Balancer OpCo Ltd Safe and Balancer Onchain Ltd Safe. **Requires 3/4 signers.**

The Foundation board consists of:
- **Leeward Management Limited** - Corporate director appointed per [BIP-480](https://forum.balancer.fi/t/bip-480-appointment-of-director-to-the-balancer-foundation/5362)
- Two community directors representing the Balancer ecosystem

### BizDev Team

The BizDev Team manages incentive funds and partnerships through the BizDev Safe. **Requires 3/5 signers.**

| Member | Address |
|--------|---------|
| Simon | `0xc57b29CAc1a1CD4E8e678622D35459c4AF6F8b9c` |
| Zekraken | `0xafFC70b81D54F229A5F50ec07e2c76D2AAAD07Ae` |
| Marcus BLabs | `0xb7364Fca20EEC90f51b158C05199044AD362b675` |
| Danko | `0x122AFb4667C5f80e45721a42C7c81e9140C62FA4` |
| Xeonus | `0x7019Be4E4eB74cA5F61224FeAf687d2b43998516` |

### Operator

The Operator Safe is a **3/5 multisig** currently managed by [MAXYZ](https://forum.balancer.fi/t/maxyz-flawless-onchain-execution/6851), a service provider engaged by Balancer Onchain Limited. The Operator executes on-chain operations through the operational multisigs.

**Safe Address:** `0xBeF27037bC6311b96635E5e9Af3A73EBF6Ca8878` (deployed on all networks where Balancer V3 is active)

The Operator can be exchanged for another service provider if needed—Balancer Onchain Ltd Safe maintains control and can replace the operator through the operational multisig configuration.

## Signer Duties

All signers are expected to sign Ethereum transactions ratifying each decision made by BAL holders through snapshot votes. This signature is expected within two weeks after the snapshot vote concludes. Signers are encouraged to sign open requests even if they have already reached quorum to signal their liveliness.

A signer shall lose their role (by action of the remaining multisig signers) in case they:

- Act against BAL token holders' off-chain voting
- Go through 3 months or 2 votes (whichever takes longer) without performing any signer duties

## Multisig Powers

Balancer V2 and V3 have different governance models reflecting their maturity and deployment strategies.

### Balancer V2 Powers

V2 smart contracts grant specific powers to an "admin" address, which points to the appropriate multisig (typically DAO multisigs on established chains).

These powers include:

- Set a share of swap fees to be diverted to the protocol (hard capped at 50% of the swap fee)
- Set a flash loan fee
- Extract from the vault collected protocol fees and/or excess balances (e.g., airdrops), to any destination
- Set the address of the oracle implementation
- Set relayer addresses: relayers are (user opt-in, audited) contracts that can make calls to the vault (with the transaction "sender" being any arbitrary address) and use the sender's ERC20 vault allowance, internal balance or BPTs on their behalf
- Set dynamic-fee controllers: addresses that may change the swap fee for pools created by the dynamic-fee pool factory
- Add and remove veBAL gauges

### Balancer V3 Powers

V3 deployments use a role-based permission system through the Authorizer contract. Admin powers include:

- Configure protocol swap and yield fee percentages
- Set pool creator fee percentages
- Manage pool registration and configuration
- Enable/disable vault query functionality
- Pause/unpause the vault and pools
- Manage hook permissions and configurations

#### Established Chains

On chains with mature V3 deployments (Ethereum, Arbitrum, Base, Gnosis, Avalanche, Optimism), the **DAO Multisig** holds administrative permissions following the standard governance model.

#### Multi-Stage Deployment Framework (Newer Chains)

For newer V3 deployments on emerging chains, Balancer uses a multi-stage deployment approach that initially grants administrative permissions to the **Omni-sig** (`0x9ff471F9f98F42E5151C7855fD1b5aa906b1AF7e`). This enables greater operational flexibility during the critical early phases of deployment.

**Chains using this framework:** Plasma, HyperEVM, Monad, XLayer

| Phase | Duration | Admin Control | Description |
|:------|:---------|:--------------|:------------|
| Phase 1: Technical Deployment | Months 1-2 | Omni-sig | Full technical functionality, frontend integration, initial pool creation |
| Phase 2: Growth & Partnerships | Months 2-8 | Omni-sig | Ecosystem partnerships, TVL growth, protocol integrations |
| Phase 3: BAL Integration | Month 8+ | Transition to DAO Multisig | Gauge system integration, veBAL voting, full governance transition |

**Governance Transition:** Upon successful completion of Phase 2 milestones (typically $15M+ TVL, 5+ protocol integrations, sustained trading volume), the Omni-sig transfers administrative privileges to a newly established DAO multisig following the standard DAO signer set.

**Exit Criteria:** Each phase has clear success metrics. If deployments don't achieve sufficient traction, the DAO can propose to wind down operations rather than proceeding to the next phase.

Example deployment BIPs using this framework:
- [BIP-862: Deploy Balancer v3 on HyperEVM](https://forum.balancer.fi/t/bip-862-deploy-balancer-v3-on-hyperevm/6628)
- [BIP-858: Deploy Balancer v3 on Plasma](https://forum.balancer.fi/t/bip-858-deploy-balancer-v3-on-plasma/6606)
