---
title: Yield-bearing asset Onboarding
order: 1
---

### Onboarding Steps for yield-bearing assets for Balancer v2

<ol>
    <li>Whitelist your token by doing a Pull-Request here (Balancer contributors can assist): <a href="https://github.com/balancer/tokenlists">https://github.com/balancer/tokenlists</a>
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
    <li>Create the pool (with the help from Balancer contributors)
    <ul>
        <li>Go to <a href="https://pool-creator.web.app/">https://pool-creator.web.app/</a></li>
        <li>Choose ComposableStable Pool and make sure Yield Protocol Fee Exempt is false</li>
        <li>Approve and Add your token and your rate provider that has been approved in step 2</li>
        <li>Add any other token (and rate providers) for up to 5 tokens</li>
        <li>Create the pool</li>
    </ul>
    </li>
    <li>Perform init join after the pool creation</li>
    <li>Provide an API endpoint for your yield bearing token, ideally with <code>api-yourtoken</code> and the APR. Contributors will make sure the APR is propagated in our front-end</li>
    <li>If you want to receive BAL rewards, set up a proper root gauge on the network your pool was deployed and apply for a gauge (contributors will assist here):
    <ul>
        <li>Create the gauges: <a href="https://forum.balancer.fi/t/instructions-overview/2674">https://forum.balancer.fi/t/instructions-overview/2674</a></li>
        <li>Post a proposal based on this instruction set: <a href="https://forum.balancer.fi/t/instructions-overview/2674/2">https://forum.balancer.fi/t/instructions-overview/2674/2</a></li>
    </ul>
    </li>
</ol>
