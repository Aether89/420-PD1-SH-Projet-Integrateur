<template>
    <v-card max-width="400" min-width="400" height="650">
        <v-card-item class="bg-orange-darken-4">
            <v-card-title>
                Liste des accessoires
            </v-card-title>

            <template v-slot:append>
                <v-btn :disabled="!(this.session.user)" color="white" icon="mdi-plus" size="small"
                    @click="accessoireStore.newAccessoire()"></v-btn>
            </template>
        </v-card-item>
        <v-divider></v-divider>
        <div v-if="!this.accessoireStore.loading">
            <v-virtual-scroll :items="items" height="590" item-height="50">
                <template v-slot:default="{ item }">
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-avatar :color="item.color" class="text-white" size="40">
                                {{ item.idAccessoire }}
                            </v-avatar>
                        </template>

                        <v-list-item-title>{{ item.name }}</v-list-item-title>

                        <template v-slot:append>
                            <v-btn @click="(this.accessoireStore.chargerAccessoire(item.idAccessoire))" size="small"
                                variant="tonal">
                                Éditer

                                <v-icon color="orange-darken-4" end>
                                    mdi-open-in-new
                                </v-icon>
                            </v-btn>
                        </template>
                    </v-list-item>
                </template>
            </v-virtual-scroll>
        </div>
    </v-card>
</template>
<script>


import { useAccessoireStore } from '@/store/accessoire';
import session from '@/session';


export default {

    data() {
        return {
            accessoireStore: useAccessoireStore(),
            colors: ['#2196F3', '#90CAF9', '#64B5F6', '#42A5F5', '#1E88E5', '#1976D2', '#1565C0', '#0D47A1', '#82B1FF', '#448AFF', '#2979FF', '#2962FF'],
            loading: true,
            loadError: false,
            session: session
        };
    },
    methods: {
        genRandomIndex(length) {
            return Math.ceil(Math.random() * (length - 1))
        },
        rafraichirAccessoires() {
            this.accessoireStore.getAccessoires();
        }

    },

    computed: {

        items() {

            const colorsLength = this.colors.length
            let num = 0

            return Array.from({ length: this.accessoires.length }, () => {


                const name = this.accessoires[num].nomAccessoire
                const id = this.accessoires[num].idAccessoire
                num++
                return {
                    color: this.colors[this.genRandomIndex(colorsLength)],
                    name: `${name} `,
                    idAccessoire: `${id}`

                }
            });
        },
        accessoires() {
            return this.accessoireStore.accessoires;
        }
    },
    mounted() {

        this.accessoireStore.getAccessoires();

    },


}
</script>


