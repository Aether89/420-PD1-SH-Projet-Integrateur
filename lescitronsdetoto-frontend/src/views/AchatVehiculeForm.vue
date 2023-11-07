<template>
    <v-card
      class=" bg-grey-lighten-3 mt-4 mx-auto"
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
                <NewClient class="mx-auto" :step="step" :mode="mode" :id="id"/>
            </v-card-text>
        </v-window-item>
  

      <v-window-item :value="2">
        <v-card-text>
            <NewVehicule class="mx-auto" :step="step" :mode="mode" :id="id "/>
        </v-card-text>
      </v-window-item>
  
        <v-window-item :value="3">
          <Confirmation class="mx-auto" :step="step" :mode="mode" :id="id"/>
        </v-window-item>
      </v-window>
  
      <v-divider></v-divider>
  
      <v-card-actions>
        <!--<v-btn
          v-if="step > 1"
          variant="text"
          @click="goToPreviousStep step--"
        >
          Précédent
        </v-btn>-->
        
        <v-spacer></v-spacer>
        <v-btn
          v-if="step === 1"
          :disabled="this.storeClient.isValidate === false"
          color="primary"
          variant="flat"
          @click="step++"
        >
          Suivant
        </v-btn>

        <v-btn
          v-if="step === 2"
          :disabled="this.storeVehicule.isValidate2 === false"
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
    import NewVehicule from './NewVehicule.vue'
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
  import { reactive } from 'vue'
  //import rules from '@/regles';
  export default {
    data: () => ({
      step: 1,
      session: session,
      storeClient: useClientStore(),
      storeVehicule: useActualyAVehiculeStore(),
      storeTrans: useAchatVenteStore(),
      storeEmploye: useEmployeStore()
    }),
    props: ['mode', 'id', 'rules'],
    computed: {
        /*formState() {
          reactive({
            validate
          })
        }*/
      },
    methods:{
      async validForm() {
        const formValid = await this.$refs.clientform.validate();
        if (!formValid.valid) {
            return;
        }
      },
      goToPreviousStep() {
        if(this.step === 3) {
          this.storeVehicule.isValidate2 = false;
         
        } else if(this.step === 2) {
          this.storeClient.isValidate = false;
         
        }
      },
      jouter() {
        const transAchat = {
          vin: this.storeVehicule.vin,
          id_etat: 1,
          couleur: this.storeVehicule.couleur,
          nombre_kilometre: this.storeVehicule.nombre_kilometre,
          prix_annonce: this.storeVehicule.prix_annonce,
          promotion: this.storeVehicule.promotion,
          description_courte: this.storeVehicule.description_courte,
          description_longue: this.storeVehicule.description_longue,
          prix_evenement: this.storeTrans.prix_evenement,
          idEmploye: this.storeEmploye.idEmploye,
          client: {
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
        }
        fetch("/api/vehicule",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...session.getAuthHeaders()
          },
          body: JSON.stringify(transAchat)
        }).then((response) => {
          if (response.ok) {
            this.$router.push(`/vehicle/${transAchat.vin}`);
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
      }
    },
    created() {
      this.storeVehicule.newVehicule();
      this.storeTrans.newTrans();
    },
  }
</script>