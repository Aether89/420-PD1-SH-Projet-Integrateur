<template>
    <v-container class="d-flex block" v-if="this.session.user">
        <v-row>
            <v-col cols="6">
        <listeInterventions />
            </v-col>
        <v-col cols="6">
        <InterventionsVue />
        </v-col>
        </v-row>
    </v-container>
        <v-container v-else class="d-flex block" justify="center">
        vous n'avez pas les droits pour acceder à cette page
    </v-container>

</template>
<script>
import listeIntervention from '@/components/interventionComponent/listeIntervention.vue';
import InterventionVue from '@/components/interventionComponent/Intervention.vue';
import session from '@/session';

export default {
    components: {
        listeInterventions: listeIntervention,
        InterventionsVue: InterventionVue,
    },


    data() {
        return {
            session: session,
        };
    },
};
</script>
