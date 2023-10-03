<template>
    <v-card
      class="mx-auto"
      max-width="80%"
    >
      <v-card-title class="text-h6 font-weight-regular justify-space-between">
        <span>{{ currentTitle }}</span>
        <v-avatar
          color="primary"
          size="24"
          v-text="step"
        ></v-avatar>
      </v-card-title>
  
      <v-window v-model="step">
        <v-window-item :value="1">
          <v-card-text>
            <v-text-field
              label="Email"
              placeholder="john@google.com"
            ></v-text-field>
            <span class="text-caption text-grey-darken-1">
              This is the email you will use to login to your Vuetify account
            </span>
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
        <v-btn
          v-if="step < 3"
          color="primary"
          variant="flat"
          @click="step++"
        >
          Next
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script setup>
    import { computed, ref } from 'vue'
    import NewVehicule from './NewVehicule.vue'
    const step = ref(1)
  
    const currentTitle = computed(() => {
      switch (step.value) {
        case 1: return 'Information du vendeur'
        case 2: return 'Information du véhicule'
        default: return 'Détail de la transaction'
      }
    })
  </script>
  
  <script>
    export default {
        
      data: () => ({
        step: 1,
      }),
      props: ['mode', 'id'],
  
      computed: {
        currentTitle () {
          switch (this.step) {
            case 1: return 'Information du vendeur'
            case 2: return 'Information du véhicule'
            default: return 'Détail de la transaction'
          }
        },
      },
      created() {
        console.log('Mode reçu en props :', this.mode);
    },
    }
  </script>