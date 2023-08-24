const Pool = require('pg').Pool;

const dbConfig = require('../db_config');

module.exports = new Pool(dbConfig);
