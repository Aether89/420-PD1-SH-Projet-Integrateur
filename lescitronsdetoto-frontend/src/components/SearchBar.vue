<template>
    <v-sheet color="amber" width="parent" class="pa-6">
        <v-row>
            <v-select style="width: 2em" label="Marque" v-model="this.store.selected.make"
                :items="this.store.makes"></v-select>
            <v-select style="width: 2em" label="Modéle" v-model="this.store.selected.model"
                :items="this.store.models"></v-select>
            <v-select style="width: 2em" label="Année" v-model="this.store.selected.year"
                :items="this.store.years"></v-select>
        </v-row><v-row>
            <v-range-slider v-model="this.store.selected.priceRange" :step="this.store.priceIncrement"
                :min="this.store.minPrice" :max="this.store.maxPrice">
                <template v-slot:prepend>
                    <v-text-field v-model="this.store.selected.priceRange[0]" hide-details single-line type="number"
                        variant="outlined" density="compact" style="width: 7em" :min="this.store.minPrice"
                        :max="this.store.maxPrice" :step="this.store.priceIncrement"></v-text-field>
                </template>
                <template v-slot:append>
                    <v-text-field v-model="this.store.selected.priceRange[1]" hide-details single-line type="number"
                        variant="outlined" style="width: 7em" density="compact" :min="this.store.minPrice"
                        :max="this.store.maxPrice" :step="this.store.priceIncrement"></v-text-field>
                </template>
            </v-range-slider>

            <v-btn prepend-icon="mdi-car-search" class="mx-2" aria-label="confirmer"
                color="green-lighten-2" @click="this.searchVehicles()">Confirmer</v-btn>
            <v-btn prepend-icon="mdi-cancel" class="mx-2" aria-label="annuler" color="red-lighten-2"
                @click="this.cancel()">Annuler</v-btn>

        </v-row>
    </v-sheet>
</template>

<script>
import { useVehiclesStore } from '@/store/vehicles';

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
        watchMake() {
            return this.store.selected.make
        },
        watchYear() {
            return this.store.selected.year
        },
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
