<template>
  <header>
    <v-app-bar flat color="lime">
      <v-app-bar-title>
        <div>
          <h1 class="text-h5"><router-link class="noLink" :to="'/'">Les Citrons de toto</router-link></h1>
        </div>
      </v-app-bar-title>
      <template v-slot:append>

        <v-spacer vertical class="ma-2"></v-spacer>
        <div v-if="session.user">
          <menulist></menulist>
        </div>

        <v-menu
        v-if="session.user"
        v-model="menu"
        :close-on-content-click="false"
        location="bottom"
      >
        <template v-slot:activator="{ props }">
          <v-btn
            v-if="isSM" v-bind="props" :append-icon="accountIcon" variant="text">Bienvenue, {{ this.session.user.userAccountId }}</v-btn>
            <v-btn
            v-else v-bind="props" :icon="accountIcon" variant="text"></v-btn>
        </template>
  
        <v-card min-width="300">
          <v-card-title v-if="!isSM">Bienvenue, {{ this.session.user.userAccountId }}</v-card-title>
            <v-list nav>
              <v-list-item prepend-icon="mdi-cog" density="compact" to="/EditerEmploye" title="Éditer Compte" />
              <v-list-item prepend-icon="mdi-calendar-month" density="compact" to="/manage/availability"
        title="Gestion des disponibilités" />            </v-list>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="red" text @click="session.disconnect()">Déconnexion</v-btn>
            </v-card-actions>
        </v-card>
      </v-menu>
      <v-btn v-else to="/login" prepend-icon="mdi-account">
            Espace employé
          </v-btn>
      

      </template>
    </v-app-bar>
  </header>
</template>

<script>
import session from '../../session';
import menulist from '@/components/menu.vue'
export default {
  components: {
    menulist: menulist
  },
  data: function () {
    return {
      menu: false,
      session: session

    };
  },
computed: {
  accountIcon() {
    return (this.session.user.isAdmin) ? 'mdi-shield-crown' : 'mdi-account-circle';
  },
  isSM() {
            return this.$vuetify.display.smAndUp;
        },
}

};
</script>

<style>
.noLink {
  text-decoration: none;
  color: white;
}
</style>