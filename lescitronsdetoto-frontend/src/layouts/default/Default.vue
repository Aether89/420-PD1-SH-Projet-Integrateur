<template>
  <v-app class="custom-background">
    <default-bar />

    <default-view />
  </v-app>
</template>

<script setup>
  import DefaultBar from './AppBar.vue'
  import DefaultView from './View.vue'
</script>

<style scoped>
.custom-background {
  background-color: #90CAF9; /* Replace with your desired color */
}
</style>