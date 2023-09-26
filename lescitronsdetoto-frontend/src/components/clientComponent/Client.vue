<template>
    <v-card class="mx-auto" max-width="600">
        <v-toolbar class="bg-orange-darken-4">
            <v-toolbar-title class="text-h5">{{ txt.title }}</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
            <v-form @submit.prevent="submit" validate-on="submit lazy" ref="clientform">
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="this.store.nomClient" label="Nom" :rules="[rules.required]"
                            dense></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="this.store.prenomClient" label="Prénom" :rules="[rules.required]"
                            dense></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="this.store.telephoneClient" label="Téléphone de l'employé"
                            :rules="[rules.required]" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-text-field v-model="this.store.numeroCivic" label="# Civic" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" md="3">
                        <v-text-field v-model="this.store.numeroAppartement" label="Appt." dense></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="this.store.nomRue" label="Nom de la rue" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="this.store.nomVille" label="Ville" dense></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="this.store.nomProvince" label="Province" dense></v-text-field>
                    </v-col>
                    <v-col cols="12">
                        <v-text-field v-model="this.store.codePostal" label="Code postal du client" dense></v-text-field>
                    </v-col>
                </v-row>

                <v-btn type="submit"
                    :disabled="!this.store.nomClient || !this.store.prenomClient || !this.store.telephoneClient">{{
                        txt.btn }}</v-btn>
                <v-btn type="button" @click="(this.store.chargerClient(this.store.idClient))">Annuler</v-btn>
                <v-btn :disabled="session.user.isAdmin" type="button" @click="supprimer">Supprimer</v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</template>
  

  
<script>

import session from '../../session.js';
import { useClientStore } from '@/store/client';
import { createClient, deleteClient, updateClient } from '@/services/ClientService';

export default {
    data() {
        return {
            session: session,
            store: useClientStore(),
            rules: {
                required: value => !!value || "Le champ est requis",

            },
        };
    },
    methods: {
        async submit() {

            const formValid = await this.$refs.clientform.validate();

            if (!formValid.valid) {
                return;
            }

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
            this.store.getClients();
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
            return (this.store.isNew) ? { title: "Nouveau Client", btn: "Créer" } : { title: "Client Existant", btn: "Modifier" };
        }
    },
    mounted() {
        this.store.newClient();
    }
}

</script> 