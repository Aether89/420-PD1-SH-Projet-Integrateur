const express = require("express");
const router = express.Router();
const passport = require("passport");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const HttpError = require("../HttpError");
const EmployeQueries = require("../queries/EmployeQueries");


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
    (req, res, next) => {
        const user = req.user;

        if (!user || !user.isAdmin) {
            return next(new HttpError(403, "Droit administrateur requis"));
        }


        const Employe = {
            nomEmploye: "" + req.body.nomEmploye,
            prenomEmploye: "" + req.body.prenomEmploye,
            posteEmploye: "" + req.body.posteEmploye,
            telephoneEmploye: "" + req.body.telephoneEmploye,
            codePostalEmploye: "" + req.body.codePostalEmploye
        }


        try {

            EmployeQueries.createEmploye(Employe).then(result => {
                if (!result) {
                    return next(new HttpError(404, `Employe ${id} introuvable`));
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
        if (!user || !user.isAdmin && user.id_employe !== id) {
            return next(new HttpError(403, "Droit administrateur requis ou être titulaire du compte"));
        }

        if (!id || id === '') {
            return next(new HttpError(400, 'Le paramètre id est requis'));
        }

        if (id != req.body.idEmploye) {
            return next(new HttpError(400, `Le paramètre spécifie l'id ${id} alors que l'utilisateur fourni a l'id ${req.body.idEmploye}`));
        }


        try {
            const employe = {
                idEmploye: "" + req.body.idEmploye,
                nomEmploye: "" + req.body.nomEmploye,
                prenomEmploye: "" + req.body.prenomEmploye,
                posteEmploye: "" + req.body.posteEmploye,
                telephoneEmploye: "" + req.body.telephoneEmploye,
                codePostalEmploye: "" + req.body.codePostalEmploye
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