<template>
    <v-container>
    <v-sheet v-if="session.user && session.user.isAdmin" class="ma-2">
        <v-form @submit.prevent validate-on="submit lazy" ref="vehiculform">
            <v-row>
                <v-col cols="6">
                    <v-text-field v-if="nouveauvehicule" v-model="this.storeVehicule.vin" label="Identifiant unique du véhicule" density="compact"  @blur="autoVin" @keyup.enter="autoVin"
                        :rules="[rules.required]"></v-text-field>
                    <p v-else >  VIN :{{ id }}</p>
                    <v-text-field v-model="this.storeVehicule.couleur" label="Couleur du véhicule" density="compact" maxlength="32" :rules="[rules.required]"
                    ></v-text-field>
                    <v-text-field class="no-spinner" v-model="this.storeVehicule.nombre_kilometre" label="Nombre de kilomètre" density="compact" type="number" step="1" min = 0 :rules="[validateNumer]" :error-messages="errorMessages"
                    ></v-text-field>
                    <v-text-field class="no-spinner" v-model="this.storeVehicule.prix_annonce" label="Prix annoncé" density="compact" type="number" prefix="$" step="0.01" min = 0 :rules="[validateNumer]" :error-messages="errorMessages" 
                    ></v-text-field>
                    <v-text-field class="no-spinner" v-model="this.storeVehicule.promotion" label="Promotion" density="compact" type="number" prefix="$" step="0.01" min = 0  :rules="[validatePromotion]" :error-messages="errorMessagesPromotion"
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field v-model="this.storeVehicule.description_courte" label="Description courte du véhicule" density="compact" maxlength="64"
                    ></v-text-field>
                    <v-textarea v-model="this.storeVehicule.description_longue" label="Description longue du véhicule" density="compact"  maxlength="512"
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
            
            <v-btn v-if="mode !== 'vehicule'" prepend-icon="mdi-car-search" color="green-lighten-2" 
                text-align="right" class="mx-2" type="submit" @click="validateVehicule"> {{ boutonText }}
            </v-btn>
            <v-btn v-else @click="validateNext">Valider</v-btn>

            <router-link v-if="mode !== 'vehicule'" :to="{path: '/' }">
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
import { useVehiclesStore } from '@/store/vehicles';
import { useActualyAVehiculeStore } from '@/store/actualyAVehicule';
import { createVehicule, udpateVoiture, getVehiculefr } from '../services/vehicule';
import { fetchVIN } from '../services/VINAPI';
import SelectAccessoire from '@/components/accessoireComponent/SelectAccessoire.vue';



const store = useVehiclesStore();
export default {
    components: {
        SelectAccessoire: SelectAccessoire

    },
    props: ['mode', 'id'],
    data() {
        return {
            //nombre_kilometre: null,
            errorMessagesPrixAnnonce: [],
            errorMessages: [],
            errorMessagesPromotion: [],
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
            selectedAccessoire: SelectAccessoire,
            couleur: '',
            nombre_kilometre: 0,
            prix_annonce: 0,
            promotion: 0,
            description_courte: '',
            description_longue: '',
            rules: {
                required: value => !!value || "Le champ est requis",
                vinIdUnique: () => this.vinIdUnique || "Ce véhicule existe déjà dans le systeme",
                //validateNumer: value => !!value || "Le champs doit être supérieur de 0"
            },
            vinIdUnique: true

        };
    },
    methods: {
        validatePromotion() {
            if (this.storeVehicule.promotion >= this.storeVehicule.prix_annonce) {
                console.log("promo", this.storeVehicule.promotion)
                console.log("prix", this.storeVehicule.prix_annonce)
                this.errorMessagesPromotion = ['Le prix de la promotion ne doit pas être supérieur ou égale au prix annoncé'];
                return false;
            }
            this.errorMessagesPromotion = [];
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
            this.recette = null;

            if (!this.nouveauvehicule) {
                /*console.log("refresh vehiculeVin", this.vehiculeVin)
                //const vehiculepatate = await getVehiculefr(this.vehiculeVin);
                //console.log("vehiculepatate", vehiculepatate)
                getVehiculefr(this.vehiculeVin).then(vehicule => {
                    this.vehicule = vehicule;
                    this.loading = false;
                    console.log("refresh", this.vehicule)
                }).catch(err => {
                    this.recette = null;
                    this.loadError = true;
                    this.loading = false;
                    this.errorMessage = err.message;
                });*/

                const formatter = new Intl.NumberFormat('en-US');

                const vehicule = await getVehiculefr(this.id);
                console.log("refresh vehicule", vehicule)
                this.vin = vehicule.vin;
                this.id_etat = vehicule.id_etat;
                this.donneesApi.marque = vehicule.marque;
                this.donneesApi.modele = vehicule.modele;
                this.donneesApi.annee = vehicule.annee;
                this.couleur = vehicule.couleur;
                this.nombre_kilometre = vehicule.nombre_kilometre;
                this.prix_annonce = parseFloat(vehicule.prix_annonce.replace(/\s+/g, '').replace(',', '.'));
                this.promotion = parseFloat(vehicule.promotion.replace(/\s+/g, '').replace(',', '.'));
                this.description_courte = vehicule.description_courte;
                this.description_longue = vehicule.description_longue;
                this.loading = false;
                console.log("this.prix_annonce", this.prix_annonce)
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
                    selectedAccessoire: []
                }
                this.loading = false;
            }
        },
        async autoVin() {
            if (this.vehiculeVin !== '') {
                console.log(this.vehiculeVin);
                this.donneesApi = await fetchVIN(this.vehiculeVin);
                console.log("this.donneesApi", this.donneesApi.Make)
                this.storeVehicule.marque = this.donneesApi.Make
                this.storeVehicule.modele = this.donneesApi.Model
                this.storeVehicule.annee = this.donneesApi.ModelYear
            }
        },
        async validateNext(){
            const formValid = await this.$refs.vehiculform.validate();
            if (!formValid.valid) {
                this.storeVehicule.isValidate2 = false;
                return;
            } else {
                this.storeVehicule.isValidate2 = true;
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
            this.loading = false;
        },
        async mettreAJourVehicule() {
            const formatter = new Intl.NumberFormat('fr-FR');
            const prix = this.prix_annonce;
            const promo = this.promotion;
            const prixFormate = formatter.format(prix);
            const promoFormate = formatter.format(promo);

            const vehicule = {
                vin: this.id,
                id_etat: this.id_etat,
                couleur: this.couleur,
                nombre_kilometre: this.nombre_kilometre,
                prix_annonce: prixFormate,
                promotion: promoFormate,
                description_courte: this.description_courte,
                description_longue: this.description_longue
            };
            console.log("cest lequel", this.id);
            console.log("couleur", vehicule.couleur);

            try {
                await udpateVoiture(vehicule);
                this.$router.push(`/vehicle/${vehicule.vin}`);
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        }
    },
    computed: {
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
            return this.nouveauvehicule? this.storeVehicule.vin : this.id;
        },  
    },
    mounted() {
        this.autoVin();
        this.refreshVehicule(this.vehiculeVin);
    },
    created() {
        console.log('Mode reçu en props :', this.mode);
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