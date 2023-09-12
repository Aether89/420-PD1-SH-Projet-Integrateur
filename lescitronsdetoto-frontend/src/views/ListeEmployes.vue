<template>
    <v-container class="d-flex" justify="center">
        <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="4">
                <listeEmploye @emitThisId="receiveEmit" />
            </v-col><v-col cols="4">
                <EmployeVue :isNew="EmployeExiste" :idEmploye="idEmploye" :nomEmploye="nomEmploye"
                    :prenomEmploye="prenomEmploye" :posteEmploye="posteEmploye" :telephoneEmploye="telephoneEmploye"
                    :codePostalEmploye="codePostalEmploye" />
            </v-col><v-col cols="2"></v-col>
        </v-row>
    </v-container>
</template>
<script>
import listeEmploye from '@/components/employeComponent/listeEmploye.vue';
import EmployeVue from '@/components/employeComponent/Employe.vue';
import { fetchEmploye, fetchemploye } from '../services/EmployeService.js';
import { computed } from 'vue';



export default {
    components: {
        listeEmploye: listeEmploye,
        EmployeVue: EmployeVue,
    },


    data() {
        return {
            employeExiste: false,
            idEmploye: '',
            nomEmploye: '',
            prenomEmploye: '',
            posteEmploye: '',
            telephoneEmploye: '',
            codePostalEmploye: ''
        };
    },
    methods: {
        receiveEmit(emitId) {
            this.idEmploye = emitId;
            this.isNew = false;
        },
        chargerEmploye(idEmploye) {
            fetchemploye(idEmploye);

        },

        rafraichirEmployes() {
            fetchEmploye();
        }
    },
    provide() {
        return {
            employes: computed(() => this.employes),
            rafraichirEmployes: this.rafraichirEmployes
        };
    },
    mounted() {
        this.rafraichirEmployes();

    },
    watch: {
        idEmploye(NewEmploye) {
            console.log(this.nomEmploye);
            this.chargerEmploye(NewEmploye);
        }
    }

};
</script>
