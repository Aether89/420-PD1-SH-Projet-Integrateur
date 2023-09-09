<template>
    <div class="boxed">
        <div>Nom :{{ nomEmploye }}</div>
        <div>Prénom: {{ prenomEmploye }}</div>
        <div>Poste : {{ posteEmploye }}</div>
        <div>Téléphone : {{ telephoneEmploye }}</div>
        <div>code Postal : {{ codePostalEmploye }}</div>
    </div>
</template>

<script>
export default {
    props: {

        idEmploye: Number,
        nomEmploye: String,
        prenomEmploye: String,
        posteEmploye: String,
        telephoneEmploye: String,
        codePostalEmploye: String
    },
    inject: ['employes'],
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
}
</script>