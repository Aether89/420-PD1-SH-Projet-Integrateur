const pool = require('./DBPool');

const getAllEvenementByType = async (id_type_evenement) => {
    const result = await pool.query(
        `SELECT
        id_type_evenement,
        id_client,
        user_account_id,
        prix_evenement,
        date_heure_evenement,
        etat_vue_evenement
        FROM
        evenement
        WHERE id_type_evenement = $1
        ORDER BY date_heure_evenement`
        [id_type_evenement]
    );

    const evenement = result.rows.map(row => {
        return {
            id_type_evenement: row.id_type_evenement,
            id_client: row.id_client,
            user_account_id: row.user_account_id,
            prix_evenement: row.prix_evenement,
            date_heure_evenement: row.date_heure_evenement,
            etat_vue_evenement: row.etat_vue_evenement
        }
    });
    return evenement;
};
exports.getAllEvenementByType = getAllEvenementByType;

const getEvenementById = async (id_evenement) => {
    const result = await pool.query(
        `SELECT
        id_type_evenement,
        id_client,
        user_account_id,
        prix_evenement,
        date_heure_evenement,
        etat_vue_evenement
        FROM
        evenement
        WHERE id_evenement = $1`
        [id_evenement]
    );

    const evenement = result.rows.map(row => {
        return {
            id_type_evenement: row.id_type_evenement,
            id_client: row.id_client,
            user_account_id: row.user_account_id,
            prix_evenement: row.prix_evenement,
            date_heure_evenement: row.date_heure_evenement,
            etat_vue_evenement: row.etat_vue_evenement
        }
    });
    return evenement;
};
exports.getEvenementById = getEvenementById;

const insertEvenement = async (evenement) => {
    const result = await pool.query(
        `INSERT INTO evenement(id_type_evenement, id_client, user_account_id, prix_evenement, date_heure_evenement, etat_vue_evenement)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id_evenement`,
        [evenement.id_type_evenement, evenement.id_client, evenement.user_account_id, evenement.prix_evenement, evenement.time_stamp,evenement.etat_vue_evenement]
    );
    return result.rows[0].id_evenement;;
};
exports.insertEvenement = insertEvenement;

const updateEvenement = async (evenement) => {
    const result = await pool.query(
        `UPDATE vehicule
        SET 
        id_type_evenement = $1,
        id_client = $2,
        user_account_id = $3,
        prix_evenemen = $4,
        etat_vue_evenement = $5`,
        [evenement.id_type_evenement, evenement.id_client, evenement.user_account_id, evenement.prix_evenement, evenement.etat_vue_evenement]
    );
    return getVehiculeByVin(vehicule.vin);
};
exports.updateEvenement = updateEvenement;

const insertAutoEvenement = async (autoEvenement) => {
    const result = await pool.query(
        `INSERT INTO auto_evenement (vin, evenement_id)
        VALUES ($1, $2)`,
        [autoEvenement.vin, autoEvenement.evenement_id]
    );
    return autoEvenement;
};
exports.insertAutoEvenement = insertAutoEvenement;

const deleteAvailability = async (evenement) => {
const result = await pool.query(
    `DELETE FROM evenement 
    WHERE user_account_id = $1 AND date_heure_evenement = $2 AND id_client IS NULL AND id_type_evenement = 1;`,
    [evenement.user_account_id, evenement.time_stamp]
);
return (result.rowCount > 0)? true : false;
};
exports.deleteAvailability = deleteAvailability;

const checkAvailabilityExist = async (evenement) => {
    const result = await pool.query(
        `SELECT * FROM public.evenement
        WHERE date_heure_evenement = $1 AND user_account_id = $2
        `,
        [evenement.time_stamp, evenement.user_account_id]
    );
    return (result.rows.length > 0)? true : false;
}
exports.checkAvailabilityExist = checkAvailabilityExist;

const getAvailability = async (user) => {
    const result = await pool.query(
        `SELECT * FROM evenement
        WHERE user_account_id = $1 AND id_type_evenement = 1 AND id_client IS NULL
        ORDER BY date_heure_evenement ASC`,
        [user]
    );
    return result.rows;
}
exports.getAvailability = getAvailability;