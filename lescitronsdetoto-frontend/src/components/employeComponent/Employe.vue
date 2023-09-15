<template>
    <v-card class="ml-6" max-width="40rem" min-width="600">
        <div class="text-h5">{{ txt.title }}</div>
        <v-form @submit.prevent="submit" validate-on="submit lazy" ref="employeform">
            <v-text-field v-model="this.store.nomEmploye" label="Nom employé" :rules="[rules.required]"
                density="compact"></v-text-field>
            <v-text-field v-model="this.store.prenomEmploye" label="Prenom employé" :rules="[rules.required]"
                density="compact"></v-text-field>
            <v-text-field :disabled="!(session.user.isAdmin)" v-model="this.store.posteEmploye" label="Poste de l'employé"
                :rules="[rules.required]" density="compact"></v-text-field>
            <v-text-field v-model="this.store.telephoneEmploye" label="Téléphone de l'employé" :rules="[rules.required]"
                density="compact"></v-text-field>
            <v-text-field v-model="this.store.codePostalEmploye" label="Code postal de l'employe" :rules="[rules.required]"
                density="compact"></v-text-field>
            <v-btn type="submit"
                :disabled="!this.store.nomEmploye || !this.store.prenomEmploye || !this.store.posteEmploye || !this.store.telephoneEmploye || !this.store.codePostalEmploye">{{
                    txt.btn }}</v-btn>
            <v-btn type="button" @click="(this.employeStore.chargerEmploye(this.store.idEmploye))">Annuler</v-btn>
            <v-btn v-if="session.user.isAdmin" type="button" @click="supprimer">Supprimer</v-btn>

        </v-form>
    </v-card>
</template>

  
<script>

import session from '../../session.js';
import { useEmployeStore } from '@/store/employe';
import { createEmploye, deleteEmploye, updateEmploye } from '@/services/EmployeService';

export default {
    data() {
        return {
            session: session,
            store: useEmployeStore(),
            rules: {
                required: value => !!value || "Le champ est requis",

            },
        };
    },
    methods: {
        async submit() {

            const formValid = await this.$refs.employeform.validate();
            const txt = this.txt.fnt;

            if (!formValid.valid) {
                return;
            }

            const Employe = {
                nomEmploye: this.store.nomEmploye,
                prenomEmploye: this.store.prenomEmploye,
                posteEmploye: this.store.posteEmploye,
                telephoneEmploye: this.store.telephoneEmploye,
                codePostalEmploye: this.store.codePostalEmploye,
            };
            if (!this.store.isNew) { Employe.idEmploye = this.store.idEmploye };

            try {

                if (this.store.isNew) { await createEmploye(Employe); } else { await updateEmploye(Employe); }



            } catch (err) {
                console.error(err);
                alert(err.message);
                if (err.status === 409) {
                    this.$refs.employeform.validate();
                }
            }
        },
        supprimer() {
            try {
                deleteEmploye(this.store.idEmploye);
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        }
    },
    computed: {
        txt() {
            return (this.store.isNew) ? { title: "Nouvel Employé", btn: "Créer" } : { title: "Employé", btn: "Modifier" };

        }
    }
}

</script> 