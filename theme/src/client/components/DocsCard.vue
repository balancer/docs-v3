<script setuplang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'DocsCard',
  props: {
    title: { type: String, default: '' },
    titleTag: { type: String, default: 'h4' },
    icon: { type: String, default: '' },
    iconDark: { type: String, default: '' },
    link: { type: String, default: '' },
    details: { type: String, default: '' },
  },
});
</script>

<template>
  <RouterLink :to="link" class="card-link group">
    <div :class="['docs-card']">
      <div :class="['card-container']">
        <div v-if="icon" class="card-icon-row">
          <img :src="icon" class="light-icon" />
          <img :src="iconDark" class="dark-icon" />
        </div>
        <div v-if="!!title || $slots.header" :class="['header']">
          <!-- eslint-disable-next-line vue/no-v-text-v-html-on-component -- Not sure if this is fine -->
          <component :is="titleTag" v-if="!!title" v-text="title" />
        </div>
        <div class="details">
          {{ details }}
        </div>
      </div>
    </div>
  </RouterLink>
</template>

<style scoped>
.card-link {
  /* border: 1px solid var(--c-docs-card-border); */
  border-radius: 12px;
  display: flex;
  font-size: 0.75rem;
  font-weight: 400;
  height: 100%;
  position: relative;
  justify-content: flex-start;
  overflow: hidden;
  transition: box-shadow 0.15s ease-out, transform 0.15s ease-out,
    opacity 0.15s ease-out;
  width: 100%;
  box-shadow: var(--box-shadow-large);
}

@media (hover: hover) {
  .card-link[href]:hover {
    box-shadow: var(--box-shadow-small);
    text-decoration: none;
  }
}

.group:hover .header {
  color: var(--c-brand);
}

.card-link img {
  height: 3.75rem;
  width: 3.75rem;
  top: 0px;
  right: 0px;
}

.light-icon {
  display: inline-block;
  border-radius: 9999px;
  box-shadow: 0px 0px 0px 1px #49351d05, 1px 1px 1px -0.5px #49351d0f,
    3px 3px 3px -1.5px #49351d0f, 6px 6px 6px -3px #49351d0f,
    -0.5px -0.5px 0px 0px #ffffff;
}

.dark-icon {
  display: none;
  border-radius: 9999px;
  box-shadow: 0px 0px 0px 1px #00000005, 1px 1px 1px -0.5px #0000000f,
    3px 3px 3px -1.5px #0000000f, 6px 6px 6px -3px #0000000f,
    12px 12px 12px -6px #0000001a, 0px -1px 0px 0px #ffffff26;
}

.dark .light-icon {
  display: none;
}

.dark .dark-icon {
  display: inline-block;
}

.card-link :deep(h4) {
  font-weight: 800;
}

.docs-card .header {
  color: var(--c-text);
}

.card-container {
  padding: 1.5rem;
}
.details {
  color: var(--c-text-light);
  font-size: 0.875rem;
}
.docs-card {
  @apply flex flex-col;
}
</style>
