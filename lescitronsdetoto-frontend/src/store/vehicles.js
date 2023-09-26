// Utilities
import { defineStore } from 'pinia';
import { fetchMakes } from '../services/MakesAPI'
import { fetchModels } from '../services/ModelsAPI'
import { fetchVIN } from '../services/VINAPI'
import { generateYears } from '../services/common'
import { fetchVehicle, fetchVehicles } from '@/services/VehicleDB';

import { useAppStore } from './app';
const debug = useAppStore().debug;

export const useVehiclesStore = defineStore('vehicles', {
  state: () => ({
    makes: [],
    years: [],
    models: [],
    
    loading: {
      makes: true,
      models: true,
      years: true
    },

    minPrice: 0,
    maxPrice: 500000,
    priceIncrement: 1000,

    selected: {
      make: null,
      year: null,
      model: null,
      priceRange: [0,500000]
    },
    vehicles:   [],

    vehicle: {
      local: null,
      api: null
    }

  }),
  actions: {
    async loadMakes() {
      this.loading.makes = true;
      this.makes = await fetchMakes();
      this.loading.makes = false;

    },
    async loadYears() {
      this.loading.years = true;
      this.years = await generateYears();
      this.loading.years = false;

    },
    async loadModels() {
      this.loading.models = true;
      this.models = (this.selected)? await fetchModels(this.selected.make,this.selected.year) : null;
      this.loading.models = false;
    },
    async loadVIN(vin) {
      this.vehicle.api = await fetchVIN(vin);
    },
    async getVehiclesList() {
      this.vehicles = await fetchVehicles();

      if (debug) {
        console.log("Vehicles List")
        console.log(JSON.stringify(this.vehicles,null,"  "));
        };

    },
    async getVehicle(id) {   
      console.log("store",id);
      this.vehicle.local = await fetchVehicle(id);
      this.vehicle.api = await fetchVIN(id);
      (this.vehicle.local.promo === "$0.00")? this.vehicle.local.promo = null : this.vehicle.local.promo = this.vehicle.local.promo;
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