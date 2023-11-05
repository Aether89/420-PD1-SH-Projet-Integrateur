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
            <entreVin :step="step" :mode="mode" :id="id "/>
        </v-card-text>
      </v-window-item>

        <v-window-item :value="2">
            <v-card-text>
                <NewClient :step="step" :mode="mode" :id="id"/>
            </v-card-text>
        </v-window-item>
  
        <v-window-item :value="3">
          <Confirmation :step="step" :mode="mode" :id="id"/>
        </v-window-item>
      </v-window>
  
      <v-divider></v-divider>
  
      <v-card-actions>
        <!--<v-btn
          v-if="step > 1"
          variant="text"
          @click="step--"
        >
          Précédent
        </v-btn>
        
        -->
        <v-spacer></v-spacer>
        <v-btn
          v-if="step === 1"
          :disabled="!isValidate2"
          color="primary"
          variant="flat"
          @click="step++"
        >
          Suivant
        </v-btn>

        <v-btn
          v-if="step === 2"
          :disabled="this.storeClient.isValidate === false"
          color="primary"
          variant="flat"
          @click="step++"
        >
          Suivant
        </v-btn>
        
        <v-btn
          v-if="step === 3"
          :disabled="this.storeTrans.isValidate3 === false"
          prepend-icon="mdi-car-search" color="green-lighten-2"  variant="flat"
          @click="jouter"
          >Envoyé
        </v-btn>
      </v-card-actions>
    </v-card>
  </template>
  
  <script setup>
    import { computed, ref } from 'vue'
    import session from '../session'
    import entreVin from '../components/transactionComponent/entreVin.vue'
    import NewClient from '../components/clientComponent/Client.vue'
    import Confirmation from '../components/transactionComponent/confirmation.vue'
    //import rules from '@/regles';

    
    //import store from '../store/client'
    const step = ref(1)

    const currentTitle = computed(() => {
        switch (step.value) {
            case 1: return 'Information du client';
            case 2: return 'Information du véhicule';
            default: return 'Détail de la transaction';
        }
    });
    /*const prenomClient = ref("");
    function updatePrenomClient(newPrenomClient) {
      prenomClient.value = newPrenomClient;
    }*/

    const getTitleWithoutNumber = computed(() => {
        // Supprimer le chiffre du début du titre
        return currentTitle.value.replace(/\d+/g, '');
    });
  </script>
  
<script>
  import { useClientStore } from '@/store/client';
  import { useActualyAVehiculeStore } from '@/store/actualyAVehicule'
  import { useAchatVenteStore } from '@/store/achatVente'
  import { useEmployeStore } from '@/store/employe'
  //import rules from '@/regles';
  export default {
    data: () => ({
      vin: "",
      step: 1,
      session: session,
      storeClient: useClientStore(),
      storeVehicule: useActualyAVehiculeStore(),
      storeTrans: useAchatVenteStore(),
      storeEmploye: useEmployeStore()
    }),
    props: ['mode', 'id', 'rules'],
    computed: {
        isValidate2() {
          return this.storeVehicule.isValidate2;
        },
      },
    methods:{
      async validForm() {
        const formValid = await this.$refs.clientform.validate();
        if (!formValid.valid) {
            return;
        }
      },
      jouter() {
        const transVente = {
          vin: this.storeVehicule.vin,
          prix_evenement: this.storeTrans.prix_evenement,
          idEmploye: this.storeEmploye.idEmploye,
          nomClient: this.storeClient.nomClient,
          prenomClient: this.storeClient.prenomClient,
          telephoneClient: this.storeClient.telephoneClient,
          numeroCivic: this.storeClient.numeroCivic,
          numeroAppartement: this.storeClient.numeroAppartement,
          nomRue: this.storeClient.nomRue,
          nomVille: this.storeClient.nomVille,
          nomProvince: this.storeClient.nomProvince,
          codePostal: this.storeClient.codePostal
        }
        fetch ('/api/transaction/vente/vehicule',{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
          },
          body: JSON.stringify(transVente)
        }).then((response) => {
          if (response.ok) {
            this.$router.push(`/transaction`);
          } else {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes("application/json")) {
              response.json().then((body) => {
              alert("Erreur: " + body.message);
              });
            } else {
              throw new Error(`Erreur ${response.status}`);
            }
          }
        }).catch((error) => {
          console.error("Erreur", error);
        });
        
      },
      vinAlreadyValidated() {
        this.storeVehicule.vin = this.vin
        this.storeVehicule.isValidate2 = true;
      }
    },
    created() {
      console.log('Mode reçu en props :', this.mode);
      console.log('Session :', this.session.user)
      //console.log('Admin :', session.user.isAdmin);
      console.log("step", this.step)
      this.vin = this.storeVehicule.vin;
      console.log("VIN", this.vin);
      this.storeVehicule.newVehicule();
      this.storeTrans.newTrans();

      if (this.vin !== '' && this.vin !== null) {
        this.storeVehicule.isValidate2 = true;
        this.storeVehicule.vin = this.vin;
      }
      
    },
    mounted() {
      
    }
  }
</script>