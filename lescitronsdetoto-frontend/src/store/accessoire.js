// Utilities
import { defineStore } from 'pinia'
import { fetchAccessoire, fetchAccessoireById } from '@/services/AccessoireService'

export const useAccessoireStore = defineStore('accessoire', {
  state: () => ({
    accessoires: [],
    isNew: false,
    idAccessoire: "",
    nomAccessoire: "",
    loading: false,
    loadingerror: false,
  }),
  actions: {
    async chargerAccessoire(idAccessoire) {
      this.idAccessoire = idAccessoire;
      fetchAccessoireById(idAccessoire)
        .then((result) => {
          this.isNew = false;
          this.nomAccessoire = result.nomAccessoire;
        })
    },

    newAccessoire() {
      this.isNew = true;
      this.idAccessoire = "";
      this.nomAccessoire = "";
      
    },
    getAccessoires() {
      this.accessoires = [];
      fetchAccessoire().then(accessoires => {
        this.accessoires = accessoires;
        this.loading = false;
        this.loadError = false;
      }).catch(err => {
        this.loading = false;
        this.loadError = true;
      });
    },

  },
})