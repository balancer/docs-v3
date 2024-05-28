---
title: Yield Bearing Thesis
heroText: Yield Bearing Thesis
heroImage: /images/yieldThesis.png
---

# The Yield Bearing Hub

:::info
Balancer is the most attuned decentralised financial technology layer to host yield-bearing assets. Yield-bearing tokens
such as LSTs and interest-bearing stablecoins offer an additional layer of efficiency compared to their vanilla
counterparts. These tokenised assets allow users to gain exposure to both onchain and offchain interest rates,
compounded within a single token. This notion page serves as an information hub that explains why, it details
Balancer’s unique YB PMFs, and also links to case studies and additional resources for partner integrations.
For a full overview of Balancer’s Yield Bearing Thesis, please read the following article.
:::

## Yield-Bearing Token Onboarding FAQ

<FAQList :faqs="faqs"></FAQList>
<script>
export default {
  data() {
    return {
      faqs: [
        {
          question: "What are steps to onboard a yield-bearing token?",
          answer: `
          <ol>
            <li>Whitelist your token by doing a Pull-Request here (Balancer Maxis can assist): <a href="https://github.com/balancer/tokenlists">https://github.com/balancer/tokenlists</a>
              <ul>
                <li>Provide token images and store png files with the token address like 0x123.png</li>
                <li>Update tokenlists/balancer/tokens and the corresponding network typescript file by adding your token address (e.g. tokenlists/balancer/tokens/arbitrum/0x…</li>
              </ul>
            </li>
            <li>You need to have a rate-provider in place. For security reasons and to make sure your rate provider adheres to Balancer’s standards, please initiate a rate provider review here: <a href="https://github.com/balancer/code-review/issues">https://github.com/balancer/code-review/issues</a>
              <ul>
                <li>A registry of already reviewed providers is here: <a href="https://github.com/balancer/code-review/tree/main/rate-providers">https://github.com/balancer/code-review/tree/main/rate-providers</a></li>
              </ul>
            </li>
            <li>Create the pool (with the help from Balancer Maxis)
              <ul>
                <li>Go to <a href="https://pool-creator.web.app/">https://pool-creator.web.app/</a></li>
                <li>Choose ComposableStable Pool and make sure Yield Protocol Fee Exempt is false</li>
                <li>Approve and Add your token and your rate provider that has been approved in step 2</li>
                <li>Add any other token (and rate providers) for up to 5 tokens</li>
                <li>Create the pool</li>
              </ul>
            </li>
            <li>Perform init join after the pool creation</li>
            <li>Whitelist your pool by doing a PR here:</li>
            <li>Provide an API endpoint for your yield bearing token, easiest with api-yourtoken and the APR. The Maxis will make sure the APR is propagated in our front-end</li>
            <li>If you want to receive BAL rewards, set up a proper root gauge on the network your pool was deployed and apply for a gauge (Maxis will assist here):
              <ul>
                <li>Create the gauges: <a href="https://forum.balancer.fi/t/instructions-overview/2674">https://forum.balancer.fi/t/instructions-overview/2674</a></li>
                <li>Post a proposal based on this proposal: <a href="https://forum.balancer.fi/t/instructions-overview/2674/2">https://forum.balancer.fi/t/instructions-overview/2674/2</a></li>
              </ul>
            </li>
          </ol>
          `
        },
        { 
            question: "What is a rate provider and what makes it innovative in context of yield-bearing tokens?",
            answer: `The Rate Provider does what the name implies - it provides AMM swap logic with the current and correct rate for 
            yield-bearing tokens. Rather than trading at 1:1 (as a traditional stableswap would), upon every YB swap on the DEX, the 
            AMM plugs into onchain rates or pricing oracles, such as Chainlink, which offer an aggregated and decentralized source 
            for the current YB token ratio. This means that as the price of the token naturally rises, the pool continually accounts 
            for it to ensure there isn’t a constant arbitrage and LP loss available due to the incorrect 1:1 pricing. Ultimately, 
            this simple contract drastically reduces LVR and ensures that Liquidity Provider YB yield is NOT siphoned off by 
            arbitrage traders. As the rate provider gives information on price appreciation of a token, it isused to deduct a 
            protocol fee on every join and exit of the pool (currently set at 50%). The fees are then streamed to the 
            protocol fee collector and later processed and swapped to USDC. The DAO then properly allocates a fraction of 
            those fees as voting incentives on secondary markets like Hidden Hand to align emissions with protocol fees earned. 
            Please consult the FAQ on the core pool flywheel for more information. Your token needs to have a rate provider if 
            you want to participate in the core pool / fee recycling process.`
        },
      ]
    };
  }
};
</script>



