---
title: Pool Creation
order: 1
---
# Pool Creation

This guide will help you understand pool configuration options and how to use the [v3 pool creation UI](https://pool-creator.balancer.fi/v3)

:::tip
If you encounter any issues or need additional help, please reach out to us on [discord](https://discord.balancer.fi/) or create an issue on [github](https://github.com/balancer/pool-creator/issues/new/choose)
:::

## Configuration Options
The process of creating a pool begins with choosing the configuration

### Network Selection
- You must select a supported network before choosing a pool type
![Switch Network Button](/images/pool-creation/switch-network.png)
- After advancing with the "Next" button, the only way to switch the network is to "Reset Progress"
![Reset Progress](/images/pool-creation/reset-progress.png)

### Pool Type
- Select either a "Weighted" or "Stable" pool type. See more detailed information [here](/concepts/explore-available-balancer-pools/)

### Pool Tokens
- You must choose at least two tokens
- You must have sufficient wallet balance relative to the input amount in order to advance
- If the token is yield-bearing, you may need to use a [rate provider](/partner-onboarding/onboarding-overview/rate-providers.html)
  - If our API contains an approved rate provider review for the token you selected, it will be automatically populated
![Rate Provider](/images/pool-creation/rate-provider.png)
- For weighted pools, you can lock weights so that only unlocked weights are automatically recalculated
![Weight Lock](/images/pool-creation/weight-lock.png)
- For weighted pools, it is important that you enter amounts that are proportional to weight percentage values
![Proportional Weights](/images/pool-creation/proportional-weight.png)

### Pool Parameters
- See detailed information about swap fee percentages [here](/concepts/vault/swap-fee.html)
- Stable pools require an amplification parameter setting. See detailed information [here](/concepts/explore-available-balancer-pools/stable-pool/stable-math.html)
- See more information about pool management [here](/concepts/core-concepts/pool-role-accounts.html)
- When using a pool hook, you have the option to disable unbalanced liquidity operations and/or allow donations
  - If the pool hooks contract sets the `enableHookAdjustedAmounts` flag to `true`, the pool must also set `disableUnbalancedLiquidity` to `true`
  - It is important to understand the permissions related to a given hooks `onRegister` function. For example, the hook could require that the pool set `enableDonations` to `true`
![Pool Hooks Config](/images/pool-creation/pool-hooks-config.png)
### Pool Information
- Pool name and symbol are automatically populated, but you have the option to modify both

## Creation Process
- Click the "Preview Pool" button to open the Pool Creation modal
- After step 1, you cannot close the modal to go back and change configuration options unless you "Reset Progress"
![Reset Creation Progress](/images/pool-creation/reset-creation-progress.png)
- After completing the pool creation process, you will have the option to view your pool on Balancer or create another pool
![Pool Creation Success](/images/pool-creation/creation-success.png)

:::tip
- Your pool may take a few minutes to show on [balancer.fi](https://balancer.fi/pools)
- If you used a rate provider that has not been reviewed, your pool will not show on [balancer.fi](https://balancer.fi/pools) 
:::