<template>
  <v-card :color="colourPrimary" class="pa-2">
    <v-card-title class="headColour">{{ vehicleName }}</v-card-title>
    <v-img color="grey-lighten-3" :width="200" :height="100" aspect-ratio="16/9" cover :src="carImg">
    </v-img>
    <div class="card-content">
      <div v-if="this.promo" class="my-2">
        <p class="text-right font-weight-bold promo"><v-icon color="red">mdi-seal</v-icon>{{ formatedPromo }}</p>
        <p class="text-right text-decoration-line-through">{{ formatedPrice }}</p>
      </div>
      <div v-else class="my-2">
        <p class=" text-right font-weight-bold">{{ formatedPrice }}</p>
      </div>
      <v-dialog v-model="dialog" fullscreen
      :scrim="true"
      transition="dialog-bottom-transition">
        <template v-slot:activator="{ props }">
          <v-btn color="primary" v-bind="props">
            Voir plus
          </v-btn>
        </template>
        <detailled-vehicle :id="this.id" @close-dialog="this.dialog = !this.dialog"></detailled-vehicle>
      </v-dialog>
      
    </div>
  </v-card>
</template>

<script>
import { useAppStore } from '@/store/app';
import { priceFormatting } from '@/services/common';
import DetailledVehicle from '@/views/DetailledVehicle.vue';

const appStore = useAppStore();
export default {
  props: ['img', 'make', 'model', 'year', 'price', 'promo', 'id'],
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
    },
    formatedPromo() {
      return (this.promo) ? priceFormatting(this.promo) : null;
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
  color: navy;
}

.headColour {
  background-color: gold;
}
</style>