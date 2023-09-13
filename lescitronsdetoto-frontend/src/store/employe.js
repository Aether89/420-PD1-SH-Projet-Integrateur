// Utilities
import { defineStore } from 'pinia'
import { fetchemploye } from '@/services/EmployeService'

export const useEmployeStore = defineStore('employe', {
  state: () => ({
    isNew: false,
    idEmploye: "",
    nomEmploye: "",
    prenomEmploye: "",
    posteEmploye: "",
    telephoneEmploye: "",
    codePostalEmploye: "",
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
                    this.codePostalEmploye = result.codePostalEmploye;
                })
        },
        newEmploye() {
            this.isNew = true;
            this.idEmploye = "";
            this.nomEmploye = "";
            this.prenomEmploye = "";
            this.posteEmploye = "";
            this.telephoneEmploye = "";
            this.codePostalEmploye = "";
        }
  },
})
