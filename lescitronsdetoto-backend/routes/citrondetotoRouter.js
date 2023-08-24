const express = require('express');
const router = express.Router();
const passport = require('passport');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const HttpError = require("../HttpError");

const recetteQueries = require("../queries/RecetteQueries");
const commentaireQueries = require("../queries/CommentaireQueries");
const appreciationQueries = require("../queries/AppreciationQueries");


router.get('/', (req, res, next) => {
    recetteQueries.getAllRecette().then(recettes => {
        res.json(recettes);
    }).catch(err => {
        return next(err);
    });
});


router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    console.log("id:", id);
    recetteQueries.getRecetteById(id).then(recette => {
        if (recette) {
            res.json(recette);
        } else {
            return next(new HttpError(404, `Recette ${id} introuvable`));
        }
    }).catch(err => {
        return next(err);
    });
});

router.get('/:id/commentaires', (req, res, next) => {
    const id = req.params.id;
    console.log("id:", id);
    commentaireQueries.getRecetteCommentaireById(id).then(commentaires => {
        if (commentaires) {
            res.json(commentaires);
        } else {
            return next(new HttpError(404, `Recette ${id} introuvable`));
        }
    }).catch(err => {
        return next(err);
    });
});

const onePixelTransparentPngImage = Buffer.from("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAAXNSR0IArs4c6QAAAA1JREFUGFdj+P///38ACfsD/QVDRcoAAAAASUVORK5CYII=", "base64");

router.get('/:id/image', (req, res, next) => {
    const id = req.params.id;
    console.log("id:", id);
    recetteQueries.getRecetteImageContent(id).then(imageInfo => {
        if (imageInfo && imageInfo.imageContent) {
            if (imageInfo.imageContentType) {
                res.header('Content-Type', imageInfo.imageContentType);
            }
            res.send(imageInfo.imageContent);
        } else {
            res.header('Content-Type', 'image/png');
            res.send(onePixelTransparentPngImage);
        }
    }).catch(err => {
        return next(err);
    });
});

router.post('/:id/commentaires',
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {
        const user = req.user;
        if (!user) {
            return next(new HttpError(403, "Doit être authentifier"));
        }

        const id = req.params.id;
        if (!id || id === '') {
            return next(new HttpError(400, 'Le champ id est requis'));
        }

        recetteQueries.getRecetteById(id).then(recette => {
            if (!recette) {
                throw new HttpError(404, `Une recette avec l'id ${id} n'existe pas`);
            }

            const nouveauCommentaire = {
                id: "" + id,
                user: "" + user.userAccountId,
                texte: "" + req.body.commentaire,
            };

            return commentaireQueries.insertCommentaire(nouveauCommentaire);
        }).then(result => {
            res.json(result);
        }).catch(err => {
            next(err);
        });

    });

router.get('/:id/appreciation',
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {
        const user = req.user;
        const id = req.params.id;

        if (!user) {
            return next(new HttpError(403, "Doit être authentifier KIU"));
        }
        appreciationQueries.selectMonAppreciation(id, user.userAccountId).then(appreciation => {
            if (appreciation) {
                res.json(appreciation);
            } else {
                return next(new HttpError(404, `Recette ${id} introuvable`));
            }
        }).catch(err => {
            return next(err);
        });


    });

router.post('/:id/appreciation',
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {
        const user = req.user;
        if (!user) {
            return next(new HttpError(403, "Doit être authentifier"));
        }

        const id = req.params.id;
        if (!id || id === '') {
            return next(new HttpError(400, 'Le champ id est requis'));
        }

        recetteQueries.getRecetteById(id).then(recette => {
            if (!recette) {
                throw new HttpError(404, `Une recette avec l'id ${id} n'existe pas`);
            }

            const appreciation = {
                id: "" + id,
                user: "" + user.userAccountId,
                rating: req.body.rating,
            };

            return appreciationQueries.updateAppreciation(appreciation);
        }).then(result => {
            res.json(result);
        }).catch(err => {
            next(err);
        });

    });

router.post('/',
    passport.authenticate('basic', { session: false }),
    (req, res, next) => {

        const user = req.user;

        if (!user || !user.isAdmin) {
            return next(new HttpError(403, "Droit administrateur requis"));
        }

        const id = req.body.id;
        if (!id || id === '') {
            return next(new HttpError(400, 'Le champ id est requis'));
        }

        const nomRecette = req.body.nom_recette;
        if (!nomRecette || typeof nomRecette !== 'string' || nomRecette.trim().length === 0) {
            return next(new HttpError(400, 'Le champ nom est requis'));
        }
        
        const descRecette = req.body.description;
        if (!descRecette || typeof nomRecette !== 'string' || nomRecette.trim().length === 0) {
            return next(new HttpError(400, 'Le champ description est requis'));
        }

        recetteQueries.getRecetteById(id).then(recette => {
            if (recette) {
                throw new HttpError(409, `Une recette avec l'id ${id} existe déjà`);
            }

            const newRecette = {
                id: "" + id,
                nom_recette: "" + req.body.nom_recette,
                description: "" + req.body.description,
                temps_preparation_minutes: "" + req.body.temps_preparation_minutes,
                temps_cuisson_minutes: "" + req.body.temps_cuisson_minutes,
                nb_portions: "" + req.body.nb_portions
            };

            

            if (newRecette.temps_cuisson_minutes.length > 0 && isNaN(newRecette.temps_cuisson_minutes) || newRecette.temps_cuisson_minutes.trim().length === 0) {
                newRecette.temps_cuisson_minutes = null;
            }
            
            if (newRecette.temps_preparation_minutes.length > 0 && isNaN(newRecette.temps_preparation_minutes) || newRecette.temps_preparation_minutes.trim().length === 0) {
                newRecette.temps_preparation_minutes = null;
            }

            if (newRecette.nb_portions.length > 0 && isNaN(newRecette.nb_portions) || newRecette.nb_portions.trim().length === 0) {
                newRecette.nb_portions = null;
            }

            
            console.log("avant etape.map");

            const newRecetteEtapes = req.body.recetteEtapes && req.body.recetteEtapes.map(etape => {
                return {
                    recette_id: req.body.id,
                    etape: etape.etape,
                    ordre: etape.ordre
                };
            });

            
            let etapeIterable = typeof newRecetteEtapes !== 'undefined' && Array.isArray(newRecetteEtapes);
            if (etapeIterable) {
                const ordres = new Set();
                for (const etape of newRecetteEtapes) {
                    console.log("etape.etape", typeof etape.etape);
                    if (etape.etape == null || typeof etape.etape !== 'string' ||etape.etape.trim().length === 0) {
                        throw new HttpError(404, 'Le champ de étape dans étape est requis');
                    }
                    if (ordres.has(etape.ordre)) {
                        throw new HttpError(404, 'Deux ou plus d\'ingrédients ont le même ordre');
                    }
                    ordres.add(etape.ordre);
                }
            }
            

            const newRecetteIngredient = req.body.recetteIngredients && req.body.recetteIngredients.map(ingredient => {
                return {
                    recette_id: req.body.id,
                    quantite: ingredient.quantite,
                    unite: ingredient.unite,
                    ingredient: ingredient.ingredient,
                    ordre: ingredient.ordre
                }
            });

            let ingredientIterable = typeof newRecetteIngredient !== 'undefined' && Array.isArray(newRecetteIngredient);
            if (ingredientIterable) {
                const ordres = new Set();
                for (const ingredient of newRecetteIngredient) {
                    console.log("ingredient.ingredient", typeof ingredient.ingredient);
                    if (ingredient.ingredient == null || typeof ingredient.ingredient !== 'string' ||ingredient.ingredient.trim().length === 0) {
                        throw new HttpError(404, 'Le champ de ingrédient dans ingrédient est requis');
                    }
                    if(ingredient.quantite === null || typeof ingredient.quantite === 'string' || ingredient.quantite === 0) {
                        ingredient.quantite = null;
                    }
                    if(ingredient.unite === null || typeof ingredient.unite !== 'string' || ingredient.unite.trim().length === 0) {
                        ingredient.unite = null;
                    }
                    if (ordres.has(ingredient.ordre)) {
                        throw new HttpError(404, 'Deux ou plus d\'ingrédients ont le même ordre');
                    }
                    ordres.add(ingredient.ordre);
                }
            }
                
            recetteQueries.insertRecette(newRecette);

            if (newRecetteEtapes && Array.isArray(newRecetteEtapes)) {
                newRecetteEtapes.forEach(etape => {
                    recetteQueries.insertRecetteEtape(etape);
                });
            }
            
            if (newRecetteIngredient && Array.isArray(newRecetteIngredient)) {
                newRecetteIngredient.forEach(ingredent => {
                    recetteQueries.insertRecetteIngredient(ingredent);
                });
            }

            return recetteQueries.getRecetteById(id);
        }).then(result => {
            res.json(result);
        }).catch(err => {
            next(err);
        });
    }
);

router.put('/:id', passport.authenticate('basic', { session: false }), async (req, res, next) => {
    try {
        const user = req.user;
        if (!user || !user.isAdmin) {
            throw new HttpError(403, "Doit être authentifié");
        }

        const id = req.params.id;
        if (!id || id === '') {
            throw new HttpError(400, 'Le champ id est requis');
        }

        const updatedRecette = req.body;

        const recette = await recetteQueries.getRecetteById(id);
        if (!recette) {
            throw new HttpError(404, `Une recette avec l'id ${id} n'existe pas`);
        }
        const nom = updatedRecette.nom;
        if (nom === null || typeof nom !== 'string' || nom.trim().length === 0) {
            throw new HttpError(404, `Le champ nom est requis`);
        }

        const description = updatedRecette.description;
        if (description === null || typeof description !== 'string' || description.trim().length === 0) {
            throw new HttpError(404, `Une description est requise`);
        }

        const portions = updatedRecette.info.portions;
        if (portions === null || portions.length > 0 && isNaN(portions) || portions == '') {
            updatedRecette.info.portions = null;
        }

        const preparation = updatedRecette.info.preparation;
        if (preparation === null || preparation.length > 0 && isNaN(preparation) || preparation == '') {
            updatedRecette.info.preparation = null;
        }

        const cuisson = updatedRecette.info.cuisson;
        if (cuisson === null || cuisson.length > 0 && isNaN(cuisson) || cuisson == '') {
            updatedRecette.info.cuisson = null;
        }


        let tmpChamp;
        console.log(updatedRecette);
        let ingredientIterable = typeof updatedRecette.ingredients[Symbol.iterator] === 'function';
        if (ingredientIterable) {
            const ordres = new Set();
            for (const ingredient of updatedRecette.ingredients) {
                tmpChamp = ingredient.ingredient;
                if (tmpChamp == null || typeof tmpChamp !== 'string' || tmpChamp.trim().length === 0) {
                    throw new HttpError(404, 'Un ingrédient est requis');
                }
                if(ingredient.quantite === null || typeof ingredient.quantite === 'string' || ingredient.quantite === 0) {
                    ingredient.quantite = null;
                }
                if(ingredient.unite === null  || typeof ingredient.unite !== 'string' || ingredient.unite.trim().length === 0) {
                    ingredient.unite = null;
                }
                if (ordres.has(ingredient.ordre)) {
                    throw new HttpError(404, 'Deux ou plus d\'ingrédients ont le même ordre');
                }
                ordres.add(ingredient.ordre);
            }
        }
        
        let EtapeIterable = typeof updatedRecette.etapes[Symbol.iterator] === 'function';
        if (EtapeIterable) {
            const ordres = new Set();
            for (const etape of updatedRecette.etapes) {
            tmpChamp = etape.etape;
            if (tmpChamp === null || typeof tmpChamp !== 'string' || tmpChamp.trim().length === 0) {
                throw new HttpError(404, 'Une étape est requis');
            }
            if (ordres.has(etape.ordre)) {
                throw new HttpError(404, 'Deux ou plus d\'étapes ont le même ordre');
            }
            ordres.add(etape.ordre);
          }
        }
        
        
        const recetteUpdate = await recetteQueries.updateRecette(updatedRecette);

        const precedentIngredient = await recetteQueries.countOrdre("recette_ingredient", updatedRecette.id);
        const updatedIngredient = updatedRecette.ingredients.length;
        let ingredientSupprimer;

        if (precedentIngredient > updatedIngredient) {
            ingredientSupprimer = await recetteQueries.deleteOrdre("recette_ingredient", updatedRecette.id, updatedIngredient);
        }


        const precedentEtape = await recetteQueries.countOrdre("recette_etape", updatedRecette.id);
        const updatedEtape = updatedRecette.etapes.length;
        let etapeSupprimer;
        if (precedentEtape > updatedEtape) {
            etapeSupprimer = await recetteQueries.deleteOrdre("recette_etape", updatedRecette.id, updatedEtape);
        }

        const newRecetteEtapes = req.body && updatedRecette.etapes.map(etape => {
            return {
                recette_id: req.body.id,
                etape: "" + etape.etape,
                ordre: etape.ordre
            };
        });

        if (newRecetteEtapes && Array.isArray(newRecetteEtapes)) {
            await Promise.all(newRecetteEtapes.map(etape => recetteQueries.insertRecetteEtape(etape)));
        }

        const newRecetteIngredient = req.body && updatedRecette.ingredients.map(ingredient => {
            return {
                recette_id: req.body.id,
                quantite: ingredient.quantite,
                unite: ingredient.unite,
                ingredient: ingredient.ingredient,
                ordre: ingredient.ordre
            };
        });

        if (newRecetteIngredient && Array.isArray(newRecetteIngredient)) {
            await Promise.all(newRecetteIngredient.map(ingredient => recetteQueries.insertRecetteIngredient(ingredient)));
        }

        console.log("Ingrédients Supprimer: ", ingredientSupprimer);
        console.log("Étapes Supprimer: ", etapeSupprimer);

        res.json(recetteUpdate);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', passport.authenticate('basic', { session: false }), async (req, res, next) => {
    try {
        const user = req.user;
        if (!user || !user.isAdmin) {
            throw new HttpError(403, "Doit être authentifié en tant qu'Administrateur");
        }
        const id = req.params.id;
        if (!id || id === '') {
            throw new HttpError(400, 'Le champ id est requis');
        }
        console.log("ID:", id);
        const recette = await recetteQueries.getRecetteById(id);
        if (!recette) {
            throw new HttpError(404, `Une recette avec l'id ${id} n'existe pas`);
        }

        const recetteDelete = await recetteQueries.deleteRecette(id);

        res.json(recetteDelete);
    } catch (error) {
        next(error);
    }
});

router.post('/:id/image',
    passport.authenticate('basic', { session: false }),

    upload.single('product-image'),
    (req, res, next) => {
        const id = req.params.id;
        if (!id || id === '') {

            return next(new HttpError(400, 'Le champ id est requis'));
        }

        recetteQueries.getRecetteById(id).then(recette => {
            if (!recette) {
                throw new HttpError(404, `Recette id ${id} introuvable`);
            }

            return recetteQueries.updateRecetteImage(id, req.file.buffer, req.file.mimetype);
        }).then(imageInfo => {
            res.send("");
        }).catch(err => {
            next(err);
        });

    });

module.exports = router;

