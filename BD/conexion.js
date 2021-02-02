var exports = module.exports = {};

const seqelize = require('sequelize');
const mysql = require('mysql2');
const conectorBD = new seqelize ('acamica', 'root', 'Stellar_0Chef_isolating_Else9_Rabin8_alfalfa_tableful_2dweller_9shrouded',{
  host: 'localhost',
  dialect: 'mysql',
  port: 3306
});

const verificarConexionBD = async function(){
  try {
    await conectorBD.authenticate();
    var [consulta_test, metadata] = await conectorBD.query('SELECT * FROM USUARIO');
  } catch (e) {
    console.error('No se ha podido establecer conexión a la BD', e);
  }
};

exports.verificarConexionBD = verificarConexionBD;
exports.conectorBD = conectorBD;

exports.verificarexport = function (){
  console.log("Sí funciono.");
};
