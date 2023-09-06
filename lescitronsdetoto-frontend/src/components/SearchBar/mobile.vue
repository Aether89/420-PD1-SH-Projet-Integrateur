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
                    <v-select label="Marque" v-model="this.store.selected.make" :items="this.store.makes"
                        density="compact"></v-select>
                </v-list-item>

                <v-list-item>

                    <v-select label="Année" v-model="this.store.selected.year" :items="this.store.years"
                        density="compact"></v-select>
                </v-list-item>

                <v-list-item>
                    <v-select label="Modéle" v-model="this.store.selected.model" :items="this.store.models"
                        density="compact"></v-select>
                </v-list-item>
                <v-list-subheader>Prix entre </v-list-subheader>
                <v-list-item>
                    <v-range-slider class="mt-8 mx-6" v-model="this.store.selected.priceRange"
                        :step="this.store.priceIncrement" :min="this.store.minPrice" :max="this.store.maxPrice"
                        thumb-label="always">
                    </v-range-slider>
                </v-list-item>

                <v-btn block prepend-icon="mdi-cancel" aria-label="annuler" color="red-lighten-2"
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
            this.store.getVehiclesList();
        },
        cancel() {
            this.store.reset();
        }
    },
    computed: {
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
        this.store.loadMakes();
        this.store.loadYears();
        this.store.loadModels()
    }

}
</script>
