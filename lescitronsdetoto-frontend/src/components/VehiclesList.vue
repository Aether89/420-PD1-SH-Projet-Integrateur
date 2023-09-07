<template>
    <v-container>
      <v-row class="flex d-flex">
        <v-col align-self-center cols="12" xs="4" sm="3" lg="2" v-for="vehicle in vehicles" class="flex d-flex flex-column">
          <VehicleListItem :img="vehicle.img" :id="vehicle.id" :make="vehicle.make" :model="vehicle.model"
            :price="vehicle.price" :year="vehicle.year">
          </VehicleListItem>
        </v-col>
      </v-row>
    </v-container>
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