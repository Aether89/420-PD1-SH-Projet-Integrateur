const express = require("express");
const router = express.Router();
const passport = require("passport");

const multer = require("multer");
const storage = multer.memoryStorage();

const HttpError = require("../HttpError");
const InterventionQueries = require("../queries/InterventionQueries");
const rules = require('./regles.js');

router.get("/", (req, res, next) => {
    InterventionQueries.getAllInterventions()
        .then((interventions) => {
            res.json(interventions);
        })
        .catch((err) => {
            return next(err);
        });
});

function validateIntervention(intervention) {
    if (intervention.typeIntervention !== "") {
        if (!rules.nom.test(intervention.typeIntervention)) {
            throw new HttpError(400, "Format du prénom invalide");
        }
    }
    if (intervention.valeurIntervention !== "") {
        if (!rules.monetaire.test(intervention.valeurIntervention)) {
            throw new HttpError(400, "Format valeur monétaire invalide");
        }
    }
}

router.get("/:id", (req, res, next) => {
    const id = req.params.id;
    InterventionQueries.getIntervention(id)
        .then((intervention) => {
            if (intervention) {
                res.json(intervention);
            } else {
                return next(new HttpError(404, `Intervention ${id} introuvable`));
            }
        })
        .catch((err) => {
            return next(err);
        });
});

router.post(
    '/',
    passport.authenticate('basic', { session: false }),
    async (req, res, next) => {
        const user = req.user;

        if (!user || !user.isAdmin) {
            return next(new HttpError(403, "Droit administrateur requis"));
        }

        try {
            validateIntervention(req.body);

            const intervention = {
                typeIntervention: req.body.typeIntervention,
                valeurIntervention: parseFloat(req.body.valeurIntervention.replace(/\s+/g, '').replace(',', '.')),
            }

            const newIntervention = await InterventionQueries.createIntervention(intervention);
const newInterventionSuccess = await InterventionQueries.getIntervention(newIntervention);
            if (!newInterventionSuccess) {
                return next(new HttpError(404, `Intervention introuvable`));
            }

            res.json(newInterventionSuccess);
        } catch (err) {
            return next(err);
        }
    }
);

router.put('/:id',
    passport.authenticate('basic', { session: false }),
    async (req, res, next) => {
        const id = req.params.id;
        const user = req.user;

        if (!user || (!user.isAdmin && user.id !== id)) {
            return next(new HttpError(403, "Droit administrateur requis ou être titulaire du compte"));
        }

        if (!id || id === '') {
            return next(new HttpError(400, 'Le paramètre id est requis'));
        }

        if (id !== req.body.idIntervention) {
            return next(new HttpError(400, `Le paramètre spécifie l'id ${id} alors que l'utilisateur fourni a l'id ${req.body.idIntervention}`));
        }

        try {
            validateIntervention(req.body);

            const intervention = {
                idIntervention: id,
                typeIntervention: req.body.typeIntervention,
                valeurIntervention: parseFloat(req.body.valeurIntervention.replace(/\s+/g, '').replace(',', '.')),
                etatIntervention: req.body.etatIntervention,
            }

            const updatedIntervention = await InterventionQueries.updateIntervention(intervention);

            if (!updatedIntervention) {
                return next(new HttpError(404, `Intervention introuvable`));
            }

            res.json(updatedIntervention);
        } catch (err) {
            return next(err);
        }
    }
);

router.delete(
    "/:id",
    passport.authenticate("basic", { session: false }),
    async (req, res, next) => {
        const user = req.user;

        if (!user || !user.isAdmin) {
            return next(new HttpError(403, "Droit administrateur requis"));
        }

        const id = req.params.id;

        if (!id || id === "") {
            return next(new HttpError(400, "Le paramètre id est requis"));
        }

        const result = await InterventionQueries.deleteIntervention(id);

        if (!result) {
            return next(new HttpError(404, `Intervention introuvable`));
        }

        res.json(result);
    }
);

module.exports = router;
