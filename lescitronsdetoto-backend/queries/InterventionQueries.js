
const HttpError = require('../HttpError');
const pool = require('./DBPool');

const getAllInterventions = async () => {
    const result = await pool.query(
        `SELECT id_intervention, type_intervention, valeur_intervention, etat_intervention
         FROM intervention
         ORDER BY id_intervention`
    );

    return result.rows.map((row) => {
        const intervention = {
            idIntervention: row.id_intervention,
            typeIntervention: row.type_intervention,
            valeurIntervention: row.valeur_intervention,
            etatIntervention: row.etat_intervention,
        };

        return intervention;
    });
};
exports.getAllInterventions = getAllInterventions;


const getInterventionByVin = async (vin) => {
   

        const listeIntervention = await pool.query(
            `SELECT id_intervention
         FROM vehicule_intervention
         WHERE vin = $1`,
            [vin]
        );

        if (!listeIntervention) {
            throw new HttpError(404, `Accessoire ${vin} introuvable`);
        }
        const result = await client.query(
            `SELECT id_intervention, nom_intervention
         FROM intervention
         WHERE id_intervention = $1`,
            [listeIntervention.rows[0].id_intervention]
        );
 

        return result.rows.map((row) => {
            const intervention = {
                idIntervention: row.id_intervention,
                typeIntervention: row.type_intervention,
                valeurIntervention: row.valeur_intervention,
                etatIntervention: row.etat_intervention,
            };

        });
    };
exports.getInterventionByVin = getInterventionByVin;

const getIntervention = async (idIntervention) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(
            `SELECT id_intervention, type_intervention, valeur_intervention, etat_intervention
            FROM intervention
            WHERE id_intervention = $1`,
            [idIntervention]
        );

        const row = result.rows[0];
        if (row) {
            return {
                idIntervention: row.id_intervention,
                typeIntervention: row.type_intervention,
                valeurIntervention: row.valeur_intervention,
                etatIntervention: row.etat_intervention,
            };
        }
        return undefined;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};
exports.getIntervention = getIntervention;

const createIntervention = async (intervention) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(
            `INSERT INTO intervention (type_intervention, valeur_intervention, etat_intervention)
            VALUES ($1, $2::money, $3)
            RETURNING id_intervention`,
            [intervention.typeIntervention, intervention.valeurIntervention, false]
        );

        if (result.rows.length === 0) {
            throw new HttpError("Impossible de créer l'intervention", 500);
        }

        return result.rows[0].id_intervention;
    } catch (err) {
        await client.query('ROLLBACK');
        throw new HttpError("Une erreur est survenue lors de la création de la transaction ", 500);
    } finally {
        client.release();
    }
};
exports.createIntervention = createIntervention;

const updateIntervention = async (intervention) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(
            `UPDATE intervention
            SET type_intervention = $2, valeur_intervention = $3, etat_intervention = $4
            WHERE id_intervention = $1`,
            [intervention.idIntervention, intervention.typeIntervention, intervention.valeurIntervention, intervention.etatIntervention]
        );
        if (result.rowCount === 0) {
            throw new HttpError(`Impossible de trouver l'intervention avec id_intervention ${intervention.idIntervention}`, 404);
        }

        await client.query('COMMIT');
        return intervention;
    } catch (err) {
        await client.query('ROLLBACK');
        throw new HttpError(`Une erreur est survenue lors de la mise à jour de l'intervention avec id_intervention ${intervention.idIntervention}`, 500);
    } finally {
        client.release();
    }
};
exports.updateIntervention = updateIntervention;

const deleteIntervention = async (idIntervention, clientParam) => {
    const client = clientParam || (await pool.connect());

    try {
        if (!clientParam) {
            await client.query('BEGIN');
        }
        
        // Supprimer de la table intervention
        const deleteInterventionQuery = `
            DELETE FROM intervention
            WHERE id_intervention = $1
        `;

        await pool.query(deleteInterventionQuery, [idIntervention]);

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

exports.deleteIntervention = deleteIntervention;

const createInterventionWvin = async (intervention,vin) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(
            `INSERT INTO intervention (type_intervention, valeur_intervention, etat_intervention)
            VALUES ($1, $2::money, $3)
            RETURNING id_intervention`,
            [intervention.typeIntervention, intervention.valeurIntervention, false]
        );

        if (result.rows.length === 0) {
            throw new HttpError("Impossible de créer l'intervention", 500);
        }

        const result2 = await client.query(
            `Insert into vehicule_intervention (vin, id_intervention)
        VALUES ($1, $2)
        RETURNING id_intervention`,
            [vin, result.rows[0].id_intervention]
        );
        if (result2.rows.length === 0) {
            throw new HttpError("Impossible de créer l'intervention", 500);
        }
        return result2.rows[0].id_intervention;
    } catch (err) {
        await client.query('ROLLBACK');
        throw new HttpError("Une erreur est survenue lors de la création de la transaction ", 500);
    } finally {
        client.release();
    }
};
exports.createInterventionWvin = createInterventionWvin;



const deleteInterventionWvin = async (idIntervention,vin, clientParam) => {
    const client = clientParam || (await pool.connect());

    try {
        if (!clientParam) {
            await client.query('BEGIN');
        }
        const deleteInterventionVehicule = `
            DELETE FROM vehicule_intervention
            WHERE id_intervention = $1 && vin = $2
        `;
        // Supprimer de la table intervention
        const deleteInterventionQuery = `
            DELETE FROM intervention
            WHERE id_intervention = $1
        `;
        await pool.query(deleteInterventionVehicule, [idIntervention]);
        if (deleteInterventionVehicule.rows.length === 0) {
            throw new HttpError(`Impossible de trouver l'intervention avec id_intervention ${intervention.idIntervention}`, 404);
        }
        await pool.query(deleteInterventionQuery, [idIntervention]);
if(deleteInterventionQuery.rows.length === 0) {
            throw new HttpError(`Impossible de trouver l'intervention avec id_intervention ${intervention.idIntervention}`, 404);
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

exports.deleteInterventionWvin = deleteInterventionWvin;
