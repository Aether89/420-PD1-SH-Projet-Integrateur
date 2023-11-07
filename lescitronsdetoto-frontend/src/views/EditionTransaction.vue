<template>
  <v-toolbar dark color="lime" >
    <v-toolbar-title @click="$emit('closeDialog')">Les citrons de Toto</v-toolbar-title>
    <v-spacer></v-spacer>
    <v-toolbar-items> <v-btn bg-color="error" icon dark @click="$emit('closeDialog')">
        <v-icon>mdi-close</v-icon>
      </v-btn></v-toolbar-items>
  </v-toolbar>
  <v-card class="pa-16" color="blue-lighten-1" justify="center">
  
    <v-form @submit.prevent="submitForm">

      <v-row>
        <!-- Bloc Employé -->
        <v-col cols="4">
          <v-card max-width="600" class="mb-4">
            <v-card-title class="section-title bg-orange darken-4 mb-4" justify="center">Employé</v-card-title>
            <v-card-text>
              <v-select @keydown.esc="$emit('closeDialog')" v-model="idEmploye" :items="employerStore.employes" :item-props="itemProps" label="Employé" dense></v-select>
            </v-card-text>
          </v-card>
          <!-- Bloc Véhicule -->
          <v-card max-width="600">
            <v-card-title class="section-title bg-orange darken-4 mb-4" justify="center">Véhicule</v-card-title>
            <v-card-text>
              <v-text-field @keydown.esc="$emit('closeDialog')" v-model="vin" label="VIN"></v-text-field>
              <v-text-field  @keydown.esc="$emit('closeDialog')" bg-color="white" class="no-spinner" v-model="this.prix" label="Prix de la transaction"
                density="compact" type="number" prefix="$" step="0.01" min=0
                required></v-text-field>
            </v-card-text>
          </v-card>
        </v-col>
        <!-- Bloc Client -->
        <v-col cols="4">
          <clientForm @keydown.esc="$emit('closeDialog')" mode="transaction" :id="this.idClient"></clientForm>
        </v-col>

        <v-col cols="4">
          <v-btn @keydown.esc="$emit('closeDialog')" type="submit" size="x-large" block color="primary" @click="submitForm">Soumettre</v-btn>

        </v-col>
      </v-row>
    </v-form>
  </v-card>
</template>
  
<script>
import session from '@/session';
import { useClientStore } from '@/store/client';
import ClientForm from '@/components/clientComponent/Client.vue';
import { useEmployeStore } from '@/store/employe';
import { getEmployeID } from '@/services/EmployeService';
import { useVehiclesStore } from '@/store/vehicles';
import rules from '@/regles';

export default {
  components: {
    clientForm: ClientForm,
  },
  props: {
    id_evenement: Number,
    strPrix: String,
    idClient: Number,
    user_account_id: String,
    mode: String,
  },
  data() {
    return {
      vin: '',
      idEmploye: '',
      prix: '',
      sessions: session,
      clientStore: useClientStore(),
      employerStore: useEmployeStore(),
      vehicleStore: useVehiclesStore(),
      rules: rules,
    };
  },
  methods: {
    submitForm() {
      // Traitement du formulaire ici
      // Vous pouvez accéder aux données du formulaire à partir de this.idEmploye, this.nomClient, etc.
    },
    async init() {
    
      this.prix = this.strPrix.replace(/[$,]/g, '');

      this.clientStore.chargerClient(this.idClient);
      this.employerStore.getEmployes();
      this.idEmploye = await getEmployeID(this.user_account_id);
      this.vin = await this.getVinEvenement();
      this.vehicleStore.getVehicle(this.vin);
      console.log(JSON.stringify(this.vehicleStore.vehicles,null,2));
    },
    itemProps (item) {
        return {
          value: item.idEmploye,
          title: item.prenomEmploye + ' ' + item.nomEmploye,
          subtitle: item.posteEmploye,
        }
      },
      async getVinEvenement() {
        const result = await fetch(`/api/transaction/${this.id_evenement}`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        ...session.getAuthHeaders()
      }
    });
  
    if (result.status === 200) {
      const data = await result.json();
      return data.vin;
    } else {
      console.error(`Error: Status code ${result.status} lors de la récupération de l'employe`);
    }
          },
closeDialog() {
      this.$emit('closeDialog');
    },
  },
  watch: {
    vin(newVal,oldVal){
      newVal !== oldVal ? this.vehicleStore.getVehicle(newVal) : null;
    },
  },
  mounted() {
    this.init();
  },
};
</script>
  