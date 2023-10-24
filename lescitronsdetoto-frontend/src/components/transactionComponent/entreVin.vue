<template>
    <h3>Vin du véhicule</h3>
    <v-text-field v-model="couleur" label="Vin du véhicule" density="compact" maxlength="32" :rules="[rules.required]"
                    ></v-text-field>
</template>

<script>
import session from '../../session'
export default {
    props: {
        id: String,
        mode: String,
    },
    data() {
        return {
            session: session,
            vin: "",
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
        
    },
    mounted() {

    }
}
</script>