<template>
    <v-sheet color="light-blue">
        <v-toolbar v-if="isDialog" dark color="lime">
            <v-toolbar-title @click="$emit('closeDialog')">Les citrons de Toto</v-toolbar-title>
        </v-toolbar>
        <v-spacer></v-spacer>
        <v-form @submit.prevent="changePassword" validate-on="submit lazy" ref="changePasswordForm">
            <v-text-field v-model="oldPassword" label="Ancien mot de passe" :rules="[rules.required, rules.passwordValid]"
                density="compact"></v-text-field>
            <v-text-field v-model="newPassword" label="Nouveau mot de passe" type="password"
                :rules="[rules.required, rules.passwordValid]" density="compact"></v-text-field>
            <v-text-field v-model="newPasswordValidation" label="Confirmer le nouveau mot de passe" type="password"
                :rules="[rules.required, rules.passwordValid, rules.passwordMatch]" density="compact"></v-text-field>
            <v-btn type="submit" :disabled="!oldPassword || !newPassword || !newPasswordValidation">Changer le mot de
                passe</v-btn>
        </v-form>
    </v-sheet>
</template>

<script>
import session from '../session';

export default {
    data: function () {
        return {
            oldPassword: '',
            newPassword: '',
            newPasswordValidation: '',
            rules: {
                required: value => !!value || "Le champ est requis",
                passwordValid: value => (value && value.length >= 8) || "Le mot de passe doit comporter au moins 8 caractères",
                passwordMatch: value => value === this.newPassword || "Les mots de passe ne correspondent pas",
            }
        };
    },
    methods: {
        async changePassword() {
            try {
                if (this.newPassword === this.newPasswordValidation) {
                    // Vous pouvez appeler une fonction de service pour changer le mot de passe
                    // Assurez-vous de gérer la logique de mise à jour du mot de passe côté serveur
                    const result = await session.changePassword(this.oldPassword, this.newPassword);

                    if (result.success) {
                        this.$router.push("login")
                    } else {
                        // Gérez les erreurs de changement de mot de passe
                        console.error(result.error);
                    }
                } else {
                    this.$refs.changePasswordForm.validate();
                }
            } catch (error) {
                // Gérez les erreurs d'authentification ici
                console.error(error);
            }
        }
    }
}
</script>