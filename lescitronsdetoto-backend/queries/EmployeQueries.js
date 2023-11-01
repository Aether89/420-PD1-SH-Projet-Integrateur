const HttpError = require('../HttpError');
const pool = require('./DBPool');

const getAllEmployes = async () => {
    const result = await pool.query(
        `SELECT id_employe, nom_employe, prenom_employe, poste_employe, telephone_employe, code_postal
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
            numeroCivic: row.numero_civic,
            numeroAppartement: row.numero_appartement,
            nomRue: row.nom_rue,
            nomVille: row.nom_ville,
            nomProvince: row.nom_province,
            codePostal: row.code_postal,
            isArchive: row.is_archive
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
            `SELECT *
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
                numeroCivic: row.numero_civic,
                numeroAppartement: row.numero_appartement,
                nomRue: row.nom_rue,
                nomVille: row.nom_ville,
                nomProvince: row.nom_province,
                codePostal: row.code_postal,
                isArchive: row.is_archive
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



const createEmploye = async (employe, clientParam) => {
    const client = clientParam || (await pool.connect());

    try {
        if (!client) {
            await client.query('BEGIN');
        }


        const result = await client.query(
            `INSERT INTO employe (nom_employe, prenom_employe, poste_employe, telephone_employe, numero_civic, numero_appartement, nom_rue,
                                nom_ville, nom_province, code_postal,is_archive ) 
                         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10,false )
                         RETURNING id_employe`,
            [
                employe.nomEmploye,
                employe.prenomEmploye,
                employe.posteEmploye,
                employe.telephoneEmploye,
                employe.numeroCivic,
                employe.numeroAppartement,
                employe.nomRue,
                employe.nomVille,
                employe.nomProvince,
                employe.codePostal,
            ]
        );

        const newEmploye = await getEmploye(result.rows[0].id_employe, client);
        if (!client) {
            await client.query('COMMIT');
        }
        return newEmploye;
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
exports.createEmploye = createEmploye;


const updateEmploye = async (employe) => {
    const client = await pool.connect();
    console.log("avant le try de la querie")
    try {
        await client.query('BEGIN');

        const result = await client.query(

            `UPDATE employe SET nom_employe = $2, prenom_employe = $3, poste_employe = $4, telephone_employe = $5 ,numero_civic = $6, numero_appartement = $7, nom_rue = $8,
             nom_ville = $9, nom_province = $10, code_postal = $11, is_archive = $12
            WHERE id_employe = $1`,
            [
                employe.idEmploye,
                employe.nomEmploye,
                employe.prenomEmploye,
                employe.posteEmploye,
                employe.telephoneEmploye,
                employe.numeroCivic,
                employe.numeroAppartement,
                employe.nomRue,
                employe.nomVille,
                employe.nomProvince,
                employe.codePostal,
                employe.isArchive
            ]
        );
        if (result.rowCount === 0) {
            throw new HttpError(`Impossible de trouver l'employé avec id_employe ${employe.idEmploye}`, 404);
        }

        await client.query("COMMIT");
        console.log("query", result)
        return employe;
    } catch (err) {
        await client.query("ROLLBACK");
        throw new HttpError(`Une erreur est survenue lors de la mise à jour de l'employé avec id_employe ${employe.idEmploye}`, 500);
    } finally {
        client.release();
    }
};
exports.updateEmploye = updateEmploye;

const deleteEmploye = async (idEmploye, clientParam) => {
    const client = clientParam || (await pool.connect());

    try {
        if (!clientParam) {
            await client.query('BEGIN');
        }
        // Vérifier d'abord si l'employé est lié à message_chat ou evenement
        const checkQuery = `
            SELECT id_employe 
            FROM employe
            WHERE id_employe NOT IN (
                SELECT id_employe FROM message_chat
                UNION
                SELECT id_employe FROM evenement
            )
        `;

        const checkResult = await pool.query(checkQuery);

        if (checkResult.rows.find(row => row.id_employe === idEmploye)) {


            // Si l'employé est lié, retourner une réponse vide
            throw new error("L'employé est lier a une autre table");

        }

        // Supprimer de user_account
        const deleteQuery = `
            DELETE FROM user_account
            WHERE id_employe = $1
        `;

        await pool.query(deleteQuery, [idEmploye]);

        // Supprimer de la table employe
        const deleteEmployeQuery = `
            DELETE FROM employe
            WHERE id_employe = $1
        `;

        await pool.query(deleteEmployeQuery, [idEmploye]);

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
    return {};
};
exports.deleteEmploye = deleteEmploye
