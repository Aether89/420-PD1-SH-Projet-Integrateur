const HttpError = require('../HttpError');
const pool = require('./DBPool');

const getAllInfoClients = async () => {
    const result = await pool.query(
        `SELECT id_client, nom_client, prenom_client, telephone_client, numero_civic, numero_appartement, nom_rue,
        nom_ville, nom_province, code_postal, is_archive
         FROM client
         ORDER BY id_client`,
    );

    return result.rows.map((row) => {
        const infoClient = {
            idClient: row.id_client,
            nomClient: row.nom_client,
            prenomClient: row.prenom_client,
            telephoneClient: row.telephone_client,
            numero_civic: row.numero_civic,
            numeroAppartement: row.numero_appartement,
            nomRue: row.nom_rue,
            nomVille: row.nom_ville,
            nomProvince: row.nom_province,
            codePostal: row.code_postal,
            isArchive: row.is_archive
        };

        return infoClient;
    });
};
exports.getAllInfoClients = getAllInfoClients;

const getInfoClient = async (idInfoClient, clientParam) => {
    const client = clientParam || (await pool.connect());

    try {
        if (!clientParam) {
            await client.query("BEGIN");
        }

        const result = await client.query(
            `SELECT id_client, nom_client, prenom_client, telephone_client, numero_civic, numero_appartement, nom_rue,
            nom_ville, nom_province, code_postal, is_archive
         FROM client
         WHERE id_client = $1`,
            [idInfoClient]
        );

        const row = result.rows[0];
        if (row) {
            const infoClient = {
                idClient: row.id_client,
                nomClient: row.nom_client,
                prenomClient: row.prenom_client,
                telephoneClient: row.telephone_client,
                numero_civic: row.numero_civic,
                numeroAppartement: row.numero_appartement,
                nomRue: row.nom_rue,
                nomVille: row.nom_ville,
                nomProvince: row.nom_province,
                codePostal: row.code_postal,
                isArchive: row.is_archive
            }



            return infoClient;
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
exports.getInfoClient = getInfoClient;


const createInfoClient = async (infoClient, clientParam) => {
    const client = clientParam || (await pool.connect());

    try {
        if (!clientParam) {
            await client.query('BEGIN');
        }
        const result = await client.query(
            `INSERT INTO client (nom_client, prenom_client, telephone_client, numero_civic, numero_appartement, nom_rue,
                nom_ville, nom_province, code_postal, is_archive ) 
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,false )
             RETURNING id_client`,
            [infoClient.nomClient, infoClient.prenomClient, infoClient.telephoneClient, infoClient.numeroCivic, infoClient.numeroAppartement,
            infoClient.nomRue, infoClient.nomVile, infoClient.nomProvince, infoClient.codePostal]
        );



        client.query('COMMIT');
        const NewInfoClient = getInfoClient(result.rows[0].id_client, client);

        return NewInfoClient;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};
exports.createInfoClient = createInfoClient;

const updateInfoClient = async (infoClient) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(
            `UPDATE client SET nom_client = $2, prenom_client = $3, telephone_client = $4 ,numero_civic = $5, numero_appartement = $6, nom_rue = $7,
             nom_ville = $8, nom_province = $9, code_postal = $10, is_archive = $11
            WHERE id_client = $1`,
            [infoClient.idClient, infoClient.nomClient, infoClient.prenomClient, infoClient.telephoneClient, infoClient.numeroCivic, infoClient.numeroAppartement,
            infoClient.nomRue, infoClient.nomVile, infoClient.nomProvince, infoClient.codePostal, infoClient.isArchive]
        );
        if (result.rowCount === 0) {
            throw new Error(`Impossible de trouver le client avec id_client ${infoClient.idClient}`);
        }


        await client.query("COMMIT");
        return infoClient;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};
exports.updateInfoClient = updateInfoClient;

const deleteInfoClient = async (idInfoClient, clientParam) => {
    const client = clientParam || (await pool.connect());

    try {
        if (!clientParam) {
            await client.query('BEGIN');
        }
        // Vérifier d'abord si le client est lié à message_chat 
        const checkQuery = `
            SELECT id_client 
            FROM client
            WHERE id_client = $1 NOT IN (
                SELECT id_client FROM message_chat
            )
        `;
        [idInfoClient]

        const row = result.rows[0];
        if (row) {

            throw new error("L'employé est lier a une autre table");

        }


        // Supprimer de la table client
        const deleteInfoClientQuery = `
            DELETE FROM client
            WHERE id_client = $1
        `;

        [idInfoClient]

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

exports.deleteInfoClient = deleteInfoClient;

