<template>
    <v-list-item :class="classItem" >
        <v-divider thickness="2"/>
        <v-row>
            <v-col cols="2">
                <strong>Nunméro de transaction : </strong> {{ item.id_evenement }}
            </v-col>
            <v-col cols="2">
                <strong>Vendeur : </strong>{{ item.user_account_id }}
            </v-col>
            <v-col cols="2">
                <strong>Client : </strong>{{ item.prenom_client }} {{ item.nom_client }}
            </v-col>
            <v-col cols="2">
                <strong>Montant : </strong>{{ item.prix_evenement }}
            </v-col>
            <v-col cols="2">
                <strong>Date : </strong> {{ formatDate(item.date_heure_evenement) }}
            </v-col>
            <v-col cols="2">
                <v-btn v-bind="$props" @click="dialog = !dialog">Éditer</v-btn>
                <v-dialog v-model="dialog" scrollable transition="dialog-bottom-transition" fullscreen>
                    <EditionTransaction :id_evenement="item.id_evenement" :strPrix="item.prix_evenement"
                        :idClient="item.id_client" :user_account_id="item.user_account_id"
                        @close-Dialog="closeDialog" />
                </v-dialog>
            </v-col>
        </v-row>
        <v-divider thickness="2"/>
    </v-list-item>
</template>

<script>

import EditionTransaction from '@/views/EditionTransaction.vue';

export default {
    components: {
        EditionTransaction: EditionTransaction,
    },
    props: {
        item: {},
        colour: String,
    },
    data() {
        return {
            dialog: false,
        }
    },
    methods: {
    formatDate(isoDate) {
            const date = new Date(isoDate);
            const options = {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            //hour: "2-digit",
            //minute: "2-digit",
            //second: "2-digit"
            };
            return date.toLocaleString("fr-FR", options);
        },
        closeDialog() {
            this.dialog = !this.dialog;
            this.$emit('refresh-list')
        },
},
computed: {
    classItem() {
        console.log(this.colour);
        return "ma-2 bg-" + this.colour;
},
},
}
</script>