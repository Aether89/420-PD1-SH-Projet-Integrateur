<template>
    <v-container class="d-flex block" justify="center">

        <EmployeVue />

    </v-container>
</template>
<script>

import EmployeVue from '@/components/employeComponent/Employe.vue';
import { useEmployeStore } from '@/store/employe';
import session from '@/session';
import { fetchEmploye } from '@/services/EmployeService.js';


export default {
    components: {

        EmployeVue: EmployeVue,
    },


    data() {
        return {
            employeStore: useEmployeStore(),
            session: session
        };

    },

    mounted() {

        fetchEmploye().then(employes => {
            this.employes = employes;
            this.loading = false;
            this.loadError = false;
        }).catch(err => {

            this.loading = false;
            this.loadError = true;
        });
        if (!this.loading) { this.employeStore.chargerEmploye(this.session.user.idEmploye); }
    },
}
</script>