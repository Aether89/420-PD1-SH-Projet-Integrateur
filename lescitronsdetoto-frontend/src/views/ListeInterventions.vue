<template  v-if="this.session.user">
    <v-container class="d-flex block" justify="center">

        <listeInterventions />

        <InterventionsVue />

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
