<template>
    <v-dialog v-model="dialog" fullscreen :scrim="false" transition="dialog-bottom-transition">
        <template v-slot:activator="{ props }">
            <v-btn block color="amber" dark v-bind="props">
                Rechercher
            </v-btn>
        </template>
        <v-card>
            <v-toolbar dark color="amber">
                <v-btn icon dark @click="dialog = false" aria-label="annuler">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Rechercher</v-toolbar-title>
                <v-spacer></v-spacer>
                <v-toolbar-items>
                    <v-btn prepend-icon="mdi-car-search" variant="text" @click="this.searchVehicles()"
                        aria-label="confirmer">
                        Confirmer
                    </v-btn>
                </v-toolbar-items>
            </v-toolbar>
            <v-list>
                <v-list-item>
                    <v-select :loading="loadingMakes" bg-color="grey-lighten-3" label="Marque" v-model="this.store.selected.make" :items="this.store.makes"
                density="compact" clearable></v-select>
                </v-list-item>

                <v-list-item>
                    <v-select bg-color="grey-lighten-3" label="Opérateur" item-title="name" item-value="value" v-model="this.store.selected.yearSign" :items="this.store.signs"
                density="compact"></v-select>
                <v-select :loading="loadingYears" bg-color="grey-lighten-3" label="Année" v-model="this.store.selected.year" :items="this.store.years"
                density="compact" clearable></v-select>
                </v-list-item>

                <v-list-item>
                    <v-select :loading="loadingModels" bg-color="grey-lighten-3" label="Modéle" v-model="this.store.selected.model" :items="this.store.models"
                density="compact" clearable></v-select>
                </v-list-item>
                <v-list-subheader>Prix entre </v-list-subheader>
                <v-list-item>
                    <v-range-slider class="mt-8 mx-6" v-model="this.store.selected.priceRange"
                        :step="this.store.priceIncrement" :min="this.store.minPrice" :max="this.store.maxPrice"
                        thumb-label="always">
                    </v-range-slider>
                </v-list-item>
                <v-btn class="my-4" block prepend-icon="mdi-car-search" @click="this.searchVehicles()"
                        aria-label="confirmer" color="green-lighten-2">Rechercher</v-btn>

                <v-btn class="my-4" block prepend-icon="mdi-cancel" aria-label="annuler" color="red-lighten-2"
                    @click="this.cancel()">Annuler</v-btn>
                    

            </v-list>
        </v-card>
    </v-dialog>
    <v-sheet class="pa-1 text-center">{{ searchToString }} <br> {{ priceToString }}</v-sheet>
</template>

<script>
import { useVehiclesStore } from '@/store/vehicles';

export default {
    data: function () {
        return {
            store: useVehiclesStore(),
            dialog: false
        };
    },
    methods: {
        searchVehicles() {
            this.dialog = false;
            this.store.filterVehiclesList();
        },
        cancel() {
            this.store.reset();
        }
    },
    computed: {
        loadingMakes() {
            return this.store.loading.makes;
        }, 
        loadingYears() {
            return this.store.loading.years;
        }, 
        loadingModels() {
            return this.store.loading.models;
        }, 
        watchMake() {
            return this.store.selected.make
        },
        watchYear() {
            return this.store.selected.year
        },
        searchToString() {

        
            const concatMake = (this.store.selected.make !== null)? this.store.selected.make : "Voitures";
            const concatModel = (this.store.selected.model !== null)? this.store.selected.model + " " : "";

            const concatYear = (this.store.selected.year !== null)? this.store.selected.year : "";
            const concatSpace = (concatMake === "")? "" : (concatModel !== "" || concatYear !== "")? " | " : "";
            return concatMake + concatSpace + concatModel + concatYear;
        },
        priceToString() {

            return "Entre : " + this.store.selected.priceRange[0] + " & " + this.store.selected.priceRange[1];
        }
    },
    watch: {
        async watchMake(newMake, oldMake) {
            await this.store.loadModels();
            this.store.selected.model = null;
        },
        async watchYear(newYear, oldYear) {
            await this.store.loadModels();
            if (!this.store.models.includes(this.store.selected.model)) {
                this.store.selected.model = null;
            }
        }

    },
    created() {
        this.store.loadYears();
    }

}
</script>
