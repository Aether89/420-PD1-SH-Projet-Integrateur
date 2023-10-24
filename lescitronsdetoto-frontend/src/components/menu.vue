<template>
    <v-menu location="start">
        <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
        </template>
        <v-list>

            <v-list-item v-if="session.user">

                <div v-if="!session.user.isAdmin">
                    <v-list-item-title><router-link to="/EditerEmploye">Editer employe</router-link></v-list-item-title>
                    <v-list-item-title><router-link to="/listeInterventions">Liste
                            Interventions</router-link></v-list-item-title>
                    <v-list-item-title><router-link to="/listeAccessoires">Liste
                            Accessoires</router-link></v-list-item-title>
                    <v-list-item-title><router-link to="/admin/newvehicle">Nouveau
                            Véhicule</router-link></v-list-item-title>
                </div>

                <v-list-item-title><router-link to="/achat/vehicule">Achat véhicule</router-link></v-list-item-title>
                <v-list-item-title><router-link to="/vente/vehicule">Vente véhicule</router-link></v-list-item-title>
                <v-list-item-title><router-link to="/transaction">Liste des transactions</router-link></v-list-item-title>
                <v-list-item-title><router-link to="/manage/availability">Gestion des
                        disponibilités</router-link></v-list-item-title>
            </v-list-item>

            <v-list-item v-if="session.user.isAdmin">
                <v-list-item-title><router-link to="/listeEmployes">Liste Employes</router-link></v-list-item-title>
                <v-list-item-title><router-link to="/listeClients">Liste Clients</router-link></v-list-item-title>
            </v-list-item>

        </v-list>
    </v-menu>
</template>
  
<script>
import session from '@/session';

export default {
    data: function () {
        return {
            session: session
        };
    },
}
</script>