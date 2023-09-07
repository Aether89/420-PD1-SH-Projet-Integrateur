<template>
    <v-container>
        <v-row>
            <v-col cols="12" sm="4">
                <v-img :src="this.local.img[0]"></v-img>
            </v-col>

            <v-col cols="12" sm="8">
                <div>
                    {{ }}
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>
  
<script>
import { useVehiclesStore } from '@/store/vehicles';
const store = useVehiclesStore;
export default {
    props: {
        id: String,
    },
    data: function () {
        return {
            vin: useVehiclesStore().vehicle.local.vin,
            local: useVehiclesStore().vehicle.local,
            api: useVehiclesStore().vehicle.api
        };
    },
    mounted() {
        store.getVehicle(this.id);
    },
    watch: {
        id(newId) {
            store.getVehicle(this.id);
        },
    }
    }
</script>
  
//   vin: null,
//       local: null,
//       api: null