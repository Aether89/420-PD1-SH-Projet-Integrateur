<template >
    <v-container v-if="this.session.user && this.session.user.isAdmin"  class="d-flex block" justify="center">
        <listeEmploye />
        <EmployeVue />
    </v-container>
    <v-container v-else class="d-flex block" justify="center">
        vous n'avez pas les droits pour acceder à cette page
    </v-container>
</template>
<script>
import listeEmploye from '@/components/employeComponent/listeEmploye.vue';
import EmployeVue from '@/components/employeComponent/Employe.vue';
import session from '@/session';

export default {
    components: {
        listeEmploye: listeEmploye,
        EmployeVue: EmployeVue,
    },

    data() {
        return {
            session: session,
        };
    },
};
</script>
