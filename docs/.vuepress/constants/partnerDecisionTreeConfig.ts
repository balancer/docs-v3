export interface Option {
  text: string;
  nextStep: string;
}

export interface Step {
  id: string;
  title: string;
  question?: string;
  options?: Option[];
  result?: string;
}

export const partnerDecisionTreeConfig: Step[] = [
  {
    id: 'start',
    title: 'Balancer Tech Product Wizard 🧙‍♂️',
    question:
      'What describes best your current product needs / primary use-case?',
    options: [
      {
        text: 'Deployment of correlated / yield-bearing asset liquidity',
        nextStep: 'step1',
      },
      {
        text: 'Hosting of primary liquidity for governance tokens',
        nextStep: 'resultD',
      },
      { text: 'Hosting of an index-fund like product', nextStep: 'resultC' },
      {
        text: 'Building pools with custom execution logic',
        nextStep: 'resultE',
      },
      {
        text: 'Providing liquidity for LVR protection',
        nextStep: 'resultF',
      },
    ],
  },
  {
    id: 'step1',
    title: 'Step 1',
    question:
      'What feature do you need for correlated asset or yield-bearing liquidity?',
    options: [
      {
        text: 'Deep liquidity pool for highly-correlated assets containing 50% yield-bearing tokens',
        nextStep: 'resultA',
      },
      {
        text: 'Deep liquidity for highly correlated assets which do not contain yield-bearing tokens',
        nextStep: 'resultB',
      },
    ],
  },
  {
    id: 'resultA',
    title: 'Composable Stable Pools',
    result:
      'A <a href="https://docs.balancer.fi/concepts/pools/composable-stable.html#composable-stable-pools" target="_blank" rel="noopener noreferrer">composable stable pool</a> with a rate provider setup',
  },
  {
    id: 'resultB',
    title: 'Composable Stable Pools',
    result:
      'A <a href="https://docs.balancer.fi/concepts/pools/composable-stable.html#composable-stable-pools" target="_blank" rel="noopener noreferrer">composable stable pool</a> without any special requirements. Use <a href="https://app.balancer.fi/#/ethereum/pool/create" target="_blank" rel="noopener noreferrer">this community tool</a> to create a pool. ',
  },
  {
    id: 'resultC',
    title: 'A multi-token pool',
    result:
      'A multi-token pool with up to 8 tokens will suit best your needs. <a href="https://app.balancer.fi/#/ethereum/pool/create" target="_blank" rel="noopener noreferrer">Create a pool</a> now!',
  },
  {
    id: 'resultD',
    title: 'Governance Tokenomics',
    result:
      'A 80/20 pool based on <a href="/partner-onboarding/onboarding-overview/product-showcases/ve8020.html" target="_blank" rel="noopener noreferrer">governance tokenomics</a> might be the best fit for you!',
  },
  {
    id: 'resultE',
    title: 'Pools with Hooks',
    result:
      'A Balancer v3 pool with <a href="/concepts/core-concepts/hooks.html" target="_blank" rel="noopener noreferrer">custom hook</a> logic sounds like a perfect fit for your needs. Explore hooks now!',
  },
  {
    id: 'resultF',
    title: 'CowAMM liquidity pool',
    result:
      'A CowAMM liquidity pool based on their custom implementation based on Balancer might be best suited for your needs',
  },
];
