const pool = require('./DBPool');

const getAllEvenementByType = async (id_type_evenement) => {
    const result = await pool.query(
        `SELECT
            e.id_evenement,
            e.id_type_evenement,
            e.id_client,
            e.user_account_id,
            e.prix_evenement,
            e.date_heure_evenement,
            e.etat_vue_evenement,
            c.nom_client,
            c.prenom_client
        FROM
            evenement e
        INNER JOIN
            client c
        ON
            e.id_client = c.id_client
        WHERE
            e.id_type_evenement = $1
        ORDER BY
            e.date_heure_evenement`,
        [id_type_evenement]
    );

    const evenement = result.rows.map(row => {
        return {
            id_evenement: row.id_evenement,
            id_type_evenement: row.id_type_evenement,
            id_client: row.id_client,
            user_account_id: row.user_account_id,
            prix_evenement: row.prix_evenement,
            date_heure_evenement: row.date_heure_evenement,
            etat_vue_evenement: row.etat_vue_evenement,
            nom_client: row.nom_client,
            prenom_client: row.prenom_client
        };
    });

    return evenement;
};
exports.getAllEvenementByType = getAllEvenementByType;

const getEvenementById = async (id_evenement) => {
    const result = await pool.query(
        `SELECT
        id_evenement,
        id_type_evenement,
        id_client,
        user_account_id,
        prix_evenement,
        date_heure_evenement,
        etat_vue_evenement
        FROM
        evenement
        WHERE id_evenement = $1`,
        [id_evenement]
    );

    const row = result.rows[0];
    const resultVin = await pool.query(
        `SELECT
        vin 
        FROM
        vehicule_evenement
        Where id_evenement = $1`,
        [id_evenement]
    );

    const vin = resultVin.rows[0];

    if (row) {
        return {
            id_evenement: row.id_evenement,
            id_type_evenement: row.id_type_evenement,
            id_client: row.id_client,
            user_account_id: row.user_account_id,
            prix_evenement: row.prix_evenement,
            date_heure_evenement: row.date_heure_evenement,
            etat_vue_evenement: row.etat_vue_evenement,
            vin: vin ? vin.vin : null 
        };
    }
    return undefined;
};
exports.getEvenementById = getEvenementById;

const insertEvenement = async (evenement) => {
    const result = await pool.query(
        `INSERT INTO evenement(id_type_evenement, id_client, user_account_id, prix_evenement, date_heure_evenement, etat_vue_evenement)
        VALUES ($1, $2, $3, $4, $5,  $6)
        RETURNING id_evenement`,
        [evenement.id_type_evenement, evenement.id_client, evenement.user_account_id, evenement.prix_evenement, evenement.date_heure_evenement, evenement.etat_vue_evenement]
    );
    return result.rows[0].id_evenement;;
};
exports.insertEvenement = insertEvenement;

const updateEvenement = async (evenement) => {
    const result = await pool.query(
        `UPDATE evenement
        SET 
        id_type_evenement = $1,
        id_client = $2,
        user_account_id = $3,
        prix_evenement = $4,
        etat_vue_evenement = $5
        WHERE id_evenement = $6`,
        [evenement.id_type_evenement, evenement.id_client, evenement.user_account_id, evenement.prix_evenement, evenement.etat_vue_evenement, evenement.id_evenement]
    );
    return getEvenementById(evenement.id_evenement);
};
exports.updateEvenement = updateEvenement;

const updateEvenementClient = async (evenement) => {
    const result = await pool.query(
        `UPDATE evenement
        SET 
        id_client = $1
        WHERE id_evenement = $2`,
        [evenement.id_client, evenement.id_evenement]
    );
    return result.rowCount > 0;
};
exports.updateEvenementClient = updateEvenementClient;


const insertAutoEvenement = async (autoEvenement) => {
    const result = await pool.query(
        `INSERT INTO vehicule_evenement (vin, id_evenement)
        VALUES ($1, $2)`,
        [autoEvenement.vin, autoEvenement.id_evenement]
    );
    return autoEvenement;
};
exports.insertAutoEvenement = insertAutoEvenement;

const getautoEvenementIdByViv= async (vin) => {
    const result = await pool.query(
        `SELECT
        id_evenement
        FROM
        vehicule_evenement
        WHERE vin = $1`,
        [vin]
    );

    return result.rows[0];
};
exports.getautoEvenementIdByViv = getautoEvenementIdByViv;

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
        WHERE user_account_id = $1 AND id_type_evenement = 1 AND date_heure_evenement >= NOW()
        ORDER BY date_heure_evenement ASC`,
        [user]
    );
    return result.rows;
}
exports.getAvailability = getAvailability;

const getAvailabilities = async () => {
    const result = await pool.query(
        `SELECT * FROM evenement
        WHERE id_type_evenement = 1 AND id_client IS NULL AND date_heure_evenement >= NOW()
        ORDER BY date_heure_evenement ASC`,
    );
    return result.rows;
}
exports.getAvailabilities = getAvailabilities;