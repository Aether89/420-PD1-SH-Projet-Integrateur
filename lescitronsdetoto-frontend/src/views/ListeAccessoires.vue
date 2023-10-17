<template  v-if="this.session.user">
    <v-container class="d-flex block" justify="center">

        <ScrollAccessoire />
        <SelectAccessoire />
        <AccessoireVue />

    </v-container>
</template>
<script>
import ScrollAccessoire from '@/components/accessoireComponent/ScrollAccessoire.vue';
import SelectAccessoire from '@/components/accessoireComponent/SelectAccessoire.vue';
import AccessoireVue from '@/components/accessoireComponent/Accessoire.vue';

export default {
    components: {
        ScrollAccessoire: ScrollAccessoire,
        SelectAccessoire: SelectAccessoire,
        AccessoireVue: AccessoireVue,
    },


    data() {
        return {
        };
    },
};
</script>
