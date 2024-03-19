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
            link: '/reference/contracts/apis/vault',
          },
          '/reference/contracts/security',
          '/reference/contracts/error-codes',
          '/reference/contracts/query-functions',
        ],
      },
      {
        text: 'Subgraph',
        children: [
          {
            text: 'Overview',
            link: '/reference/subgraph/',
            children: [
              {
                text: 'Core',
                link: '/reference/subgraph/core/entities',
              },
              {
                text: 'Gauges',
                link: '/reference/subgraph/gauges/entities',
              },
            ],
          },
        ],
      },
      {
        text: 'Dune',
        children: [
          {
            text: 'Overview',
            link: '/reference/dune/',
          },
        ],
      },
      {
        text: 'API',
        children: [
          {
            text: 'Overview',
            link: '/reference/API/',
          },
        ],
      },
      {
        text: 'Math',
        children: [
          '/reference/math/weighted-math',
          '/reference/math/stable-math',
          '/reference/math/linear-math',
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
