<template>
    <v-sheet class="mx-14" color="transparent">
      <v-row class=" d-flex">
        <v-col align-self-center cols="12" sm="6" md="4" lg="3" xl="2" xxl="1" v-for="vehicle in vehicles" class="d-flex flex-column">
          <VehicleListItem class="ma-1" :img="vehicle.img" :vin="vehicle.vin" :make="vehicle.make" :model="vehicle.model"
            :price="vehicle.price" :promo="vehicle.promo" :year="vehicle.year" :etat="vehicle.etat" />
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
      return this.store.vehicles.filter(vehicle => vehicle.etat !== 3);
    }
    },
    mounted() {
        this.store.getVehiclesList();
        console.log(this.vehicles);
    }
}
</script>