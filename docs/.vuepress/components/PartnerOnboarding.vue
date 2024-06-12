<template>
  <div class="deployment-container">
    <div class="docs-cards deployments-table">
      <div
        v-for="deployment in deployments"
        :key="deployment.title"
        class="tools-row"
      >
        <DocsCard
          :title="deployment.title"
          :icon="deployment.icon"
          :link="deployment.link"
          :details="deployment.details"
          :target="_getLinkTarget(deployment.link)"
        />
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
import DocsCard from './DocsCardTools.vue';

const deployments = [
  {
    title: 'Balancer v2',
    icon: '/images/logo-balancer-white-512x512.svg',
    details: 'Onboarding documentation and FAQ for Balancer v2',
    link: '/partner-onboarding/balancer-v2/v2-overview.html',
  },
  {
    title: 'Balancer v3',
    icon: '/images/logo-balancer-white-512x512.svg',
    details: 'Onboarding documentation and FAQ for Balancer v3',
    link: '/partner-onboarding/balancer-v3/v3-overview.html',
  },
  // Add more Core Tools as needed
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
