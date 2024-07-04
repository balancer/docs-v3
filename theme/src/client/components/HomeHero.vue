<script setup lang="ts">
import AutoLink from '@theme/AutoLink.vue';
import {
  ClientOnly,
  usePageFrontmatter,
  useSiteLocaleData,
  withBase,
} from '@vuepress/client';
import { isArray } from '@vuepress/shared';
import type { FunctionalComponent } from 'vue';
import { computed, h } from 'vue';
import type { DefaultThemeHomePageFrontmatter } from '../../shared/index.js';
import { useDarkMode } from '../composables/index.js';

const frontmatter = usePageFrontmatter<DefaultThemeHomePageFrontmatter>();
const siteLocale = useSiteLocaleData();
const isDarkMode = useDarkMode();

const heroImage = computed(() => {
  if (isDarkMode.value && frontmatter.value.heroImageDark !== undefined) {
    return frontmatter.value.heroImageDark;
  }
  return frontmatter.value.heroImage;
});
const heroAlt = computed(
  () => frontmatter.value.heroAlt || heroText.value || 'hero'
);
const heroHeight = computed(() => frontmatter.value.heroHeight || 280);

const heroText = computed(() => {
  if (frontmatter.value.heroText === null) {
    return null;
  }
  return frontmatter.value.heroText || siteLocale.value.title || 'Hello';
});

const heroStyle = computed(() => {
  if (frontmatter.value.heroImage === null) {
    return '';
  }
  return `background-image: url(${frontmatter.value.heroImage})`;
});

const tagline = computed(() => {
  if (frontmatter.value.tagline === null) {
    return null;
  }
  return (
    frontmatter.value.tagline ||
    siteLocale.value.description ||
    'Welcome to your VuePress site'
  );
});

const actions = computed(() => {
  if (!isArray(frontmatter.value.actions)) {
    return [];
  }

  return frontmatter.value.actions.map(({ text, link, type = 'primary' }) => ({
    text,
    link,
    type,
  }));
});

const headerColor = computed(() => (isDarkMode.value ? '#E5D3BE' : '#2c3e50'));
const taglineColor = computed(() => (isDarkMode.value ? '#A0AEC0' : '#3a5169'));
</script>

<template>
  <div class="home-hero-container">
    <div class="home-hero-bg">
      <header class="home-hero" :style="heroStyle">
        <p class="home-eyebrow">Balancer v3 Docs</p>
        <h1 v-if="heroText" id="main-title" :style="{ color: headerColor }">
          AMMs made easy
        </h1>
        <p v-if="tagline" class="description" :style="{ color: taglineColor }">
          {{ tagline }}
        </p>

        <p v-if="actions.length" class="actions">
          <AutoLink
            v-for="action in actions"
            :key="action.text"
            class="action-button"
            :class="[action.type]"
            :item="action"
          />
        </p>
      </header>
    </div>
  </div>
</template>
