<template>
    <v-container class="d-flex block" justify="center" v-if="this.session.user">
        <listeInterventions />

        <InterventionsVue />
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
