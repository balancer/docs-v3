<template>
  <div class="container">
    <div class="box" v-for="(column, index) in columns" :key="index">
      <h2>{{ column.header }}</h2>
      <p>{{ column.description }}</p>
      <CardComponent
        v-for="(card, cardIndex) in column.cards"
        :key="cardIndex"
        :card="card"
      />
    </div>
  </div>
</template>

<script>
import CardComponent from './CardComponent.vue';

export default {
  name: 'HomeCards',
  components: {
    CardComponent,
  },
  props: {
    columns: {
      type: Array,
      required: true,
    },
  },
};
</script>

<style scoped>
.container {
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  max-width: 1200px; /* adjust this value as needed */
  margin-left: auto;
  margin-right: auto;
}
.box {
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.box h2 {
  font-size: 1.2em;
  font-weight: bold;
}
.box p {
  margin-bottom: 10px;
  align-items: center;
  justify-content: center;
}
</style>
