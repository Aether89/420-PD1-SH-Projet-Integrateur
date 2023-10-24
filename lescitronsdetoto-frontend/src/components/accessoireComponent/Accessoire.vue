<template>
    <v-card class="mx-auto" max-width="600">
        <v-toolbar class="bg-orange-darken-4">
            <v-toolbar-title class="text-h5">{{ txt.title }}</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
            <v-form @submit.prevent="submit" validate-on="submit lazy && blur" ref="accessoireform">
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="this.store.nomAccessoire" label="Nom" :rules="[rules.nom]"
                            dense></v-text-field>
                    </v-col>
                </v-row>

                <v-btn type="submit" :disabled="!this.store.nomAccessoire">{{
                    txt.btn }}</v-btn>
                <v-btn type="button" @click="(this.store.chargerAccessoire(this.store.idAccessoire))">Annuler</v-btn>
                <v-btn v-if="session.user.isAdmin" type="button" @click="supprimer">Supprimer</v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</template>
  

  
<script>

import session from '../../session.js';
import { useAccessoireStore } from '@/store/accessoire';
import { createAccessoire, deleteAccessoire, updateAccessoire } from '@/services/AccessoireService';
import rules from '@/regles';


export default {
    data() {
        return {
            isNew: true,
            session: session,
            store: useAccessoireStore(),
            rules: rules,
        };
    },
    methods: {
        async submit() {

            const formValid = await this.$refs.accessoireform.validate();

            if (!formValid.valid) {
                return;
            }

            const Accessoire = {
                nomAccessoire: this.store.nomAccessoire
            };
            if (!this.store.isNew) { Accessoire.idAccessoire = this.store.idAccessoire };

            try {

                if (this.store.isNew) { await createAccessoire(Accessoire); } else { await updateAccessoire(Accessoire); }

            } catch (err) {
                console.error(err);
                alert(err.message);
                if (err.status === 409) {
                    this.$refs.accessoireform.validate();
                }
            }
            this.store.getAccessoires();
            this.store.newAccessoire();
        },
        async supprimer() {
            try {
                await deleteAccessoire(this.store.idAccessoire);
                this.store.getAccessoires();
                this.store.newAccessoire();
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        }


    },
    computed: {
        txt() {
            return (this.store.isNew) ? { title: "Nouvel Accessoire", btn: "Créer" } : { title: "Accessoire Existant", btn: "Modifier" };
        }
    },
    mounted() {
        this.store.newAccessoire();
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