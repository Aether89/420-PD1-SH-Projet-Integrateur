<template>
    <v-sheet color="light-blue">
        <v-toolbar v-if="isDialog" dark color="lime">
            <v-toolbar-title @click="$emit('closeDialog')">Les citrons de Toto</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn @click="partager" variant="text" aria-label="partager" icon="mdi-share-variant"></v-btn>
            <v-toolbar-items> <v-btn bg-color="error" icon dark @click="$emit('closeDialog')">
                    <v-icon>mdi-close</v-icon>
                </v-btn></v-toolbar-items>
        </v-toolbar>

        <v-container color="blue-lighten-1">
            <div class="ma-4">
                <v-row v-if="!this.load" class="flex d-flex">
                    <v-col cols="12" sm="4">
                        <v-carousel height="250" width="350" hide-delimiter-background show-arrows="hover">
                            <v-carousel-item v-for="(item, index) in this.local.img" :key="index" :src="item">
                            </v-carousel-item>
                        </v-carousel>
                    </v-col>

                    <v-col cols="12" sm="4">
                        <div>
                            <h3>{{ this.api.Make }} {{ this.api.Model }} {{ this.api.ModelYear }}</h3>
                            <h4 v-if="this.api.Series !== ''">{{ this.api.Series }}</h4>
                            <p>{{ this.local.shortDescription }}</p>
                            <p><strong>VIN:</strong> {{ this.id }}</p>
                        </div>
                    </v-col>
                    <v-col cols="12" sm="4">
                        <v-card :color="this.colourPrimary" class="pa-2">
                            <div v-if="this.local.promo">
                                <h3>Promotion: {{ this.promoPrice }}</h3>
                                <p class="text-decoration-line-through">Prix régulier: {{ this.regPrice }}</p>
                            </div>
                            <div v-else>
                                <h3>Prix: {{ this.regPrice }}</h3>
                            </div>
                        </v-card>

                        <v-card v-if="session.user" color="lime-lighten-1" class="pa-2 text-center mt-4">
                            <v-btn class="ma-2" type="button" prepend-icon="mdi-shopping" color="green-lighten-3"
                                aria-label="Éditer" :to="venteURL">Vendre</v-btn>
                            <v-btn class="ma-2" type="button" prepend-icon="mdi-file-edit-outline" color="amber-lighten-3"
                                aria-label="Éditer" :to="editionURL" router-link>Éditer</v-btn>
                            <v-btn class="ma-2" type="button" prepend-icon="mdi-delete" @click="suppression"
                                aria-label="Supprimer" color="red-lighten-3">Supprimer</v-btn>
                        </v-card>

                        <v-card :color="this.colourSecondary" class="pb-6 text-center mt-4">
                            <v-card-title>Ce véhicule m'interesse</v-card-title>
                            <v-btn v-bind="props" size="large" @click="dialog = !dialog">Prendre un<br>rendez-vous</v-btn>

                            <v-dialog v-model="dialog" persistent transition="dialog-bottom-transition" width="auto">
                                <reservation-form :vin="this.local.vin" :vehicule="concatName"
                                    @close-Reservation-Dialog="this.dialog = !this.dialog" />
                            </v-dialog>
                        </v-card>

                    </v-col>
                </v-row>

                <v-row v-if="!this.load">
                    <v-col cols="12" sm="4">
                        <v-table class="mb-8">
                            <thead>
                                <tr>
                                    <th class="text-left">
                                        Information
                                    </th>
                                    <th class="text-left">
                                        Spécification
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-if="this.local.colour !== null">
                                    <td>Couleur</td>
                                    <td>{{ this.local.colour }}</td>
                                </tr>
                                <tr v-if="this.api.TransmissionStyle !== ''">
                                    <td>Transmission</td>
                                    <td>{{ this.api.TransmissionStyle }}</td>
                                </tr>
                                <tr v-if="this.api.DisplacementL !== ''">
                                    <td>Moteur</td>
                                    <td>{{ this.api.DisplacementL }}L</td>
                                </tr>
                                <tr v-if="this.api.EngineCylinders !== ''">
                                    <td>Cylindre</td>
                                    <td>{{ this.api.EngineCylinders }}</td>
                                </tr>
                                <tr v-if="this.local.km !== null">
                                    <td>KM</td>
                                    <td>{{ this.local.km }}</td>
                                </tr>
                                <tr v-if="this.api.TractionControl !== ''">
                                    <td>Traction</td>
                                    <td>{{ this.api.TractionControl }}</td>
                                </tr>
                                <tr v-if="this.api.Doors !== ''">
                                    <td>Porte</td>
                                    <td>{{ this.api.Doors }}</td>
                                </tr>
                                <tr v-if="this.api.FuelTypePrimary !== ''">
                                    <td>Carburant</td>
                                    <td>{{ this.api.FuelTypePrimary }}</td>
                                </tr>
                                <tr v-if="this.api.FuelTypeSecondary !== ''">
                                    <td>Carburant Secondaire</td>
                                    <td>{{ this.api.FuelTypeSecondary }}</td>
                                </tr>
                                <tr v-if="this.api.FuelTypeSecondary !== ''">
                                    <td>Catégorie</td>
                                    <td>{{ this.api.FuelTypeSecondary }}</td>
                                </tr>
                                <tr v-if="this.api.BodyClass !== ''">
                                    <td>Categorie</td>
                                    <td>{{ this.api.BodyClass }}</td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-col>

                    <v-col cols="12" sm="8">
                        <v-card v-if="this.local.selectedAccessoire" class=" mb-8" rounded="t-lg">
                            <v-sheet class="pa-3 bg-primary text-center">
                                Listes des accessoires
                            </v-sheet>
                            <div>
                                <v-chip class="ma-2" v-for="name in this.names">
                                    {{ name }}
                                </v-chip>
                            </div>
                        </v-card>
                        <v-card v-if="(this.session.user && (this.interventions.length > 0))" class=" mb-8" rounded="t-lg">

                            <div v-for="intervention in  this.interventions ">
                                {{ intervention.typeIntervention }}{{ intervention.valeurIntervention }}

                                <!-- <v-checkbox v-model="intervention.etatIntervention" label="Fait" dense></v-checkbox> -->
                            </div>
                        </v-card>
                        <v-card class=" pa-8 mb-8" :color="this.colourPrimary">{{ this.local.longDescription }}
                        </v-card>

                    </v-col>
                </v-row>
            </div>
        </v-container>
        <v-btn v-if="!this.loading && isDialog" size="x-large" aria-label="fermer dialogue véhicule" color="red-lighten-3"
            block @click="$emit('closeDialog')"><v-icon size="x-large" icon="mdi-menu-down"></v-icon></v-btn>
    </v-sheet>
</template>
  
<script>
import { useVehiclesStore } from '@/store/vehicles';

import { useAppStore } from '@/store/app';
import { deleteVehicule } from '@/services/vehicule';
import { useAccessoireStore } from '@/store/accessoire';
import { fetchAccessoireById } from '@/services/AccessoireService';
import { fetchInterventionByVIN } from '@/services/InterventionService';
import { reactive } from 'vue';


import session from '@/session';
import reservationForm from '@/components/appointment/reservation.vue';
import { vModelCheckbox } from 'vue';






export default {
    components: {
        ReservationForm: reservationForm
    },
    props: {
        id: String,
        isDialog: Boolean,


    },
    data() {
        return {
            page: 1,
            session: session,
            load: true,
            dialog: false,
            Accessoires: useAccessoireStore(),
            store: useVehiclesStore(),
            appStore: useAppStore(),

            names: [],
            interventions: [],

        };
    },
    computed: {
        local() {
            return this.store.vehicle.local;
        },
        api() {
            return this.store.vehicle.api;
        },
        regPrice() {
            return this.local.price;
        },
        promoPrice() {
            return this.local.promo;
        },
        appointmentURL() {
            return "/newappointment/" + this.id;
        },
        shareURL() {
            return "/vehicles/" + this.id;
        },
        colourPrimary() {
            return this.appStore.colourPrimary;
        },
        colourSecondary() {
            return this.appStore.colourSecondary;
        },
        editionURL() {
            return "/vehicle/" + this.id + "/edition";
        },
        venteURL() {
            return "/vente/vehicule/" + this.id;
        },
        concatName() {
            return this.api.Make + " " + this.api.Model + " " + this.api.ModelYear;
        },
    },
    methods: {
        async nomAccessoire() {
            const names = [];
            for (let i = 0; i < this.local.selectedAccessoire.length; i++) {
                const temp = await fetchAccessoireById(this.local.selectedAccessoire[i]);
                const name = temp.nomAccessoire;
                names.push(name);
            }
            console.log(names);
            return names;


        },

        async loadData() {
            console.log(this.id);
            this.load = true;
            await this.store.getVehicle(this.id);
            this.Accessoires.getAccessoires();
            this.names = await this.nomAccessoire();
            this.interventions = await fetchInterventionByVIN(this.id);
            console.log("liste interventions", this.interventions);
            console.log(this.interventions);
            this.load = false;
            console.log(JSON.stringify(this.local.price, null, "  "));


        },
        async suppression() {
            await deleteVehicule(this.id);

            this.$router.push('/');
        },
        partager() {
            navigator.share({
                title: 'Les citrons de Toto',
                text: 'Venez voir ce véhicule',
                url: this.shareURL
            })
        }
    },
    mounted() {
        this.loadData();


    },
    watch: {
        id(newId) {
            this.loadData();
        },
    }
}

</script>