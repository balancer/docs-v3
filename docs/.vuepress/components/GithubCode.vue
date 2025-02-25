<template>
  <div :class="`language-${language} ext-${fileExtension}`">
    <pre
      v-if="code"
      :class="`language-${language}`"
    ><code v-html="highlightedCode"></code></pre>
    <div v-else>Loading...</div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Prism from 'prismjs';
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-solidity';

const props = defineProps({
  url: {
    type: String,
    required: true,
  },
  language: {
    type: String,
    default: '',
  },
  clipStartLines: {
    type: Number,
    default: 0
  },
  clipEndLines: {
    type: Number,
    default: 0
  }
});

const code = ref(null);

const inferredLanguage = computed(() => {
  if (props.language) return props.language;
  
  // Extract file extension from URL
  const urlPath = props.url.split('/').pop() || '';
  const extension = urlPath.split('.').pop().toLowerCase();
  
  // Map extensions to languages
  const extensionMap = {
    'ts': 'typescript',
    'tsx': 'typescript',
    'js': 'javascript',
    'jsx': 'javascript',
    'sol': 'solidity',
    // Add more mappings as needed
  };
  
  return extensionMap[extension] || 'typescript'; // Default to typescript if unknown
});

const fileExtension = computed(() => {
  const langToExt = {
    'typescript': 'ts',
    'javascript': 'js',
    'solidity': 'sol',
    // Add more mappings as needed
  };
  return langToExt[inferredLanguage.value] || inferredLanguage.value;
});

const processedCode = computed(() => {
  if (!code.value) return '';
  
  const lines = code.value.split('\n');
  let result = lines;
  
  // Apply start clipping if specified
  if (props.clipStartLines > 0) {
    result = result.slice(props.clipStartLines);
  }
  
  // Apply end clipping if specified
  if (props.clipEndLines > 0) {
    result = result.slice(0, -props.clipEndLines);
  }
  
  return result.join('\n');
});

const highlightedCode = computed(() => {
  if (!processedCode.value) return '';
  
  // Make sure the language is loaded in Prism
  if (inferredLanguage.value && !Prism.languages[inferredLanguage.value]) {
    try {
      // Try to dynamically load the language if not already loaded
      require(`prismjs/components/prism-${inferredLanguage.value}`);
    } catch (e) {
      console.warn(`Prism language '${inferredLanguage.value}' not available`);
    }
  }
  
  return Prism.highlight(
    processedCode.value,
    Prism.languages[inferredLanguage.value] || Prism.languages.plaintext,
    inferredLanguage.value
  );
});

onMounted(async () => {
  try {
    const response = await fetch(props.url);
    if (!response.ok) throw new Error('Failed to fetch code');
    code.value = await response.text();
  } catch (error) {
    console.error('Error fetching code:', error);
    code.value = 'Error loading code';
  }
});
</script>
