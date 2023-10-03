const pool = require('./DBPool');

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