<template>
    <v-card class="mx-auto" max-width="600">
        <v-toolbar class="bg-orange-darken-4">
            <v-toolbar-title class="text-h5">{{ txt.title }}</v-toolbar-title>
        </v-toolbar>

        <v-card-text>
            <v-form @submit.prevent="submit" validate-on="submit lazy" ref="interventionform">
                <v-row>
                    <v-col cols="12" md="6">
                        <v-text-field v-model="this.store.typeIntervention" label="Nom" :rules="[rules.nom]"
                            dense></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                        <v-text-field class="no-spinner" type="number" v-model="this.store.valeurIntervention" label="Prix"
                            :rules="[rules.monetaire]" suffix="$" default=0 dense></v-text-field>
                    </v-col>

                </v-row>

                <v-btn type="submit" :disabled="!this.store.typeIntervention">{{
                    txt.btn }}</v-btn>
                <v-btn type="button" @click="(this.store.chargerIntervention(this.store.idIntervention))">Annuler</v-btn>
                <v-btn v-if="session.user.isAdmin" type="button" @click="supprimer">Supprimer</v-btn>
            </v-form>
        </v-card-text>
    </v-card>
</template>
  

  
<script>

import session from '../../session.js';
import { useInterventionStore } from '@/store/intervention';
import { createIntervention, deleteIntervention, updateIntervention } from '@/services/InterventionService';
import rules from '@/regles';


export default {
    data() {
        return {
            isNew: true,
            session: session,
            store: useInterventionStore(),
            rules: rules,
        };
    },
    methods: {
        async submit() {

            const formValid = await this.$refs.interventionform.validate();

            if (!formValid.valid) {
                return;
            }

            const Intervention = {
                typeIntervention: this.store.typeIntervention,
                valeurIntervention: this.store.valeurIntervention,
                etatIntervention: this.store.etatIntervention
            };
            if (!this.store.isNew) { Intervention.idIntervention = this.store.idIntervention };

            try {

                if (this.store.isNew) { await createIntervention(Intervention); } else { await updateIntervention(Intervention); }

            } catch (err) {
                console.error(err);
                alert(err.message);
                if (err.status === 409) {
                    this.$refs.interventionform.validate();
                }
            }
            this.store.getInterventions()
            this.store.newIntervention();
        },
        async supprimer() {
            try {
                await deleteIntervention(this.store.idIntervention);
                this.store.getInterventions();
                this.store.newIntervention();
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        }


    },
    computed: {
        txt() {
            return (this.store.isNew) ? { title: "Nouvel Intervention", btn: "Créer" } : { title: "Intervention Existant", btn: "Modifier" };
        }
    },
    mounted() {
        this.store.newIntervention();
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