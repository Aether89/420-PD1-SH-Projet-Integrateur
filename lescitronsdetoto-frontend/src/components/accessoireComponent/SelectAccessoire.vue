<template>
    <div v-if="!this.accessoireStore.loading">
        <v-container :items="items" height="auto" item-height="50" fluid>

            <v-list-item>

                <v-checkbox v-model="selected" label="{{item.name}}" value="{{item.idAccessoire}}"></v-checkbox>
            </v-list-item>
        </v-container>
    </div>
</template>
<script type="module" src="./listeAccessoire.vue"></script>
