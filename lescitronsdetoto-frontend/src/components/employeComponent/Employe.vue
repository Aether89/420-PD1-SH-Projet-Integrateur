<template>
    <v-card class="mx-auto" maxHeight="650" max-width="600">
        <v-toolbar class="bg-orange-darken-4">
            <v-toolbar-title class="text-h5">{{ txt.title }}</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
            <v-form @submit.prevent="submit" validate-on="submit lazy && blur" ref="employeform">
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="this.store.prenomEmploye" label="Prenom employé" maxlength="64"
                            :rules="[rules.prenom]" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="this.store.nomEmploye" label="Nom employé" maxlength="64"
                            :rules="[rules.nom]" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field :disabled="!(this.session.user && this.session.user.isAdmin)"
                            v-model="this.store.posteEmploye" label="Poste de l'employé" maxlength="64"
                            :rules="[rules.posteEmploye]" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="this.store.telephoneEmploye" label="Téléphone" :rules="[rules.telephone]"
                            class="no-spinner" dense maxlength="16"></v-text-field></v-col>
                    <v-col cols="12" md="3">
                        <v-text-field type="number" class="no-spinner" v-model="this.store.numeroCivic" maxlength="10"
                            :rules="[rules.numeroCivic]" label="# Civic" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-text-field v-model="this.store.numeroAppartement" label="Appt." maxlength="6"
                            :rules="[rules.numeroAppartement]" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="this.store.nomRue" label="Nom rue" maxlength="64" :rules="[rules.nomRue]"
                            dense></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="this.store.nomVille" label="Ville" maxlength="64" :rules="[rules.nomVille]"
                            dense></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-select v-model="this.store.nomProvince" :items="this.province" maxlength="64" label="Province"
                            dense></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="this.store.codePostal" label="Code postal de l'employe" maxlength="6"
                            :rules="[rules.codePostal]" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-checkbox v-if="!this.store.isNew && this.session.user.isAdmin" v-model="this.store.isArchive"
                            label="Archiver l'employé" dense></v-checkbox>
                    </v-col>
                </v-row>


                <v-btn type="submit"
                    :disabled="!(this.store.nomEmploye && this.store.prenomEmploye && this.store.posteEmploye && this.store.telephoneEmploye && this.store.numeroCivic && this.store.nomRue && this.store.nomVille && this.store.nomProvince && this.store.codePostal)">{{
                        txt.btn }}</v-btn>
                <v-btn type="button" @click="(this.store.chargerEmploye(this.store.idEmploye))">Annuler</v-btn>
                <v-btn v-if="session.user.isAdmin" type="button" @click="supprimer">Supprimer</v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</template>

  
<script>

import session from '../../session.js';
import { useEmployeStore } from '@/store/employe';
import { createEmploye, deleteEmploye, updateEmploye } from '@/services/EmployeService';
import rules from '@/regles';

export default {
    data() {
        return {
            isNew: true,
            session: session,
            store: useEmployeStore(),
            rules: rules,
            province: [
                "Alberta",
                "Colombie-Britannique",
                "Île-du-Prince-Édouard",
                "Manitoba",
                "Nouveau-Brunswick",
                "Nouvelle-Écosse",
                "Ontario",
                "Québec",
                "Saskatchewan",
                "Terre-Neuve-et-Labrador",
                "Territoires du Nord-Ouest",
                "Nunavut",
                "Yukon"
            ],
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
                numeroCivic: this.store.numeroCivic,
                numeroAppartement: this.store.numeroAppartement,
                nomRue: this.store.nomRue,
                nomVille: this.store.nomVille,
                nomProvince: this.store.nomProvince,
                codePostal: this.store.codePostal,
                isArchive: this.store.isArchive
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
            this.store.getEmployes()
            if (this.session.user.isAdmin) { this.store.newEmploye(); }
            else { this.store.chargerEmploye(this.session.user.idEmploye); }
        },
        async supprimer() {
            try {
                await deleteEmploye(this.store.idEmploye);
                this.store.getEmployes();
                this.store.newEmploye();
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        },
        reactive() {
            this.store.newEmploye();
        }

    },
    computed: {

        txt() {
            return (this.store.isNew) ? { title: "Nouvel Employé", btn: "Créer" } : { title: "Employé", btn: "Modifier" };
        }
    },
    mounted() {
        this.store.newEmploye();
    }
}


</script> 


<style>
.no-spinner input::-webkit-outer-spin-button,
.no-spinner input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>