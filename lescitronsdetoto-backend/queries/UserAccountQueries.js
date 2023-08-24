const HttpError = require('../HttpError');
const pool = require('./DBPool');

const getLoginByUserAccountId = async (userAccountId, client) => {
    const result = await (client || pool).query(
        `SELECT user_account_id, password_hash, password_salt, user_full_name, is_active, is_admin
         FROM user_account
         WHERE user_account_id = $1`,
        [userAccountId]
    );

    const row = result.rows[0];
    if (row) {
        return {
            userAccountId: row.user_account_id,
            passwordHash: row.password_hash,
            passwordSalt: row.password_salt,
            userFullName: row.user_full_name,
            isActive: row.is_active,
            isAdmin: row.is_admin
        };
    }
    return undefined;
};
exports.getLoginByUserAccountId = getLoginByUserAccountId;


const createUserAccount = async (userAccountId, passwordHash, passwordSalt, name) => {

    const client = await pool.connect();

    try {
        // Initie la transaction
        await client.query('BEGIN');

        const existingUserAccount = await getLoginByUserAccountId(userAccountId, client);
        if (existingUserAccount) {
            throw new HttpError(409, `Un compte avec l'identifiant ${userAccountId} existe déjà`);
        }

        const result = await (client || pool).query(
            `INSERT INTO user_account (user_account_id, password_hash, password_salt, user_full_name) 
             VALUES ($1, $2, $3, $4)`,
            [userAccountId, passwordHash, passwordSalt, name]
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
