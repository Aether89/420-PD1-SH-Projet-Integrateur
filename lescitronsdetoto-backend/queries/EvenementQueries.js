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
    if (row) {
        return {
            id_evenement: row.id_evenement,
            id_type_evenement: row.id_type_evenement,
            id_client: row.id_client,
            user_account_id: row.user_account_id,
            prix_evenement: row.prix_evenement,
            date_heure_evenement: row.date_heure_evenement,
            etat_vue_evenement: row.etat_vue_evenement
        };
    }
    return undefined;
};
exports.getEvenementById = getEvenementById;

const insertEvenement = async (evenement) => {
    const result = await pool.query(
        `INSERT INTO evenement(id_type_evenement, id_client, user_account_id, prix_evenement, date_heure_evenement, etat_vue_evenement)
        VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP,  $5)
        RETURNING id_evenement`,
        [evenement.id_type_evenement, evenement.id_client, evenement.user_account_id, evenement.prix_evenement, evenement.etat_vue_evenement]
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