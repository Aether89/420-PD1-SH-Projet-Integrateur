<template>
    <v-container v-if="this.session.user">
        <v-row>
            <v-col cols="6">
        <ScrollAccessoire />
            </v-col>
        <v-col cols="6">
        <AccessoireVue />
        </v-col>
        </v-row>
    </v-container>
        <v-container v-else class="d-flex block" justify="center">
        vous n'avez pas les droits pour acceder à cette page
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
