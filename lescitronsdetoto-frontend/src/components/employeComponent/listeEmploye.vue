<template>
  <v-card max-width="400" min-width="400">
    <v-card-item class="bg-orange-darken-4">
      <v-card-title>
        Liste des employés
      </v-card-title>

      <template v-slot:append>
        <v-btn v-if="session.user.isAdmin" color="white" icon="mdi-plus" size="small" @click="employeStore.newEmploye()"></v-btn>
      </template>
    </v-card-item>
    <v-divider></v-divider>
    <div v-if="!this.loading">
    <v-virtual-scroll :items="items" height="300" item-height="50">
      <template v-slot:default="{ item }">
        <v-list-item>
          <template v-slot:prepend>
            <v-avatar :color="item.color" class="text-white" size="40">
              {{ item.initials }}
            </v-avatar>
          </template>

          <v-list-item-title>{{ item.fullName }}</v-list-item-title>

          <template v-slot:append>
            <v-btn @click="(this.employeStore.chargerEmploye(item.idEmploye))" size="small" variant="tonal">
              View User

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


import { computed } from 'vue';
import { fetchEmploye } from '../../services/EmployeService.js'
import { useEmployeStore } from '@/store/employe';
import session from '@/session';
export default {

  data() {
    return {
      employeStore: useEmployeStore(),
      employes: [],
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
    rafraichirEmployes() {
      fetchEmploye();
    }
  },
  provide() {
    return {
      employes: computed(() => this.employes),
      rafraichirEmployes: this.rafraichirEmployes
    };
  },

  computed: {
    items() {

      const colorsLength = this.colors.length
      let num = 0

      return Array.from({ length: this.employes.length }, () => {


        const name = this.employes[num].nomEmploye
        const surname = this.employes[num].prenomEmploye
        const id = this.employes[num].idEmploye
        num++
        return {
          color: this.colors[this.genRandomIndex(colorsLength)],
          fullName: `${name} ${surname}`,
          initials: `${name[0]} ${surname[0]}`,
          idEmploye: `${id}`

        }
      });
    }
  },
  mounted() {

    fetchEmploye().then(employes => {
      this.employes = employes;
      this.loading = false;
      this.loadError = false;
    }).catch(err => {

      this.loading = false;
      this.loadError = true;
    });
  },


}
</script>

