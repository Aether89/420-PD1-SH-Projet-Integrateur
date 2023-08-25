<template>
    <v-sheet class="ma-2" max-width="40rem">
        <div class="text-h5">Nouveau compte utilisateur</div>
        <v-form @submit.prevent="createNewAccount" validate-on="submit lazy" ref="accountform">
            <v-text-field v-model="userAccountId" label="Identifiant utilisateur"
                :rules="[rules.required, rules.userAccountIdUnique]" density="compact"></v-text-field>
            <v-text-field v-model="password" label="Mot de passe" :rules="[rules.required, rules.passwordsMatch]"
                density="compact" type="password"></v-text-field>
            <v-text-field v-model="passwordConf" label="Confirmez le mot de passe"
                :rules="[rules.required, rules.passwordsMatch]" density="compact" type="password"></v-text-field>
            <v-text-field v-model="userFullName" label="Prénom et nom" density="compact"></v-text-field>
            <v-btn type="submit" :disabled="!userAccountId || !password || !passwordConf">Créer un nouveau compte</v-btn>
        </v-form>
    </v-sheet>
</template>

<script>
import session from '../session';

export default {
    data: function () {
        return {
            userAccountId: '',
            password: '',
            passwordConf: '',
            userFullName: '',
            rules: {
                required: value => !!value || "Le champ est requis",
                passwordsMatch: () => this.password === this.passwordConf || "Les mots de passe ne correspondent pas",
                userAccountIdUnique: () => this.userAccountUnique || "Cet identifiant est déjà utilisé, veuillez en enter un autre"
            },
            userAccountUnique: true
        };
    },
    methods: {
        async createNewAccount() {
            this.userAccountUnique = true;
            const formValid = await this.$refs.accountform.validate();

            if (formValid.valid) {
                session.createNewAccount(this.userAccountId, this.password, this.userFullName).then(() => {
                    alert("Compte créé avec succès, veuillez vous authentifier pour accéder à votre compte.");
                    this.userAccountUnique = true;
                    this.$router.replace('/login');
                }).catch(authError => {
                    alert(authError.message);
                    if (authError.status === 409) {
                        this.userAccountUnique = false;
                        this.$refs.accountform.validate();
                    }
                });
            }
        }
    }
}
</script>
