import { defineStore } from 'pinia'
import { getVehiculefr } from '../services/vehicule'
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
    annee: null,
    selectedAccessoire: null,
  }),
  actions: {
    async chargerVehicle(vin) {
      this.vin = vin;
      getVehiculefr(vin)
        .then((result) => {
          this.isNew = false;
          this.vin = result.vin;
          this.id_etat = result.id_etat;
          this.couleur = result.couleur;
          this.nombre_kilometre = result.nombre_kilometre;
          this.prix_annonce = parseFloat(result.prix_annonce.replace(/[\s$,]+/g, '').replace('.', ',')).toFixed(2);
          this.promotion = parseFloat(result.promotion.replace(/[\s$,]+/g, '').replace('.', ',')).toFixed(2);
          this.description_courte = result.description_courte;
          this.description_longue = result.description_longue;
          this.marque = result.marque;
          this.modele = result.modele;
          this.annee = result.annee;
          this.selectedAccessoire = result.accessoires;

        })
    },
        newVehicule() {
          this.isNew = false;
          this.vin = null;
          this.isValidate2 = false;
          this.id_etat = '';
          this.couleur = '';
          this.nombre_kilometre = 0;
          this.prix_annonce = 0;
          this.promotion = 0;
          this.description_courte = '';
          this.description_longue = '';
          this.marque = '';
          this.modele = '';
          this.annee = '';
          this.selectedAccessoire = [];
    }
  }
})