<template>
  <v-card color="amber" class="pa-2">
    <v-img aspect-ratio="16/9" :src="carImg"></v-img>
    <div class="card-content">
      <p class="text-left two-line">{{ vehicleName }}</p>
      <p class="text-right">{{ formatedPrice }}</p>
    </div>
    <router-link :to="carURL" aria-label="Voir plus" class="text-h6">Voir plus</router-link>
  </v-card>
</template>

<script>
import {priceFormatting} from '@/services/common';

export default {
  props: ['img', 'make', 'model', 'year', 'price', 'id'],
  data() {
    return {};
  },
  computed: {

    carURL() {
      return "/vehicle/" + this.id;
    },
    vehicleName() {
      return this.make + " " + this.model + " " + this.year;
    },
    carImg() {
      return (this.img !== null) ? this.img : "./src/assets/logo.png";
    },
    formatedPrice() {
      return priceFormatting(this.price);
    }
  }
}
</script>
  
<style scoped>
.card-content {
  height: 3em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.two-line {
  line-height: 1.5em;
  overflow: hidden;
  white-space: normal;
}
</style>