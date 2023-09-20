const express = require("express");
const router = express.Router();
const passport = require("passport");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const HttpError = require("../HttpError");
const InfoClientQueries = require("../queries/InfoClientQueries");


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
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {
        const user = req.user;

        if (!user || !user.isAdmin) {
            return next(new HttpError(403, "Droit administrateur requis"));
        }


        const InfoClient = {
            nomClient: "" + req.body.nomClient,
            prenomClient: "" + req.body.prenomClient,
            telephoneClient: "" + req.body.telephoneClient,
            numeroCivic: "" + req.body.numeroCivic,
            numeroAppartement: "" + req.body.numeroAppartement,
            nomRue: "" + req.body.nomRue,
            nomVille: "" + req.body.nomVille,
            nomProvince: "" + req.body.nomProvince,
            codePostal: "" + req.body.codePostal,

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

        try {
            // Data validation - Vérification de la présence des champs requis et de leurs types
            if (!idClient || idClient === '') {
                throw new HttpError(400, 'Le paramètre id est requis');
            }

            if (idClient !== req.body.idClient) {
                throw new HttpError(400, `Le paramètre spécifie l'id ${idClient} alors que l'utilisateur fourni a l'id ${req.body.idClient}`);
            }

            // Préparation des informations mises à jour du client
            const infoClient = {
                idClient: req.body.idClient,
                nomClient: req.body.nomClient,
                prenomClient: req.body.prenomClient,
                posteClient: req.body.posteClient,
                telephoneClient: req.body.telephoneClient,
                numeroCivic: req.body.numeroCivic,
                numeroAppartement: req.body.numeroAppartement,
                nomRue: req.body.nomRue,
                nomVille: req.body.nomVille,
                nomProvince: req.body.nomProvince,
                codePostal: req.body.codePostal,
                isArchive: req.body.isArchive,
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