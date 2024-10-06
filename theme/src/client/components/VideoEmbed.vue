<script setup lang="ts">
import { computed } from 'vue'
import { usePageData } from '@vuepress/client'

const page = usePageData()
const videoSrc = computed(() => page.value.frontmatter.videoSrc)
</script>

<template>
  <div v-if="videoSrc" class="video-container">
    <div class="video-wrapper">
      <iframe
        :src="videoSrc"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
  </div>
</template>

<style scoped>
.video-container {
  margin-top: 1rem;
  width: 100%;
  max-width: 800px; /* Adjust this value as needed */
  margin-left: auto;
  margin-right: auto;
}

.video-wrapper {
  position: relative;
  padding-bottom: 56.25%; /* 16:9 aspect ratio */
  height: 0;
  overflow: hidden;
}

.video-wrapper iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>