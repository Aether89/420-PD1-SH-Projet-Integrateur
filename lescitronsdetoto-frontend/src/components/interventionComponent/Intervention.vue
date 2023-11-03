<template>
    <v-card class="mx-auto" maxHeight="650" max-width="600">
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
import { createInterventionWvin, createIntervention, deleteIntervention, updateIntervention, updateInterventionWvin, fetchInterventionWvin } from '@/services/InterventionService';
import rules from '@/regles';


export default {
    props: ['vin'],
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

            const vin = this.vin;

            const formValid = await this.$refs.interventionform.validate();

            if (!formValid.valid) {
                return;
            }

            const Intervention = {
                typeIntervention: this.store.typeIntervention,
                valeurIntervention: this.store.valeurIntervention,
                etatIntervention: this.store.etatIntervention
            };
            if (!this.store.isNew && !vin) { Intervention.idIntervention = this.store.idIntervention };


            try {

                if (this.store.isNew) {
                    if (vin) { await createInterventionWvin(Intervention, vin); } else { await createIntervention(Intervention); }
                } else {
                    if (vin) { await updateInterventionWvin(Intervention, vin); } else { await updateIntervention(Intervention); }
                }
                if (vin) { await fetchInterventionWvin(vin); } else { await this.store.getInterventions(); }

                this.store.newIntervention();
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        },
        async supprimer() {
            try {
                if (vin) { await deleteInterventionWvin(this.store.idIntervention, vin); } else { await deleteIntervention(this.store.idIntervention); }
                this.store.getInterventions();
                this.store.newIntervention();
            } catch (err) {
                console.error(err);
                alert(err.message);
            }
        },
        async rafraichirIntervention() {
            try {
                await fetchInterventionWvinById(vin);
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