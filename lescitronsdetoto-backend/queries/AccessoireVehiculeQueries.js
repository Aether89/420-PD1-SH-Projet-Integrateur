const HttpError = require('../HttpError');
const pool = require('./DBPool');
const accessoireQuerie = require('./AccessoireQueries');

const addAccessoireVehicule = async (idAccessoire, vin) => {
    console.log("idAccessoire", idAccessoire , idAccessoire.length);
    console.log("vin", vin);
    let resultat = [];
    let i=0;
      while (i < idAccessoire.length) {
    if (isNaN(idAccessoire[i])) {
      console.log(`L'élément à l'index ${i} n'est pas un chiffre.`);
    i++;
  }
        console.log("idAccessoire", idAccessoire[i]);
        console.log("vin", vin);
        
            if (isNaN(idAccessoire[i])) { i++; }
        
            console.log("idAccessoire", idAccessoire[i]);
            console.log("vin", vin);
            const result = await pool.query(
                `INSERT INTO vehicule_accessoire (vin, id_accessoire) 
                VALUES ($1, $2)
                RETURNING id_accessoire`,
                [vin, idAccessoire[i]]
          );
          if (result.rows.length === 0) {
              throw new HttpError(`Impossible de trouver le véhicule avec id_accessoire ${idAccessoire}`, 404);
            }
          resultat.push(idAccessoire[i] );
            i++;
        }

    console.log("resultat", resultat);
    

    // Déclarez newAccessoire en dehors de la boucle for
    let newAccessoire = [];

    for (let i = 0; i < resultat.length; i++) {
        const row = resultat[i];
        const accessoire = await accessoireQuerie.getAccessoire(row);
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

        if (!listeAccessoire) {
            throw new HttpError(404, `Accessoire ${vin} introuvable`);
        }
        const result = await client.query(
            `SELECT id_accessoire, nom_accessoire
         FROM accessoire
         WHERE id_accessoire = $1`,
            [listeAccessoire.rows[0].id_accessoire]
        );
    return result.rows.map((row) => {
        const accessoire = {
            idAccessoire: row.id_accessoire,
            nomAccessoire: row.nom_accessoire
        };

    });

};
exports.getAccessoireVehicule = getAccessoireVehicule;

const updateAccessoireVehicule = async (vin,idAccessoire) => {
 
        const result = await pool.query(
            `UPDATE accessoireVehicule SET  id_accessoire = $2
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
        if (!clientParam) {
            await client.query('COMMIT');
        }

        return {};
};

exports.deleteAccessoireVehicule = deleteAccessoireVehicule;