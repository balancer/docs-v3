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
    title: 'Balancer Tech Product Wizard',
    question:
      'What describes best your current product needs / primary use-case?',
    options: [
      { text: 'Deployment of correlated / yield-bearing assets', nextStep: 'step1' },
      { text: 'Hosting of primary liquidity for governance tokens', nextStep: 'step2' },
      { text: 'Hosting of Index-fund like product', nextStep: 'step3' },
    ],
  },
  {
    id: 'step1',
    title: 'Step 1',
    question: 'What feature do you need?',
    options: [
      { text: 'Feature A', nextStep: 'resultA' },
      { text: 'Feature B', nextStep: 'resultB' },
    ],
  },
  {
    id: 'step2',
    title: 'Step 2',
    question: 'Choose a category',
    options: [
      { text: 'Category X', nextStep: 'resultC' },
      { text: 'Category Y', nextStep: 'resultD' },
    ],
  },
  {
    id: 'resultA',
    title: 'Result A',
    result: 'Product A is the best fit for you.',
  },
  {
    id: 'resultB',
    title: 'Result B',
    result: 'Product B is the best fit for you.',
  },
  {
    id: 'resultC',
    title: 'Result C',
    result: 'Product C is the best fit for you.',
  },
  {
    id: 'resultD',
    title: 'Result D',
    result: 'Product D is the best fit for you.',
  },
];
