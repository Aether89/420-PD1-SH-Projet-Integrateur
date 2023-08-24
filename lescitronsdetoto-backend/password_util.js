// Pour générer le hash et salt d'un mot de passe, lancer en ligne de commande :
//
// node password_util.js motdepasse
//
// ... substituez motdepasse par le mot de passe voulu.
// L'outil affichera dans la console le hash calculé du mot de passe ainsi que la valeur
// salt générée aléatoirement. Ces valeurs sont encodées en base64 et peuvent être insérées
// telles quelles dans les colonnes password_hash et password_salt de la table user_account
// dans la BD paniervert.

const crypto = require("crypto");

const saltBuf = crypto.randomBytes(16);
const salt = saltBuf.toString("base64");

const password = process.argv[2];

crypto.pbkdf2(password, salt, 100000, 64, "sha512", (err, derivedKey) => {
    if (err) throw err;
    console.log("hash: " + derivedKey.toString("base64"));
    console.log("salt: " + salt);
});
