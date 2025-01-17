<template>
  <div>
    <div v-for="task in localTasks" :key="task.text" class="task-item">
      <input
          type="checkbox"
          v-model="task.done"
          @change="saveState"
      >
      <span>{{ task.text }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    tasks: {
      type: Array,
      required: true,
      default: () => []
    },
    storageKey: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      localTasks: []
    }
  },
  mounted() {
    // Initialize local tasks from props
    this.localTasks = this.tasks.map(task => ({
      text: task,
      done: false
    }))

    // Load saved state if it exists
    const saved = localStorage.getItem(this.storageKey)
    if (saved) {
      const savedTasks = JSON.parse(saved)
      // Merge saved state with current tasks
      this.localTasks = this.localTasks.map(task => {
        const savedTask = savedTasks.find(t => t.text === task.text)
        return savedTask || task
      })
    }
  },
  methods: {
    saveState() {
      localStorage.setItem(this.storageKey, JSON.stringify(this.localTasks))
    }
  }
}
</script>

<style>
.task-item {
  margin: 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>
