<template>
    <v-container width="100%" color="amber">
        <mobileSearchBar v-if="!isSM"></mobileSearchBar>
        <desktopSearchBar v-else></desktopSearchBar>
    </v-container>
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
            return this.$vuetify.display.smAndUp;
        },

    },
    }
</script>
