const express = require("express");
const router = express.Router();
const passport = require("passport");

const multer = require("multer");
const storage = multer.memoryStorage();


const HttpError = require("../HttpError");
const AccessoireQueries = require("../queries/AccessoireQueries");
const rules = require('./regles.js');




router.get("/", (req, res, next) => {
    AccessoireQueries
        .getAllAccessoires()
        .then((accessoires) => {
            res.json(accessoires.data);
        })
        .catch((err) => {
            return next(err);
        });
});

function validateAccessoire(accessoire) {
    if(accessoire.nomAccessoire !== "") {
        if(!rules.nom.test(accessoire.nomAccessoire)) {
            throw new HttpError(400, "Format de nom invalide");
        }
    }

   
}

router.get("/:id", (req, res, next) => {
    const id = req.params.id;
    AccessoireQueries.getAccessoire(id).then((accessoire) => {
        if (accessoire) {
            res.json(accessoire);
        } else {
            return next(new HttpError(404, `Accessoire ${id} introuvable`));
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

        validateAccessoire(req.body);



        const accessoire = {
            
            nomAccessoire:""+  req.body.nomAccessoire
        }


        try {


            AccessoireQueries.createAccessoire(accessoire).then(result => {
            if (!result) {
                return next(new HttpError(404, `Accessoire ${id} introuvable`));
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
            return next(new HttpError(403, "Droit ajout accessoire requis"));
        }

        if (!id || id === '') {
            return next(new HttpError(400, 'Le paramètre id est requis'));
        }

        validateAccessoire(req.body);

        try {
            const accessoire = {
                idAccessoire: req.body.idAccessoire,
                nomAccessoire: req.body.nomAccessoire
                
            };
const result = await AccessoireQueries.updateAccessoire(accessoire);

            if (!result) {
                throw new HttpError(404, `Accessoire ${id} introuvable`);
            }

            // Récupérer et renvoyer les informations mises à jour du client
            const updatedAccessoire = await AccessoireQueries.getAccessoire(result.idAccessoire);

            if (updatedAccessoire) {
                res.json(updatedAccessoire);
            } else {
                throw new HttpError(404, `Accessoire ${id} introuvable`);
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


        AccessoireQueries
            .deleteAccessoire(id)
            .then((result) => {
                if (!result) {
                    return next(new HttpError(404, `accessoire ${id} introuvable`));
                }

                res.json(result);
            })
            .catch((err) => {
                return next(err);
            });

    }

);

module.exports = router;