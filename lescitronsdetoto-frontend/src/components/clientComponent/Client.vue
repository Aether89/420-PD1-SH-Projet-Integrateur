<template>
    <v-card class="mx-4" maxHeight="650" max-width="600">
        <div v-if="mode !== 'vehicule'">
            <v-toolbar v-if="mode !== 'reservation'" class="bg-orange-darken-4">
                <v-toolbar-title class="text-h5">{{ txt.title }}</v-toolbar-title>
            </v-toolbar>
        </div>
        <v-card-text>
            <v-form @submit.prevent="submit" validate-on="submit lazy && blur" ref="clientform">
                <v-row>
                    <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="this.store.prenomClient" label="Prénom" :rules="[rules.prenom]" dense
                            maxlength="64"></v-text-field>
                    </v-col>

                    <v-col cols="12" sm="6" md="6">
                        <v-text-field v-model="this.store.nomClient" label="Nom" :rules="[rules.nom]" dense
                            maxlength="64"></v-text-field>
                    </v-col>

                    <v-row v-if="mode === 'reservation'">
                        <p class="ml-6">Méthode de contact</p>
                        <v-radio-group class="ml-6" v-model="inline" inline>
                            <v-radio label="Téléphone" :value="0"></v-radio>
                            <v-radio label="Courriel" :value="1"></v-radio>
                        </v-radio-group>
                        <v-col v-if="inline === 1" cols="12">
                            <v-text-field v-model="this.store.courriel" label="courriel" :rules="[rules.courriel]" dense
                                maxlength="64"></v-text-field>
                        </v-col>
                        <v-col v-else-if="inline === 0" cols="12">
                            <v-text-field v-model="this.store.telephoneClient" label="Téléphone" :rules="[rules.telephone]"
                                class="no-spinner" dense maxlength="16"></v-text-field>
                        </v-col>

                    </v-row>
                    <v-row v-else>
                        <v-col cols="12">
                            <v-text-field v-model="this.store.telephoneClient" label="Téléphone" :rules="[rules.telephone]"
                                class="no-spinner" dense maxlength="16"></v-text-field>
                        </v-col>

                        <v-col cols="12" md="3">
                            <v-text-field v-model="this.store.numeroCivic" type="number" label="# Civic"
                                :rules="[rules.numeroCivic]" class="no-spinner" maxlength="10"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="3">
                            <v-text-field v-model="this.store.numeroAppartement" label="Appt."
                                :rules="[rules.numeroAppartement]" dense maxlength="6"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="this.store.nomRue" label="Nom de la rue" :rules="[rules.nomRue]" dense
                                maxlength="64"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-text-field v-model="this.store.nomVille" label="Ville" :rules="[rules.nomVille]" dense
                                maxlength="64"></v-text-field>
                        </v-col>
                        <v-col cols="12" md="6">
                            <v-select v-model="this.store.nomProvince" :items="this.province" maxlength="64"
                                label="Province" dense></v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field class="mb-10" v-model="this.store.codePostal" label="Code postal du client"
                                :rules="[rules.codePostal]" dense maxlength="6"
                                hint="Inscrire sous le format H0H0H0"></v-text-field>
                        </v-col>
                    </v-row>

                </v-row>
                <div v-if="mode === 'reservation'">

                </div>
                <div v-else-if="mode !== 'vehicule' && mode !== 'transaction'">
                    <v-btn type="submit">{{
                        txt.btn }}</v-btn>
                    <v-btn type="button" @click="(this.store.chargerClient(this.store.idClient))">Annuler</v-btn>
                </div>
                <div v-else>
                    <v-btn type="submit">Valider</v-btn>
                </div>
            </v-form>
        </v-card-text>
    </v-card>
</template>
  

  
<script>

import session from '../../session.js';
import { useClientStore } from '@/store/client';
import { createClient, deleteClient, updateClient } from '@/services/ClientService';
import rules from '@/regles';


export default {
    props: {
        id: String,
        mode: String,
        prenomClient: String
    },
    data() {
        return {
            isNew: true,
            session: session,
            store: useClientStore(),
            rules: rules,
            inline: 0,
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
        async validate() {
            const formValid = await this.$refs.clientform.validate();
            return (!formValid.valid) ? this.store.isValidate = false : this.store.isValidate = true;
        },

        async submit() {


            const formValid = await this.$refs.clientform.validate();

            if (!formValid.valid) {
                this.store.isValidate = false;
                return;
            }

            this.store.isValidate = true;

            const Client = {
                nomClient: this.store.nomClient,
                prenomClient: this.store.prenomClient,
                posteClient: this.store.posteClient,
                telephoneClient: this.store.telephoneClient,
                numeroCivic: this.store.numeroCivic,
                numeroAppartement: this.store.numeroAppartement,
                nomRue: this.store.nomRue,
                nomVille: this.store.nomVille,
                nomProvince: this.store.nomProvince,
                codePostal: this.store.codePostal,
                isArchive: this.store.isArchive

            };
            if (this.mode !== 'vehicule') {
                if (!this.store.isNew) { Client.idClient = this.store.idClient };

                try {

                    if (this.store.isNew) { await createClient(Client); } else { await updateClient(Client); }

                } catch (err) {
                    console.error(err);
                    alert(err.message);
                    if (err.status === 409) {
                        this.$refs.clientform.validate();
                    }
                }

                if (this.mode !== 'transaction') {
                    this.store.getClients();
                    this.store.newClient();
                }
            }
        },
        async supprimer() {
            try {
                await deleteClient(this.store.idClient);
                this.store.getClients();
                this.store.newClient();
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        }


    },
    computed: {

        txt() {
            return (this.mode === 'transaction') ? { title: "Client", btn: "Modifier" } : (this.store.isNew) ? { title: "Nouveau Client", btn: "Créer" } : { title: "Client Existant", btn: "Modifier" };
        },

        watchNom() {
            return this.store.nomClient;
        },
        watchPrenom() {
            return this.store.prenomClient;
        },
        watchPhone() {
            return this.store.telephoneClient;
        },
        watchEmail() {
            return this.store.courriel;
        }

    },
    watch: {
        watchNom(newVal, oldVal) {
            this.validate();
        },
        watchPrenom(newVal, oldVal) {
            this.validate();
        },
        watchPhone(newVal, oldVal) {
            this.validate();
        },
        watchEmail(newVal, oldVal) {
            this.validate();
        },
        inline(newVal, oldVal) {
            (newVal === 0) ? this.store.courriel = "" : this.store.telephoneClient = "";
            this.store.isValidate = false;
        },

    },
    mounted() {
        this.store.newClient();
        this.store.nomProvince = "Québec";

    },
    created() {
    },
}

</script> 

<style>
.no-spinner input::-webkit-outer-spin-button,
.no-spinner input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}
</style>