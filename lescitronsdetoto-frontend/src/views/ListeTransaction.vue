<template>
    <div>
      <h1>Liste des transactions</h1>
      <div class="button-container">
        <button @click="afficherListeAchat" class="custom-button">Achat</button>
        <button @click="afficherListeVente" class="custom-button">Vente</button>
      </div>
      <ul>
        <li v-for="transaction in transactions" :key="transaction.id" class="transaction-item">
            <div>
            
                <strong>Vendeur : </strong>{{ transaction.user_account_id }}
                &nbsp;|&nbsp;
                <strong>Client : </strong>{{ transaction.prenom_client }} {{ transaction.nom_client }}
                &nbsp;|&nbsp;
                
                <strong>Montant : </strong>{{ transaction.prix_evenement }}
                &nbsp;|&nbsp;
                <strong>Date : </strong> {{ formatDate(transaction.date_heure_evenement) }}
                    <router-link :to="'/transaction/editer/' + transaction.id_evenement">
                        <button class="edit-button">Éditer</button>
                    </router-link>
          </div>
        </li>
      </ul>
    </div>
  </template>

<script>
import session from '../session';
import {fetchTransactionVente, fetchTransactionAchat} from '../services/transaction'

export default {
    data() {
        return {
            session: session,
            transactions: [],
        }
    },
    methods: {
        formatDate(isoDate) {
            const date = new Date(isoDate);
            const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            //hour: "2-digit",
            //minute: "2-digit",
            //second: "2-digit"
            };
            return date.toLocaleString("fr-FR", options);
        },
        async afficherListeAchat() {
            try {
                const transactions = await fetchTransactionAchat();
                this.transactions = transactions;
            } catch (err) {
                console.error(err);
            }
        },
        async afficherListeVente() {
            try {
                const transactions = await fetchTransactionVente();
                this.transactions = transactions;
            } catch (err) {
                console.error(err);
            }
        },
    },
    /*
    computed: {
       
    },*/
    mounted() {
        fetchTransactionVente().then(transactions =>{
            this.transactions = transactions;
        }).catch(err => {
            console.error(err);
        });
    }
}
</script>

<style>
.button-container {
  display: flex;
  justify-content: center;
  gap: 10px; /* Espacement entre les boutons */
  margin-bottom: 20px; /* Espacement sous les boutons */
}

.custom-button {
  background-color: white;
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  cursor: pointer;
}

.transaction-item {
  background-color: white; /* Définissez la couleur de fond sur blanc */
  padding: 10px; /* Ajoutez un peu de marge intérieure pour l'espace */
  margin: 10px;
  margin-bottom: 10px; /* Ajoutez de l'espace entre chaque élément */
  border: 1px solid #ccc; /* Ajoutez une bordure autour de chaque élément si nécessaire */
}

.edit-button {
  float: right; /* Pour aligner le bouton "Éditer" à droite */
}
</style>