<template>
    <div class="text-center">
      <v-menu
        v-model="menu"
        :close-on-content-click="false"
        location="bottom"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            icon="mdi-menu" />
        </template>
  
        <v-card min-width="300">
            <v-list>
                <div v-if="session.user">
    <v-list-item prepend-icon="mdi-cart-plus" density="compact" to="/achat/vehicule" title="Achat véhicule" />
    <v-list-item prepend-icon="mdi-cart-minus" density="compact" to="/vente/vehicule" title="Vente véhicule" />
    <v-list-item prepend-icon="mdi-car-wrench" density="compact" to="/listeInterventions"
        title="Gestion des Interventions" />
    <v-list-item prepend-icon="mdi-car-cog" density="compact" to="/listeAccessoires"
        title="Gestion des Accessoires" />
</div>

<v-list-group v-if="session.user.isAdmin" value="Administration">
    <template v-slot:activator="{ props }">
        <v-list-item v-bind="props" title="Admin"></v-list-item>
    </template>
    <v-list-item prepend-icon="mdi-face-agent" density="compact" to="/listeEmployes" title="Gestion Employés" />
    <v-list-item prepend-icon="mdi-receipt-outline" density="compact" to="/transaction" title="Gestion des Transactions" />
    <v-list-item prepend-icon="mdi-account-group" density="compact" to="/listeClients" title="Gestion des Clients" />
</v-list-group>
            </v-list>
        </v-card>
      </v-menu>
    </div>
  </template>
<script>
import session from '@/session';

export default {
    data: function () {
        return {
            menu: false,
            session: session
        };
    },
}
</script>