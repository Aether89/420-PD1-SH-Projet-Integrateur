const rules = {
  nom: (v) => ((!!v || "Champ requis") && (/^(?:[A-Za-zÀ-ÿ\s]+)$/.test(v) || "Nom invalide")),
  prenom: (v) => ((!!v || "Champ requis") && (/^(?:[A-Za-zÀ-ÿ\s]+)$/.test(v) || "Prénom invalide")),
  posteEmploye: (v) => ((!!v || "Champ requis") && (/^(?:[A-Za-zÀ-ÿ\s]+)$/.test(v) || "Poste invalide")),
  telephone: (v) => ((!!v || "Champ requis") && (/^((\+1)?[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/.test(v) || "Numéro de téléphone invalide")),
  numeroCivic: (v) => ((!!v || "Champ requis") && (/^[0-9]+$/.test(v) || "Numéro invalide")),
  numeroAppartement: (v) => /^[0-9a-zA-Z]*$/.test(v) || "Numéro invalide",
  
  nomRue: (v) => ((!!v || "Champ requis") &&(/^(?:[A-Za-zÀ-ÿ\s]+)$/.test(v) || "Nom de rue invalide")),
  nomVille: (v) => ((!!v || "Champ requis") &&(/^(?:[A-Za-zÀ-ÿ\s]+)$/.test(v) || "Nom de ville invalide")),
  nomProvince: (v) => ((!!v || "Champ requis") &&(/^(?:[A-Za-zÀ-ÿ\s]+)$/.test(v) || "Nom de province invalide")),
  codePostal: (v) => ((!!v || "Champ requis") &&(/^[A-Za-z][0-9][A-Za-z][0-9][A-Za-z][0-9]$/.test(v) || "Code postal invalide")),
  courriel: (v) => ((!!v || "Champ requis") &&(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || "Courriel invalide")),
  monetaire: (v) => /^\d+(\.\d{1,2})?$/.test(v) || "Valeur monétaire invalide",

};

export default rules;