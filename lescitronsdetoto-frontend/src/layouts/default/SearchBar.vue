<template>
    <v-sheet class="mx-16 my-4" color="transparent">
        <mobileSearchBar v-if="!isSM"></mobileSearchBar>
        <desktopSearchBar v-else></desktopSearchBar>
    </v-sheet>
</template>

<script>
import desktopSearchBar from '@/components/SearchBar/desktop.vue';
import mobileSearchBar from '@/components/SearchBar/mobile.vue'

export default {
    components: {
        desktopSearchBar,mobileSearchBar
    },
    data: function () {
        return {};
    },
    computed: {
        isSM() {
            return this.$vuetify.display.mdAndUp;
        },

    },
    }
</script>
