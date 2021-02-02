const os = require('os');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const pug = require('pug');
const cors = require('cors');
const events = require('events');
const process = require('process');
const dotenv = require('dotenv').config({path:'./VariablesEntorno.env'}); // Antiguo nombre ENVVariables.env
const swaggerjsdoc = require('swagger-jsdoc');
const swaggerui = require('swagger-ui-express');
const openApiDoc = require('./openapi.json');
const app = express();
const moduloBD = require('./BD/conexion.js');
const middlewareBD = require('./BD/MiddlewareBD.js');
const middlewareJWT = require('./JWT/middlewareJWT.js');
var id_usuario; // Variable en la que se guarda el id del usuario que inicia sesión
var rol; // Variable para guardar si es ADMIN o no

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
app.use('/api-docs', swaggerui.serve, swaggerui.setup(openApiDoc));
app.set('views', './');
app.set('view engine', 'pug');

//moduloBD.verificarConexionBD();
moduloBD.verificarexport();
middlewareBD.extender();

/*END POINTS DE USUARIO*/

app.route('/ingresar') // EQUIVALENTE AL LOGIN PARA INICIAR SESIÓN
  .post(middlewareBD.userInfoByEmail, middlewareJWT.autenticarIngresoJWT, function (req, res){
    res.send(res.locals.accessToken);
  })
  .get(middlewareJWT.verificarToken, function (req, res, next){ // ENDPOINT PARA VERIFICAR SI EL TOKEN ES VÁLIDO. NO PARA EL USO DEL CLIENTE.
    res.sendStatus(202);
  });

app.route('/usuario') // END POINT DE USUARIOS
  .get(middlewareJWT.verificarToken, middlewareBD.userInfoByID, function(req, res, next){ // RETORNA LA INFORMACIÓN DE PERFIL DEL USUARIO LOGEADO
    var infoPersonal = res.locals.userData;
    res.send(infoPersonal);
  })
  .post(middlewareBD.validarEmail, middlewareBD.singInUser, function(req, res){ // CREA UN USUARIO. POR AHORA, NO ES NECESARIO SER ADMIN.
    res.sendStatus(200);
  });

app.route('/usuario/all')
  .get(middlewareJWT.verificarToken, middlewareBD.verificarRol, middlewareBD.usersProfileAll); // RETORNA EL LISTADO COMPLETO DE TODOS LOS USUARIOS REGISTRADOS EN EL SISTEMA. SOLO ADMIN.

app.route('/usuario/:id_usuario')
  .get(middlewareJWT.verificarToken, middlewareBD.verificarRol, middlewareBD.usersProfile, function(req, res){ // RETORNA LA INFORMACIÓN DE PERFIL DE UN USUARIO. SOLO ADMIN.
    res.send(res.locals.userData);
  })
  .delete(middlewareJWT.verificarToken, middlewareBD.verificarRol, middlewareBD.eleminarUsuario, function(req, res){ // ELIMINA UN USARIO. SOLO ADMIN.
    res.sendStatus(200);
  })
  .put(middlewareJWT.verificarToken, middlewareBD.verificarRol, middlewareBD.actualizarUsuario); // ACTUALIZA LA INFORMACIÓN DE UN USARIO. SOLO ADMIN

app.route('/historial')
  .get(middlewareJWT.verificarToken, middlewareBD.historialPersonal); // RETORNA EL HISTORIAL DE COMPRAS DE UN USUARIO LOGEADO

app.route('/historial/all')
  .get(middlewareJWT.verificarToken, middlewareBD.verificarRol, middlewareBD.historiaAllUsers); // RETORNA EL HISTORIAL DE COMPRAS DE TODOS LOS USUARIOS EN EL SISTEMA. SOLO ADMIN.

app.route('/historial/:id_usuario')
  .get(middlewareJWT.verificarToken, middlewareBD.verificarRol, middlewareBD.historialUsuario); // RETORNA EL HISTORIAL DE COMPRAS DE UN USUARIO. SOLO ADMIN.

app.route('/pedido') //Crear PEDIDO
  .post(middlewareJWT.verificarToken, middlewareBD.crearPedido); // CREA UN PEDIDO CON UNA LISTA DE PRODUCTOS

app.route('/pedido/:id_pedido')
  .get(middlewareJWT.verificarToken, middlewareBD.pedidoUsuario) // RETORNA LA LISTA DE PRODUCTOS DE UN PEDIDO EN PARTICULAR DE UN USUARIO LOGGEADO
  .delete(middlewareJWT.verificarToken, middlewareBD.verificarRol, middlewareBD.eliminarPedido); // ELIMINA UN PEDIDO, POR TANTO LOS PRODUCTOS REGISTRADOS EN ESA ORDEN. SOLO ADMIN.

app.route('/pedido/:id_pedido/:id_usuario')
  .get(middlewareJWT.verificarToken, middlewareBD.verificarRol, middlewareBD.pedidoUser) // RETORNA LOS PRODUCTOS DE UN PEDIDO DE UN USUARIO. SOLO ADMIN.
  .put(middlewareJWT.verificarToken, middlewareBD.verificarRol, middlewareBD.actualizarEstadoPedido); // ACTUALIZA UN PEDIDO DE UN USUARIO. SOLO ADMIN.

/*END POINTS DE PRODUCTO*/

app.route('/productos')
  .get(middlewareJWT.verificarToken, middlewareBD.menu) // RETORNA LA LISTA DE PRODUCTOS DISPONIBLES

app.route('/producto')
  .post(middlewareJWT.verificarToken, middlewareBD.verificarRol, middlewareBD.crearProducto); // CREA UN PRODUCTO. SOLO ADMIN.

app.route('/producto/:id_producto')
  .put(middlewareJWT.verificarToken, middlewareBD.verificarRol, middlewareBD.actualizarProducto) // ACTUALIZA LA INFORMACIÓN DE UN PRODUCTO. SOLO ADMIN.
  .delete(middlewareJWT.verificarToken, middlewareBD.verificarRol, middlewareBD.eliminarProducto); // ELIMINA UN PRODUCTO. SOLO ADMIN.

var server = app.listen(3000, function(){
  console.log("Servidor iniciado");
});
