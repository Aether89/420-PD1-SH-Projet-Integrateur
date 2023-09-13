<template>
    <v-container>
    <v-sheet v-if="session.user && session.user.isAdmin" class="ma-2">
        <v-form @submit.prevent="submitNewVehicule" validate-on="submit lazy" ref="vehiculform">
            <v-row>
                <v-col cols="6">
                    <v-text-field v-model="vin" label="Identifiant unique du véhicule" density="compact"  @blur="autoVin" @keyup.enter="autoVin"
                        :rules="[rules.required]"></v-text-field>
                    <v-text-field v-model="couleur" label="Couleur du véhicule" density="compact" maxlength="32"
                    ></v-text-field>
                    <v-text-field v-model="nombre_kilometre" label="Nombre de kilomètre" density="compact" type="number" step="1" min = 0
                    ></v-text-field>
                    <v-text-field v-model="prix_annonce" label="Prix annoncé" density="compact" type="number" prefix="$" step="0.01" min = 0
                    ></v-text-field>
                    <v-text-field v-model="promotion" label="Promotion" density="compact" type="number" prefix="$" step="0.01" min = 0
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field v-model="description_courte" label="Description courte du véhicule" density="compact" maxlength="64"
                    ></v-text-field>
                    <v-textarea v-model="description_longue" label="Description longue du véhicule" density="compact"  maxlength="512"
                    ></v-textarea>
                </v-col>
            </v-row>
            <v-row>
                <v-col cols="12" sm="4">
                    <v-table>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Information
                                </th>
                                <th class="text-left">
                                    Spécification
                                </th>
                            </tr>
                            <tr v-if="this.donneesApi.Make !== ''">
                                <td>Marque : </td>
                                <td>{{ this.donneesApi.Make }}</td>
                            </tr>
                            <tr v-if="this.donneesApi.Model !== ''">
                                <td>Model</td>
                                <td>{{ this.donneesApi.Model }}</td>
                            </tr>
                            <tr v-if="this.donneesApi.ModelYear !== ''">
                                <td>Année</td>
                                <td>{{ this.donneesApi.ModelYear }}</td>
                            </tr>
                        </thead>
                    </v-table>
                </v-col>
            </v-row>
            <br>
            
            <v-btn v-if="!nouveauvehicule" prepend-icon="mdi-car-search" color="green-lighten-2" 
                text-align="right" class="mx-2" type="submit" @click="updateVehicule">Editer</v-btn>
            <v-btn v-else prepend-icon="mdi-car-search" color="green-lighten-2" 
                text-align="right" class="mx-2" type="submit" @click="submitNewVehicule">Ajouter</v-btn>

            <router-link :to="{path: '/' }">
                <v-btn prepend-icon="mdi-cancel" class="mx-2" aria-label="annuler" color="red-lighten-2"
                >Annuler</v-btn>
            </router-link>
        </v-form>
    </v-sheet>
    <v-sheet v-else class="ma-2">Vous n'avez pas les permissions pour voir cette page</v-sheet>
</v-container>
</template>

<script>
import session from '../session';
import { createVehicule } from '../services/vehicule';
import { fetchVIN } from'../services/VINAPI';

export default {
    props: ['mode'],
    data() {
        return {
            session: session,
            loading: true,
            loadError: false,
            errorMessage: null,
            vin: '',
            id_etat: 1,
            donneesApi: {
                marque: '',
                modele: '',
                annee: ''
            },
            couleur: '',
            nombre_kilometre: 0,
            prix_annonce: 0,
            promotion: 0,
            description_courte: '',
            description_longue: '',   
            rules: {
                required: value => !!value || "Le champ est requis",
                vinIdUnique: () => this.vinIdUnique || "Ce véhicule existe déjà dans le systeme"
            },
            vinIdUnique: true
            
        };
    },
    methods: {
        async autoVin() {
            this.donneesApi = await fetchVIN(this.vin);
        },
        async submitNewVehicule() {
            this.vinIdUnique = true;
            const formatter = new Intl.NumberFormat('fr-FR');
            const prix = this.prix_annonce;
            const promo = this.promotion;
            const prixFormate = formatter.format(prix);
            const promoFormate = formatter.format(promo);

            const formValid = await this.$refs.vehiculform.validate();
            
            if (!formValid.valid) {
                return;
            }
            const vehicule = {
                vin: this.vin,
                id_etat: this.id_etat,
                marque: this.marque,
                modele: this.modele,
                annee: this.annee,
                couleur: this.couleur,
                nombre_kilometre: this.nombre_kilometre,
                prix_annonce: prixFormate,
                promotion: promoFormate,
                description_courte: this.description_courte,
                description_longue: this.description_longue
            };
            try {
                await createVehicule(vehicule);
                this.vinIdUnique = true;
                this.$router.push(`/vehicle/${vehicule.vin}`);
            } catch (err) {
                console.error(err);
                alert(err.message);
                if (err.status === 409) {
                    this.recetteIdUnique = false;
                }
                await this.$refs.vehiculform.validate();
            }
        }
    },
    computed: {
        nouveauvehicule() {
            return this.mode === 'newvehicle';
        }
    }
}
</script>
