<template>
    <v-card
      class="mx-auto"
      max-width="80%"
    >
      <v-card-title class="text-h6 font-weight-regular justify-space-between">
        <span>{{ getTitleWithoutNumber }}</span>
        <v-avatar
          color="primary"
          size="24"
          v-text="step"
        ></v-avatar>
      </v-card-title>
  
      <v-window v-model="step">
        <v-window-item :value="1">
            <v-card-text>
                <NewClient :step="step" :mode="mode" :id="id"/>
            </v-card-text>
        </v-window-item>
  

      <v-window-item :value="2">
        <v-card-text>
            <NewVehicule :step="step" :mode="mode" :id="id"/>
        </v-card-text>
      </v-window-item>
  
        <v-window-item :value="3">
          <div class="pa-4 text-center">
            <v-img
              class="mb-4"
              contain
              height="128"
              src="https://cdn.vuetifyjs.com/images/logos/v.svg"
            ></v-img>
            <h3 class="text-h6 font-weight-light mb-2">
              Welcome to Vuetify
            </h3>
            <span class="text-caption text-grey">Thanks for signing up!</span>
          </div>
        </v-window-item>
      </v-window>
  
      <v-divider></v-divider>
  
      <v-card-actions>
        <v-btn
          v-if="step > 1"
          variant="text"
          @click="step--"
        >
          Back
        </v-btn>
        <v-spacer></v-spacer>
        <router-link :to="{path: '/' }">
          <v-btn prepend-icon="mdi-cancel" class="mx-2" aria-label="annuler" color="red-lighten-2"
          >Annuler</v-btn>
            </router-link>
        <v-spacer></v-spacer>
        <v-btn
          v-if="step < 3"
          color="primary"
          variant="flat"
          @click="step++"
        >
          Next
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
    import session from '@/session'
    import NewVehicule from './NewVehicule.vue'
    import NewClient from '../components/clientComponent/Client.vue'
    const step = ref(1)

    const currentTitle = computed(() => {
        switch (step.value) {
            case 1: return 'Information du vendeur';
            case 2: return 'Information du véhicule';
            default: return 'Détail de la transaction';
        }
    });

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
      }),
      props: ['mode', 'id'],
  
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