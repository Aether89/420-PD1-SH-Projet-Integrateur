const express = require("express");
const router = express.Router();
const passport = require("passport");

const multer = require("multer");
const storage = multer.memoryStorage();


const HttpError = require("../HttpError");
const InterventionQueries = require("../queries/InterventionQueries");
const rules = require('./regles.js');



router.get("/", (req, res, next) => {
    InterventionQueries
        .getAllInterventions()
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
    InterventionQueries.getIntervention(id).then((intervention) => {
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

router.post('/',
    passport.authenticate('basic', { session: false }),
    async (req, res, next) => {
        const user = req.user;

        if (!user || !user.isAdmin) {
            return next(new HttpError(403, "Droit administrateur requis"));
        }

        validateIntervention(req.body);



        const intervention = {
            typeIntervention: "" + req.body.typeIntervention,
            valeurIntervention: "" + req.body.valeurIntervention,
            etatIntervention: "" + req.body.etatIntervention
        }


        try {


            const newIntervention = await InterventionQueries.createIntervention(intervention).then(result => {
            if (!newIntervention) {
                return next(new HttpError(404, `Intervention ${id} introuvable`));
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

        const id = req.params.id
        const user = req.user;
        console.log(user);
        if (!user || !user.isAdmin ) {
            return next(new HttpError(403, "Droit administrateur requis ou être titulaire du compte"));
        }

        if (!id || id === '') {
            return next(new HttpError(400, 'Le paramètre id est requis'));
        }

        if (id != req.body.idIntervention) {
            return next(new HttpError(400, `Le paramètre spécifie l'id ${id} alors que l'utilisateur fourni a l'id ${req.body.idIntervention}`));
        }
        validateIntervention(req.body);

        try {
            const intervention = {
                idIntervention: "" + req.body.idIntervention,
                typeIntervention: "" + req.body.typeIntervention,
                valeurIntervention: "" + req.body.valeurIntervention,
                etatIntervention: "" + req.body.etatIntervention
                
            }


            const result = await InterventionQueries.updateIntervention(intervention);

            if (!result) {
                throw new HttpError(404, `Intervntion ${id} introuvable`);
            }

            // Récupérer et renvoyer les informations mises à jour du client
            const updatedIntervntion = await InterventionQueries.getIntervention(id);

            if (updatedIntervntion) {
                res.json(updatedIntervntion);
            } else {
                throw new HttpError(404, `Intervntion ${id} introuvable`);
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


        InterventionQueries
            .deleteIntervention(id)
            .then((result) => {
                if (!result) {
                    return next(new HttpError(404, `intervention ${id} introuvable`));
                }

                res.json(result);
            })
            .catch((err) => {
                return next(err);
            });

    }

);

module.exports = router;