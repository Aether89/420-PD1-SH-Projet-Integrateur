<template>
  <v-card max-width="400" min-width="400" height="650">
    <v-card-item class="bg-orange-darken-4">
      <v-card-title>
        Liste des clients
      </v-card-title>

      <template v-slot:append>
        <v-btn :disabled="!(this.session.user.isAdmin)" color="white" icon="mdi-plus" size="small"
          @click="clientStore.newClient()"></v-btn>
      </template>
    </v-card-item>
    <v-divider></v-divider>
    <div v-if="!this.clientStore.loading">
      <v-virtual-scroll :items="items" height="590" item-height="50">
        <template v-slot:default="{ item }">
          <v-list-item>
            <template v-slot:prepend>
              <v-avatar :color="item.color" class="text-white" size="40">
                {{ item.initials }}
              </v-avatar>
            </template>

            <v-list-item-title>{{ item.fullName }}</v-list-item-title>

            <template v-slot:append>
              <v-btn @click="(this.clientStore.chargerClient(item.idClient))" size="small" variant="tonal">
                Éditer

                <v-icon color="orange-darken-4" end>
                  mdi-open-in-new
                </v-icon>
              </v-btn>
            </template>
          </v-list-item>
        </template>
      </v-virtual-scroll>
    </div>
  </v-card>
</template>

<script>

import { useClientStore } from '@/store/client';
import session from '@/session';

export default {

  data() {
    return {
      clientStore: useClientStore(),
      colors: ['#2196F3', '#90CAF9', '#64B5F6', '#42A5F5', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1', '#82B1FF', '#448AFF', '#2979FF', '#2962FF'],
      loading: true,
      loadError: false,
      session: session
    };
  },
  methods: {
    genRandomIndex(length) {
      return Math.ceil(Math.random() * (length - 1))
    },
    rafraichirClients() {
      this.clientStore.getClients();
    }

  },

  computed: {

    items() {

      const colorsLength = this.colors.length
      let num = 0

      return Array.from({ length: this.clients.length }, () => {


        const name = this.clients[num].nomClient
        const surname = this.clients[num].prenomClient
        const id = this.clients[num].idClient
        num++
        return {
          color: this.colors[this.genRandomIndex(colorsLength)],
          fullName: `${name} ${surname}`,
          initials: `${name[0]} ${surname[0]}`,
          idClient: `${id}`

        }
      });
    },
    clients() {
      return this.clientStore.clients;
    }
  },
  mounted() {

    this.clientStore.getClients();

  },


}
</script>

