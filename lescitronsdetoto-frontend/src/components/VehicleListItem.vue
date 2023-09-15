<template>
  <v-card :color="colourPrimary" class="pa-2">
    <v-card-title class="headColour">{{ vehicleName }}</v-card-title>
    <v-row class="mt-1">
      <v-img color="grey-lighten-3" :width="200" :height="163" aspect-ratio="16/9" cover :src="carImg">
        <div class="overlay-text mx-4">
      <div v-if="hasPromo">
        <p class="text-right font-weight-bold promo"><v-icon color="red">mdi-seal</v-icon>{{ formatedPromo }}</p>
        <p class="text-right text-decoration-line-through reg">{{ this.price }}</p>
      </div>
      <div v-else>
        <p class=" text-right font-weight-bold">{{ this.price }}</p>
      </div>
      </div></v-img>
    
      <v-col cols="12"></v-col>
    </v-row>

      <v-dialog v-model="dialog" fullscreen
      :scrim="true"
      transition="dialog-bottom-transition">
        <template v-slot:activator="{ props }">
          <v-btn block color="primary" v-bind="props">
            Voir plus
          </v-btn>
        </template>
        <detailled-vehicle class="mb-8" :id="this.vin" :isDialog="true" @close-dialog="this.dialog = !this.dialog"></detailled-vehicle>
      </v-dialog>
      
  </v-card>
</template>

<script>
import { useAppStore } from '@/store/app';
import { priceFormatting } from '@/services/common';
import DetailledVehicle from '@/views/DetailledVehicle.vue';

const appStore = useAppStore();
export default {
  props: ['img', 'make', 'model', 'year', 'price', 'promo', 'id', 'vin'],
  components: {
    DetailledVehicle
  },
  data() {
    return {
      dialog: false,
    };
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
      return (this.promo === "$0.00") ? null : this.promo;
    },
    hasPromo() {
      return (this.promo === "$0.00") ? false : true;
    },
    colourPrimary() {
      return (!this.promo) ? appStore.colourPrimary : appStore.colourTernary;
    },
    colourSecondary() {
      return appStore.colourSecondary;
    },
    imgSize() {
      console.log($(document).width());
      return this.$vuetify.display
    }
  }
}
</script>
  
<style scoped>
.card-content {
  flex-direction: column;
  justify-content: space-between;
  height: 6em;
  display: flex;
}

.promo {
  color: white;
}

.reg {
  color: #ECEFF1;
}
.headColour {
  background-color: gold;
}

.overlay-text {
  position: absolute;
  bottom: 0;
  right: 0;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.2);
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  border-top-left-radius: 25px;
}

</style>