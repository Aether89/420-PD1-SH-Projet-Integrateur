const HttpError = require('../HttpError');
const pool = require('./DBPool');
const crypto = require('crypto');

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
      isAdmin: row.is_admin,
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
      `INSERT INTO user_account (user_account_id, id_employe, courriel_compte_employe, password_hash, password_salt, is_active, is_admin, a_change) 
             VALUES ($1, $2, $3, $4, $5, true, false,true)`,
      [userAccountId, idEmploye, courrielCompteEmploye, passwordHash, passwordSalt]
    );

    if (!result) {
      throw new HttpError(500, `Impossible de créer le compte ${userAccountId}`);
    }
    const userAccount = await getLoginByUserAccountId(userAccountId, client);

    console.log("userAccount", userAccount)
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

const changeMDP = async (userAccountId, passwordHash, passwordSalt) => {

  const client = await pool.connect();

  try {
    // Initie la transaction
    await client.query('BEGIN');

    const result = await (client || pool).query(
      `UPDATE user_account 
             SET password_hash=$2, password_salt=$3, a_change=false
             WHERE user_account_id=$1`,
      [userAccountId, passwordHash, passwordSalt]
    );

    const userAccount = getLoginByUserAccountId(result.userAccountId, client);

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
exports.changeMDP = changeMDP;
