<template>
  <div class="card">
    <div class="card-title">{{ card.title }}</div>
    <p>{{ card.content }}</p>
    <router-link :to="card.link">Read More</router-link>
  </div>
</template>

<script>
export default {
  name: 'CardComponent',
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style scoped>
.card {
  width: 350px;
  height: 150px;
  margin: 10px;
  padding: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
  box-shadow: 1px 1px 3px 0px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  color: #333;
}
.card-title {
  font-size: 1.2em;
  font-weight: bold;
  margin: 0 0 10px 0;
}
.card p {
  margin: 0;
  padding-top: 0;
}
</style>