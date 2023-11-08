<template>
    <v-container>
        <v-sheet v-if="session.user" class="ma-2 rounded-lg pa-4">
            <v-form @submit.prevent validate-on="submit lazy" ref="vehiculform">
                <v-row>
                    <v-col cols="6">
                        <v-text-field v-if="nouveauvehicule" v-model="this.storeVehicule.vin"
                            label="Identifiant unique du véhicule" density="compact" @blur="autoVin" @keyup.enter="autoVin"
                            :rules="[rules.required]"></v-text-field>
                        <p v-else> VIN :{{ id }}</p>
                        <v-text-field v-model="this.storeVehicule.couleur" label="Couleur du véhicule" density="compact"
                            maxlength="32" :rules="[rules.required]"></v-text-field>
                        <v-text-field class="no-spinner" v-model="this.storeVehicule.nombre_kilometre"
                            label="Nombre de kilomètre" density="compact" type="number" step="1" min=0
                            :rules="[validateNumer]" :error-messages="errorMessages"></v-text-field>
                        <v-text-field class="no-spinner" v-model="this.storeVehicule.prix_annonce" label="Prix annoncé"
                            density="compact" type="number" prefix="$" step="0.01" min=0 :rules="[validateNumer]"
                            :error-messages="errorMessages"></v-text-field>
                        <v-text-field class="no-spinner" v-model="this.storeVehicule.promotion" label="Promotion"
                            density="compact" type="number" prefix="$" step="0.01" min=0 :rules="[validatePromotion]"
                            :error-messages="errorMessagesPromotion"></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="this.storeVehicule.description_courte" label="Description courte du véhicule"
                            density="compact" maxlength="64"></v-text-field>
                        <v-textarea v-model="this.storeVehicule.description_longue" label="Description longue du véhicule"
                            density="compact" maxlength="512"></v-textarea>
                        <SelectAccessoire :vin="this.id" @receiveDataFromChild="receiveEmit" class="mb-4 flex-wrap" />
                        <interventionForm :vin="this.storeVehicule.vin" class="mb-4" v-if="!nouveauvehicule"
                            @refresh-list="refreshList" />
                        <v-card v-if="session.user && interventions && !nouveauvehicule" class="ma-8"
                            color="brown-lighten-4" rounded="t-lg">
                            <v-col cols="12" sm="12">
                                <v-table class="mb-8 bg-brown-lighten-3">
                                    <thead>
                                        <tr>
                                            <th class="start">
                                                Intervention
                                            </th>
                                            <th class="end">
                                                Prix
                                            </th>
                                            <th>Fait</th>
                                        </tr>
                                    </thead>
                                    <tbody class="bg-brown-lighten-4">
                                        <tr v-for="intervention in interventionsCom" :key="intervention.id">
                                            <td class="start">{{ intervention.typeIntervention }}</td>
                                            <td class="end">{{ intervention.valeurIntervention }}</td>
                                            <td>
                                                <input type="checkbox" @click="check(intervention)"
                                                    v-model="intervention.etatIntervention">

                                            </td>
                                        </tr>
                                    </tbody>
                                </v-table>
                            </v-col>
                        </v-card>

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

                <v-btn v-if="mode !== 'vehicule'" prepend-icon="mdi-car-search" color="green-lighten-2" text-align="right"
                    class="mx-2" type="submit" @click="validateVehicule"> {{ boutonText }}
                </v-btn>
                <v-btn v-else @click="validateNext">Valider</v-btn>

                <router-link v-if="mode !== 'vehicule'" :to="{ path: '/' }">
                    <v-btn prepend-icon="mdi-cancel" class="mx-2" aria-label="annuler" color="red-lighten-2">Annuler</v-btn>
                </router-link>
            </v-form>
        </v-sheet>
        <v-sheet v-else class="ma-2">Vous n'avez pas les permissions pour voir cette page</v-sheet>
    </v-container>
</template>

<script>
import session from '../session';
import { useInterventionStore } from '@/store/intervention';
import { fetchInterventionByVIN, updateInterventionWvin } from '@/services/InterventionService';
import { useActualyAVehiculeStore } from '@/store/actualyAVehicule';
import { createVehicule, udpateVoiture } from '../services/vehicule';
import { fetchVIN } from '../services/VINAPI';
import interventionForm from '@/components/interventionComponent/Intervention.vue';
import SelectAccessoire from '@/components/accessoireComponent/SelectAccessoire.vue';
import { useAccessoireStore } from '@/store/accessoire';

export default {
    components: {
        SelectAccessoire: SelectAccessoire,
        interventionForm: interventionForm
    },
    props: ['mode', 'id'],
    data() {
        return {

            errorMessagesPrixAnnonce: [],
            errorMessages: [],
            errorMessagesPromotion: [],
            storeIntervention: useInterventionStore(),
            storeVehicule: useActualyAVehiculeStore(),
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
            Item: [],
            selectedAccessoire: useAccessoireStore().selectedAccessoire,
            couleur: '',
            nombre_kilometre: 0,
            prix_annonce: 0,
            promotion: 0,
            description_courte: '',
            description_longue: '',
            rules: {
                required: value => !!value || "Le champ est requis",
                vinIdUnique: () => this.vinIdUnique || "Ce véhicule existe déjà dans le systeme",
            },
            vinIdUnique: true,


        };
    },
    methods: {
        check(intervention) {
            updateInterventionWvin(intervention, this.vin);
        },
        validatePromotion() {
            if (this.storeVehicule.promotion >= this.storeVehicule.prix_annonce) {
                this.errorMessagesPromotion = ['Le prix de la promotion ne doit pas être supérieur ou égale au prix annoncé'];
                return false;
            }
            this.errorMessagesPromotion = '';
            return true;
        },
        validateNumer(value) {
            if (value <= 0) {
                this.errorMessages = ['Le nombre doit être supérieur à 0'];
                return false;
            }
            this.errorMessages = [];
            return true;
        },
        async refreshVehicule() {
            this.loadError = false;
            this.loading = true;
            this.errorMessage = null;


            if (!this.nouveauvehicule) {

                const formatter = new Intl.NumberFormat('en-US');
                this.storeVehicule.prix_annonce = formatter.format(this.storeVehicule.prix_annonce);
                this.storeVehicule.promotion = formatter.format(this.storeVehicule.promotion);
                console.log("prix_annonce ", this.storeVehicule.prix_annonce, " promotion ", this.storeVehicule.promotion);


            } else {
                this.vehicule = {
                    vin: null,
                    id_etat: null,
                    donneesApi: {
                        marque: null,
                        modele: null,
                        annee: null
                    },
                    couleur: null,
                    nombre_kilometre: 0,
                    prix_annonce: 0,
                    promotion: 0,
                    description_courte: null,
                    description_longue: null,
                    selectedAccessoire: this.selectedAccessoire
                }
                this.rafraichirIntervention();

                this.loading = false;
            }
        },
        async autoVin() {
            if (this.vehiculeVin !== '') {

                this.donneesApi = await fetchVIN(this.vehiculeVin);

                this.storeVehicule.marque = this.donneesApi.Make
                this.storeVehicule.modele = this.donneesApi.Model
                this.storeVehicule.annee = this.donneesApi.ModelYear
                await this.storeVehicule.chargerVehicle(this.vehiculeVin)

            }
        },
        async validateNext() {
            const formValid = await this.$refs.vehiculform.validate();
            if (!formValid.valid) {
                this.storeVehicule.isValidate2 = false;
                return;
            } else {
                this.storeVehicule.isValidate2 = true;
                this.storeVehicule.selectedAccessoire = this.selectedAccessoire;
            }
        },
        async validateVehicule() {
            if (this.nouveauvehicule) {
                this.submitNewVehicule();
            } else {
                this.mettreAJourVehicule();
            }
        },

        async submitNewVehicule() {
            this.loading = true;
            this.vinIdUnique = true;
            const formatter = new Intl.NumberFormat('fr-FR');
            const prix = this.prix_annonce;
            if (this.promotion === null) {
                this.promotion = 0;
            }
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
                description_longue: this.description_longue,
                selectedAccessoire: this.selectedAccessoire

            };
            try {
                await createVehicule(vehicule);
                this.vinIdUnique = true;
                this.creat = true;
                this.$router.push(`/vehicle/${vehicule.vin}`);
                this.rafraichirIntervention();
            } catch (err) {
                console.error(err);
                alert(err.message);
                if (err.status === 409) {
                    this.recetteIdUnique = false;
                }
                await this.$refs.vehiculform.validate();
            }
            this.loading = false;
        },
        async mettreAJourVehicule() {
            const formatter = new Intl.NumberFormat('fr-FR');
            const prix = this.storeVehicule.prix_annonce;
            const promo = this.storeVehicule.promotion;
            const prixFormate = formatter.format(prix);
            const promoFormate = formatter.format(promo);


            const vehicule = {
                vin: this.id,
                id_etat: this.storeVehicule.id_etat,
                couleur: this.storeVehicule.couleur,
                nombre_kilometre: this.storeVehicule.nombre_kilometre,
                prix_annonce: prixFormate,
                promotion: promoFormate,
                description_courte: this.storeVehicule.description_courte,
                description_longue: this.storeVehicule.description_longue,
                selectedAccessoire: this.selectedAccessoire
            };


            try {
                await udpateVoiture(vehicule);
                this.$router.push(`/vehicle/${vehicule.vin}`);
                this.rafraichirIntervention();
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        },
        rafraichirIntervention: async function () {
            this.interventions = await fetchInterventionByVIN(this.id);
        },
        async receiveEmit(data) {
            this.selectedAccessoire = data;
        },
        refreshList() {
             this.rafraichirIntervention();
        }


    },
    computed: {
        interventionsCom() {
            return this.interventions;
        },
        nouveauvehicule() {
            return this.mode === 'vehicule';
        },
        boutonText() {
            return this.nouveauvehicule ? "Ajouter" : "Éditer";
        },
        afficherVin() {
            return this.vin;
        },
        vehiculeVin() {
            return this.nouveauvehicule ? this.storeVehicule.vin : this.id;
        },
    },
    mounted() {
        this.autoVin();
        this.rafraichirIntervention();
    },
    created() {
        this.storeVehicule.newVehicule();
    },
    watch: {
        check(newVal) {
            this.intervention.etatIntervention = newVal;
        },

        selectedAccessoire() {
            this.$emit('receiveDataFromChild', this.selectedAccessoire);
        },
    },
}
</script>

<style>
.no-spinner input::-webkit-outer-spin-button,
.no-spinner input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>