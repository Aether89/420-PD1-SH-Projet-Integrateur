<template>
    <v-sheet class="ma-2" max-width="40rem">
        <div class="text-h5">Nouvelle Employe</div>
        <v-form @submit.prevent="submitNewEmploye" validate-on="submit lazy" ref="employeform">
            <v-text-field v-model="nomEmploye" label="Nom employé"
                :rules="[rules.required]" density="compact"></v-text-field>
            <v-text-field v-model="prenomEmploye" label="Prenom employé"
                :rules="[rules.required]" density="compact"></v-text-field>
            <v-text-field v-model="posteEmploye" label="Poste de l'employé"
                :rules="[rules.required]" density="compact"></v-text-field>
            <v-text-field v-model="telephoneEmploye" label="Téléphone de l'employé"
                :rules="[rules.required]" density="compact"></v-text-field>
            <v-text-field v-model="codePostalEmploye" label="Code postal de l'employe"
                :rules="[rules.required]" density="compact"></v-text-field>
            <v-btn type="submit" :disabled="!nomEmploye || !prenomEmploye || !posteEmploye|| !telephoneEmploye || !codePostalEmploye">Créer un nouveau compte</v-btn>
        </v-form>
    </v-sheet>
</template>

<script>
import session from '../session';
import { createEmploye } from '../services/EmployeService';

export default {
    data() {
        return {
            nomEmploye: '',
            prenomEmploye: '',
            posteEmploye: '',
            telephoneEmploye: '',
            codePostalEmploye: '',
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
        }
    },
};
   
</script>