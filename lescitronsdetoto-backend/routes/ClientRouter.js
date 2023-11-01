const express = require("express");
const router = express.Router();
const passport = require("passport");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const HttpError = require("../HttpError");
const InfoClientQueries = require("../queries/InfoClientQueries");
const rules = require('./regles.js');

function validateClient(client) {
    if (client.nomClient!=="") { if (!rules.nom.test(client.nomClient)) {
        throw new HttpError(400, "Format de nom invalide");
    }}
    if (client.prenomClient!=="") { if (!rules.prenom.test(client.prenomClient)) {
        throw new HttpError(400, "Format du prénom invalide");
    }	}

    if (client.telephone!=="") { if (!rules.telephone.test(client.telephoneClient)) {
        throw new HttpError(400, "Format du numéro de téléphone invalid");
    }}

    if (client.numeroCivic!=='') { if (!rules.numeroCivic.test(client.numeroCivic)) {
        throw new HttpError(400, "Format du numéro civic invalid");
    }}
    if (client.numeroAppartement!=="") { if (!rules.numeroAppartement.test(client.numeroAppartement)) {
        throw new HttpError(400, "Format du numéro d'appartement invalid");
    }}
    if (client.nomRue!=="") { if (!rules.nomRue.test(client.nomRue)) {
        throw new HttpError(400, "Format du nom de rue invalide");
    }}
    if (client.nomVille!=="") { if (!rules.nomVille.test(client.nomVillee)) {
        throw new HttpError(400, "Format du nom de la ville invalide");
    }}
    if (client.nomProvince!=="") { if (!rules.nomProvince.test(client.nomProvince)) {
        throw new HttpError(400, "Format du nom de la province invalide");
    }}
    if (client.codePostal!=="") { if (!rules.codePostal.test(client.codePostal)) {
        throw new HttpError(400, "Format du code postal invalide");
    }}
    if (client.courriel && client.courriel !=="") { if (!rules.email.test(client.courriel)) {
        throw new HttpError(400, "Format du courriel invalide");
    }}
}

router.get("/", (req, res, next) => {
    InfoClientQueries
        .getAllInfoClients()
        .then((infoClients) => {
            res.json(infoClients);
        })
        .catch((err) => {
            return next(err);
        });
});

router.get("/:id", (req, res, next) => {
    const id = req.params.id;
    InfoClientQueries.getInfoClient(id).then((infoClient) => {
        if (infoClient) {
            res.json(infoClient);
        } else {
            return next(new HttpError(404, `InfoClient ${id} introuvable`));
        }
    })
        .catch((err) => {
            return next(err);
        });
});

router.post('/',
    // passport.authenticate('basic', { session: false }),
    (req, res, next) => {

        // à retirer si on veut que utilisateur peuve s'ajouter
        // const user = req.user;

        // if (!user || !user.isAdmin) {
        //     return next(new HttpError(403, "Droit administrateur requis"));
        // }

validateClient(req.body);   
        const InfoClient = {
            nomClient: "" + req.body.nomClient,
            prenomClient: "" + req.body.prenomClient,
            telephoneClient: "" + req.body.telephoneClient,
            numeroCivic:  req.body.numeroCivic,
            numeroAppartement: "" + req.body.numeroAppartement,
            nomRue: "" + req.body.nomRue,
            nomVille: "" + req.body.nomVille,
            nomProvince: "" + req.body.nomProvince,
            codePostal: "" + req.body.codePostal,
            courrielClient: "" + req.body.courriel,
        }


        try {

            InfoClientQueries.createInfoClient(InfoClient).then(result => {
                if (!result) {
                    return next(new HttpError(404, `InfoClient ${id} introuvable`));
                }
                res.json(result);
            }).catch(err => {
                return next(err);
            });
        } catch (error) {
            return next(error);
        }
    }
);

router.put('/:id',
    passport.authenticate('basic', { session: false }),
    async (req, res, next) => {
        const idClient = req.params.id; // Utilisation d'une dénomination constante
console.log(req.body);
        try {
            // Data validation - Vérification de la présence des champs requis et de leurs types
            if (!idClient || idClient === '') {
                throw new HttpError(400, 'Le paramètre id est requis');
            }

            if (idClient != req.body.idClient) {
                throw new HttpError(400, `Le paramètre spécifie l'id ${idClient} alors que l'utilisateur fourni a l'id ${req.body.idClient}`);
            }
            validateClient(req.body);

            // Préparation des informations mises à jour du client
            const infoClient = {
                idClient: req.body.idClient,
                nomClient: req.body.nomClient,
                prenomClient: req.body.prenomClient,
                telephoneClient: req.body.telephoneClient,
                numeroCivic: req.body.numeroCivic,
                numeroAppartement: req.body.numeroAppartement,
                nomRue: req.body.nomRue,
                nomVille: req.body.nomVille,
                nomProvince: req.body.nomProvince,
                codePostal: req.body.codePostal,
                isArchive: req.body.isArchive,
                courrielClient: req.body.courrielClient
            };

            // Mettre à jour les informations du client
            const result = await InfoClientQueries.updateInfoClient(infoClient);

            if (!result) {
                throw new HttpError(404, `InfoClient ${idClient} introuvable`);
            }

            // Récupérer et renvoyer les informations mises à jour du client
            const updatedInfoClient = await InfoClientQueries.getInfoClient(idClient);

            if (updatedInfoClient) {
                res.json(updatedInfoClient);
            } else {
                throw new HttpError(404, `InfoClient ${idClient} introuvable`);
            }
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

        InfoClientQueries
            .deleteInfoClient(id)
            .then((result) => {
                if (!result) {
                    return next(new HttpError(404, `infoClient ${id} introuvable`));
                }

                res.json(result);
            })
            .catch((err) => {
                return next(err);
            });
    }
);

module.exports = router;