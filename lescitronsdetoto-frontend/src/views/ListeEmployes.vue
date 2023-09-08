<template>
    <v-sheet class="d-flex">
        <listeEmploye />
        <v-sheet>
            <Employe />
            <v-divider vertical></v-divider>
            <EmployeVueDetail div v-if="employeExiste" :key="idEmploye" :employeKey="key" :nomEmploye="nomEmploye"
                :prenomEmploye="prenomEmploye" :posteEmploye="posteEmploye" :telephoneEmploye="telephoneEmploye"
                :codePostalEmploye="codePostalEmploye" />
            <div v-else>Employe introuvable!</div>
        </v-sheet>
    </v-sheet>
</template>
<script>
import listeEmploye from '@/components/employeComponent/listeEmploye.vue';
import EmployeVue from '@/components/employeComponent/Employe.vue';
import EmployeVueDetail from '@/components/employeComponent/EmployeVueDetail.vue';


export default {
    components: {
        listeEmploye: listeEmploye,
        EmployeVue: EmployeVue,
        EmployeVueDetail: EmployeVueDetail,

    },
    inject: ['employes'],
    props: {
        idEmploye: Number
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
        chargerEmploye(idEmploye) {
            fetch("/api/employes/" + idEmploye)
                .then((response) => {
                    if (response.ok) {

                        return response.json();
                    } else {
                        if (response.status === 404) {
                            throw new Error("Contact introuvable");
                        }
                        throw new Error("Erreur HTTP " + response.status);
                    }
                })
                .then((respEmploye) => {
                    this.idEmploye = respEmploye.idEmploye;
                    this.nomEmploye = respEmploye.nomEmploye;
                    this.prenomEmploye = respEmploye.prenomEmploye;
                    this.posteEmploye = respEmploye.posteEmploye;
                    this.telephoneEmploye = respEmploye.telephoneEmploye;
                    this.codePostalEmploye = respEmploye.codePostalEmploye;
                    this.employeExiste = true;
                }).catch((error) => {
                    console.log("Erreur", error);
                    this.employeExiste = false;
                });
        }
    },
    mounted() {
        this.chargerEmploye(this.idEmploye);
    },
    watch: {
        idEmploye(NewEmploye) {
            this.chargerEmploye(NewEmploye);
        }
    }

};
</script>