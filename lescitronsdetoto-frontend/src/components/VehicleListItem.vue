<template>
  <v-card color="amber" class="pa-2">
    <v-img aspect-ratio="16/9" :src="carImg"></v-img>
    <div class="card-content">
      <p class="text-left two-line">{{ vehicleName }}</p>
      <div v-if="this.promo" class="my-2">
        <p class="text-right font-weight-bold promo"><v-icon>mdi-seal</v-icon>{{ this.promo }}</p>
        <p class="text-right text-decoration-line-through">{{ this.price }}</p>
        </div>
          <div v-else class="my-2"> <br>
          <p class=" text-right"> {{ this.price }}</p>
      </div>
      <router-link :to="carURL" aria-label="Voir plus" class="text-h6">Voir plus</router-link>
    </div>
  </v-card>
</template>

<script>
import { priceFormatting } from '@/services/common';

export default {
  props: ['img', 'make', 'model', 'year', 'price', 'promo', 'vin', 'id'],
  data() {
    return {};
  },
  computed: {

    carURL() {
      return "/vehicle/" + this.vin;
    },
    vehicleName() {
      return this.make + " " + this.model + " " + this.year;
    },
    carImg() {
      return (this.img !== null) ? this.img : "./src/assets/logo.png";
    },
    formatedPrice() {
      return priceFormatting(this.price);
    },
    formatedPromo() {
      console.log(this.promo);
      return (this.promo) ? priceFormatting(this.promo) : null;
    }
  }
}
</script>
  
<style scoped>
.card-content {
  height: 9em;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.two-line {
  line-height: 1.5em;
  overflow: hidden;
  white-space: normal;
}

.promo {
  color: navy;
}
</style>