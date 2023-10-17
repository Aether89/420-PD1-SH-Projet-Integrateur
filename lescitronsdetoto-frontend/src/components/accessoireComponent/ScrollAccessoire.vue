<template>
    <v-card max-width="400" min-width="400" height="auto">
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
            <v-virtual-scroll :items="items" height="auto" item-height="50">
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
                                View User

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
<script type="module" src="./listeAccessoire.vue"></script>