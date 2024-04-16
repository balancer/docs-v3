import type { NavbarConfig } from '@vuepress/theme-default';

export const navbar: NavbarConfig = [
  {
    text: 'Build An AMM',
    link: '/build-a-custom-amm/build-a-custom-amm',
  },
  {
    text: 'Integration Guides',
    link: '/integration-guides/overview',
  },
  {
    text: 'Dev Ref',
    children: [
      {
        text: 'SDK',
        children: [
          {
            text: 'Overview',
            link: '/developer-reference/sdk/',
          },
          '/developer-reference/sdk/API',
        ],
      },
      {
        text: 'Contracts',
        children: [
          {
            text: 'ABIs',
            link: '/developer-reference/contracts/abi',
          },
          {
            text: 'Deployment Addresses',
            link: '/developer-reference/contracts/deployment-addresses/mainnet.md',
          },
          '/developer-reference/contracts/router-api',
          '/developer-reference/contracts/batch-router-api',
          '/developer-reference/contracts/vault-api',
          '/developer-reference/contracts/error-codes',
          '/developer-reference/contracts/security',
        ],
      },
      {
        text: 'Authorizer',
        link: '/developer-reference/authorizer',
      },
    ],
  },
  {
    text: 'Concepts',
    link: '/concepts/overview/basics',
  },
  {
    text: 'Partner Onboarding',
    link: '/partner-onboarding/overview',
  },
  {
    text: 'Data & Analytics',
    link: '/data-and-analytics/overview',
  },
  {
    text: 'Tools',
    link: '/tools',
  },
];
