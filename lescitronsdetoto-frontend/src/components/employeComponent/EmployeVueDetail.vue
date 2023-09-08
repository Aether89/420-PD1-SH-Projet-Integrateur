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
        employeExiste: Boolean,
        idEmploye: Number,
        nomEmploye: String,
        prenomEmploye: String,
        posteEmploye: String,
        telephoneEmploye: String,
        codePostalEmploye: String
    }
}
</script>