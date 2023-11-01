import { defineStore } from 'pinia'

export const useAchatVenteStore = defineStore('achatVente', {
  state: () => ({
    isValidate3: false,
    prix_evenement: '',
    vin: ''
  }),
  actions: {
    newTrans() {
      this.isValidate3 = false;
      this.prix_evenement = null;
      this.vin = null;
    }
  }
})