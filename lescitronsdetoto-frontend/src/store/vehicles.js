// Utilities
import { defineStore } from 'pinia';
import { fetchMakes } from '../services/MakesAPI'
import { fetchModels } from '../services/ModelsAPI'
import { fetchVIN } from '../services/VINAPI'
import { generateYears, prune } from '../services/common'
import { fetchVehicle, fetchVehicles } from '@/services/VehicleDB';

import { useAppStore } from './app';
const debug = useAppStore().debug;

export const useVehiclesStore = defineStore('vehicles', {
  state: () => ({
    makes: [],
    years: [],
    models: [],
    unfiltredModels: [],
    signs: [
      { name: "plus petite que", value: "<" },
      { name: "plus petite ou égal à", value: "<=" },
      { name: "égal à", value: "===" },
      { name: "plus grande ou égal à", value: ">=" },
      { name: "plus grande que", value: ">" },
    ],
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
      yearSign: ">=",
      model: null,
      priceRange: [0, 500000]
    },
    vehicles: [],
    unfiltredVehicles: [],
    vehicle: {
      local: null,
      api: null
    }

  }),
  actions: {
    async loadMakes() {
      this.loading.makes = true;
      this.getAllMakes();
      this.loading.makes = false;
    },
    async loadYears() {
      this.loading.years = true;
      this.years = await generateYears();
      this.loading.years = false;

    },
    async loadModels() {
      this.loading.models = true;
      await this.getAllModels();
      console.log("unfiltered Model", JSON.stringify(this.unfiltredModels,null,"  "));
      this.loading.models = false;
    },
    async loadVIN(vin) {
      this.vehicle.api = await fetchVIN(vin);
    },
    async getVehiclesList() {
      this.vehicles = await fetchVehicles();
      this.vehicles = this.vehicles.map((vehicle) => {
        vehicle.priceNum = parseFloat(vehicle.price.replace('$', ''));
        vehicle.promoNum = (vehicle.promo === "$0.00") ? null : parseFloat(vehicle.promo.replace('$', ''));
        return vehicle;
      });
      this.unfiltredVehicles = JSON.parse(JSON.stringify(this.vehicles));
      this.loadMakes();
      this.getAllModels();
    },
    async filterVehiclesList() {
      console.log("FILTERING");
      if (this.selected.make) {
        this.vehicles = this.unfiltredVehicles.filter(vehicle => vehicle.make === this.selected.make);
        (this.selected.model) ? this.vehicles = this.vehicles.filter(vehicle => vehicle.model === this.selected.model) : null;
      } else {
        this.vehicles = JSON.parse(JSON.stringify(this.unfiltredVehicles));
      }

      (this.selected.year) ? this.vehicles = this.vehicles.filter(vehicle => eval(`${vehicle.year} ${this.selected.yearSign} ${this.selected.year}`)) : null;
      this.vehicles = this.vehicles.filter(vehicle => {
        if (vehicle.promoNum) {
          return vehicle.promoNum >= this.selected.priceRange[0] && vehicle.promoNum <= this.selected.priceRange[1]
        } else {
          return vehicle.priceNum >= this.selected.priceRange[0] && vehicle.priceNum <= this.selected.priceRange[1]
        }
      });
    },
    async getAllMakes() {
      this.vehicles.forEach(vehicle => {
        if (!this.makes.includes(vehicle.make)) {
          this.makes.push(vehicle.make);
        }
      });
      this.makes.sort();
    },
    async getAllModels() {

      if (this.selected.make) {
      this.loading.models = true;

      if (this.selected.make && this.selected.year) {
        this.models = this.unfiltredVehicles
          .filter(vehicle => vehicle.make === this.selected.make && eval(`${vehicle.year} ${this.selected.yearSign} ${this.selected.year}`))
          .map(vehicle => vehicle.model);
      } else if (this.selected.make) {
        this.models = this.unfiltredVehicles
          .filter(vehicle => vehicle.make === this.selected.make)
          .map(vehicle => vehicle.model);
      } else {
        this.models = [];
      }
      this.models = await prune(this.models);
      this.loading.models = false;
      } else {
        this.models = [];
      }
    },
 
  async getVehicle(id) {
    this.vehicle.local = await fetchVehicle(id);
    this.vehicle.api = await fetchVIN(id);
      (this.vehicle.local.promo === "$0.00") ? this.vehicle.local.promo = null : this.vehicle.local.promo = this.vehicle.local.promo;
    },
    async reset() {
  this.selected.make = null;
  this.selected.year = null;
  this.selected.model = null;
  this.selected.yearSign = ">=",
    this.selected.priceRange[0] = this.minPrice;
  this.selected.priceRange[1] = this.maxPrice;
  this.vehicles = JSON.parse(JSON.stringify(this.unfiltredVehicles));

}
  }
});