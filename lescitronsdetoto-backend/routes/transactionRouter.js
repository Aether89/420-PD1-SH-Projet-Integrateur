const express = require('express');
const router = express.Router();
const passport = require('passport');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const HttpError = require("../HttpError");

const evenementQueries = require("../queries/EvenementQueries");
const vehiculeQueries = require("../queries/VehiculeQueries");
const clientQueries = require("../queries/InfoClientQueries");

module.exports = router;

router.get('/achat', (req, res, next) => {
    evenementQueries.getAllEvenementByType(2).then(evenements => {
        res.json(evenements);
    }).catch(err => {
        return next(err);
    });
});

router.get('/vente', (req, res, next) => {
    evenementQueries.getAllEvenementByType(3).then(evenements => {
        res.json(evenements);
    }).catch(err => {
        return next(err);
    });
});

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    console.log("id", id)
    evenementQueries.getEvenementById(id).then(evenement => {
        if (evenement) {
            res.json(evenement);
        } else {
            return next(new HttpError(404, `L'évenement avec le id ${id} est introuvable`));
        }
    }).catch(err => {
        return next(err);
    });
});

router.post('/', passport.authenticate('basic', { session: false }), async (req, res, next) => {
    try {
        console.log("req.body : ",req.body);
        
        const user = req.user;
        if (!user) {
            return next(new HttpError(403, 'Droit administrateur requis'));
        }
  
        const vin = req.body.vin;
        if (!vin || vin === '') {
            return next(new HttpError(400, 'Le champ vin est requis'));
        }
        
        
        const newClient = {
            nomClient: req.body.nomClient,
            prenomClient: req.body.prenomClient,
            telephoneClient: req.body.telephoneClient,
            numeroCivic: req.body.numeroCivic,
            numeroAppartement: req.body.numeroAppartement,
            nomRue: req.body.nomRue,
            nomVille: req.body.nomVille,
            nomProvince: req.body.nomProvince,
            codePostal: req.body.codePostal
        }
       
        
        const vehiculeExcite = await vehiculeQueries.getVehiculeByVin(vin);
        if (!vehiculeExcite) {
          return next(new HttpError(409, `Le véhicule avec ce VIN ${vin} n'existe pas.`));
        }

        const currentTime = new Date();
        console.log("currentTime", currentTime.toISOString())

        const clientNouveu = await clientQueries.createInfoClient(newClient);
        console.log("clientNouveu", clientNouveu)
        const newAchat = {
            prix_evenement: req.body.prix_evenement.replace(/\s/g, ''),
            etat_vue: null,
            id_type_evenement: 2,
            id_client: clientNouveu.idClient,
            date_heure_evenement: currentTime.toISOString(),
            user_account_id: user.userAccountId
        }
        const evenementId = await evenementQueries.insertEvenement(newAchat);

        console.log("evenementId", evenementId);

        const autoVin = await vehiculeQueries.addVehicule(newVehicule);

        const newEvenementVehicule ={
            id_evenement: evenementId,
            vin: vin
        }
        console.log("newEvenementVehicule : ", newEvenementVehicule);
        console.log("newEvent : ", newAchat);
        console.log("newVehicule", newVehicule);
        
        evenementQueries.insertAutoEvenement(newEvenementVehicule);

        res.json(newVehicule);
    } catch(err) {
        next(err);
    }
});

router.put('/:id',
passport.authenticate('basic', { session: false }),
    async (req, res, next) => {
        try {
            const user = req.user;
            if (!user || !user.isAdmin) {
                return next(new HttpError(403, "Droit administrateur requis"));
            }
            
            const id = req.body.id;
            if (!id || id === '') {
                return next(new HttpError(400, 'Le champ id est requis'));
            }

            const evenement = await evenementQueries.getEvenementById(id);
            if (!evenement) {
                throw new HttpError(404, `Une transaction avec le id ${id} n'existe pas`);
            }
            console.log("evenement", evenement)

            const updateEvenement = {
                id_evenement: id,
                prix_evenement: req.body.prix_evenement.replace(/\s/g, ''),
                etat_vue: null,
                id_type_evenement: evenement.id_type_evenement,
                id_client: req.body.id_client,
                user_account_id: user.userAccountId
            };
            console.log("updateEvenement", updateEvenement)
                
            const EvenementUpdated = await evenementQueries.updateEvenement(updateEvenement);
            //console.log("vehiculeUpdated", vehiculeUpdated);
            res.json(EvenementUpdated);
        } catch (error) {
            next(error);
        }
    }
);

router.put('/vente/:id',
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

            //const vin = await evenementQueries.getautoEvenementVinByID(id);
            const vehiculeSell = await vehiculeQueries.getVehiculeByVin(vin);

            if (!vehiculeSell) {
                throw new HttpError(404, `Le vehicule avec le vin ${vin} n'existe pas`);
            }

            console.log("vehiculeSell",vehiculeSell)
            if(vehiculeSell.id_etat === 3) {
                return next(new HttpError(400, `Le vehicule ${vehiculeSell.vin} est déjà vendu`))
            }

            //console.log("evenement", evenement)

            //const evenement = await evenementQueries.getautoEvenementIdByViv(vin);
            //const getEvenement = await evenementQueries.getEvenementById(evenement.id_evenement);
            const prix_evenement = vehiculeSell.promotion !== null ? vehiculeSell.promotion : vehiculeSell.prix_annonce;
            const venteEvenement = {
                prix_evenement: prix_evenement,
                etat_vue: null,
                id_type_evenement: 3,
                id_client: req.body.id_client,
                user_account_id: user.userAccountId
            };
            
            console.log("vin", vin);

            const updateVehicule = {
                vin: vehiculeSell.vin,
                id_etat: 3,
                couleur:vehiculeSell.couleur,
                nombre_kilometre: vehiculeSell.nombre_kilometre,
                prix_annonce: vehiculeSell.prix_annonce,
                promotion: vehiculeSell.promotion,
                description_courte: vehiculeSell.description_courte,
                description_longue: vehiculeSell.description_longue,
            };
            const EvenementUpdated = await evenementQueries.insertEvenement(venteEvenement);
            await vehiculeQueries.updateVehicule(updateVehicule);
            console.log("vehiculeSell", vehiculeSell);
            const newEvenementVehicule ={
                id_evenement: EvenementUpdated,
                vin: vin
            }

            evenementQueries.insertAutoEvenement(newEvenementVehicule);
            console.log("newEvenementVehicule : ", newEvenementVehicule);
            
            res.json(EvenementUpdated);
        } catch (error) {
            next(error);
        }
    }
);