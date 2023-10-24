import { defineStore } from 'pinia'
import { fetchVIN } from '../services/VINAPI'
export const useActualyAVehiculeStore = defineStore('vehicule', {
  state: () => ({
    vehicules: [],
    isNew: false,
    isValidate2: false,
    vin: "",
    id_etat: "",
    couleur: "",
    nombre_kilometre: "",
    prix_annonce: "",
    promotion: "",
    description_courte: "",
    description_longue: "",
    loading: false,
    loadingerror: false,
    marque: null,
    modele: null,
    annee: null
  }),
})