<template>
    <v-sheet class="ma-2" max-width="40rem">
        <v-form @submit.prevent="login" validate-on="submit lazy" ref="loginform">
            <v-text-field v-model="userAccountId" label="Identifiant utilisateur"
                :rules="[rules.required, rules.passwordValid]" density="compact"></v-text-field>
            <v-text-field v-model="password" label="Mot de passe" type="password"
                :rules="[rules.required, rules.passwordValid]" density="compact"></v-text-field>
            <v-btn type="submit" :disabled="!userAccountId || !password">Se connecter</v-btn>
        </v-form>
        <div class="text-body ma-3">Vous n'avez pas de compte utilisateur ?&nbsp;
            <router-link to="/login/new" replace>Créez-en un !</router-link>
        </div>
    </v-sheet>
</template>

<script>
import session from '../session';

export default {
    data: function () {
        return {
            userAccountId: '',
            password: '',
            passwordValid: true,
            rules: {
                required: value => !!value || "Le champ est requis",

            }
        };
    },
    methods: {

        async login() {
            try {
                const user = await session.login(this.userAccountId, this.password);
                this.$refs.loginform.validate();

                if (user.mustChangePassword) {
                    // Redirigez l'utilisateur vers une page de changement de mot de passe
                    this.$router.push("/changepassword");
                } else {
                    // L'utilisateur n'a pas besoin de changer de mot de passe, redirigez-le vers une page d'accueil
                    this.$router.push("/");
                }
            } catch (error) {
                // Gérez les erreurs d'authentification ici
                console.error(error);
            }
        }
    }
}
</script>
