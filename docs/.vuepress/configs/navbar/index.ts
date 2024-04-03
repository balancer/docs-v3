import type { NavbarConfig } from '@vuepress/theme-default';

export const navbar: NavbarConfig = [
  {
    text: 'Concepts',
    link: '/',
  },
  {
    text: 'SDK',
    link: '/sdk/overview',
  },
  {
    text: 'API',
    link: '/reference/api/readme.md',
  },
  {
    text: 'Data',
    children: [
      {
        text: 'Dune Dashboard',
        link: '/reference/dune/readme.md',
      },
      {
        text: 'Subgraph',
        link: '/reference/subgraph/readme.md',
      },
    ],
  },
  {
    text: 'Reference',
    children: [
      {
        text: 'Contracts',
        link: '/reference/contracts',
        children: [
          {
            text: 'Deployment Addresses',
            link: '/reference/contracts',
          },
          {
            text: 'Authorizer Permissions',
            link: '/reference/authorizer',
          },
          {
            text: 'APIs',
            link: '/reference/contracts/api/readme.md',
          },
          {
            text: 'ABIs',
            link: '/reference/contracts/abi/readme.md',
          },
          '/reference/contracts/security',
          '/reference/contracts/error-codes',
        ],
      },
      {
        text: 'Math',
        children: [
          '/reference/math/weighted-math',
          '/reference/math/stable-math',
          '/reference/math/linear-math',
          '/reference/math/impermanent-loss',
        ],
      },
      {
        text: 'veBAL & Gauges',
        children: [
          '/reference/vebal-and-gauges/apr-calculation',
          '/reference/vebal-and-gauges/gauges',
          '/reference/vebal-and-gauges/vebal',
        ],
      },
    ],
  },
  {
    text: 'Tools',
    link: '/tools',
  },
];
