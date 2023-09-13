<template>
    <v-card class="ml-6" max-width="40rem" min-width="600">
        <div v-if="this.store.isNew" class="text-h5">Nouvelle Employe</div>
        <div v-else class="text-h5">Employe</div>
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
                :disabled="!this.store.nomEmploye || !this.store.prenomEmploye || !this.store.posteEmploye || !this.store.telephoneEmploye || !this.store.codePostalEmploye || !this.store.isNew">Créer
                un nouveau compte</v-btn>
            <v-btn type="submit"
                :disabled="!this.store.nomEmploye || !this.store.prenomEmploye || !this.store.posteEmploye || !this.store.telephoneEmploye || !this.store.codePostalEmploye || !this.session.user.isAdmin && (this.session.user.id_employe !== id) || this.store.isNew">
                Modifier</v-btn>
        </v-form>
    </v-card>
</template>

  
<script>

import session from '../../session.js';
import { useEmployeStore } from '@/store/employe';
import { createEmploye, updateEmploye } from '@/services/EmployeService';

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
            if (this.store.isNew) { Employe.idEmploye = this.store.idEmploye };

            try {
                if (this.store.isNew) {
                    await createEmploye(Employe);
                    console.log("create");
                }
                else {
                    await updateEmploye(Employe);
                    console.log("modifier");

                }
            } catch (err) {
                console.error(err);
                alert(err.message);
                if (err.status === 409) {
                    this.$refs.employeform.validate();
                }
            }
        },
    },
}
</script> 