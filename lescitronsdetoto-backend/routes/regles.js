module.exports = {
    nom: /^(?:[A-Za-zÀ-ÿ\s]+)$/,
    prenom: /^(?:[A-Za-zÀ-ÿ\s]+)$/,
    posteEmploye: /^(?:[A-Za-zÀ-ÿ\s]+)$/,
    telephone:  /^((\+1)?[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/,
    numeroCivic:/^[0-9]+$/,
    numeroAppartement:/^[0-9a-zA-Z]*$/,
    nomRue:/^(?:[A-Za-zÀ-ÿ\s]+)$/,
    nomVille:/^(?:[A-Za-zÀ-ÿ\s]+)$/,
    nomProvince:/^(?:[A-Za-zÀ-ÿ\s]+)$/,
    codePostal: /^[A-Za-z][0-9][A-Za-z][0-9][A-Za-z][0-9]$/,
    monetaire: /^\d+(\.?,?\d?d?)?$/,
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};
