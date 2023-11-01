import { defineStore } from 'pinia'

export const useAchatVenteStore = defineStore('achatVente', {
  state: () => ({
    isValidate3: false,
    prix_evenement: '',
    vin: ''
  }),
})