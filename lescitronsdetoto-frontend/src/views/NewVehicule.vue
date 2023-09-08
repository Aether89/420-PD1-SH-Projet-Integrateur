<template>
    <v-sheet v-if="session.user && session.user.isAdmin" class="ma-2" max-width="50rem">
        <v-form @submit.prevent="submitNewVehicule" validate-on="submit lazy" ref="vehiculform">
            <v-text-field v-model="vin" label="Identifiant unique du véhicule" density="compact"
                :rules="[rules.required]"></v-text-field>
                <v-text-field v-model="couleur" label="Couleur du véhicule" density="compact"
                ></v-text-field>
                <v-text-field v-model="couleur" label="Couleur du véhicule" density="compact"
                ></v-text-field>
                <v-text-field v-model="nombre_kilometre" label="Nombre de kilomètre" density="compact" type="number" step="1"
                ></v-text-field>
                <v-text-field v-model="prix_annonce" label="Prix annoncé" density="compact" type="number" step="0.01"
                ></v-text-field>
                <v-text-field v-model="promotion" label="Promotion" density="compact" type="number" step="0.01"
                ></v-text-field>
                <v-text-field v-model="description_courte" label="Description courte du véhicule" density="compact"
                ></v-text-field>
                <v-textarea v-model="description_longue" label="Description longue du véhicule" density="compact" 
                ></v-textarea>
                <v-btn prepend-icon="mdi-car-search" class="mx-2" aria-label="confirmer" type="submit"
                color="green-lighten-2">Ajouter</v-btn>
                <router-link :to="{path: '/' }">
                    <v-btn prepend-icon="mdi-cancel" class="mx-2" aria-label="annuler" color="red-lighten-2"
                    >Annuler</v-btn>
                </router-link>
        </v-form>
    </v-sheet>
    <v-sheet v-else class="ma-2">Vous n'avez pas les permissions pour voir cette page</v-sheet>
</template>

<script>
import session from '../session';
import { createVehicule } from '../services/vehicule';

export default {
    data() {
        return {
            session: session,
            vin: '',
            id_etat: 1,
            marque: '',
            modele: '',
            annee: '',
            couleur: '',
            nombre_kilometre: 0,
            prix_annonce: 0,
            promotion: 0,
            description_courte: '',
            description_longue: '',   
            rules: {
                required: value => !!value || "Le champ est requis",
                //vinIdUnique: () => this.vinIdUnique || "Ce véhicule existe déjà dans le systeme"
            }/*,
            vinIdUnique: true
            */
        };
    },
    methods: {
        async submitNewVehicule() {
            //this.vinIdUnique = true;
            const formValid = await this.$refs.vehiculform.validate();
            if (!formValid.valid) {
                return;
            }
            const vehicule = {
                vin: this.vin,
                id_etat: this.id_etat,
                marque: this.marque,
                modele: this.modele,
                annee: this.annee,
                couleur: this.couleur,
                nombre_kilometre: this.nombre_kilometre,
                prix_annonce: this.prix_annonce,
                promotion: this.promotion,
                description_courte: this.description_courte,
                description_longue: this.description_longue
            };
            try {
                await createVehicule(vehicule);
                //this.vinIdUnique = true;
                this.$router.push('/vehicule/' + this.vin);
            } catch (err) {
                console.error(err);
                alert(err.message);
                /*if (err.status === 409) {
                    this.recetteIdUnique = false;
                }*/
                await this.$refs.recetteform.validate();
            }
        }
    }
}
</script>
