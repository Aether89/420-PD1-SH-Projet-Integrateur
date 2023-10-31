const express = require('express');
const router = express.Router();
const passport = require('passport');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const HttpError = require("../HttpError");

const evenementQueries = require("../queries/EvenementQueries");

module.exports = router;

router.put('/', async (req, res, next) => {
    try {
        const event = {
            id_evenement: req.body.idEvenement,
            id_client: req.body.idClient,
        };

        const autoEvent = null;
        const result = await evenementQueries.updateEvenementClient(event);

        const autoResult = null;
        if (req.body.vin) {
            autoEvent = {
                vin: req.body.vin,
                id_evenement: result.id_evenement,
            };
            autoResult = await evenementQueries.insertAutoEvenement(autoEvent);
        }
        let resCode = result ? 200 : 500;
        let resMessage = (autoResult === autoEvent) ? "Rendez-vous modifié et véhicule associé." : "Rendez-vous modifié";
        
        res.status(resCode).send(resMessage);
    } catch (err) {
        next(err);
    }
});
