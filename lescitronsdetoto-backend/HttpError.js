// Classe utilitaire pour générer un message d'erreur à passer à la méthode next(...)
// Le gestionnaire d'erreur traitera tout objet qui est une instance de cette classe
// de manière spéciale, en appelant la méthode getJsonMessage() afin de créer une réponse
// contenant un objet JSON décritant l'erreur avec les champs status et message.
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
    this.message = message;
  }

  getJsonMessage() {
    return { status: this.status, message: this.message };
  }
}

module.exports = HttpError;
