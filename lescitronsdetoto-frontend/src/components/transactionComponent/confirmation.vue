<template>
    <v-container>
        <v-sheet v-if="session.user && session.user.isAdmin" class="ma-2">
            <v-form @submit.prevent validate-on="submit lazy" ref="vehiculform">
                <v-row>
                    <v-col cols="6">
                        <h3 align="center">Informations véhicule</h3>
                        <v-table>
                            <thead>
                                <tr>
                                <th class="text-left">
                                    Champs
                                </th>
                                <th class="text-left">
                                Informations
                                </th>
                            </tr>
                            <tr>
                                <td>Vin</td>
                                <td>patate</td>
                            </tr>
                            <tr>
                                <td>Marque</td>
                                <td>patate</td>
                            </tr>
                            <tr>
                                <td>Modèle</td>
                                <td>patate</td>
                            </tr>
                            <tr>
                                <td>Année</td>
                                <td>patate</td>
                            </tr>
                            <tr>
                                <td>Couleur</td>
                                <td>patate</td>
                            </tr>
                            <tr>
                                <td>Nombre de kilomètre</td>
                                <td>patate km</td>
                            </tr>
                            <tr>
                                <td>Estimation prix de vente</td>
                                <td>patate</td>
                            </tr>
                            
                            </thead>
                        </v-table>                       
                    </v-col>
                    <v-col cols="6">
                        <h3 align="center">Informations client</h3>
                        <v-table>
                            <thead>
                                
                                <tr>
                                    <th class="text-left">
                                        Champs
                                    </th>
                                    <th class="text-left">
                                        Informations
                                    </th>
                                </tr>
                                <tr>
                                    <td>Nom complet : </td>
                                    <td>{{ this.storeClient.prenomClient }} {{ this.storeClient.nomClient }}</td>
                                </tr>
                                <tr>
                                    <td>Téléphone : </td>
                                    <td>{{ this.storeClient.telephoneClient }}</td>
                                </tr>
                                <tr>
                                    <td>Adresse : </td>
                                    <td > {{ this.storeClient.numeroCivic }} {{ this.storeClient.nomRue }}<v-text v-if="this.storeClient.numeroAppartement"> App.</v-text> {{ this.storeClient.numeroAppartement }}
                                        <v-text v-if="this.storeClient.nomVille">,</v-text> {{ this.storeClient.nomVille }}
                                        <v-text v-if="this.storeClient.nomProvince">,</v-text> {{ this.storeClient.nomProvince }}
                                        <v-text v-if="!this.storeClient.numeroCivic && !this.storeClient.nomRue && !this.storeClient.numeroAppartement && !this.storeClient.nomVille && !this.storeClient.nomProvince && !this.storeClient.numeroAppartement">
                                        N/A
                                        </v-text>
                                    </td>
                                    
                                </tr>
                                <tr>
                                    <td>Code postal : </td>
                                    <td v-if="codePostalVerif">{{ this.storeClient.codePostal }}</td>
                                    <td v-else>N/A</td>
                                </tr>
                            </thead>
                        </v-table>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col><h3 align="center">Finalisation de la transaction</h3></v-col>         
                </v-row>
                <v-row>
                    <v-col md="6" align="right">
                            <tr>
                                <h4 align="left">Transaction fait par :</h4>
                            </tr>
                            <tr>
                                <p align="left"><i>{{ this.storeEmploye.prenomEmploye }} {{ this.storeEmploye.nomEmploye }}</i></p>
                            </tr>
                    </v-col>
                    <v-col md="4">
                    <v-text-field class="no-spinner" v-model="prix_evenement" label="Prix $" density="compact" type="number" step="1" min = "0" :rules="[rules.required]"
                        ></v-text-field>
                    </v-col>
                </v-row>
            </v-form>
        </v-sheet>
    </v-container>
</template>

<script>
import session from '../../session'
import { useClientStore } from '@/store/client';
import { useEmployeStore } from '@/store/employe'
export default {
    props: {
        id: String,
        mode: String,
    },
    data() {
        return {
            storeClient: useClientStore(),
            session: session,
            storeEmploye: useEmployeStore(),
            prix_evenement: null,
            rules: {
                required: value => !!value || "Le champ est requis",
            },
        };
    },
    methods: {
        
    },
    computed: {
        codePostalVerif() {
            if(this.storeClient.codePostal) {
                return true
            } else {
                return false
            }
        },

    },
   
    created() {
        console.log("this.session.user.idEmploye : ",this.session.user.idEmploye)
        console.log("prenom : ", this.storeEmploye.prenomEmploye)
        console.log("nom vendeur", this.storeEmploye.nomEmploye)
        
    },
    mounted() {
        this.storeEmploye.chargerEmploye(this.session.user.idEmploye);
        console.log("mode confirmation : ", this.mode)
    }
}
</script>

<style>
.no-spinner input::-webkit-outer-spin-button,
.no-spinner input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>