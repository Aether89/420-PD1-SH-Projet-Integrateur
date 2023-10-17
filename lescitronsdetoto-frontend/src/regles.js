

const rules = {
  nom: (v) => ((!!v || "Champ requis") && (/^[A-Za-z\s]+$/.test(v) || "Nom invalide")),
  prenom: (v) => ((!!v || "Champ requis") && (/^[A-Za-z\s]+$/.test(v) || "Prénom invalide")),
  posteEmploye: (v) => ((!!v || "Champ requis") && (/^[A-Za-z\s]+$/.test(v) || "Poste invalide")),
  telephone: (v) => ((!!v || "Champ requis") && (/^[0-9]{10}$/.test(v) || "Numéro de téléphone invalide")),
  numeroCivic: (v) => /^[0-9]+$/.test(v) || "Numéro invalide",
  numeroAppartement: (v) => /^[0-9a-zA-Z]*$/.test(v) || "Numéro invalide",
  nomRue: (v) => /^[A-Za-z0-9\s]+$/.test(v) || "Nom de rue invalide",
  nomVille: (v) => /^[A-Za-z\s]+$/.test(v) || "Nom de ville invalide",
  nomProvince: (v) => /^[A-Za-z\s]+$/.test(v) || "Nom de province invalide",
  codePostal: (v) => /^[A-Za-z][0-9][A-Za-z][0-9][A-Za-z][0-9]$/.test(v) || "Code postal invalide",
  monetaire: (v) => /^\d+(\.?,?\d?d?)?$/.test(v) || "Valeur monétaire invalide",



};



export default rules;