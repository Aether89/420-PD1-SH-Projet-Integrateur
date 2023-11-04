const HttpError = require('../HttpError');
const pool = require('./DBPool');

const getAllInterventions = async () => {
  const result = await pool.query(
    `SELECT id_intervention, type_intervention, valeur_intervention, etat_intervention
     FROM intervention
     ORDER BY id_intervention`
  );

  return result.rows.map((row) => {
    return {
      idIntervention: row.id_intervention,
      typeIntervention: row.type_intervention,
      valeurIntervention: row.valeur_intervention,
      etatIntervention: row.etat_intervention,
    };
    
  });
};

const getInterventionByVin = async (vin) => {
  const interventions = [];
  const listeIntervention = await pool.query(
    `SELECT id_intervention
     FROM vehicule_intervention
     WHERE vin = $1`,
    [vin]
  );

  if (listeIntervention.rows.length === 0) {
    return interventions; // Return an empty array when there are no interventions.
  }
 
  
    listeIntervention.rows.map((row) => {
        
        const interventionResult = pool.query(
            `SELECT id_intervention, type_intervention, valeur_intervention, etat_intervention
       FROM intervention
       WHERE id_intervention = $1`,
            [row.id_intervention]
        );
        console.log(interventionResult.rows);
      
        return interventionResult.rows.map((row) => {
            return {
                idIntervention: row.id_intervention,
                typeIntervention: row.type_intervention,
                valeurIntervention: row.valeur_intervention,
                etatIntervention: row.etat_intervention,
            };
    
        });
    });
};




const getIntervention = async (idIntervention) => {
  const result = await pool.query(
    `SELECT id_intervention, type_intervention, valeur_intervention, etat_intervention
     FROM intervention
     WHERE id_intervention = $1`,
    [idIntervention]
  );

  if (result.rows.length === 0) {
    return null; // Return null when the intervention is not found
  }

  const row = result.rows[0];
  return {
    idIntervention: row.id_intervention,
    typeIntervention: row.type_intervention,
    valeurIntervention: row.valeur_intervention,
    etatIntervention: row.etat_intervention,
  };
};

const createIntervention = async (intervention) => {
  const result = await pool.query(
    `INSERT INTO intervention (type_intervention, valeur_intervention, etat_intervention)
     VALUES ($1, $2::money, $3)
     RETURNING id_intervention`,
    [intervention.typeIntervention, intervention.valeurIntervention, false]
  );

  if (result.rows.length === 0) {
    throw new HttpError(500, "Unable to create the intervention");
  }

  return result.rows[0].id_intervention;
};

const updateIntervention = async (intervention) => {
  const result = await pool.query(
    `UPDATE intervention
     SET type_intervention = $2, valeur_intervention = $3, etat_intervention = $4
     WHERE id_intervention = $1`,
    [intervention.idIntervention, intervention.typeIntervention, intervention.valeurIntervention, intervention.etatIntervention]
  );

  if (result.rowCount === 0) {
    throw new HttpError(404, `Intervention with id_intervention ${intervention.idIntervention} not found`);
  }

  return intervention;
};

const deleteIntervention = async (idIntervention, clientParam) => {
  const client = clientParam || (await pool.connect());

  try {
    if (!clientParam) {
      await client.query('BEGIN');
    }

    // Delete from the intervention table
    const deleteInterventionQuery = `
      DELETE FROM intervention
      WHERE id_intervention = $1
    `;
    const result = await pool.query(deleteInterventionQuery, [idIntervention]);

    if (result.rowCount === 0) {
      throw new HttpError(404, `Intervention with id_intervention ${idIntervention} not found`);
    }

    if (!clientParam) {
      await client.query('COMMIT');
    }

    return {};
  } catch (err) {
    if (!clientParam) {
      await client.query('ROLLBACK');
    }
    throw err;
  } finally {
    if (!clientParam) {
      client.release();
    }
  }
};

const createInterventionWvin = async (intervention, vin) => {
  const client = await pool.connect();
    
    console.log(vin);
  try {
    await client.query('BEGIN');

    const result = await client.query(
      `INSERT INTO intervention (type_intervention, valeur_intervention, etat_intervention)
       VALUES ($1, $2::money, $3)
       RETURNING id_intervention`,
      [intervention.typeIntervention, intervention.valeurIntervention, false]
    );

    if (result.rows.length === 0) {
      throw new Error("Unable to create the intervention");
    }

    const result2 = await client.query(
      `INSERT INTO vehicule_intervention (vin, id_intervention)
       VALUES ($1, $2)
       RETURNING id_intervention`,
      [vin, result.rows[0].id_intervention]
    );

    if (result2.rows.length === 0) {
      throw new Error("Unable to associate the intervention with the vehicle");
    }

    await client.query('COMMIT');

    return result2.rows[0].id_intervention;
  } catch (err) {
    await client.query('ROLLBACK');
    throw new Error(`An error occurred while creating the transaction: ${err.message}`);
  } finally {
    client.release();
  }
};

const deleteInterventionWvin = async (idIntervention, vin, clientParam) => {
  const client = clientParam || (await pool.connect());

  try {
    if (!clientParam) {
      await client.query('BEGIN');
    }

    // Delete from the vehicule_intervention table
    const deleteInterventionVehicule = `
      DELETE FROM vehicule_intervention
      WHERE id_intervention = $1 AND vin = $2
    `;
    const result1 = await pool.query(deleteInterventionVehicule, [idIntervention, vin]);

    if (result1.rowCount === 0) {
      throw new HttpError(404, `Intervention with id_intervention ${idIntervention} and vin ${vin} not found`);
    }

    // Delete from the intervention table
    const deleteInterventionQuery = `
      DELETE FROM intervention
      WHERE id_intervention = $1
    `;
    const result2 = await pool.query(deleteInterventionQuery, [idIntervention]);

    if (result2.rowCount === 0) {
      throw new HttpError(404, `Intervention with id_intervention ${idIntervention} not found`);
    }

    if (!clientParam) {
      await client.query('COMMIT');
    }

    return {};
  } catch (err) {
    if (!clientParam) {
      await client.query('ROLLBACK');
    }
    throw err;
  } finally {
    if (!clientParam) {
      client.release();
    }
  }
};

module.exports = {
  getAllInterventions,
  getInterventionByVin,
  getIntervention,
  createIntervention,
  updateIntervention,
  deleteIntervention,
  createInterventionWvin,
  deleteInterventionWvin,
};
