const HttpError = require('../HttpError');
const pool = require('./DBPool');
const accessoireQuerie = require('./AccessoireQueries');

const addAccessoireVehicule = async (idAccessoire, vin) => {
   
    let resultat = [];
    let i=0;
     for(let i=0; i<idAccessoire.length; i++){

            const result = await pool.query(
                `INSERT INTO vehicule_accessoire (vin, id_accessoire) 
                VALUES ($1, $2)
                RETURNING id_accessoire`,
                [vin, idAccessoire[i]]
          );
          if (result.rows.length === 0) {
              throw new HttpError(`Impossible de trouver le véhicule avec id_accessoire ${idAccessoire}`, 404);
            }          
        }
    console.log("resultat", resultat);
    

    // Déclarez newAccessoire en dehors de la boucle for
    let newAccessoire = [];

    for (let i = 0; i < idAccessoire.length; i++) {
                const accessoire = await accessoireQuerie.getAccessoire(idAccessoire[i]);
        newAccessoire.push(accessoire);
    }

    return newAccessoire;
};
exports.addAccessoireVehicule = addAccessoireVehicule;

const getAccessoireVehicule = async (vin) => {


    const listeAccessoire = await pool.query(
        `SELECT id_accessoire
         FROM vehicule_accessoire
         WHERE vin = $1`,
        [vin]
    );

    if (listeAccessoire !== undefined && listeAccessoire.rows.length > 0) {
        
        const accessoire = await pool.query(
            `SELECT id_accessoire, nom_accessoire
         FROM accessoire
         WHERE id_accessoire = $1`,
            [listeAccessoire.rows[0].id_accessoire]
        );
        return accessoire.rows.map((row) => {
            return {
                idAccessoire: row.id_accessoire,
                nomAccessoire: row.nom_accessoire
            };

        });
    } else {
        return {};

    };
};
exports.getAccessoireVehicule = getAccessoireVehicule;

const updateAccessoireVehicule = async (vin,idAccessoire) => {
 
        const result = await pool.query(
            `UPDATE accessoire_vehicule SET  id_accessoire = $2
            WHERE vin = $1`,
            [idAccessoire, vin]
        );
        if (result.rowCount === 0) {
            throw new HttpError(`Impossible de trouver le véhicule avec id_accessoire ${idAccessoire}`, 404);
        }

        await client.query("COMMIT");
        return result.rows[0].id_accessoir;

};
exports.updateAccessoireVehicule = updateAccessoireVehicule;

const deleteAccessoireVehicule = async (vin,idAccessoire) => {
   
        const result = await pool.query(
            `DELETE FROM vehicule_accessoire
            WHERE vin = $1 and id_accessoire = $2`,
            [vin,idAccessoire]
        );
        if (result.rowCount === 0) {
            throw new HttpError(`Impossible de trouver le véhicule avec id_accessoire ${idAccessoire}`, 404);
        }
       
        
        

        return {};
};

exports.deleteAccessoireVehicule = deleteAccessoireVehicule;

const deleteAccessoireAllVehicule = async (vin) => {
   
        const result = await pool.query(
            `DELETE FROM vehicule_accessoire
            WHERE vin = $1 `,
            [vin]
        );
        if (result.rowCount === 0) {
            throw new HttpError(`Impossible de trouver le véhicule avec id_accessoire ${idAccessoire}`, 404);
        }
              

        return {};
};

exports.deleteAccessoireAllVehicule = deleteAccessoireAllVehicule;