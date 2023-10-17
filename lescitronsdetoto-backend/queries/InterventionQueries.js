const HttpError = require('../HttpError');
const pool = require('./DBPool');

const getAllInterventions = async () => {
    const result = await pool.query(
        `SELECT id_intervention, type_intervention, valeur_intervention, etat_intervention
         FROM intervention
         ORDER BY id_intervention`,
    );

    return result.rows.map((row) => {
        const intervention = {
            idIntervention: row.id_intervention,
            typeIntervention: row.type_intervention,
            valeurIntervention: row.valeur_intervention,
            etatIntervention: row.etat_intervention
        };

        return intervention;
    });
};
exports.getAllInterventions = getAllInterventions;

const getIntervention = async (idIntervention, clientParam) => {
    const client = clientParam || (await pool.connect());

    try {
        if (!clientParam) {

            await client.query("BEGIN");
        }

        const result = await client.query(
            `SELECT id_intervention, type_intervention, valeur_intervention, etat_intervention
         FROM intervention
         WHERE id_intervention = $1`,
            [idIntervention]
        );

        const row = result.rows[0];
        if (row) {
            const intervention = {
                idIntervention: row.id_intervention,
            typeIntervention: row.type_intervention,
            valeurIntervention: row.valeur_intervention,
            etatIntervention: row.etat_intervention
            }



            return intervention;
        };
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
exports.getIntervention = getIntervention;



const createIntervention = async (intervention, clientParam) => {
    const client = clientParam || (await pool.connect());

    try {
        if (!client) {
            await client.query('BEGIN');
        }


        const result = await client.query(
            `INSERT INTO intervention (id_intervention, type_intervention, valeur_intervention, etat_intervention ) 
                         VALUES ($1, $2, $3, $4 )
                         RETURNING id_intervention`,
            [
                intervention.idIntervention,
                intervention.typeIntervention,
                intervention.valeurIntervention,
                intervention.etatIntervention,
            
            ]
        );

        const newIntervention = await getIntervention(result.rows[0].id_intervention, client);
        if (!client) {
            await client.query('COMMIT');
        }

        return newIntervention;
    } catch (err) {
        if (!client) {
            await client.query('ROLLBACK');
        }
        throw new HttpError("Une erreur est survenue lors de la création de l'employé", 500);
    } finally {
        if (!client) {
            client.release();
        }
    }
};
exports.createIntervention = createIntervention;


const updateIntervention = async (intervention) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(
            `UPDATE intervention SET  type_intervention = $2, valeur_intervention = $3, etat_intervention = $4 
            WHERE id_intervention = $1`,
            [intervention.idIntervention, intervention.typeIntervention, intervention.valeurIntervention, intervention.etatIntervention]
        );
        if (result.rowCount === 0) {
            throw new HttpError(`Impossible de trouver l'employé avec id_intervention ${intervention.idIntervention}`, 404);
        }

        await client.query("COMMIT");
        return intervention;
    } catch (err) {
        await client.query("ROLLBACK");
        throw new HttpError(`Une erreur est survenue lors de la mise à jour de l'employé avec id_intervention ${intervention.idIntervention}`, 500);
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
        // Vérifier d'abord si l'employé est lié à message_chat ou evenement
        const checkQuery = `
            SELECT id_intervention 
            FROM intervention
            WHERE id_intervention NOT IN (
                SELECT id_intervention FROM vehicule_intervention

            )
        `;

        const checkResult = await pool.query(checkQuery);

        if (checkResult.rows.find(row => row.id_intervention === idIntervention)) {


            // Si l'employé est lié, retourner une réponse vide
            throw new error("L'employé est lier a une autre table");

        }

        // Supprimer de user_account
        const deleteQuery = `
            DELETE FROM user_account
            WHERE id_intervention = $1
        `;

        await pool.query(deleteQuery, [idIntervention]);

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

