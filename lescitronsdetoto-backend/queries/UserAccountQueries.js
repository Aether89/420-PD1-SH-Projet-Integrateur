const HttpError = require('../HttpError');
const pool = require('./DBPool');

const getLoginByUserAccountId = async (userAccountId, client) => {
    const result = await (client || pool).query(
        `SELECT user_account_id, id_employe, courriel_compte_employe, password_hash, password_salt, is_active, is_admin
         FROM user_account
         WHERE user_account_id = $1`,
        [userAccountId]
    );

    const row = result.rows[0];
    if (row) {
        return {
            userAccountId: row.user_account_id,
            idEmploye: row.id_employe,
            courrielCompteEmploye: row.courriel_compte_employe,
            passwordHash: row.password_hash,
            passwordSalt: row.password_salt,
            isActive: row.is_active,
            isAdmin: row.is_admin
        };
    }
    return undefined;
};
exports.getLoginByUserAccountId = getLoginByUserAccountId;


const createUserAccount = async (userAccountId, idEmploye, courrielCompteEmploye, passwordHash, passwordSalt) => {

    const client = await pool.connect();

    try {
        // Initie la transaction
        await client.query('BEGIN');

        const existingUserAccount = await getLoginByUserAccountId(userAccountId, client);
        if (existingUserAccount) {
            throw new HttpError(409, `Un compte avec l'identifiant ${userAccountId} existe déjà`);
        }


        const result = await (client || pool).query(
            `INSERT INTO user_account (user_account_id, id_employe, courriel_compte_employe, password_hash, password_salt, is_active, is_admin) 
             VALUES ($1, $2, $3, $4, $5, true, false)`,
            [userAccountId, idEmploye, courrielCompteEmploye, passwordHash, passwordSalt]
        );

        const userAccount = getLoginByUserAccountId(userAccountId, client);

        client.query('COMMIT');

        return userAccount;
    } catch (err) {
        // Annule la transaction en cas d'échec
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};
exports.createUserAccount = createUserAccount;
