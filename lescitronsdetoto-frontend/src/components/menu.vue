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
            <v-list nav>
                <div v-if="session.user">
    <v-list-item prepend-icon="mdi-cart-plus" density="compact" to="/achat/vehicule" title="Achat véhicule" />
    <v-list-item prepend-icon="mdi-cart-minus" density="compact" to="/vente/vehicule" title="Vente véhicule" />
    <v-list-item prepend-icon="mdi-car-wrench" density="compact" to="/listeInterventions"
        title="Gestion des Interventions" />
    <v-list-item prepend-icon="mdi-car-cog" density="compact" to="/listeAccessoires"
        title="Gestion des Accessoires" />
</div>
<div v-if="session.user && session.user.isAdmin">
  <v-divider/>
  <v-list-item type="subheader" density="compact" title="Administration" />
        <v-list-item prepend-icon="mdi-chart-line" density="compact" to="/transaction" title="Gestion des Transactions" />
        <v-divider/>
    <v-list-item prepend-icon="mdi-badge-account-horizontal-outline" density="compact" to="/listeEmployes" title="Gestion Employés" />
    <v-list-item prepend-icon="mdi-account-box-multiple-outline" density="compact" to="/listeClients" title="Gestion des Clients" />
</div>
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