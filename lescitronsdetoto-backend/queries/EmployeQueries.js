const HttpError = require('../HttpError');
const pool = require('./DBPool');

const getAllEmployes = async () => {
    const result = await pool.query(
        `SELECT id_employe, nom_employe, prenom_employe, poste_employe, telephone_employe, code_postal_employe
         FROM employe
         ORDER BY id_employe`,
    );

    return result.rows.map((row) => {
        const employe = {
            idEmploye: row.id_employe,
            nomEmploye: row.nom_employe,
            prenomEmploye: row.prenom_employe,
            posteEmploye: row.poste_employe,
            telephoneEmploye: row.telephone_employe,
            codePostalEmploye: row.code_postal_employe
        };

        return employe;
    });
};
exports.getAllEmployes = getAllEmployes;

const getEmploye = async (idEmploye, clientParam) => {
    const client = clientParam || (await pool.connect());

    try {
        if (!clientParam) {
            await client.query("BEGIN");
        }

        const result = await client.query(
            `SELECT id_employe, nom_employe, prenom_employe, poste_employe, telephone_employe, code_postal_employe
         FROM employe
         WHERE id_employe = $1`,
            [idEmploye]
        );

        const row = result.rows[0];
        if (row) {
            const employe = {
                idEmploye: row.id_employe,
                nomEmploye: row.nom_employe,
                prenomEmploye: row.prenom_employe,
                posteEmploye: row.poste_employe,
                telephoneEmploye: row.telephone_employe,
                codePostalEmploye: row.code_postal_employe
            }



            return employe;
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
exports.getEmploye = getEmploye;


const createEmploye = async (Employe, clientParam) => {
    const client = clientParam || (await pool.connect());

    try {
        if (!clientParam) {
            await client.query('BEGIN');
        }
        const result = await pool.query(
            `INSERT INTO employe (nom_employe, prenom_employe, poste_employe, telephone_employe, code_postal_employe) 
             VALUES ($1, $2, $3, $4, $5)
             RETURNING id_employe`,
            [Employe.nomEmploye, Employe.prenomEmploye, Employe.posteEmploye, Employe.telephoneEmploye, Employe.codePostalEmploye]
        );

        const NewEmploye = getEmploye(result.rows[0].id_employe, client);

        client.query('COMMIT');

        return NewEmploye;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};
exports.createEmploye = createEmploye;

const updateEmploye = async (employe) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(
            `UPDATE employe SET nom_employe = $2, prenom_employe = $3, poste_employe = $4, telephone_employe = $5, code_postal_employe = $6
            WHERE id_employe = $1`,
            [employe.idEmploye, employe.nomEmploye, employe.prenomEmploye, employe.posteEmploye, employe.telephoneEmploye, employe.codePostalEmploye]
        );
        if (result.rowCount === 0) {
            throw new Error(`Impossible de trouver l'employe avec id_employe ${employe.idEmploye}`);
        }


        await client.query("COMMIT");
        return employe;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};
exports.updateEmploye = updateEmploye;

const deleteEmploye = async (idEmploye) => {
    const result = await pool.query(
        `DELETE FROM employe WHERE id_employe = $1`,
        [idEmploye]
    );
    if (result.rowCount === 0) {
        return undefined;
    }
    return {};
};
exports.deleteEmploye = deleteEmploye
