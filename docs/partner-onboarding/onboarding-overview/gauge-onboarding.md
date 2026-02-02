---
title: Gauge Onboarding
order: 3
---

# Gauge Onboarding

A gauge is a staking contract that enables token rewards to flow to liquidity providers of a pool. Gauges are required for **both** BAL emissions and secondary reward token incentives. Pools do not automatically have gauges—they must be created first.

## Which Path Do You Need?

| Goal | Steps Required |
|------|----------------|
| **Secondary rewards only** | Complete [Step 1](#step-1-create-the-gauge) (gauge creation), then follow the [Incentive Management Guide](./incentive-management.md) |
| **BAL emissions** | Complete all steps in this guide (Steps 1-6), including governance approval |
| **Both BAL + secondary rewards** | Complete all steps in this guide, then add secondary rewards via the [Incentive Management Guide](./incentive-management.md) |

:::tip
If you only need to distribute your own reward tokens (not BAL), you can skip the governance process. Simply create the gauge and proceed directly to the [Incentive Management Guide](./incentive-management.md) to configure secondary rewards.
:::

## Prerequisites

Before starting the gauge onboarding process, ensure:

1. Your pool is deployed and indexed (visible on the [Balancer App](https://balancer.fi))
2. Rate providers are vetted (if applicable) - see [Rate Provider Registry](https://github.com/balancer/code-review/tree/main/rate-providers)
3. You understand [gauge caps](#gauge-caps) and have determined the appropriate cap for your pool

## Step 1: Create the Gauge

Use the [Gauge Creator Tool](https://balancer.defilytica.tools/gauge-creator) to deploy your gauge contracts.

### Ethereum Mainnet Pools

1. Select "Ethereum" on the gauge creator
2. Search and select your pool from the pool list
   ![Select Pool](/images/incentive-management/gauge_creation_1.png)
3. If a gauge has already been created for your pool, the UI will display a warning - you can skip this step
   ![Gauge Already Exists](/images/incentive-management/gauge_creation_4.png)
4. Choose an appropriate [voting cap](#gauge-caps) (2% to uncapped)
5. Execute the transaction by clicking "Create Mainnet Gauge"
6. **Note down the root gauge address** - it will appear in the event logs and in the UI after successful transaction
   ![Creation Event](/images/incentive-management/gauge_creation_5.png)

For mainnet, only the root gauge is needed.

### L2/Sidechain Pools

For pools on Arbitrum, Polygon, Gnosis, and other L2 networks:

1. **Create the Child Chain Gauge first:**
   - Select the target network on the gauge creator
   - Search and select your pool from the pool list
   - The tool will indicate if a child chain gauge already exists for this pool
   - Execute the child chain gauge creation transaction

2. **Create the Root Gauge on Ethereum Mainnet:**
   - Switch to Ethereum on the gauge creator
   - Create a root gauge pointing to your child chain gauge
   - Choose an appropriate [voting cap](#gauge-caps)
   - **Note down the root gauge address** - this is needed for the governance proposal

:::tip
The child chain gauge handles staking on the L2, while the root gauge on Ethereum is what veBAL voters interact with. Only the root gauge address is needed for your proposal.
:::

## Step 2: Create the Enable Gauge Payload

Before submitting your governance proposal, create the technical payload that will be executed upon approval.

1. Go to the [Enable Gauge Payload Builder](https://balancer.defilytica.tools/payload-builder/enable-gauge)
2. Enter the following:
   - **Root Gauge**: The root gauge contract address from Ethereum Mainnet
   - **Network**: The chain where your pool is deployed
3. Click "Generate Payload" and validate it by simulating the transaction
4. **Copy the Technical Specification** - you'll need this for your forum proposal
5. **Create the PR**: Log in with your GitHub account and submit the PR directly from the tool

:::info
The payload builder generates the exact technical specification text that should be included in your forum proposal, ensuring consistency and accuracy.
:::

## Step 3: Write Your Governance Proposal

Create a proposal on the [Balancer Forum](https://forum.balancer.fi) under the BAL gauges [category](https://forum.balancer.fi/c/vebal/13).

### Proposal Template

Copy the template below and fill in the placeholders (marked with `[PLACEHOLDER]`). The technical specification should be copied from the [Enable Gauge Payload Builder](https://balancer.defilytica.tools/payload-builder/enable-gauge).

#### For Mainnet Pools

```md
# [Proposal] Enable Gauge for [POOL_SYMBOL] on Ethereum

**Summary:**

This is a proposal to enable the gauge `[ROOT_GAUGE_ADDRESS]` on Ethereum,
for the pool `[POOL_ADDRESS]` ([POOL_SYMBOL]).

**References/Useful links:**

- Website: [URL]
- Documentation: [URL]
- Github Page: [URL]
- Communities: [URL]
- Other useful links: [URL]

**Protocol Description:**

[Describe the proposed asset(s), the corresponding protocol(s), and historic
prices of the token. Price must come from the source of highest liquidity.]

**Motivation:**

[Explain why this pool needs incentivization.]

**Specifications:**

**Governance:** [Provide current information on the protocol's governance
structure. Provide links to any admin and/or multisig addresses, and describe
the powers afforded to these addresses. If there are plans to change the
governance system in the future, please explain.]

**Oracles:** [Does the protocol rely on external oracles? If so, provide
details about the oracles and their implementation in the protocol.]

**Audits:** [Provide links to audit reports and any relevant details about
security practices.]

**Centralization vectors:** [Is there any component of the protocol that has
centralization vectors? E.g. if only 1 dev manages the project, that is a
centralized vector. If price oracles need to be updated by a bot, that is a
centralized vector. If liquidations are done by the protocol, that is also
a centralization vector.]

**Market History:** [Has the asset observed severe volatility? In the case
of stablecoins, has it depegged? In the case of an unpegged asset, have there
been extreme price change events in the past? Provide specific information
about the Balancer pool: how long has it been active, TVL, historical volume?
**You must provide a direct link to the pool AND a link to your pool's gauge.**]

**Value:** [Is this pool intended to be the primary source of liquidity for
the token(s)? If this is not the case, explain the expected value add to
Balancer (can this pool generate consistent fees?)]

**Technical Specification:**

[PASTE_TECHNICAL_SPEC_FROM_PAYLOAD_BUILDER]
```

#### For L2/Sidechain Pools

```md
# [Proposal] Enable Gauge for [POOL_SYMBOL] on [NETWORK]

**Summary:**

This is a proposal to enable the root gauge `[ROOT_GAUGE_ADDRESS]` on Ethereum,
which redirects rewards to the child gauge `[CHILD_GAUGE_ADDRESS]` on [NETWORK],
for the pool `[POOL_ADDRESS]` ([POOL_SYMBOL]).

**References/Useful links:**

- Website: [URL]
- Documentation: [URL]
- Github Page: [URL]
- Communities: [URL]
- Other useful links: [URL]

**Protocol Description:**

[Describe the proposed asset(s), the corresponding protocol(s), and historic
prices of the token. Price must come from the source of highest liquidity.]

**Motivation:**

[Explain why this pool needs incentivization.]

**Specifications:**

**Governance:** [Provide current information on the protocol's governance
structure. Provide links to any admin and/or multisig addresses, and describe
the powers afforded to these addresses. If there are plans to change the
governance system in the future, please explain.]

**Oracles:** [Does the protocol rely on external oracles? If so, provide
details about the oracles and their implementation in the protocol.]

**Audits:** [Provide links to audit reports and any relevant details about
security practices.]

**Centralization vectors:** [Is there any component of the protocol that has
centralization vectors? E.g. if only 1 dev manages the project, that is a
centralized vector. If price oracles need to be updated by a bot, that is a
centralized vector. If liquidations are done by the protocol, that is also
a centralization vector.]

**Market History:** [Has the asset observed severe volatility? In the case
of stablecoins, has it depegged? In the case of an unpegged asset, have there
been extreme price change events in the past? Provide specific information
about the Balancer pool: how long has it been active, TVL, historical volume?
**You must provide a direct link to the pool AND a link to your pool's gauge.**]

**Value:** [Is this pool intended to be the primary source of liquidity for
the token(s)? If this is not the case, explain the expected value add to
Balancer (can this pool generate consistent fees?)]

**Technical Specification:**

[PASTE_TECHNICAL_SPEC_FROM_PAYLOAD_BUILDER]
```

:::tip
The technical specification is automatically generated by the [Enable Gauge Payload Builder](https://balancer.defilytica.tools/payload-builder/enable-gauge). Simply copy and paste it into the Technical Specification section of your proposal.
:::

## Step 4: Community Discussion

After posting your proposal:
- Allow time for community discussion and feedback
- **Recommended discussion period**: 1 week (common practice)
- Address any questions or concerns raised by community members
- See [Governance Guidelines](https://forum.balancer.fi/t/governance-guidelines) for detailed timelines

## Step 5: Request Snapshot Vote

When discussion is complete:
1. Request a vote by replying to your forum thread
2. **Deadline**: Proposals meeting all requirements by **Thursday 8PM CET** are included in the next snapshot round

### Voting and Execution Schedule
- Snapshot votes begin every **Friday 8PM CET**
- Voting period concludes the following Tuesday 8PM CET
- Gauges are added to the gauge controller by Wednesday of vote conclusion

### Emissions Timeline
- **Mainnet gauges**: Emissions can begin after successful vote once the payload is executed
- **L2 gauges**: Emissions begin **one week after** a successful vote
  - Example: If voting ends June 8, emissions start June 15

:::warning
Gauges receiving less than 0.1% of total votes may not receive emissions every week due to gas cost considerations.
:::

## Step 6: Post-Approval & Maintenance

### After Approval
Once your proposal passes:
- The MAXYZ service provider executes the payload from your PR
- Your gauge begins receiving BAL emissions based on veBAL votes

### Gauge Monitoring & Kill Conditions

Gauges are evaluated on a quarterly basis per [BIP-795](https://forum.balancer.fi/t/bip-795-kill-stale-gauges-q1-2025/6410). A gauge may be flagged for removal if it meets **both** conditions:
- Has not received veBAL votes for **>60 days**
- Median TVL has been under **$100k USD** for **>60 days**

Check the [Gauge Kill List](https://balancer.defilytica.tools/gauge-kill-list) to see if your gauge is flagged.

:::info
Gauges can also be killed at any time due to externalities. The rules above are meant to keep the system lean and efficient.
:::

### Security Notes
- Balancer's **Emergency subDAO** may disable pools or gauges in case of malicious activity
- **veBAL holders** can vote to disable gauges at any time

## Gauge Caps

Gauge caps limit the maximum percentage of BAL emissions a pool can receive, ensuring efficient incentive distribution across the ecosystem.

Use the [Gauge Cap Calculator](https://docs.google.com/spreadsheets/d/1zKb8x1RqJ5Ap7gXPvYn38U0TwjqAQCzBB62N2d7feto/edit?gid=1999793696#gid=1999793696) to determine the appropriate cap for your pool.

### How Caps Are Calculated

Caps are determined through a two-phase analysis:

**Phase 1: Weight and Market Cap Factors**

*Market Cap Factor:*
```
token mcap factor = mcap (in USD millions) / % weighting
mcapFactor = sqrt(min(token mcap factor))
```

*Overall Factor:*
```
overall factor = mcapFactor^weightFactor
```

**Phase 2: Revenue Factor**

If a pool remains below the threshold after Phase 1, a revenue factor is applied:
- Average percentage of total revenue contributed during the two most recent protocol fee distribution periods
- Bounded between 1 and 100
- Multiplied by the overall factor

### Cap Tiers
Pools below the threshold after both phases undergo mandatory migration to a gauge with one of these caps:
- **2%** cap
- **5%** cap
- **10%** cap
- **Uncapped** (for qualifying pools)

## Checklist

<ClientOnly>
  <Checklist
    :tasks="[
      'Pool is deployed and visible on [Balancer App](https://balancer.fi)',
      'Rate providers are vetted (if applicable)',
      'Gauge created using the [Gauge Creator Tool](https://balancer.defilytica.tools/gauge-creator)',
      'Enable gauge payload created and PR submitted via [Payload Builder](https://balancer.defilytica.tools/payload-builder/enable-gauge)',
      'Forum proposal posted with all required sections',
      'Community discussion period completed (recommended: 1 week)',
      'Snapshot vote requested by Thursday 8PM CET',
    ]"
    storage-key="gauge-onboarding-checklist"
  />
</ClientOnly>

## Resources

- [Gauge Creator Tool](https://balancer.defilytica.tools/gauge-creator)
- [Enable Gauge Payload Builder](https://balancer.defilytica.tools/payload-builder/enable-gauge)
- [Gauge Cap Calculator](https://docs.google.com/spreadsheets/d/1zKb8x1RqJ5Ap7gXPvYn38U0TwjqAQCzBB62N2d7feto/edit?gid=1999793696#gid=1999793696)
- [Balancer Forum - veBAL Category](https://forum.balancer.fi/c/vebal/13)
- [Gauge Kill List](https://balancer.defilytica.tools/gauge-kill-list)
- [BIP-795: Stale Gauge Removal](https://forum.balancer.fi/t/bip-795-kill-stale-gauges-q1-2025/6410)
- [Rate Provider Registry](https://github.com/balancer/code-review/tree/main/rate-providers)
