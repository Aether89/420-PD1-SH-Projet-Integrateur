<!-- <template>
    <v-card class="ma-2">
        <v-sheet class="d-flex flex-no-wrap">

            <div class="text-h5">{{ nomEmploye }}</div>
            <div class="text-h5">{{ prenomEmploye }}</div>
            <div class="text-h5">{{ posteEmploye }}</div>
            <div class="text-h5">{{ telephoneEmploye }}</div>
            <div class="text-h5">{{ codePostalEmploye }}</div>

        </v-sheet>
    </v-card>
</template>

  
<script>

import session from '../../session.js';

export default {
    data() {
        return {
            session: session,
            employes: []
        };
    },
    methods: {
        rafraichirEmployes() {
            fetch("/api/employes/" + this.idEmploye)
                .then((response) => {
                    if (response.ok) {
                        return response.json();
                    } else {
                        throw new Error("Erreur HTTP " + response.status);
                    }
                })
                .then((respEmployes) => {

                    const nouvEmployes = [];
                    respEmployes.forEach((respEmploye) => {
                        const nouvEmploye = {
                            idEmploye: Number,
                            nomEmploye: String,
                            prenomEmploye: String,
                            posteEmploye: String,
                            telephoneEmploye: String,
                            codePostalEmploye: String,
                        };
                        nouvEmployes.push(nouvEmploye);
                    });

                    this.employe = nouvEmployes;
                }).catch((error) => {
                    console.err("Erreur", error);
                });
        }
    },
    provide() {
        return {
            employes: computed(() => this.employes),
            rafraichirEmployes: this.rafraichirEmployes
        };
    },
    mounted() {
        this.rafraichirEmployes();
    }
};
</script> -->