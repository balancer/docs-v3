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
    title: 'Balancer Product Wizard 🧙‍♂️',
    question:
      'What best describes your current product needs or primary use-case?',
    options: [
      {
        text: 'Yield Optimization & Liquidity Provision',
        nextStep: 'yield_step',
      },
      {
        text: 'Governance Token Liquidity',
        nextStep: 'resultD',
      },
      {
        text: 'Index Products or Multi-Token Pools',
        nextStep: 'resultC',
      },
      {
        text: 'Custom Pool Logic or Extensions',
        nextStep: 'resultE',
      },
      {
        text: 'Stablecoin or Correlated Asset Liquidity',
        nextStep: 'stable_step',
      },
      {
        text: 'LVR Protection',
        nextStep: 'resultF',
      },
      {
        text: 'Token launch',
        nextStep: 'resultG',
      },
    ],
  },
  {
    id: 'yield_step',
    title: 'Yield Strategy',
    question: 'What type of yield strategy are you looking to implement?',
    options: [
      {
        text: 'Maximum yield with 100% capital efficiency (v3)',
        nextStep: 'boosted_step',
      },
      {
        text: 'Traditional yield-bearing token pool (v2)',
        nextStep: 'resultA',
      },
    ],
  },
  {
    id: 'boosted_step',
    title: 'Boosted Pools (v3)',
    question: 'What type of assets are you looking to boost?',
    options: [
      {
        text: 'Stablecoins with Lending Market integration',
        nextStep: 'resultI',
      },
      {
        text: 'Other yield-generating strategies',
        nextStep: 'resultJ',
      },
    ],
  },
  {
    id: 'stable_step',
    title: 'Stablecoin Strategy',
    question:
      'What is your primary goal for stablecoin or correlated asset liquidity?',
    options: [
      {
        text: 'Maximize yield while maintaining deep liquidity (v3)',
        nextStep: 'boosted_step',
      },
      {
        text: 'Optimized trading efficiency',
        nextStep: 'resultH',
      },
      {
        text: 'Traditional stable pool (v2)',
        nextStep: 'resultB',
      },
    ],
  },
  {
    id: 'resultA',
    title: 'Composable Stable Pools (v2)',
    result:
      'A <a href="https://docs-v2.balancer.fi/concepts/pools/composable-stable.html#composable-stable-pools" target="_blank" rel="noopener noreferrer">composable stable pool</a> with a rate provider setup will best suit your needs. Consult <a href="/partner-onboarding/balancer-v2/onboard-yb-token.html" target="_blank" rel="noopener noreferrer">our v2 onboarding guide</a> for more details.',
  },
  {
    id: 'resultB',
    title: 'Composable Stable Pools (v2)',
    result:
      'A <a href="https://docs-v2.balancer.fi/concepts/pools/composable-stable.html#composable-stable-pools" target="_blank" rel="noopener noreferrer">composable stable pool</a> without any special requirements. Use <a href="https://balancer.defilytica.tools/pool-creator-v2" target="_blank" rel="noopener noreferrer">this community tool</a> to create a pool.',
  },
  {
    id: 'resultC',
    title: 'Weighted Pools',
    result:
      'A weighted pool with up to 8 tokens will best suit your needs for creating index-like products. <a href="https://balancer.defilytica.tools/pool-creator-v2" target="_blank" rel="noopener noreferrer">Create a pool</a> now!',
  },
  {
    id: 'resultD',
    title: 'Governance Tokenomics',
    result:
      'A 80/20 pool based on <a href="/partner-onboarding/onboarding-overview/products/ve8020.html" target="_blank" rel="noopener noreferrer">governance tokenomics</a> might be the best fit for you!',
  },
  {
    id: 'resultE',
    title: 'Pools with Hooks (v3)',
    result:
      'Balancer v3\'s <a href="/concepts/core-concepts/hooks.html" target="_blank" rel="noopener noreferrer">hooks system</a> allows you to extend existing pool types with custom logic. Perfect for implementing unique features while maintaining core pool efficiency.',
  },
  {
    id: 'resultG',
    title: 'Liquidity Bootstrapping Pool',
    result:
      'A <a href="https://docs.balancer.fi/concepts/explore-available-balancer-pools/liquidity-bootstrapping-pool.html" target="_blank" rel="noopener noreferrer"> pool with changing weights, ideal for token launches or price discovery.',
  },
  {
    id: 'resultH',
    title: 'Gyroscope E-CLPs',
    result:
      '<a href="https://app.gyro.finance/" target="_blank" rel="noopener noreferrer">Gyroscope\'s</a> elliptical concentrated liquidity pools offer the best trading efficiency for highly correlated assets with customized trading curves.',
  },
  {
    id: 'resultI',
    title: 'Lending Market Boosted Pools (v3)',
    result:
      'A v3 <a href="/partner-onboarding/onboarding-overview/products/boostedpools.html" target="_blank" rel="noopener noreferrer">Boosted Pool</a> is perfect for your needs. It offers 100% capital efficiency, maximizing yield through e.g. lending markets while maintaining deep liquidity for trades via an efficient buffer system.',
  },
  {
    id: 'resultJ',
    title: 'Custom Boosted Pools (v3)',
    result:
      'A v3 <a href="/partner-onboarding/onboarding-overview/products/boostedpools.html" target="_blank" rel="noopener noreferrer">Boosted Pool</a> can be integrated with your chosen yield strategy. The buffer system ensures gas-efficient swaps while maintaining 100% capital utilization in your yield-generating protocol.',
  },
];
