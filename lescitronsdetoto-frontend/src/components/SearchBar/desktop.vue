<template>
    <v-card :color="colourAccent" width="parent" class="pa-8">
        <v-row>
            <v-select :loading="loadingMakes" bg-color="grey-lighten-3" style="width: 2em" label="Marque" v-model="this.store.selected.make" :items="this.store.makes"
                density="compact" clearable></v-select>
            <v-select :loading="loadingModels" bg-color="grey-lighten-3" style="width: 2em" label="Modéle" v-model="this.store.selected.model" :items="this.store.models"
                density="compact" clearable></v-select>
            <v-select :loading="loadingYears" bg-color="grey-lighten-3" style="width: 2em" label="Année" v-model="this.store.selected.year" :items="this.store.years"
                density="compact" clearable></v-select>
        </v-row><v-row>
            <v-range-slider v-model="this.store.selected.priceRange" :step="this.store.priceIncrement"
                :min="this.store.minPrice" :max="this.store.maxPrice">
                <template v-slot:prepend>
                    <v-text-field bg-color="grey-lighten-3" v-model="this.store.selected.priceRange[0]" hide-details single-line type="number"
                        variant="outlined" density="compact" style="width: 7em" :min="this.store.minPrice"
                        :max="this.store.maxPrice" :step="this.store.priceIncrement"></v-text-field>
                </template>
                <template v-slot:append>
                    <v-text-field bg-color="grey-lighten-3" v-model="this.store.selected.priceRange[1]" hide-details single-line type="number"
                        variant="outlined" style="width: 7em" density="compact" :min="this.store.minPrice"
                        :max="this.store.maxPrice" :step="this.store.priceIncrement"></v-text-field>
                </template>
            </v-range-slider>

            <v-btn prepend-icon="mdi-car-search" class="mx-2" aria-label="confirmer" color="green-lighten-2"
                @click="this.searchVehicles()">Confirmer</v-btn>
            <v-btn prepend-icon="mdi-cancel" class="mx-2" aria-label="annuler" color="red-lighten-2"
                @click="this.cancel()">Annuler</v-btn>

        </v-row>
    </v-card>
</template>

<script>
import { useVehiclesStore } from '@/store/vehicles';
import { useAppStore } from '@/store/app';

const appStore = useAppStore();
export default {
    data: function () {
        return {
            store: useVehiclesStore(),
        };
    },
    methods: {
        searchVehicles() {
            this.store.getVehiclesList();
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
        colourPrimary() {
            return appStore.colourPrimary;
        },
        colourSecondary() {
            return appStore.colourSecondary;
        },
        colourAccent() {
            return appStore.colourAccent;
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
