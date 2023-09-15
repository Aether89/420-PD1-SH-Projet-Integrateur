<template>
    <v-menu location="start">
        <template v-slot:activator="{ props }">
            <v-btn icon="mdi-dots-vertical" v-bind="props"></v-btn>
        </template>
        <v-list>
            <v-list-item v-if="session.user.isAdmin">
                <v-list-item-title><router-link to="/listeEmployes">Liste Employes</router-link></v-list-item-title>
            </v-list-item>
            <v-list-item v-if="session.user && !session.user.isAdmin">
                <v-list-item-title><router-link to="/EditerEmploye">Editer employe</router-link></v-list-item-title>
            </v-list-item>
            <v-list-item v-if="session.user">
                <v-list-item-title><router-link to="/admin/newvehicle">Nouveau Véhicule</router-link></v-list-item-title>
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