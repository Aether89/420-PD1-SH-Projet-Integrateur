const HttpError = require('../HttpError');
const pool = require('./DBPool');
const accessoireQuerie = require('./AccessoireQueries');

const addAccessoireVehicule = async ( idAccessoire,vin, clientParam) => {
    const client = clientParam || (await pool.connect());
    try {
        if (!clientParam) {
            await client.query('BEGIN');
        }
        const result = await client.query(
            `INSERT INTO vehicule_accessoire (vin, id_accessoire) 
                         VALUES ($1, $2 )
                         RETURNING id_accessoire`,
            [
                vin,
                idAccessoire
            ]
        );
                    await client.query('COMMIT');
       
        const newAccessoire = await accessoireQuerie.getAccessoire(result.rows.map, client);
  

        return newAccessoire;
    } catch (err) {
        if (!client) {
            await client.query('ROLLBACK');
        }
        throw new HttpError("Une erreur est survenue lors de la création de l'accessoire", 500);
    } finally {
        if (!client) {
            client.release();
        }
    }
};
exports.addAccessoireVehicule = addAccessoireVehicule;

const getAccessoireVehicule = async (vin, clientParam) => {
    const client = clientParam || (await pool.connect());

    try {
        if (!clientParam) {

            await client.query("BEGIN");
        }

        const listeAccessoire = await client.query(
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

        return accessoire;
        });
    } catch (err) {
        if (!clientParam) {
            await client.query("ROLLBACK");
        }
        throw err;
    } finally {
        if (!clientParam) {
            client.release();
        }
    }
};
exports.getAccessoireVehicule = getAccessoireVehicule;

const updateAccessoireVehicule = async (vin,idAccessoire) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(
            `UPDATE accessoireVehicule SET  id_accessoire = $2
            WHERE vin = $1`,
            [idAccessoire, vin]
        );
        if (result.rowCount === 0) {
            throw new HttpError(`Impossible de trouver le véhicule avec id_accessoire ${idAccessoire}`, 404);
        }

        await client.query("COMMIT");
        return result.rows[0].id_accessoir;
    } catch (err) {
        await client.query("ROLLBACK");
        throw new HttpError(`Une erreur est survenue lors de la mise à jour de le vehicule avec id_accessoire ${idAccessoire}`, 500);
    } finally {
        client.release();
    }
};
exports.updateAccessoireVehicule = updateAccessoireVehicule;

const deleteAccessoireVehicule = async (vin,idAccessoire, clientParam) => {
    const client = clientParam || (await pool.connect());

    try {
        if (!clientParam) {
            await client.query('BEGIN');
        }
        const result = await client.query(
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


    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        if (!clientParam) {
            client.release();
        }
    }
};

exports.deleteAccessoireVehicule = deleteAccessoireVehicule;