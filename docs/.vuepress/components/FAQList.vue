<!-- .vuepress/components/FAQ/FAQList.vue -->
<template>
  <div class="faq-list">
    <div v-for="(faq, index) in faqs" :key="index" class="faq-item" :class="{ 'is-open': isOpen(index) }">
      <h3 @click="toggle(index)" class="faq-question">
        <span class="faq-arrow" :class="{ 'is-open': isOpen(index) }">▶</span>
        {{ faq.question }}
      </h3>
      <transition name="fade">
        <div v-if="isOpen(index)" class="faq-answer">
          <div v-html="faq.answer"></div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FAQList',
  props: {
    faqs: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      openIndex: null
    };
  },
  methods: {
    toggle(index) {
      this.openIndex = this.openIndex === index ? null : index;
    },
    isOpen(index) {
      return this.openIndex === index;
    }
  }
};
</script>

<style scoped>
:root {
  --faq-border-color: #ddd;
  --faq-border-color-open: #007bff;
  --faq-background-color: #fff;
  --faq-background-color-hover: #f7f7f7;
  --faq-text-color: #333;
  --faq-answer-background-color: #f9f9f9;
  --faq-answer-text-color: #333;
}

@media (prefers-color-scheme: dark) {
  :root {
    --faq-border-color: #444;
    --faq-border-color-open: #007bff;
    --faq-background-color: #333;
    --faq-background-color-hover: #444;
    --faq-text-color: #ddd;
    --faq-answer-background-color: #444;
    --faq-answer-text-color: #ddd;
  }
}

.faq-list {
  margin: 20px 0;
}
.faq-item {
  border: 1px solid var(--faq-border-color);
  border-radius: 5px;
  margin-bottom: 10px;
  overflow: hidden;
  transition: all 0.3s ease;
  background-color: var(--faq-background-color);
}
.faq-item.is-open {
  border-color: var(--faq-border-color-open);
}
.faq-question {
  padding: 10px 15px;
  cursor: pointer;
  margin: 0;
  display: flex;
  align-items: center;
  transition: background-color 0.3s ease;
  background-color: var(--faq-background-color);
  color: var(--faq-text-color);
}
.faq-question:hover {
  background-color: var(--faq-background-color-hover);
}
.faq-arrow {
  margin-right: 10px;
  transition: transform 0.3s ease;
}
.faq-arrow.is-open {
  transform: rotate(90deg);
}
.faq-answer {
  padding: 15px;
  background-color: var(--faq-answer-background-color);
  color: var(--faq-answer-text-color);
}
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active in <2.1.8 */ {
  opacity: 0;
}
</style>
