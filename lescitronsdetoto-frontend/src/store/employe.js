// Utilities
import { defineStore } from 'pinia'
import { fetchemploye , fetchEmploye} from '@/services/EmployeService'

export const useEmployeStore = defineStore('employe', {
  state: () => ({
    employes: [],
    isNew: false,
    idEmploye: "",
    nomEmploye: "",
    prenomEmploye: "",
    posteEmploye: "",
    telephoneEmploye: "",
    codePostalEmploye: "",
    loading: false,
    loadingerror: false,
  }),
  actions: {
    async chargerEmploye(idEmploye) {
      this.idEmploye = idEmploye;
      fetchemploye(idEmploye)
        .then((result) => {
          this.isNew = false;
          this.nomEmploye = result.nomEmploye;
          this.prenomEmploye = result.prenomEmploye;
          this.posteEmploye = result.posteEmploye;
          this.telephoneEmploye = result.telephoneEmploye;
          this.numeroCivic = result.numeroCivic;
          this.numeroAppartement = result.numeroAppartement;
          this.nomRue = result.nomRue;
          this.nomVille = result.nomVille;
          this.nomProvince = result.nomProvince;
          this.codePostal = result.codePostal;
          this.isArchive = result.isArchive;
        })
        console.log(idEmploye)
    },
    newEmploye() {
      this.isNew = true;
      this.idEmploye = "";
      this.nomEmploye = "";
      this.prenomEmploye = "";
      this.posteEmploye = "";
      this.telephoneEmploye = "";
      this.numeroCivic = "";
      this.numeroAppartement = "";
      this.nomRue = "";
      this.nomVille = "";
      this.nomProvince = "";
      this.codePostal = "";
    },
    getEmployes() {
      this.employes = [];
      fetchEmploye().then(employes => {
        this.employes = employes;
        this.loading = false;
        this.loadError = false;
      }).catch(err => {
        this.loading = false;
        this.loadError = true;
      });
  },

  },
})
