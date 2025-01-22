<template>
  <div>
    <div v-for="task in localTasks" :key="task.text" class="task-item">
      <input v-model="task.done" type="checkbox" @change="saveState" />
      <span v-html="parseMarkdownLinks(task.text)"></span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tasks: {
      type: Array,
      required: true,
      default: () => [],
    },
    storageKey: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localTasks: [],
    };
  },
  mounted() {
    // Initialize local tasks from props
    this.localTasks = this.tasks.map(task => ({
      text: task,
      done: false,
    }));

    // Load saved state if it exists
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      const savedTasks = JSON.parse(saved);
      // Merge saved state with current tasks
      this.localTasks = this.localTasks.map(task => {
        const savedTask = savedTasks.find(t => t.text === task.text);
        return savedTask || task;
      });
    }
  },
  methods: {
    saveState() {
      localStorage.setItem(this.storageKey, JSON.stringify(this.localTasks));
    },
    parseMarkdownLinks(text) {
      // Parse markdown links [text](url) to HTML <a> tags
      return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
        // Handle local markdown files
        if (url.includes('.md')) {
          // Split URL into path and hash
          const [path, hash] = url.split('#');

          // Process the path - handle both direct and nested paths
          const pathParts = path.split('/');
          const lastPart = pathParts[pathParts.length - 1];

          // Replace .md with .html in the last part of the path
          pathParts[pathParts.length - 1] = lastPart.replace(/\.md$/, '.html');

          // Reconstruct the URL
          const cleanPath = pathParts.join('/');
          const hashFragment = hash ? `#${hash}` : '';

          return `<a href="${cleanPath}${hashFragment}" class="internal-link">${text}</a>`;
        }
        // External links
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="external-link">${text}</a>`;
      });
    },
  },
};
</script>

<style>
.task-item {
  margin: 1rem 0;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.task-item a {
  text-decoration: none;
}

.task-item a:hover {
  text-decoration: underline;
}

.task-item .internal-link {
  /* Style for internal links if you want to differentiate them */
}

.task-item .external-link {
  /* Style for external links if you want to differentiate them */
}
</style>
