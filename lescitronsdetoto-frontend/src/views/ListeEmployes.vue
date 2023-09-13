<template>
    <v-container class="d-flex" justify="center">
        <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="4">
                <listeEmploye/>
            </v-col><v-col cols="4">
                <EmployeVue />
            </v-col><v-col cols="2"></v-col>
        </v-row>
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
