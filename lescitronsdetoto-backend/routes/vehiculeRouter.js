const express = require('express');
const router = express.Router();
const passport = require('passport');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const HttpError = require("../HttpError");

const vehiculeQuerie = require("../queries/VehiculeQueries");
const fetchVIN = require("../vpic/VINAPI");

module.exports = router;

router.get('/', (req, res, next) => {
    vehiculeQuerie.getAllVehicule().then(vehicules => {
        res.json(vehicules);
    }).catch(err => {
        return next(err);
    });
});

router.get('/:vin', (req, res, next) => {
    const vin = req.params.vin;
    console.log("vin:", vin);
    vehiculeQuerie.getVehiculeByVin(vin).then(vehicule => {
        if (vehicule) {
            res.json(vehicule);
        } else {
            return next(new HttpError(404, `Le véhicule avec le VIN ${vin} est introuvable`));
        }
    }).catch(err => {
        return next(err);
    });
});

router.post('/', passport.authenticate('basic', { session: false }), async (req, res, next) => {
    try {
        console.log("req.body : ",req.body);
        
        const user = req.user;
        if (!user || !user.isAdmin) {
            return next(new HttpError(403, 'Droit administrateur requis'));
        }
  
        const vin = req.body.vin;
        if (!vin || vin === '') {
            return next(new HttpError(400, 'Le champ vin est requis'));
        }
        
        /*const prixDAchat = req.body.prixEvenement;
        if(!prixDAchat || prixDAchat <= 0) {
            return next(new HttpError(400, 'Le champ prix d\'achat est requis'));
        }*/

        console.log("user", user.userAccountId);
        const fetchedVehicule = await fetchVIN(vin);
        if (fetchedVehicule.ErrorCode !== "0") {
          return next(new HttpError(404, `Veillez rentrer un vin existant!`));
        }

        const marque = fetchedVehicule.Make;
        const modele = fetchedVehicule.Model;
        const annee = fetchedVehicule.ModelYear;

        const newVehicule = {
            vin: req.body.vin,
            id_etat: req.body.id_etat,
            marque: marque,
            modele: modele,
            annee: annee,
            couleur: "" + req.body.couleur,
            nombre_kilometre: req.body.nombre_kilometre,
            prix_annonce: req.body.prix_annonce.replace(/\s/g, ''),
            promotion: req.body.promotion.replace(/\s/g, ''),
            description_courte: "" + req.body.description_courte,
            description_longue: "" + req.body.description_longue,
        };
        
        const vehiculeExcite = await vehiculeQuerie.getVehiculeByVin(vin);
        if (vehiculeExcite) {
          return next(new HttpError(409, `Le véhicule avec ce VIN ${vin} existe déjà.`));
        }
        
        if(newVehicule.couleur.length > 32 || newVehicule.description_courte.length > 64 || newVehicule.description_longue.length > 512)
        {
            return next(new HttpError(400, `Un champ n'est pas valide`));
        }

        if (newVehicule.id_etat === null || newVehicule.id_etat < 1 || newVehicule.id_etat > 3) {
            newVehicule.id_etat = 1;
        }

        /*if (newVehicule.prix_annonce <= 0){
            newVehicule.prix_annonce = null;
        } */ //a voir avec la bd

        if(newVehicule.promotion <= 0) {
            newVehicule.promotion = null;
        }
        

        console.log("newVehicule", newVehicule);
        vehiculeQuerie.addVehicule(newVehicule);
        res.json(newVehicule);

        return vehiculeQuerie.getVehiculeByVin(vin);
    } catch(err) {
        next(err);
    }
});

router.put('/:vin',
passport.authenticate('basic', { session: false }),
    async (req, res, next) => {
        try {
            const user = req.user;
            if (!user || !user.isAdmin) {
                return next(new HttpError(403, "Droit administrateur requis"));
            }

            
            const vin = req.body.vin;
            if (!vin || vin === '') {
                return next(new HttpError(400, 'Le champ vin est requis'));
            }

            const vehicule = await vehiculeQuerie.getVehiculeByVin(vin);
            if (!vehicule) {
                throw new HttpError(404, `Un vehicule avec le vin ${vin} n'existe pas`);
            }

            const updateVehicule = {
                vin: req.body.vin,
                id_etat: req.body.id_etat,
                couleur: "" + req.body.couleur,
                nombre_kilometre: req.body.nombre_kilometre,
                prix_annonce: (req.body.prix_annonce && typeof req.body.prix_annonce === 'string')
                    ? req.body.prix_annonce.replace(/\s/g, '')
                    : req.body.prix_annonce,
                promotion: (req.body.promotion && typeof req.body.promotion === 'string')
                    ? req.body.promotion.replace(/\s/g, '')
                    : req.body.promotion,
                description_courte: "" + req.body.description_courte,
                description_longue: "" + req.body.description_longue,
            };
            console.log("updated Vehicule : ", updateVehicule);

            if (updateVehicule.id_etat === undefined || updateVehicule.id_etat === null || updateVehicule.id_etat < 1 || updateVehicule.id_etat > 3) {
                updateVehicule.id_etat = 1;
            }
            
            if(updateVehicule.nombre_kilometre === undefined) {
                updateVehicule.nombre_kilometre = 0;
            }

            if(updateVehicule.prix_annonce === undefined || updateVehicule.prix_annonce === null) {
                updateVehicule.prix_annonce = '0,00'
            }

            if(updateVehicule.id_etat === 2){
                if (updateVehicule.couleur === null || updateVehicule.couleur.trim() === "" || updateVehicule.nombre_kilometre === null || updateVehicule.nombre_kilometre === 0 ||
                updateVehicule.prix_annonce === null || updateVehicule.description_courte === null || updateVehicule.description_courte.trim() === "" ||
                updateVehicule.description_longue === null || updateVehicule.description_longue.trim() === "")
                updateVehicule.id_etat = 1;
            }

            console.log("updatedVehicule", updateVehicule);
            

            const vehiculeUpdated = await vehiculeQuerie.updateVehicule(updateVehicule);
            //console.log("vehiculeUpdated", vehiculeUpdated);
            res.json(vehiculeUpdated);
        } catch (error) {
            next(error);
        }
    }
);

router.delete('/:vin',passport.authenticate('basic', { session: false }), async (req, res, next) => {
    try {
        const user = req.user;
        if (!user || !user.isAdmin) {
            throw new HttpError(403, "Doit être authentifié en tant qu'Administrateur");
        }
        const vin = req.params.vin;
        if (!vin || vin === '') {
            throw new HttpError(400, 'Le champ id est requis');
        }
        
        const vehicule = await vehiculeQuerie.getVehiculeByVin(vin);
        console.log("vehicule du delete:", vehicule);
        if (!vehicule) {
            throw new HttpError(404, `Un véhicule avec le vin ${vin} n'existe pas`);
        }

        const vehiculeDelete = await vehiculeQuerie.deleteVehicule(vin);
        
        res.json(vehiculeDelete);
    } catch (error) {
        next(error);
    }
});