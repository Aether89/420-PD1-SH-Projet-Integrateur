// Utilities
import { defineStore } from 'pinia'
import { fetchClient, fetchClientById } from '@/services/ClientService'

export const useClientStore = defineStore('client', {
  state: () => ({
    clients: [],
    isNew: false,
    isValidate: false,
    idClient: "",
    nomClient: "",
    prenomClient: "",
    posteClient: "",
    telephoneClient: "",
    numeroCivic: "",
    numeroAppartement: "",
    courriel: "",
    nomRue: "",
    nomVille: "",
    nomProvince: "",
    codePostal: "",
    isArchive: "",
    loading: false,
    loadingerror: false,
  }),
  actions: {
    async chargerClient(idClient) {
      this.idClient = idClient;
      fetchClientById(idClient)
        .then((result) => {
          this.isNew = false;
          this.nomClient = result.nomClient;
          this.prenomClient = result.prenomClient;
          this.posteClient = result.posteClient;
          this.telephoneClient = result.telephoneClient;
          this.numeroCivic = result.numeroCivic;
          this.numeroAppartement = result.numeroAppartement;
          this.nomRue = result.nomRue;
          this.nomVille = result.nomVille;
          this.nomProvince = result.nomProvince;
          this.codePostal = result.codePostal;
          this.isArchive = result.isArchive;
          this.courriel = result.courrielClient;

        })
    },

    newClient() {
      this.isNew = true;
      this.isValidate = false;
      this.idClient = "";
      this.nomClient = "";
      this.prenomClient = "";
      this.posteClient = "";
      this.telephoneClient = "";
      this.numeroCivic = "";
      this.numeroAppartement = "";
      this.nomRue = "";
      this.nomVille = "";
      this.nomProvince = "";
      this.codePostal = "";
      this.isArchive = "";
      this.courriel = "";

    },
    getClients() {
      this.clients = [];
      fetchClient().then(clients => {
        this.clients = clients;
        this.loading = false;
        this.loadError = false;
      }).catch(err => {
        this.loading = false;
        this.loadError = true;
      });
    },

  },
})