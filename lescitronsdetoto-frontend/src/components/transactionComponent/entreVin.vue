<template>
    <h3>Vin du véhicule</h3>
    <v-row>
        <v-col cols="10">
    <v-text-field v-model="this.storeVehicule.vin" label="Vin du véhicule" density="compact" maxlength="32" :rules="[rules.required]" :error-messages="errorMessages"
                    ></v-text-field> 
        </v-col>
        <v-col cols="1">
                    <v-btn @click="validateNext" color="green-lighten-2">Valider</v-btn>
                </v-col>
        <v-col cols="1">
                    <v-btn prepend-icon="mdi-cancel" color="red-lighten-2" @click="this.storeVehicule.vin = null">vider</v-btn>
        </v-col></v-row>

        <v-virtual-scroll :items="this.allVehicles.unfiltredVehicles" height="300">
  <template v-slot="{ item }">
    <v-row class="ma-2">
        <v-col cols="2">
    {{ item.vin }}
        </v-col>
        <v-col cols="6">    
        {{ item.make }} {{ item.model }} {{  item.year }}
        </v-col>
        <v-col cols="2">    
        {{ item.price }}
    </v-col>
        <v-col cols="2">    
        <v-btn @click="selectVehicle(item.vin)">Choisir</v-btn>  
        </v-col>
    </v-row></template>
</v-virtual-scroll>
<div class="ma-6">
</div>

</template>

<script>
import session from '../../session'
import { useActualyAVehiculeStore } from '@/store/actualyAVehicule';
import { getVehiculefr } from '@/services/vehicule'
import { useVehiclesStore } from '@/store/vehicles';

export default {
    props: {
        id: String,
        mode: String,
    },
    data() {
        return {
            session: session,
            storeVehicule: useActualyAVehiculeStore(),
            allVehicles: useVehiclesStore(),
            errorMessages: [],
            rules: {
                required: value => !!value || "Le champ est requis",
            },
        };
    },
    methods: {
        async validateNext(){

            const vehiculeFind = await getVehiculefr(this.storeVehicule.vin);

            if (this.storeVehicule.vin === '') {
                return;
            }else if(vehiculeFind.vin !== this.storeVehicule.vin) {
                this.errorMessages = ['Aucun véhicule trouvé!'];
            } else {   
                this.storeVehicule.vin = vehiculeFind.vin;
                this.storeVehicule.id_etat = vehiculeFind.id_etat
                this.storeVehicule.couleur = vehiculeFind.couleur
                this.storeVehicule.nombre_kilometre = vehiculeFind.nombre_kilometre
                this.storeVehicule.prix_annonce = vehiculeFind.prix_annonce
                this.storeVehicule.promotion = vehiculeFind.promotion
                this.storeVehicule.description_courte = vehiculeFind.description_courte
                this.storeVehicule.description_longue = vehiculeFind.description_longue
                this.storeVehicule.marque = vehiculeFind.marque
                this.storeVehicule.modele = vehiculeFind.modele
                this.storeVehicule.annee = vehiculeFind.annee
            }
        },
        selectVehicle(vin){
            this.storeVehicule.vin = vin;
            this.storeVehicule.isValidate2 = true;
        },
        clearVIN(){
            this.storeVehicule.vin = null;
            this.storeVehicule.isValidate2 = false;

        }
    },
    computed: {

    },
   
    created() {
        
    },
    mounted() {
        (this.allVehicles.unfiltredVehicles.length === 0) ? this.allVehicles.getVehiclesList(): null;
    }
}
</script>