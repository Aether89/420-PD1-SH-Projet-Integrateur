const express = require('express');
const router = express.Router();
const passport = require('passport');

const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const HttpError = require("../HttpError");

const evenementQueries = require("../queries/EvenementQueries");

module.exports = router;

function isValidDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
}



router.put('/',
passport.authenticate('basic', { session: false }),
    async (req, res, next) => {

        if (!req.user) {
            return next(HttpError(403, "Employé authentifié requis"));
        }

        try {
            const user = req.user.userAccountId;
            const toAdd = req.body.toAdd;
            const toRemove = req.body.toRemove;
            
            let results = [];

            if (toRemove.length >= 1) {
                await Promise.all(toRemove.map(async (day) => {
                    let event = {
                        user_account_id: user,  
                        time_stamp: day.date + " " + day.time,
                    };

                    let resEvent = {timestamp: event.time_stamp, user: user};
                    (!isValidDate(event.time_stamp))
                        ? results.push({ code: 500, msg: "Date et/ou heure invalide pour la suppression ", event: resEvent })
                        : !(await evenementQueries.checkAvailabilityExist(event))
                            ? results.push({ code: 404, msg: "Disponibilité n'existe pas", event: resEvent })
                            : (await evenementQueries.deleteAvailability(event))
                                ? results.push({ code: 200, msg: "Disponibilité supprimé", event: resEvent })
                                : results.push({ code: 500, msg: "Erreur lors de la suppression de la disponibilité", event: resEvent });
                }));    
            }

            if (toAdd.length >= 1) {
                await Promise.all(toAdd.map(async (day) => {
                    let event = {
                        id_type_evenement: "1",
                        id_client: null,
                        user_account_id: user,  
                        prix_evenement: null,
                        time_stamp: day.date + " " + day.time,
                        etat_vue_evenement: false
                    };

                    let resEvent = {timestamp: event.time_stamp, user: user};
                    
                    (!isValidDate(event.time_stamp))
                        ? results.push({ code: 500, msg: "Date et/ou heure invalide pour l'insertion ", event: resEvent })
                        : (await evenementQueries.checkAvailabilityExist(event))
                            ? results.push({ code: 409, msg: "Disponibilité déja existante", event: resEvent })
                            : (await evenementQueries.insertEvenement(event))
                                ? results.push({ code: 200, msg: "Disponibilité ajouté", event: resEvent })
                                : results.push({ code: 500, msg: "Erreur lors de l'insertion de la disponibilité", event: resEvent });
                }));    
            }

            res.status(200).json(results);
        } catch (error) {
            next(error);
        }
    }
);

router.get('/',
passport.authenticate('basic', { session: false }),
    async (req, res, next) => {
        if (!req.user) {
            return next(HttpError(403, "Employé authentifié requis"));
        }

        try {
            let result = await evenementQueries.getAvailability(req.user.userAccountId)

            const availability = [];

            result.forEach((event) => {
                const date = new Date(event.date_heure_evenement);

                const client = event.id_client;
                const agent = event.user_account_id;

                const formattedDate = date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/-/g, '/');;
                const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

                const existingDate = availability.find((block) => block.date === formattedDate);

                if (existingDate) {
                    existingDate.block.push({ date: formattedDate, time: formattedTime, status: "old", client: client, agent: agent});
                } else {    
                    availability.push({ date: formattedDate, block: [{ date: formattedDate, time: formattedTime, status: "old", client: client, agent: agent}] });
                }
            });

            res = res.status(200).json(availability);
        } catch (error) {
            next(error);
        }

    }


);

router.get('/all',
    async (req, res, next) => {

        try {
            let result = await evenementQueries.getAvailabilities();

            const availability = [];

            result.forEach((event) => {
                const date = new Date(event.date_heure_evenement);
                
                const client = event.id_client;
                const agent = event.user_account_id;
                const eventId = event.id_evenement;
                const formattedDate = date.toLocaleDateString('en-CA', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/-/g, '/');;
                const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })

                const existingDate = availability.find((block) => block.date === formattedDate);

                if (existingDate) {
                    existingDate.block.push({ date: formattedDate, time: formattedTime, status: "old", client: client, agent: agent, eventId: eventId});
                } else {    
                    availability.push({ date: formattedDate, block: [{ date: formattedDate, time: formattedTime, status: "old", client: client, agent: agent, eventId: eventId}] });
                }
            });

            res = res.status(200).json(availability);
        } catch (error) {
            next(error);
        }

    }


);
