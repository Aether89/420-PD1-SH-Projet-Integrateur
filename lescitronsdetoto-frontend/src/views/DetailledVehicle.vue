<template>
    <v-sheet color="light-blue">
    <v-toolbar v-if="isDialog" dark color="lime">
        <v-toolbar-title @click="$emit('closeDialog')">Les citrons de Toto</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn variant="text" aria-label="partager" icon="mdi-share-variant"></v-btn>
        <v-toolbar-items > <v-btn bg-color="error" icon dark @click="$emit('closeDialog')">
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

                <v-card v-if="session.user.isAdmin" color="lime-lighten-1" class="pa-2 text-center mt-4">
                    <v-btn class="ma-2" type="button" prepend-icon="mdi-file-edit-outline" color="amber-lighten-3"
                        aria-label="Éditer" :to="editionURL" router-link>Éditer</v-btn>
                    <v-btn v-if="session.user" class="ma-2" type="button" prepend-icon="mdi-delete" @click="suppression" aria-label="Supprimer"
                        color="red-lighten-3">Supprimer</v-btn>
                </v-card>

                <v-card :color="this.colourSecondary" class="pb-6 text-center mt-4">
                    <v-card-title>Ce véhicule m'interesse</v-card-title>
                    <v-btn :to="appointmentURL" size="large">Prendre un<br>rendez-vous</v-btn>
                </v-card>

            </v-col>
        </v-row>

        <v-row v-if="!this.load">
            <v-col cols="12" sm="4">
                <v-table  class="mb-8">
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

                <v-card class="pa-8 mb-8" :color="this.colourPrimary">{{ this.local.longDescription }}</v-card>

            </v-col>
        </v-row>
    </div>
    </v-container>
    <v-btn v-if="!this.loading && isDialog" size="x-large" aria-label="fermer dialogue véhicule" color="red-lighten-3" block @click="$emit('closeDialog')"><v-icon size="x-large" icon="mdi-menu-down" ></v-icon></v-btn>
</v-sheet>
</template>
  
<script>
import { useVehiclesStore } from '@/store/vehicles';
import { useAppStore } from '@/store/app';
import { priceFormatting } from '@/services/common';
import { deleteVehicule } from '@/services/vehicule';
import session from '@/session';
import FooterBar from '@/layouts/default/FooterBar.vue';

const appStore = useAppStore();
const store = useVehiclesStore();
export default {
    components: {
FooterBar: FooterBar
    },
    props: {
        id: String,
        isDialog: Boolean
    },
    data: function () {
        return {
            session: session,
            load: true,
        };
    },
    computed: {
        local() {
            return store.vehicle.local;
        },
        api() {
            return store.vehicle.api;
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
            return appStore.colourPrimary;
        },
        colourSecondary() {
            return appStore.colourSecondary;
        },
        editionURL() {
            return "/vehicle/" + this.id + "/edition";
        }
    },
    methods: {
        async loadData() {
            this.load = true;
            await store.getVehicle(this.id);
            this.load = false;
            console.log(JSON.stringify(this.local.price,null,"  "));

        },
        async suppression() {
            await deleteVehicule(this.id);
            this.$router.push(`/`);
            //test
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