const express = require("express");
const router = express.Router();
const passport = require("passport");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const HttpError = require("../HttpError");
const EmployeQueries = require("../queries/EmployeQueries");

router.post('/',
    (req, res, next) => {
         const Employe = {
           nomEmploye:""+ req.body.nomEmploye,
            prenomEmploye:""+ req.body.prenomEmploye,
            posteEmploye:""+ req.body.posteEmploye,
            telephoneEmploye:""+ req.body.telephoneEmploye,
            codePostalEmploye:""+ req.body.codePostalEmploye
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
    console.log("id:", id);
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

router.put('/:id',
    (req, res, next) => {
        const id = req.params.id
        try {
            const Employe = {
                id: ""+id,
                nomEmploye:""+ req.body.nomEmploye,
                prenomEmploye:""+ req.body.prenomEmploye,
                posteEmploye:""+ req.body.posteEmploye,
                telephoneEmploye:""+ req.body.telephoneEmploye,
                codePostalEmploye:""+ req.body.codePostalEmploye
            }


            EmployeQueries.updateEmploye(Employe).then(result => {
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

module.exports = router;