<template>
    <v-card class="ml-6" max-width="40rem" min-width="600">
        <div v-if="isNew" class="text-h5">Nouvelle Employe</div>
        <v-form @submit.prevent="submitNewEmploye" validate-on="submit lazy" ref="employeform">
            <v-text-field v-bind="nomEmploye" label="Nom employé" :rules="[rules.required]"
                density="compact"></v-text-field>
            <v-text-field v-bind="prenomEmploye" label="Prenom employé" :rules="[rules.required]"
                density="compact"></v-text-field>
            <v-text-field :disabled="!isNew || !session.isAdmin" v-bind="posteEmploye" label="Poste de l'employé"
                :rules="[rules.required]" density="compact"></v-text-field>
            <v-text-field v-bind="telephoneEmploye" label="Téléphone de l'employé" :rules="[rules.required]"
                density="compact"></v-text-field>
            <v-text-field v-bind="codePostalEmploye" label="Code postal de l'employe" :rules="[rules.required]"
                density="compact"></v-text-field>
            <v-btn type="submit"
                :disabled="!nomEmploye || !prenomEmploye || !posteEmploye || !telephoneEmploye || !codePostalEmploye">Créer
                un nouveau compte</v-btn>
        </v-form>
    </v-card>
</template>

  
<script>

import session from '../../session.js';
import { fetchemploye } from '@/services/EmployeService';

export default {
    props: ['idEmploye', 'isNew', 'nomEmploye', 'prenomEmploye', 'posteEmploye', 'telephoneEmploye', 'codePostalEmploye'],
    data() {
        return {
            session: session,

            rules: {
                required: value => !!value || "Le champ est requis",

            },
        };
    },
    methods: {
        async submitNewEmploye() {
            const formValid = await this.$refs.employeform.validate();

            if (!formValid.valid) {
                return;
            }
            const Employe = {
                nomEmploye: this.nomEmploye,
                prenomEmploye: this.prenomEmploye,
                posteEmploye: this.posteEmploye,
                telephoneEmploye: this.telephoneEmploye,
                codePostalEmploye: this.codePostalEmploye,
            };
            try {
                await createEmploye(Employe);

            } catch (err) {
                console.error(err);
                alert(err.message);
                if (err.status === 409) {
                    this.$refs.employeform.validate();
                }
            }
        },
        chargerEmploye(idEmploye) {
            fetchemploye(idEmploye);
        }
    },
    watch: {
        idEmploye(newId, oldId) {
            console.log(newId);
            this.chargerEmploye(newId);
        }
    }
}
</script> 