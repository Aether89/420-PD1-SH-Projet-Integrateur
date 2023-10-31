const pool = require('./DBPool');

const getAllVehicule = async () => {
    const result = await pool.query(
        `SELECT
        vin,
        marque,
        modele,
        annee,
        couleur,
        nombre_kilometre,
        prix_annonce, 
        promotion,
        description_courte,
        description_longue
        FROM
        vehicule`
    );

    if (result.rows && result.rows.length > 0) {
        return result.rows.map(row => {
            const vehicule = {
                vin: row.vin,
                marque: row.marque,
                modele: row.modele,
                annee: row.annee,
                prix_annonce: row.prix_annonce,
                promotion: row.promotion
            };
            return vehicule;
        });
    } else {
        return [];
    }
};
exports.getAllVehicule = getAllVehicule;

const getVehiculeByVin = async (vin) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const accessoireResult = await pool.query(
                `SELECT id_accessoire
                FROM vehicule_accessoire
                where vin = $1`,
                [vin]
                
        );
       
        const vehiculeResult = await pool.query(
        `SELECT 
        vin,
        id_etat,
        marque,
        modele,
        annee,
        couleur,
        nombre_kilometre,
        prix_annonce, 
        promotion,
        description_courte,
        description_longue        
        FROM
        vehicule
        WHERE
        vin = $1`,
        [vin]
        );
        /*const vehiculeResponsePromises = vehiculeResult.rows.map(vehiculeRow => buildVehiculeResponseObject(vehiculeRow, client));
        const vehicule = await Promise.all(vehiculeResponsePromises);*/
        await client.query("COMMIT");
        const row = vehiculeResult.rows[0];
        if (row) {
           return{
                vin: row.vin,
                id_etat: row.id_etat,
                marque: row.marque,
                modele: row.modele,
                annee: row.annee,
                couleur: row.couleur,
                nombre_kilometre: row.nombre_kilometre,
                prix_annonce: row.prix_annonce,
                promotion: row.promotion,
                description_courte: row.description_courte,
                description_longue: row.description_longue,
                selectedAccessoire: accessoireResult.rows.map((row) => row.id_accessoire)
            };
        }
            
        return undefined;
    } catch (err) {
        await client.query("ROLLBACK");
        throw err;
    } finally {
        client.release();
    }
};
exports.getVehiculeByVin = getVehiculeByVin;

const addVehicule = async (vehicule) => {
    console.log("create vehicule : ", vehicule);
    const result = await pool.query (
        `INSERT INTO vehicule (vin, id_etat, marque, modele, annee, couleur, nombre_kilometre, prix_annonce, promotion, description_courte, description_longue)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8::money, $9::money, $10, $11)`,
    [vehicule.vin, vehicule.id_etat, vehicule.marque, vehicule.modele, vehicule.annee, vehicule.couleur, vehicule.nombre_kilometre, vehicule.prix_annonce, vehicule.promotion, vehicule.description_courte, vehicule.description_longue]
    );

    if (result.rowCount === 0) {
        return undefined;
    }
};
exports.addVehicule = addVehicule;

const updateVehicule = async (vehicule) => {
    const result = await pool.query(
        `UPDATE vehicule
        SET 
        id_etat = $1, 
        couleur = $2, 
        nombre_kilometre = $3, 
        prix_annonce = $4::money, 
        promotion = $5::money, 
        description_courte = $6, 
        description_longue = $7
        WHERE vin = $8`,
        [vehicule.id_etat, vehicule.couleur, vehicule.nombre_kilometre, vehicule.prix_annonce, vehicule.promotion, vehicule.description_courte, vehicule.description_longue, vehicule.vin]
    );
    return getVehiculeByVin(vehicule.vin);
};
exports.updateVehicule = updateVehicule;

const deleteVehicule = async (vin) => {
    const result = await pool.query(
        `DELETE FROM vehicule
        WHERE vin = $1;`,
        [vin]
    );
    return result;
};
exports.deleteVehicule = deleteVehicule;