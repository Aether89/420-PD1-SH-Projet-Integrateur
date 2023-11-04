<template>
    <v-row justify="center">
        <v-col cols="12" sm="7" md="6" lg="5">
            <v-sheet class="mx-auto" elevation="10" rounded="xl" maxHeight="650" max-width="600">
                <v-sheet class="pa-3 bg-primary text-center" rounded="t-xl">
                    Listes des accessoires
                    <v-pagination :total-visible="1" :length="this.pagination" v-model="page"></v-pagination>
                </v-sheet>

                <div class="pa-4">
                    <v-chip-group v-model="selectedEventIDs" v-on:child-to-parent="receiveDataFromChild" multiple
                        selected-class="text-primary" column>
                        <v-chip v-for="item in items.slice(this.currentIndex, (this.currentIndex + this.contentOfPage))"
                            :key="item.idAccessoire">
                            {{ item.name }}
                        </v-chip>
                    </v-chip-group>
                </div>
            </v-sheet>
        </v-col>
    </v-row>
</template>

<script>
import { useAccessoireStore } from '@/store/accessoire';
import session from '@/session';

import { reactive } from 'vue';

export default {

    data() {

        return {
            page: 1,
            currentIndex: 0,
            session: session,
            accessoireStore: useAccessoireStore(),
            colors: ['#2196F3', '#90CAF9', '#64B5F6', '#42A5F5', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1', '#82B1FF', '#448AFF', '#2979FF', '#2962FF'],
            selectedEventIDs: [],
            contentOfPage: 15,
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
        itemTooLoad() {
            this.selectedEventIDs.push(item.idAccessoire);

        },

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

        page(newIndex, oldIndex) {
            // existing code...
        },

        page(newIndex, oldIndex) {
            this.currentIndex = this.contentOfPage * (this.page - 1);
        }
    },
    mounted() {
        this.accessoireStore.getAccessoires();
    },
};
</script>

