<template>
    <v-card
      class="mx-auto"
      max-width="80%"
    ><v-toolbar class="bg-orange-darken-4">
      <v-card-title class="text-h6 font-weight-regular justify-space-between">
        <span>{{ getTitleWithoutNumber }}</span>
      </v-card-title>
      <v-spacer></v-spacer>
        <router-link :to="{path: '/' }">
          <v-btn variant="flat" prepend-icon="mdi-cancel" class="mx-2 text-red-accent-3 font-weight-bold " aria-label="annuler" color="white-darken-2" 
          >Annuler</v-btn>
            </router-link>
    </v-toolbar>
      <v-window v-model="step">
        <v-window-item :value="1">
            <v-card-text>
                <NewClient :step="step" :mode="mode" :id="id" :prenomClient="prenomClient"
            @client-info="updatePrenomClient"/>
            </v-card-text>
        </v-window-item>
  

      <v-window-item :value="2">
        <v-card-text>
            <NewVehicule :step="step" :mode="mode" :id="id"/>
        </v-card-text>
      </v-window-item>
  
        <v-window-item :value="3">
          <Confirmation :step="step" :prenomClient="prenomClient"/>
        </v-window-item>
      </v-window>
  
      <v-divider></v-divider>
  
      <v-card-actions>
        <v-btn
          v-if="step > 1"
          variant="text"
          @click="step--"
        >
          Précédent
        </v-btn>
        
        <v-spacer></v-spacer>
        <v-btn
          v-if="step < 3"
          color="primary"
          variant="flat"
          @click="step++"
        >
          Suivant
        </v-btn>
        
        <v-btn
          v-if="step === 3"
          prepend-icon="mdi-car-search" color="green-lighten-2"  variant="flat">Envoyé
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script setup>
    import { computed, ref } from 'vue'
    import session from '../session'
    import NewVehicule from './NewVehicule.vue'
    import NewClient from '../components/clientComponent/Client.vue'
    import Confirmation from '../components/transactionComponent/confirmation.vue'
    //import store from '../store/client'
    const step = ref(1)

    const currentTitle = computed(() => {
        switch (step.value) {
            case 1: return 'Information du vendeur';
            case 2: return 'Information du véhicule';
            default: return 'Détail de la transaction';
        }
    });
    const prenomClient = ref("");
    function updatePrenomClient(newPrenomClient) {
      prenomClient.value = newPrenomClient;
    }

    const getTitleWithoutNumber = computed(() => {
        // Supprimer le chiffre du début du titre
        return currentTitle.value.replace(/\d+/g, '');
    });
  </script>
  
  <script>
  export default {
      data: () => ({
        step: 1,
        session: session,
        //prenomClient: ""
                
      }),
      props: ['mode', 'id', 'prenomClient'],
  
      computed: {
        
      },
      created() {
        console.log('Mode reçu en props :', this.mode);
        console.log('Session :', session)
        //console.log('Admin :', session.user.isAdmin);
        console.log("step", this.step)
    },
    }
  </script>