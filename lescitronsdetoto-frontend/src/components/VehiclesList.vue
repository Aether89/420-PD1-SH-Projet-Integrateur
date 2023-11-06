<template>
    <v-sheet class="mx-4" color="transparent">
      <v-row class="flex d-flex">
        <v-col align-self-center cols="12" sm="6" md="4" lg="3" xl="2" xxl="1" v-for="vehicle in vehicles" class="flex d-flex flex-column">
          <VehicleListItem :img="vehicle.img" :vin="vehicle.vin" :make="vehicle.make" :model="vehicle.model"
            :price="vehicle.price" :promo="vehicle.promo" :year="vehicle.year" />
        </v-col>
      </v-row>
    </v-sheet>
  </template>

<script>
import VehicleListItem from '@/components/VehicleListItem.vue';
import { useVehiclesStore } from '@/store/vehicles';

export default {
    components: {
        VehicleListItem: VehicleListItem
    },
    data() {
        return {
            store: useVehiclesStore(),
        };
    },
    computed: {
    vehicles() {
      return this.store.vehicles;
    }
    },
    mounted() {
        this.store.getVehiclesList();
    }
}
</script>