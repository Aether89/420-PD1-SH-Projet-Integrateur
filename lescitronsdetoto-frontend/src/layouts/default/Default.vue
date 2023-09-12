<template>
  <v-app class="custom-background">
    <default-bar />
    <default-view />
    <default-footer />
  </v-app>
</template>

<script setup>
  import DefaultBar from './AppBar.vue'
  import DefaultView from './View.vue'
  import DefaultFooter from './FooterBar.vue'
</script>

<style scoped>
.custom-background {
  background-color: #90CAF9; /* Replace with your desired color */
}
</style>