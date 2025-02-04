<template>
  <div class="decision-tree">
    <div v-if="currentStep" class="step-container">
      <h2 class="step-title">{{ currentStep.title }}</h2>
      <p v-if="currentStep.question" class="step-question">
        {{ currentStep.question }}
      </p>
      <div v-if="currentStep.options" class="options-container">
        <button
          v-for="option in currentStep.options"
          :key="option.text"
          class="option-button"
          @click="goToStep(option.nextStep)"
        >
          {{ option.text }}
        </button>
      </div>
      <p
        v-if="currentStep.result"
        class="step-result"
        v-html="currentStep.result"
      ></p>
      <button v-if="isResult" class="reset-button" @click="reset">
        Restart
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import {
  partnerDecisionTreeConfig,
  Step,
} from '../constants/partnerDecisionTreeConfig';

export default defineComponent({
  data() {
    return {
      currentStepId: 'start',
      steps: partnerDecisionTreeConfig,
    };
  },
  computed: {
    currentStep(): Step | undefined {
      return this.steps.find(step => step.id === this.currentStepId);
    },
    isResult(): boolean {
      return !!this.currentStep?.result;
    },
  },
  methods: {
    goToStep(stepId: string) {
      this.currentStepId = stepId;
    },
    reset() {
      this.currentStepId = 'start';
    },
  },
});
</script>

<style scoped>
:root {
  --background-color-light: #f9f9f9;
  --background-color-dark: #333;
  --text-color-light: #000;
  --text-color-dark: #fff;
  --button-background-light: #007bff;
  --button-background-dark: #0056b3;
  --button-hover-background-light: #0056b3;
  --button-hover-background-dark: #004085;
  --button-reset-background-light: #28a745;
  --button-reset-background-dark: #218838;
  --button-reset-hover-background-light: #218838;
  --button-reset-hover-background-dark: #1e7e34;
}

[data-theme='light'] {
  --background-color: var(--background-color-light);
  --text-color: var(--text-color-light);
  --button-background: var(--button-background-light);
  --button-hover-background: var(--button-hover-background-light);
  --button-reset-background: var(--button-reset-background-light);
  --button-reset-hover-background: var(--button-reset-hover-background-light);
}

[data-theme='dark'] {
  --background-color: var(--background-color-dark);
  --text-color: var(--text-color-dark);
  --button-background: var(--button-background-dark);
  --button-hover-background: var(--button-hover-background-dark);
  --button-reset-background: var(--button-reset-background-dark);
  --button-reset-hover-background: var(--button-reset-hover-background-dark);
}

.decision-tree {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  border: 1px solid var(--c-docs-card-border);
  background-color: var(--background-color);
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  color: var(--text-color);
  transition: background-color 0.3s, color 0.3s;
}

.step-container {
  text-align: center;
}

.step-title {
  font-size: 24px;
  margin-bottom: 10px;
}

.step-question {
  font-size: 18px;
  margin-bottom: 20px;
}

.options-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.option-button {
  background-color: var(--button-background);
  color: var(--text-color);
  border: 1px solid var(--c-docs-card-border);
  padding: 10px 20px;
  margin: 5px 0;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  width: 100%;
  max-width: 400px;
  transition: box-shadow 0.15s ease-out, transform 0.15s ease-out,
    opacity 0.15s ease-out;
}

.option-button:hover {
  background-color: var(--button-hover-background);
  box-shadow: var(--c-docs-card-shadow);
}

.step-result {
  font-size: 18px;
  margin-top: 20px;
}

.reset-button {
  background-color: var(--button-reset-background);
  color: var(--text-color);
  border: 1px solid var(--c-docs-card-border);
  padding: 10px 20px;
  margin-top: 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s;
}

.reset-button:hover {
  background-color: var(--button-reset-hover-background);
}
</style>
