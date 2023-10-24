<template>
    <div class="form-container">
      <v-form @submit.prevent="submitForm">
        <!-- Bloc Employé -->
        <v-card class="section-card">
          <v-card-title class="section-title bg-orange darken-4" justify="center">Employé</v-card-title>
          <v-card-text>
            <v-text-field v-model="idEmploye" label="ID Employé"></v-text-field>
          </v-card-text>
        </v-card>
  
        <!-- Bloc Client -->
        <v-card class="section-card">
          <v-card-title class="section-title bg-orange darken-4" justify="center">Client</v-card-title>
          <v-card-text>
            <v-text-field v-model="nomClient" label="Nom Client"></v-text-field>
            <v-text-field v-model="prenomClient" label="Prénom Client"></v-text-field>
            <v-text-field v-model="telephoneClient" label="Téléphone Client"></v-text-field>
            <v-text-field v-model="courrielClient" label="Courriel Client"></v-text-field>
            <v-text-field
              v-model="numeroCivic"
              label="Numéro Civic"
              type="number"
              inputmode="numeric"
            ></v-text-field>
            <v-text-field
              v-model="numeroAppartement"
              label="Numéro Appartement"
              type="number"
              inputmode="numeric"
            ></v-text-field>
            <v-text-field v-model="nomRue" label="Nom Rue"></v-text-field>
            <v-text-field v-model="nomVille" label="Nom Ville"></v-text-field>
            <v-text-field v-model="nomProvince" label="Nom Province"></v-text-field>
            <v-text-field v-model="codePostal" label="Code Postal"></v-text-field>
          </v-card-text>
        </v-card>
  
        <!-- Bloc Véhicule -->
        <v-card class="section-card">
          <v-card-title class="section-title bg-orange darken-4" justify="center">Véhicule</v-card-title>
          <v-card-text>
            <v-text-field v-model="vin" label="VIN"></v-text-field>
          </v-card-text>
        </v-card>
  
        <v-btn type="submit" color="primary">Soumettre</v-btn>
      </v-form>
    </div>
  </template>
  
  <style scoped>
  .form-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .section-card {
    margin-top: 20px;
  }
  
  .section-title {
    color: white;
  }
  </style>
  
  <script>
  export default {
    data() {
      return {
        idEmploye: '',
        nomClient: '',
        prenomClient: '',
        telephoneClient: '',
        courrielClient: '',
        numeroCivic: null,
        numeroAppartement: null,
        nomRue: '',
        nomVille: '',
        nomProvince: '',
        codePostal: '',
        vin: '',
      };
    },
    methods: {
      submitForm() {
        // Traitement du formulaire ici
        // Vous pouvez accéder aux données du formulaire à partir de this.idEmploye, this.nomClient, etc.
      },
    },
  };
  </script>
  