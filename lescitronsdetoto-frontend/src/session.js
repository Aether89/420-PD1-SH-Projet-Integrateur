import { reactive } from "vue";

class AuthError extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}

const session = reactive({
    user: null,
    username: null,
    password: null,

    initialize() {
        if (sessionStorage.username) {
            this.username = sessionStorage.username;
        }
        if (sessionStorage.password) {
            this.password = sessionStorage.password;
        }
        if (this.user == null && this.username != null) {
            this.fetchUser().catch(err => console.error("L'authentification initiale a échouée: ", err));
        }
    },

    login(username, password) {
        this.setCredentials(username, password);
        return this.fetchUser();
    },
    setCredentials(username, password) {
        this.username = username;
        sessionStorage.username = username;
        this.password = password;
        sessionStorage.password = password;

    },
    clearCredentials() {
        this.username = null;
        sessionStorage.removeItem('username');
        this.password = null;
        sessionStorage.removeItem('password');

    },
    disconnect() {
        this.user = null;
        this.clearCredentials();
        this.$router.push(`/`);
    },
    async fetchUser() {
        const response = await fetch("/api/login", {
            method: "GET",
            headers: {
                ... this.getAuthHeaders()
            }
        });

        if (response.ok) {
            const user = await response.json();
            this.user = user;
            return user;
        } else {
            this.user = null;
            if (response.status === 401) {
                throw new AuthError(response.status, "Nom d'utilisateur ou mot de passe incorrect");
            } else {
                throw new AuthError(response.status, "Erreur lors de l'authentification: " + response.status);
            }
        }
    },
    getAuthHeaders() {
        if (this.username) {
            return {
                "Authorization": "Basic " + btoa(this.username + ":" + this.password),
                "X-Requested-With": "XMLHttpRequest"
            };
        } else {
            return {};
        }
    },
    async createNewAccount(userAccountId, password, idEmploye) {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                userAccountId: userAccountId,
                password: password,
                idEmploye: idEmploye
            })
        });

        if (response.ok) {
            const user = await response.json();
            return user;
        } else {
            this.user = null;
            if (response.status === 409) {
                const respBody = await response.json();
                if (respBody && respBody.message) {
                    throw new AuthError(response.status, respBody.message);
                }
                throw new AuthError(response.status, "Erreur lors de la création du compte");
            } else {
                throw new AuthError(response.status, "Erreur lors de la création du compte: " + response.status);
            }
        }
    },
    async changePassword(userAccountId, oldPassword, newPassword) {
  try {
    const response = await fetch('/api/changepassword', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...this.getAuthHeaders()
      },
      body: JSON.stringify({
        userAccountId,
        oldPassword,
        newPassword
      })
    });

    if (response.status === 200) {
      return { success: true };
    } else {
      const data = await response.json();
      return { success: false, error: data.message };
    }
  } catch (error) {
    return { success: false, error: 'Erreur inattendue' };
  }
}
});

export default session;

session.initialize();
