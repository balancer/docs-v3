---
home: true
title: Yield Bearing Thesis
heroText: Yield Bearing Thesis
heroImage: /images/yieldThesis.png
homeImage: /images/yieldThesis.png
---

# The Yield Bearing Hub (Balancer v2)
:::info
Balancer is the most attuned decentralised financial technology layer to host yield-bearing assets. Yield-bearing tokens 
such as LSTs and interest-bearing stablecoins offer an additional layer of efficiency compared to their vanilla 
counterparts. These tokenised assets allow users to gain exposure to both onchain and offchain interest rates, 
compounded within a single token.  This notion page serves as an information hub that explains why, it details 
Balancer’s unique YB PMFs, and also links to case studies and additional resources for partner integrations. 
For a full overview of Balancer’s Yield Bearing Thesis, please read the following article.
:::


## Yield-Bearing Token Onboarding
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
            <li>Whitelist your token here by doing a Pull-Request here (Maxis can assist): <a href="https://github.com/balancer/tokenlists">https://github.com/balancer/tokenlists</a>
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
            <li>Create the pool (Balancer Maxis)
              <ul>
                <li>Go to <a href="https://pool-creator.web.app/">https://pool-creator.web.app/</a></li>
                <li>Choose ComposableStable Pool and make sure Yield Protocol Fee Exempt is false</li>
                <li>Approve and Add your token and your rate provider that has been approved in step 2</li>
                <li>Add any other token (and rate providers) for up to 5 tokens</li>
                <li>Create the pool</li>
              </ul>
            </li>
            <li>Perform init join with after pool creation</li>
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
        }
      ]
    };
  }
};
</script>



