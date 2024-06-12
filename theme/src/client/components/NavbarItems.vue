<script setup lang="ts">
import AutoLink from '@theme/AutoLink.vue';
import NavbarDropdown from '@theme/NavbarDropdown.vue';
import { useRouteLocale, useSiteLocaleData } from '@vuepress/client';
import { isLinkHttp, isString } from '@vuepress/shared';
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import type { ComputedRef } from 'vue';
import { useNavLink, useThemeLocaleData } from '../composables/index.js';
import { resolveRepoType } from '../utils/index.js';

const useNavbarSelectLanguage = (): ComputedRef<ResolvedNavbarItem[]> => {
  const router = useRouter();
  const routeLocale = useRouteLocale();
  const siteLocale = useSiteLocaleData();
  const themeLocale = useThemeLocaleData();

  return computed<ResolvedNavbarItem[]>(() => {
    const localePaths = Object.keys(siteLocale.value.locales);
    if (localePaths.length < 2) {
      return [];
    }
    const currentPath = router.currentRoute.value.path;
    const currentFullPath = router.currentRoute.value.fullPath;
    const currentHash = router.currentRoute.value.hash;

    const languageDropdown: ResolvedNavbarItem = {
      text: themeLocale.value.selectLanguageText ?? 'unknown language',
      ariaLabel:
          themeLocale.value.selectLanguageAriaLabel ??
          themeLocale.value.selectLanguageText ??
          'unknown language',
      children: localePaths.map(targetLocalePath => {
        const targetSiteLocale =
            siteLocale.value.locales?.[targetLocalePath] ?? {};
        const targetThemeLocale =
            themeLocale.value.locales?.[targetLocalePath] ?? {};
        const targetLang = `${targetSiteLocale.lang}`;

        const text = targetThemeLocale.selectLanguageName ?? targetLang;
        let link;

        if (targetLang === siteLocale.value.lang) {
          link = currentFullPath;
        } else {
          const targetLocalePage = currentPath.replace(
              routeLocale.value,
              targetLocalePath
          );
          if (router.getRoutes().some(item => item.path === targetLocalePage)) {
            link = `${targetLocalePage}${currentHash}`;
          } else {
            link = targetThemeLocale.home ?? targetLocalePath;
          }
        }

        return {
          text,
          link,
        };
      }),
    };

    return [languageDropdown];
  });
};

const resolveNavbarItem = (
    item: NavbarItem | NavbarGroup | string
): ResolvedNavbarItem => {
  if (isString(item)) {
    return useNavLink(item);
  }
  if ((item as NavbarGroup).children) {
    return {
      ...item,
      children: (item as NavbarGroup).children.map(resolveNavbarItem),
    };
  }
  return item as ResolvedNavbarItem;
};

const useNavbarConfig = (): ComputedRef<ResolvedNavbarItem[]> => {
  const themeLocale = useThemeLocaleData();
  return computed(() =>
      (themeLocale.value.navbar || []).map(resolveNavbarItem)
  );
};

const isMobile = ref(false);
const showMore = ref(false);
const navbarConfig = useNavbarConfig();
const navbarSelectLanguage = useNavbarSelectLanguage();
const navbarLinks = computed(() => [
  ...navbarConfig.value,
  ...navbarSelectLanguage.value,
]);

const displayedLinks = ref(navbarLinks.value);
const hiddenLinks = ref<ResolvedNavbarItem[]>([]);

const handleLinksVisibility = () => {
  const MOBILE_DESKTOP_BREAKPOINT = 1380;

  if (window.innerWidth < MOBILE_DESKTOP_BREAKPOINT) {
    isMobile.value = true;

    // Hide some items if needed
    const visibleCount = 3; // Number of items to show before the "more" button
    displayedLinks.value = navbarLinks.value.slice(0, visibleCount);
    hiddenLinks.value = navbarLinks.value.slice(visibleCount);
  } else {
    isMobile.value = false;
    displayedLinks.value = navbarLinks.value;
    hiddenLinks.value = [];
  }
};

onMounted(() => {
  handleLinksVisibility();
  window.addEventListener('resize', handleLinksVisibility, false);
  window.addEventListener('orientationchange', handleLinksVisibility, false);
});
</script>


<template>
  <nav v-if="navbarLinks.length" class="navbar-items">
    <div v-for="item in displayedLinks" :key="item.text" class="navbar-item">
      <NavbarDropdown
          v-if="item.children"
          :item="item"
          :class="isMobile ? 'mobile' : ''"
      />
      <AutoLink v-else :item="item" />
    </div>
    <div v-if="hiddenLinks.length" class="navbar-item more-dropdown">
      <button @click="showMore = !showMore">...</button>
      <div v-if="showMore" class="dropdown-content">
        <div v-for="item in hiddenLinks" :key="item.text">
          <NavbarDropdown
              v-if="item.children"
              :item="item"
              :class="isMobile ? 'mobile' : ''"
          />
          <AutoLink v-else :item="item" />
        </div>
      </div>
    </div>
  </nav>
</template>


<style scoped>
.navbar-items {
  display: flex;
  align-items: center;
}

.navbar-item {
  margin-right: 1rem;
}

.more-dropdown {
  position: relative;
}

.more-dropdown button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.25rem;
}

.dropdown-content {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 100%;
  right: 0;
  background-color: var(--c-bg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  z-index: 1000;
}

@media (max-width: 1380px) {
  .navbar-items {
    flex-wrap: wrap;
  }
}
</style>

