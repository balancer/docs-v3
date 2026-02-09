# Governance Process

## Summary

The Balancer Governance process has evolved through a number of BIPs as Balancer moves along on its quest towards decentralization. The most recent governance overhaul BIP at the time of this writing is [BIP-163](https://snapshot.org/#/balancer.eth/proposal/0xcd2cab0522b0e9a90ad40f93aca4505b17d60468224c22b69c4f9bd2bbd64e31).

Balancer governance submissions consist of 2 items: an English proposal and a multisig payload that executes the changes described on-chain. [Balancer Onchain Limited](./corporate-structure.md), through its service provider [MAXYZ](https://forum.balancer.fi/t/maxyz-flawless-onchain-execution/6851), is tasked with supporting community members in putting together proposals when required, and with the final evaluation and execution of approved proposals.

Operational support can be reached on the [Balancer Discord](https://discord.balancer.fi/) or through an issue in the [Balancer Multisig Ops Repo](https://github.com/BalancerMaxis/multisig-ops/issues).

![img.png](./images/govProcess.png)

## Governance Timeline

The following timeline requirements apply to different proposal types (per [DAO Governance Guidelines](https://forum.balancer.fi/t/balancer-dao-governance-guidelines/6311)):

### Forum Discussion Periods

| Proposal Type | Minimum Discussion | Submission Deadline |
|---------------|-------------------|---------------------|
| General proposals | 72 hours | Tuesday 20:00 CET |
| Gauge additions | 24 hours | Thursday 20:00 CET |
| Funding proposals | 1 week | 1 week before snapshot |

### Voting Schedule

- **Voting starts**: Friday 20:00 CET
- **Voting ends**: Tuesday 20:00 CET (4 days / 96 hours)
- **Quorum**: 2 million veBAL

### Execution Timeline

| Action Type | Typical Execution |
|-------------|-------------------|
| Gauge activations | Tuesday after successful vote |
| Standard multi-sig execution | End of month (usually last week) |
| Gauge removals | End of month, quarterly basis |

::: warning Funding Proposals
Funding proposals and real-world contracts may require additional review periods and legal sign-off, potentially extending timelines beyond minimum requirements.
:::

## Outline

This page outlines the Balancer Governance Process from Request for Comment \[RFC\] through executing a result.

1. Post a Request for Comment to the forum
2. Facilitate preliminary discussion
3. Update and refine RFC to become a Proposal
4. Snapshot vote
5. Execute result or try again in 30 days

### Step 1: Write Request For Comment \(RFC\)

An initial request for governance is made up of 2 potential components. An English language description of the purpose of the proposal and the details of the changes to be made, and a payload to execute such changes on chain which can be loaded into Safe if on-chain changes are required for execution. When possible, any off-chain changes to code should also have PRs linked in governance.

#### **English Description**

Start a new conversation: [General Proposals](https://forum.balancer.fi/c/governance/7) or [veBAL Gauge additions](https://forum.balancer.fi/c/vebal/13) with the [RFC] tag. The message should contain the following sections.

- **Link to Transaction Payload PR**
  - _The Snapshot body should begin with a link to the transaction payload PR on GitHub. If the text is too long it can be truncated. Note that if the proposal requires no on-chain actions to be executed, the payload is not required._
  - _Note that this link can be added towards the end of the discussion process once the proposal is moving to snapshot._
- **Background and motivation**
  - _What is the current state or what you're addressing?_
  - _What is the reason for this?_
  - _Why is it good for the veBAL ecosystem or the Balancer Protocol?_
  - _Is there any relevant information that the common reader might not know?_
- **English Specification**
  - _Clearly state exactly what this proposal will change and the effects it will have on the operation of the protocol or balance of the treasury._
- **Dependencies(if any)**
  - _What is needed to introduce the change?_
- **Risk assessment**
  - \_What can go wrong? What is the impact of your proposal on the rest of the community, ecosystem, protocol?
    - _For Spend (how does it affect runway)_
    - _For Gauge Votes (consider pool makeup and caps as per the Gauge Framework defined in BIP- and/or community discussion)_
      For other changes explain any and all risks clearly.\_
- **Open Questions**
  - _Any obvious discussions or things you are still considering?_

Further, votes requesting new gauges should include the following information:

* What are the initial fees set to, and what is the reasoning for this?
* If stableswap, how is the A-factor set and why was the given a-factor chosen?
* If custom pool, how does this pool generate revenue? Is 50% of the revenue generated sent to the fees collector? Where can details about the performance of this pool be found? Where can users deposit into it and swap through it?

### **Step 2: Discussion**

- Encourage and participate in discussions on the forum.
- Promote your topics, find voters, get feedback.
  - Consider contacting [Delegates](https://forum.balancer.fi/c/delegate-citadel/14) to obtain their support.
- Encourage interested parties on Discord to gather their thoughts in a forum post
- It is advised that proper time is given for the community to discuss a proposal before bringing it to a Snapshot vote and that the original proposer is open to making changes as part of the discussion process.
- The Operator currently performs initial validation on any submitted snapshots and gets in touch with the proposer if there are issues, inviting them to take down their vote and repost it properly to avoid an end result that cannot be executed due to lack of compliance.

### **Step 3: Develop and validate transaction Pull Request**

**NOTE:** The Operator team is available to build and validate your PR. If you don't want to get involved in the technical details of defining your execution, contact the team on Discord and they will be happy to help. Signers are listed in the [Multisig documentation](./multisig.md).

A Pull Request (PR) that posts a transaction to a Safe multisig which executes the changes specified by the BIP on-chain is required as part of the body of a Proposal specified above before it can be brought to valid snapshot.

The file(s) should be added into their own directory here on the [Multisig Ops Repo](https://github.com/BalancerMaxis/multisig-ops/tree/main/BIPs/00proposed). Once the BIP is ready to go to Snapshot vote and a BIP number is selected, the files will be moved into the [BIPs directory](https://github.com/BalancerMaxis/multisig-ops/tree/main/BIPs) following the apparent pattern there. The description of the pull request should contain a link to the Forum Post with the English Specification of it. The Operator will review the payload and post any concerns or questions in review.

Examples of how to submit payload PRs for common governance quests can be found [HERE](https://github.com/BalancerMaxis/multisig-ops/tree/main/BIPs/00examples)

### **Step 4: Snapshot**

The Snapshot process is started when an address with at least 200,000 veBAL in delegation posts a snapshot to the forum that meets all of the required specifications as defined in [BIP-163](https://forum.balancer.fi/t/bip-163-restructure-governance-process-disband-governance-council/4244).

- The Snapshot body should begin with a link to any required transaction payload PR on GitHub. Followed by the full text of the BIP. If the text is too long, it can be truncated.
- A link to the forum discussion should be included in the discussion (optional) field of Snapshot.
- The BIP is titled like `BIP-[XXX] Title from Forum`, where XXX is the next number in the BIP sequence.
  - The original forum proposer should update their post to match the title from the Snapshot and include a link to it at the bottom of the body of the Forum Post.
- Barring clear community consensus otherwise the vote should be of Type "Basic Voting" and the choices should be one of [Yes, let's do it - No, This is not the way - Abstain].
- Runs for 96 hours (4 days) starting on **Friday 20:00 CET** and concluding **Tuesday 20:00 CET**.
- Has a quorum of 2 million veBAL.
- The linked payload matches the English specification and passes review and is in a recognizable/verifiable form by the Operator.
- The linked payload simulates successfully in Tenderly and/or produces the desired results on fork.

**IMPORTANT:** A Snapshot vote that does not meet all of the above requirements will not be valid even if it wins a majority of the votes. Please take your time when posting Snapshots. Several community members have delegations of over 200k veBAL and would be happy to help you post your Snapshot if you are unsure and it has some community support.

If a Snapshot is approved by governance but rejected for technical reasons, the Operator will help to fix the payload and facilitate a revote to approve.

### Snapshot Governance Configuration

As of [BIP-882](https://forum.balancer.fi/t/bip-882-transitioning-onchain-operations-of-the-balancer-dao-to-balancer-onchain-limited/6859):

- **Space Controller**: Balancer Onchain Ltd Safe ([0x16b0056636Fcc85f92C49cD49a24bc519d4A1941](https://app.safe.global/home?safe=eth:0x16b0056636Fcc85f92C49cD49a24bc519d4A1941))
- **Snapshot Authors**:
  - Operator EOA: `0x58865c1B463Fd2772cD50EB50976A07FaE3Dc6F1`
  - Foundation EOA: `0x122AFb4667C5f80e45721a42C7c81e9140C62FA4`
- **Treasury Display**: Treasury Safe ([0x0EFcCBb9E2C09Ea29551879bd9Da32362b32fc89](https://app.safe.global/home?safe=eth:0x0EFcCBb9E2C09Ea29551879bd9Da32362b32fc89))

### Step 5: Results and Execution

If the vote fails in an approve/reject vote it will not be executed on. Proposers are encouraged to wait at least 30 days and/or until something significant has changed before posting another vote, and delegates with sufficient veBAL to post votes are asked to be considerate about creating governance noise and SPAM by reposting failed votes in rapid succession.

If the vote succeeds or a result has been chosen, follow through to make sure that it is properly executed. Depending on what the vote is about, it may require an action by the [multisig](multisig.md). The Operator is currently responsible for organizing the on-chain execution of governance and is working toward making the process as transparent as possible in the public [Balancer Multisig Ops GitHub Repo](https://github.com/BalancerMaxis/multisig-ops).

Assuming all reviews are finished and dependencies are met, the Operator will make every effort to execute on finished proposals in the same week that governance concludes. Note that in some cases complex BIPs may require more time for final multisigner review.

The Operator will endeavor to post a comment to the Forum post with a link to the execution TX upon execution.
