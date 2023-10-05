const express = require("express");
const router = express.Router();
const passport = require("passport");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const HttpError = require("../HttpError");
const EmployeQueries = require("../queries/EmployeQueries");
const userAccountQueries = require("../queries/UserAccountQueries");
const rules = require('./regles.js');
const crypto = require('crypto');


router.get("/", (req, res, next) => {
    EmployeQueries
        .getAllEmployes()
        .then((employes) => {
            res.json(employes);
        })
        .catch((err) => {
            return next(err);
        });
});

function validateEmploye(employe) {
    if (employe.nomEmploye !== "") {
        if (!rules.nom.test(employe.nomEmploye)) {
            throw new HttpError(400, "Format de nom invalide");
        }
    }
    if (employe.prenomEmploye !== "") {
        if (!rules.prenom.test(employe.prenomEmploye)) {
            throw new HttpError(400, "Format du prénom invalide");
        }
    }
    if (employe.posteEmploye !== "") {
        if (!rules.posteEmploye.test(employe.posteEmploye)) {
            throw new HttpError(400, "Format du nom de poste invalide");
        }
    }
    if (employe.telephone !== '') {
        if (!rules.telephone.test(employe.telephoneEmploye)) {
            throw new HttpError(400, "Format du numéro de téléphone invalid");
        }
    }
    if (employe.numeroCivic !== '') {
        if (!rules.numeroCivic.test(employe.numeroCivic)) {
            throw new HttpError(400, "Format du numéro civic invalid");
        }
    }
    if (employe.numeroAppartement !== "") {
        if (!rules.numeroAppartement.test(employe.numeroAppartement)) {
            throw new HttpError(400, "Format du numéro d'appartement invalid");
        }
    }
    if (employe.nomRue !== "") {
        if (!rules.nomRue.test(employe.nomRue)) {
            throw new HttpError(400, "Format du nom de rue invalide");
        }
    }
    if (employe.nomVille !== "") {
        if (!rules.nomVille.test(employe.nomVillee)) {
            throw new HttpError(400, "Format du nom de la ville invalide");
        }
    }
    if (employe.nomProvince !== "") {
        if (!rules.nomProvince.test(employe.nomProvince)) {
            throw new HttpError(400, "Format du nom de la province invalide");
        }
    }
    if (employe.codePostal !== "") {
        if (!rules.codePostal.test(employe.codePostal)) {
            throw new HttpError(400, "Format du code postal invalide");
        }
    }
}

router.get("/:id", (req, res, next) => {
    const id = req.params.id;
    EmployeQueries.getEmploye(id).then((employe) => {
        if (employe) {
            res.json(employe);
        } else {
            return next(new HttpError(404, `Employe ${id} introuvable`));
        }
    })
        .catch((err) => {
            return next(err);
        });
});

router.post('/',
    passport.authenticate('basic', { session: false }),
    async (req, res, next) => {
        const user = req.user;

        if (!user || !user.isAdmin) {
            return next(new HttpError(403, "Droit administrateur requis"));
        }

        validateEmploye(req.body);



        const employe = {
            nomEmploye: "" + req.body.nomEmploye,
            prenomEmploye: "" + req.body.prenomEmploye,
            posteEmploye: "" + req.body.posteEmploye,
            telephoneEmploye: "" + req.body.telephoneEmploye,
            numeroCivic: + req.body.numeroCivic,
            numeroAppartement: "" + req.body.numeroAppartement,
            nomRue: "" + req.body.nomRue,
            nomVille: "" + req.body.nomVille,
            nomProvince: "" + req.body.nomProvince,
            codePostal: "" + req.body.codePostal,

        }


        try {


            const newEmploye = await EmployeQueries.createEmploye(employe);
            if (!newEmploye) {
                return next(new HttpError(404, `Employe ${id} introuvable`));
            }
            const newAccountName = newEmploye.prenomEmploye[0] + newEmploye.nomEmploye + newEmploye.idEmploye;
            const newAccountCouriel = newAccountName + "@citron.com";

            const saltBuf = crypto.randomBytes(16);
            const salt = saltBuf.toString("base64");
            // Calcule le hash pour le mot de passe, la fonction fléchée en callback sera appellée
            // avec le résultat dans le paramètre derivedKey
            crypto.pbkdf2(newAccountName, salt, 100000, 64, "sha512", async (err, derivedKey) => {
                if (err) {
                    return next(err);
                }
                const passwordHashBase64 = derivedKey.toString("base64");

                try {

                    const userAccountWithPasswordHash = await userAccountQueries.createUserAccount(newAccountName, newEmploye.idEmploye, newAccountCouriel,
                        passwordHashBase64, salt);

                    const userDetails = {
                        userAccountId: userAccountWithPasswordHash.userAccountId,
                        idEmploye: userAccountWithPasswordHash.idEmploye,
                        courrielCompteEmploye: userAccountWithPasswordHash.courrielCompteEmploye,
                        passwordHash: userAccountWithPasswordHash.passwordHash,
                        passwordSalt: userAccountWithPasswordHash.passwordSalt,
                    };
                    res.json(userDetails);
                } catch (err) {
                    return next(err);
                }
            });
        } catch (error) {
            return next(error);
        }
    }
);



router.put('/:id',
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {

        const id = req.params.id
        const user = req.user;
        console.log(user);
        if (!user || !user.isAdmin || user.id_employe !== id) {
            return next(new HttpError(403, "Droit administrateur requis ou être titulaire du compte"));
        }

        if (!id || id === '') {
            return next(new HttpError(400, 'Le paramètre id est requis'));
        }

        if (id != req.body.idEmploye) {
            return next(new HttpError(400, `Le paramètre spécifie l'id ${id} alors que l'utilisateur fourni a l'id ${req.body.idEmploye}`));
        }
        validateEmploye(req.body);

        try {
            const employe = {
                idEmploye: "" + req.body.idEmploye,
                nomEmploye: "" + req.body.nomEmploye,
                prenomEmploye: "" + req.body.prenomEmploye,
                posteEmploye: "" + req.body.posteEmploye,
                telephoneEmploye: "" + req.body.telephoneEmploye,
                numeroCivic: + req.body.numeroCivic,
                numeroAppartement: "" + req.body.numeroAppartement,
                nomRue: "" + req.body.nomRue,
                nomVille: "" + req.body.nomVille,
                nomProvince: "" + req.body.nomProvince,
                codePostal: "" + req.body.codePostal,
                isArchive: "" + req.body.isArchive,
            }


            EmployeQueries.updateEmploye(employe).then(result => {
                if (!result) {
                    return next(new HttpError(404, `Employe ${id} introuvable`));
                }

            }).catch(err => {
                return next(err);
            });

            EmployeQueries.getEmploye(id).then(employe => {
                if (employe) {
                    res.json(employe);
                } else {
                    return next(new HttpError(404, `Employe ${id} introuvable`));
                }
            }).catch(err => {
                return next(err);
            });
        } catch (error) {
            return next(error);
        }
    }
);

router.delete(
    "/:id",
    passport.authenticate("basic", { session: false }),
    (req, res, next) => {
        const user = req.user;

        if (!user || !user.isAdmin) {
            return next(HttpError(403, "Droit administrateur requis"));
        }

        const id = req.params.id;
        if (!id || id === "") {
            return next(new HttpError(400, "Le paramètre id est requis"));
        }
        if (id == user.idEmploye) {
            return next(new HttpError(400, "Vous ne pouvez pas vous effacer vous même"));
        }

        EmployeQueries
            .deleteEmploye(id)
            .then((result) => {
                if (!result) {
                    return next(new HttpError(404, `employe ${id} introuvable`));
                }

                res.json(result);
            })
            .catch((err) => {
                return next(err);
            });

    }

);

module.exports = router;