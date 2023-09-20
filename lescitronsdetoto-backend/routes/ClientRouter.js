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
            nomInfoClient: "" + req.body.nomClient,
            prenomInfoClient: "" + req.body.prenomClient,
            telephoneInfoClient: "" + req.body.telephoneClient,
            numeroCivic: "" + req.body.numeroCivic,
            numeroAppartement: "" + req.body.numeroAppartement,
            nomRue: "" + req.body.nomRue,
            nomVille: "" + req.body.nomVille,
            nomProvince: "" + req.body.nomProvince,
            codePostal: "" + req.body.codePostal,
            isArchive: "" + req.body.isArchive,
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
    (req, res, next) => {

        const id = req.params.id
        const user = req.user;
        console.log(user);
        if (!user || !user.isAdmin && user.id_Client !== id) {
            return next(new HttpError(403, "Droit administrateur requis ou être titulaire du compte"));
        }

        if (!id || id === '') {
            return next(new HttpError(400, 'Le paramètre id est requis'));
        }

        if (id != req.body.idInfoClient) {
            return next(new HttpError(400, `Le paramètre spécifie l'id ${id} alors que l'utilisateur fourni a l'id ${req.body.idClient}`));
        }


        try {
            const infoClient = {
                idClient: "" + req.body.idClient,
                nomClient: "" + req.body.nomClient,
                prenomClient: "" + req.body.prenomClient,
                posteClient: "" + req.body.posteClient,
                telephoneClient: "" + req.body.telephoneClient,
                numeroCivic: "" + req.body.numeroCivic,
                numeroAppartement: "" + req.body.numeroAppartement,
                nomRue: "" + req.body.nomRue,
                nomVille: "" + req.body.nomVille,
                nomProvince: "" + req.body.nomProvince,
                codePostal: "" + req.body.codePostal,
                isArchive: "" + req.body.isArchive,
            }


            InfoClientQueries.updateInfoClient(infoClient).then(result => {
                if (!result) {
                    return next(new HttpError(404, `InfoClient ${id} introuvable`));
                }

            }).catch(err => {
                return next(err);
            });

            InfoClientQueries.getInfoClient(id).then(infoClient => {
                if (infoClient) {
                    res.json(infoClient);
                } else {
                    return next(new HttpError(404, `InfoClient ${id} introuvable`));
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