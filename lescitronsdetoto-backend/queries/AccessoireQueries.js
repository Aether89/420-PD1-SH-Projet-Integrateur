const HttpError = require('../HttpError');
const pool = require('./DBPool');

const getAllAccessoires = async () => {
    const result = await pool.query(
        `SELECT id_accessoire, nom_accessoire
         FROM accessoire
         ORDER BY id_accessoire`,
    );

    return result.rows.map((row) => {
        const accessoire = {
            idAccessoire: row.id_accessoire,
            nomAccessoire: row.nom_accessoire
        };

        return accessoire;
    });
};


exports.getAllAccessoires = getAllAccessoires;



const getAccessoire = async (idAccessoire) => {
        const result = await pool.query(
            `SELECT id_accessoire, nom_accessoire
         FROM accessoire
         WHERE id_accessoire = $1`,
            [idAccessoire]
        );

        const row = result.rows[0];
        if (row) {
            const accessoire = {
                idAccessoire: row.id_accessoire,
            nomAccessoire: row.nom_accessoire
            }



            return accessoire;
        };
 
};
exports.getAccessoire = getAccessoire;



const createAccessoire = async (accessoire, clientParam) => {
    const client = clientParam || (await pool.connect());

    try {
        if (!clientParam) {
            await client.query('BEGIN');
        }


        const result = await client.query(
            `INSERT INTO accessoire (nom_accessoire) 
                         VALUES ($1 )
                         RETURNING id_accessoire`,
            [
                
                accessoire.nomAccessoire
            
            ]
        );
      
            await client.query('COMMIT');
       
        const newAccessoire = await getAccessoire(result.rows[0].id_accessoire, client);
  

        return newAccessoire;
    } catch (err) {
        if (!client) {
            await client.query('ROLLBACK');
        }
        throw new HttpError("Une erreur est survenue lors de la création de l'accessoire", 500);
    } finally {
        if (!client) {
            client.release();
        }
    }
};
exports.createAccessoire = createAccessoire;


const updateAccessoire = async (accessoire) => {
    const client = await pool.connect();

    try {
        await client.query('BEGIN');

        const result = await client.query(
            `UPDATE accessoire SET  nom_accessoire = $2
            WHERE id_accessoire = $1`,
            [accessoire.idAccessoire, accessoire.nomAccessoire]
        );
        if (result.rowCount === 0) {
            throw new HttpError(`Impossible de trouver l'employé avec id_accessoire ${accessoire.idAccessoire}`, 404);
        }

        await client.query("COMMIT");
        return accessoire;
    } catch (err) {
        await client.query("ROLLBACK");
        throw new HttpError(`Une erreur est survenue lors de la mise à jour de l'employé avec id_accessoire ${accessoire.idAccessoire}`, 500);
    } finally {
        client.release();
    }
};
exports.updateAccessoire = updateAccessoire;



const deleteAccessoire = async (idAccessoire, clientParam) => {
    const client = clientParam || (await pool.connect());

    try {
        if (!clientParam) {
            await client.query('BEGIN');
        }
        // Vérifier d'abord si l'accessoire est lié
        const checkQuery = `
            SELECT id_accessoire 
            FROM accessoire
            WHERE id_accessoire NOT IN (
                SELECT id_accessoire FROM vehicule_accessoire

            )
        `;

        const checkResult = await pool.query(checkQuery);

        if (checkResult.rows.find(row => row.id_accessoire === idAccessoire)) {


            
            throw new error("L'employé est lier a une autre table");

        }

       
        // Supprimer de la table accessoire
        const deleteAccessoireQuery = `
            DELETE FROM accessoire
            WHERE id_accessoire = $1
        `;

        await pool.query(deleteAccessoireQuery, [idAccessoire]);

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

exports.deleteAccessoire = deleteAccessoire;

const createAccessoireWvin = async (accessoire, vin) => {
  const client = await pool.connect();
    
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO accessoire (type_accessoire, valeur_accessoire, etat_accessoire)
       VALUES ($1, $2::money, $3)
       RETURNING id_accessoire`,
      [accessoire.typeAccessoire, accessoire.valeurAccessoire, false]
    );

    if (result.rows.length === 0) {
      throw new Error("Unable to create the accessoire");
    }

    const result2 = await client.query(
      `INSERT INTO vehicule_accessoire (vin, id_accessoire)
       VALUES ($1, $2)
       RETURNING id_accessoire`,
      [vin, result.rows[0].id_accessoire]
    );

    if (result2.rows.length === 0) {
      throw new Error("Unable to associate the accessoire with the vehicle");
    }

    await client.query('COMMIT');

    return result2.rows[0].id_accessoire;
  } catch (err) {
    await client.query('ROLLBACK');
    throw new Error(`An error occurred while creating the transaction: ${err.message}`);
  } finally {
    client.release();
  }
};

