<template>
  <div class="tools-container">
    <h3>Calculators and dApps</h3>
    <h3></h3>
    <div class="docs-cards tools-table">
      <div
        v-for="tool in calculatorsAndDApps"
        :key="tool.title"
        class="tools-row"
      >
        <DocsCard
          :title="tool.title"
          :icon="tool.icon"
          :link="tool.link"
          :details="tool.details"
          :target="_getLinkTarget(tool.link)"
        />
      </div>
    </div>

    <h3>Analytics and Dashboards</h3>
    <h3></h3>
    <div class="docs-cards tools-table">
      <div v-for="tool in analyticsSites" :key="tool.title" class="tools-row">
        <DocsCard
          :title="tool.title"
          :icon="tool.icon"
          :link="tool.link"
          :details="tool.details"
          :target="_getLinkTarget(tool.link)"
        />
      </div>
    </div>
  </div>
</template>



<script setup lang="ts">
import DocsCard from './DocsCardTools.vue';

const calculatorsAndDApps = [
  {
    title: 'Maxis Operations UI',
    icon: '/images/toolshub/defilytica_simple.png',
    details:
      'DAO Operations tooling for the Balancer ecosystem',
    link: 'https://balancer.defilytica.tools',
  },
  {
    title: 'Internal Balances Manager',
    icon: '/images/toolshub/balancer-symbol.svg',
    details:
      'User-friendly interface designed for traders to easily manage and interact with their internal balances within the V2 Vault - created by Bleu',
    link: 'https://tools.balancer.blue/internalmanager',
  },
  {
    title: 'Stable Swap Simulator',
    icon: '/images/toolshub/balancer-symbol.svg',
    details:
      'Dashboard to visualize the impact of changes in the Amplification Factor on Balancer Stable-Like Pools - created by Bleu',
    link: 'https://tools.balancer.blue/stableswapsimulator',
  },
  {
    title: 'LBP simulator',
    icon: '/images/toolshub/balancer-symbol.svg',
    details:
      'Tool created for LBP pool creators, with the goal of facilitating the projection of different scenarios that the pool may follow.',
    link: 'https://lbp.balancer.fi/',
  },
  // Add more calculators and dApps as needed
];

const analyticsSites = [
  {
    title: 'DeFilytica Analytics',
    icon: '/images/toolshub/defilytica_simple.png',
    details:
      'Protocol, pool and token metrics. Additionally, an in-depth financial dashboard and service-provider analytics board. V2 only ',
    link: 'https://balancer.defilytica.com/',
  },
  {
    title: 'Token Terminal',
    icon: '/images/toolshub/tokenterminal.jpg',
    details: 'Tools to evaluate and track Balancer',
    link: 'https://tokenterminal.com/terminal/projects/balancer',
  },
  {
    title: 'DefiLlama',
    icon: '/images/toolshub/defi-lama-logo.webp',
    details: 'Balancer Dashboard',
    link: 'https://defillama.com/protocol/balancer',
  },

  // Add more analytics sites as needed
];

// Function to check if a link is external
function isExternalLink(link) {
  return link.startsWith('http://') || link.startsWith('https://');
}

// Function to get the target attribute for the link
function _getLinkTarget(link) {
  return isExternalLink(link) ? '_blank' : '_self';
}
</script>

<style scoped>
.tools-container {
  max-width: 1200px;
  margin: 0 auto;
}

.docs-cards {
  grid-gap: 1.35rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  padding-bottom: 2em;
}

.tools-row {
  /* Adjust the styles for each row of tools (DocsCard components) */
}

/* Add any additional styles as needed */
</style>
