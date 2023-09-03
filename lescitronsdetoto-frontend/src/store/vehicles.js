// Utilities
import { defineStore } from 'pinia';
import { fetchMakes } from '../services/MakesAPI'
import { fetchModels } from '../services/ModelsAPI'
import { fetchVIN } from '../services/VINAPI'
import { generateYear } from '../services/common'

export const useVehiclesStore = defineStore('vehicles', {
  state: () => ({
    makes: [],
    years: [],
    models: [],

    minPrice: 0,
    maxPrice: 500000,
    priceIncrement: 1000,

    selected: {
      make: null,
      year: null,
      model: null,
      priceRange: [0,500000]
    },
    vehicles: [],

    vehicle: {
      vin: null,
      local: null,
      api: null
    }

  }),
  actions: {
    async loadMakes() {
      this.makes = await fetchMakes();
    },
    async loadYears() {
      this.years = await generateYears();
    },
    async loadModels() {
      this.models = await fetchModels(this.selected.make,this.selected.year);
    },
    async loadVIN(vin) {
      this.vehicle.api = await fetchVIN(vin);
    },
    async getVehiclesList() {
      
    },
    async reset() {
      this.selected.make = null;
      this.selected.year = null;
      this.selected.model = null;
      this.selected.priceRange[0] = this.minPrice;
      this.selected.priceRange[1] = this.maxPrice;
    }
  }
});