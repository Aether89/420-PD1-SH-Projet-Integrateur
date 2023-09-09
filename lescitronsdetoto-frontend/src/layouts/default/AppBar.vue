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
        <div>

          <v-btn v-if="session.user" @click="session.disconnect()"
            :prepend-icon="session.user && session.user.isAdmin ? 'mdi-car-key' : 'mdi-car'"><template v-slot:prepend>
              <v-icon v-if="session.user && session.user.isAdmin" color="yellow-lighten-3"></v-icon>
              <v-icon v-else color="white"></v-icon>
            </template>
            Déconnexion
          </v-btn>
          <v-btn v-else to="/login" prepend-icon="mdi-account">
            Se connecter
          </v-btn>
        </div>
        <div class="text-body-2 text-center" v-if="session.user">
          Bienvenue, {{ session.user.userFullName }}
        </div>
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
      session: session
    };
  },
}
</script>

<style>
.noLink {
  text-decoration: none;
  color: white;
}
</style>