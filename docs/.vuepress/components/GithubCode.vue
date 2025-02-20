<template>
  <div :class="`language-${language} ext-${fileExtension}`">
    <pre v-if="code" :class="`language-${language}`"><code v-html="highlightedCode"></code></pre>
    <div v-else>Loading...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import Prism from 'prismjs'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-solidity'

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  language: {
    type: String,
    default: 'typescript',
    validator: (value) => ['typescript', 'solidity'].includes(value)
  }
})

const code = ref(null)

const fileExtension = computed(() => {
  return props.language === 'typescript' ? 'ts' : 'sol'
})

const highlightedCode = computed(() => {
  if (!code.value) return ''
  return Prism.highlight(code.value, Prism.languages[props.language], props.language)
})

onMounted(async () => {
  try {
    const response = await fetch(props.url)
    if (!response.ok) throw new Error('Failed to fetch code')
    code.value = await response.text()
  } catch (error) {
    console.error('Error fetching code:', error)
    code.value = 'Error loading code'
  }
})
</script>