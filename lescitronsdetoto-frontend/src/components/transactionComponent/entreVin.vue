<template>
    <h3>Vin du véhicule</h3>
    <v-text-field v-model="this.storeVehicule.vin" label="Vin du véhicule" density="compact" maxlength="32" :rules="[rules.required]" :error-messages="errorMessages"
                    ></v-text-field>
    <v-btn @click="validateNext">Valider</v-btn>
</template>

<script>
import session from '../../session'
import { useActualyAVehiculeStore } from '@/store/actualyAVehicule';
import { getVehiculefr } from '@/services/vehicule'
export default {
    props: {
        id: String,
        mode: String,
    },
    data() {
        return {
            session: session,
            storeVehicule: useActualyAVehiculeStore(),
            errorMessages: [],
            rules: {
                required: value => !!value || "Le champ est requis",
            },
        };
    },
    methods: {
        async validateNext(){
            console.log("this.storeVehicule.vin", this.storeVehicule.vin)

            const vehiculeFind = await getVehiculefr(this.storeVehicule.vin);
            console.log("vehiculeFind.vin", vehiculeFind.vin)
            if (this.storeVehicule.vin === '') {
                return;
            }else if(vehiculeFind.vin !== this.storeVehicule.vin) {
                this.errorMessages = ['Aucun véhicule trouvé!'];
            } else {   
                this.storeVehicule.isValidate2 = true;
            }
            
        }
    },
    computed: {

    },
   
    created() {
        
    },
    mounted() {

    }
}
</script>