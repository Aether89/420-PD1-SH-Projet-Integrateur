<template>
    <v-container>
        <v-sheet v-if="session.user && session.user.isAdmin" class="ma-2">
            <v-form @submit.prevent validate-on="submit lazy" ref="vehiculform">
                <v-row>
                    <v-col cols="6">
                        <v-text-field class="no-spinner" v-model="prix_evenement" label="Prix d'achat" density="compact" type="number" step="1" min = "0" :rules="[rules.required]"
                    ></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <p>Nom client : {{ prenomClient }}</p>
                    </v-col>
                </v-row>
            </v-form>
        </v-sheet>
    </v-container>
</template>

<script>
import session from '../../session'

export default {
    props: ['prenomClient'],
    data() {
        return {
            session: session,
            prix_evenement: null,
            rules: {
                required: value => !!value || "Le champ est requis",
            },
        };
    },
    methods: {
        
    },
    computed: {
        
    },
   
    created() {
        console.log("prenom : ", this.prenomClient)
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