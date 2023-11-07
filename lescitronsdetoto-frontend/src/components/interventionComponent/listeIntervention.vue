<template>
    <v-card class="mx-auto" max-width="600" min-width="400" height="650">
        <v-card-item class="bg-orange-darken-4">
            <v-card-title>
                Liste des interventions
            </v-card-title>

            <template v-slot:append>
                <v-btn :disabled="!(this.session.user && this.session.user.isAdmin)" color="white" icon="mdi-plus"
                    size="small" @click="interventionStore.newIntervention()"></v-btn>
            </template>
        </v-card-item>
        <v-divider></v-divider>
        <div v-if="!this.interventionStore.loading">
            <v-virtual-scroll :items="items" height="590" item-height="50">
                <template v-slot:default="{ item }">
                    <v-list-item>
                        <template v-slot:prepend>
                            <v-avatar :color="item.color" class="text-white" size="40">
                                {{ item.idIntervention }}
                            </v-avatar>
                        </template>
                        <v-list-item-title>{{ item.type }}</v-list-item-title>

                        <template v-slot:append>
                            <v-btn @click="(this.interventionStore.chargerIntervention(item.idIntervention))" size="small"
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

import { useInterventionStore } from '@/store/intervention';
import session from '@/session';

export default {

    data() {
        return {
            interventionStore: useInterventionStore(),
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
        rafraichirInterventions() {
            this.interventionStore.getInterventions();
        }

    },

    computed: {

        items() {

            const colorsLength = this.colors.length
            let num = 0

            return Array.from({ length: this.interventions.length }, () => {



                const type = this.interventions[num].typeIntervention
                const id = this.interventions[num].idIntervention
                num++
                return {
                    color: this.colors[this.genRandomIndex(colorsLength)],

                    type: `${type}`,
                    idIntervention: `${id}`

                }
            });
        },
        interventions() {
            return this.interventionStore.interventions;
        }
    },
    mounted() {

        this.interventionStore.getInterventions();
        console.log(JSON.stringify(this.interventionStore.interventions,null,2));

    },


}
</script>

