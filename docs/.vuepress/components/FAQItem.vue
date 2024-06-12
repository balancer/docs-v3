<template>
  <div class="faq-item">
    <h3 @click="toggle">{{ question }}</h3>
    <div v-show="isOpen">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    question: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    }
  }
};
</script>

<style scoped>
.faq-item h3 {
  cursor: pointer;
}
.faq-item div {
  padding-left: 20px;
}
</style>
