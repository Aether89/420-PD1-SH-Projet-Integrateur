<template v-if="this.session.isAdmin">
    <v-container class="d-flex block" justify="center">

        <listeEmploye />

        <EmployeVue />

    </v-container>
</template>
<script>
import listeEmploye from '@/components/employeComponent/listeEmploye.vue';
import EmployeVue from '@/components/employeComponent/Employe.vue';

export default {
    components: {
        listeEmploye: listeEmploye,
        EmployeVue: EmployeVue,
    },


    data() {
        return {
        };
    },
};
</script>
