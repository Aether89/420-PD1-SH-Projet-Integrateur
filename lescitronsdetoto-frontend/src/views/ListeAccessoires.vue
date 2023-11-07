<template  v-if="this.session.user">
    <v-container color="transparent" class="ma-8" v-if="session.user" justify="center">

        <v-row>
        <v-cols cols="6">
        <ScrollAccessoire />
        </v-cols>

        <v-cols cols="6">
        <AccessoireVue />
        </v-cols>
        </v-row>
    </v-container>
    <v-container v-else>
        Vous n'avez pas accés à cette page
    </v-container>
</template>
<script>
import ScrollAccessoire from '@/components/accessoireComponent/ScrollAccessoire.vue';
import AccessoireVue from '@/components/accessoireComponent/Accessoire.vue';
import session from '@/session';

export default {
    components: {
        ScrollAccessoire: ScrollAccessoire,
        AccessoireVue: AccessoireVue,
    },


    data() {
        return {
            session: session,
        };
    },
};
</script>
