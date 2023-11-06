<template>
  <v-sheet color="transparent" class="ma-8">
    <h1>Liste des transactions ({{ title }})</h1>
    <v-tabs v-model="tab" bg-color="lime" align-tabs="center">
      <v-tab value="achat" @click="afficherListeAchat">Achat</v-tab>
      <v-tab value="vente" @click="afficherListeVente">Vente</v-tab>
    </v-tabs>
    <v-sheet :color="bgColour">
      <v-virtual-scroll :items="transactions" :height="400">
        <template v-slot:default="{ item }">
          <transactionlistitem :colour="listColour" :item="item"></transactionlistitem>
        </template>
      </v-virtual-scroll>
    </v-sheet>
  </v-sheet>
</template>

<script>
import session from '../session';
import { fetchTransactionVente, fetchTransactionAchat } from '../services/transaction'
import transactionlistitem from '../components/transactionComponent/transactionListItem.vue'
export default {
  components: {
    transactionlistitem: transactionlistitem,
  },
  data() {
    return {
      session: session,
      transactions: [],
      title: "vente",
      dialog: false,
      tab: "vente",
    }
  },
  methods: {

    async afficherListeAchat() {
      try {
        const transactions = await fetchTransactionAchat();
        this.transactions = transactions;
      } catch (err) {
        console.error(err);
      }
      this.title = "achat";
    },
    async afficherListeVente() {
      try {
        const transactions = await fetchTransactionVente();
        this.transactions = transactions;
      } catch (err) {
        console.error(err);
      }
      this.title = "vente";
    },
  },
  
  computed: {
     listColour() {
      return (this.title === "vente") ? "light-green-lighten-4" : "deep-orange-lighten-4";
  },
  bgColour() { 
   return (this.title === "vente") ? "light-green-lighten-5" : "deep-orange-lighten-5"; 
  }
},
  mounted() {
    fetchTransactionVente().then(transactions => {
      this.transactions = transactions;
    }).catch(err => {
      console.error(err);
    });
  }
}
</script>
