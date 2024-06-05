<template>
  <svg
      class="search-icon"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
  >
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
</template>

<script>
export default {};
</script>

<style scoped>
.search-icon {
  fill: none; /* Ensure no fill for the circle */
  color: var(--c-text); /* Ensure `currentColor` is set based on the theme */
}

:root {
  --c-text-light: #000; /* Example light mode text color */
  --c-text-dark: #fff;  /* Example dark mode text color */
}

body.light-mode {
  --c-text: var(--c-text-light);
}

body.dark-mode {
  --c-text: var(--c-text-dark);
}
</style>


