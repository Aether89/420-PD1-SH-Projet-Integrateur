// Utilities
import { defineStore } from 'pinia'
import { fetchIntervention, fetchInterventionById } from '@/services/InterventionService'

export const useInterventionStore = defineStore('intervention', {
  state: () => ({
    interventions: [],
    isNew: false,
    idIntervention: "",
    typeIntervention: "",
    valeurIntervention: '',
    etatIntervention: "",
    loading: false,
    loadingerror: false,
  }),
  actions: {
    async chargerIntervention(idIntervention) {
      this.idIntervention = idIntervention;
      fetchInterventionById(idIntervention)
        .then((result) => {
          this.isNew = false;
          this.typeIntervention = result.typeIntervention;
          const valeurInterventionWithDollarSign = result.valeurIntervention;

          const valeurInterventionWithoutDollarSign = valeurInterventionWithDollarSign.replace(/\$|,/g, '');
          
          const floatValue = parseFloat(valeurInterventionWithoutDollarSign);

          this.valeurIntervention = floatValue;
          this.etatIntervention = result.etatIntervention;
        })
    },

    newIntervention() {
      this.isNew = true;
      this.idIntervention = 0;
      this.typeIntervention = "";
      this.valeurIntervention = "";
      this.etatIntervention = "";
      
    },
    getInterventions() {
      this.interventions = [];
      fetchIntervention().then(interventions => {
        this.interventions = interventions;
        this.loading = false;
        this.loadError = false;
      }).catch(err => {
        this.loading = false;
        this.loadError = true;
      });
    },

  },
})