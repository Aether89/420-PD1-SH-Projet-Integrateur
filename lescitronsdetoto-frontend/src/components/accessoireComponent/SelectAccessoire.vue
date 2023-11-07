<template>
    <v-container justify="center">
        <v-sheet elevation="10" rounded="xl" maxHeight="650">
            <v-sheet class="pa-3 bg-primary text-center" rounded="t-xl">
                Listes des accessoires

            </v-sheet>

            <div class="pa-4">
                <v-chip-group v-model="selectedEventIDs" v-on:child-to-parent="receiveDataFromChild" multiple
                    selected-class="text-primary" column>
                    <v-chip v-for="item in items" :key="item.idAccessoire" :value="item.idAccessoire">
                        {{ item.name }}
                    </v-chip>
                </v-chip-group>
            </div>
        </v-sheet>
    </v-container>
</template>

<script>
import { useAccessoireStore } from '@/store/accessoire';
import { createAccessoireWvin } from '@/services/AccessoireService';
import session from '@/session';

import { reactive } from 'vue';

export default {
    props: ['vin', 'creat'],

    data() {

        return {


            session: session,
            accessoireStore: useAccessoireStore(),
            colors: ['#2196F3', '#90CAF9', '#64B5F6', '#42A5F5', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1', '#82B1FF', '#448AFF', '#2979FF', '#2962FF'],
            selectedEventIDs: [],

        };
    },
    methods: {

        genRandomIndex(length) {
            return Math.ceil(Math.random() * (length - 1));
        },
        rafraichirAccessoires() {
            this.accessoireStore.getAccessoires();
        },
    },
    computed: {
        pagination() {
            return Math.ceil(this.items.length / this.contentOfPage);
        },
        formState() {
            return reactive({
                selectedEventIDs: [],

            });

        },
        items() {
            const colorsLength = this.colors.length;
            let num = 0;
            return Array.from({ length: this.accessoires.length }, () => {
                const name = this.accessoires[num].nomAccessoire;
                const id = this.accessoires[num].idAccessoire;
                num++;
                return {
                    color: this.colors[this.genRandomIndex(colorsLength)],
                    name: `${name} `,
                    idAccessoire: `${id}`,
                };
            });
        },


        accessoires() {
            return this.accessoireStore.accessoires;
        },
    },
    watch: {
        selectedEventIDs() {
            this.$emit('receiveDataFromChild', this.selectedEventIDs);
        },


    },
    mounted() {
        this.accessoireStore.getAccessoires();
    },
};
</script>

