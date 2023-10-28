import { defineStore } from 'pinia'
import { useClientStore } from '@/store/client';

export const useTransactionStore = defineStore('transactionStore', {
  data() {
    return {
      storeClient: useClientStore(),
    }
  },
  state: () => ({
    prenomClient: false,
  }),
  validateNomClient() {
    if (!this.storeClient.nomClient) {
        this.errorMessageNom = ['Ce champs est obligatoire'];
        return false;
    }
    this.errorMessageNom = [];
    return true;
},
})
