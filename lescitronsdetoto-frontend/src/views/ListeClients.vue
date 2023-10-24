<template  v-if="this.session.user">
    <v-container class="d-flex block" justify="center">

        <listeClient />

        <ClientVue />

    </v-container>
</template>
<script>
import listeClient from '@/components/clientComponent/listeClient.vue';
import ClientVue from '@/components/clientComponent/Client.vue';

export default {
    components: {
        listeClient: listeClient,
        ClientVue: ClientVue,
    },


    data() {
        return {
        };
    },
};
</script>
