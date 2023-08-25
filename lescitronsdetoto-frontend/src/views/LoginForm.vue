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
                passwordValid: () => this.passwordValid || "Nom d'utilisateur ou mot de passe incorrect"
            }
        };
    },
    methods: {
        login() {
            session.login(this.userAccountId, this.password).then(() => {
                this.passwordValid = true;
                this.$refs.loginform.validate();
                this.$router.go(-1);
            }).catch(authError => {
                this.passwordValid = false;
                this.$refs.loginform.validate();
                alert(authError.message);
            });
        }
    }
}
</script>
