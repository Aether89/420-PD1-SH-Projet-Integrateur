<template  >
    <v-container  v-if="this.session.user && this.session.user.isAdmin"  class="d-flex block" justify="center">

        <listeClient />

        <ClientVue />

    </v-container>
</template>
<script>
import listeClient from '@/components/clientComponent/listeClient.vue';
import ClientVue from '@/components/clientComponent/Client.vue';
import session from '@/session';

export default {
    components: {
        listeClient: listeClient,
        ClientVue: ClientVue,

    },


    data() {
        return {
            session: session,
        };
    },
};
</script>
