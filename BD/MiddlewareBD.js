const bd = require('./conexion.js');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var idUsuario;
var emailUsuario;
var extender = function (){console.log("DESDE MIDDLEWARE BD")};

const userInfoByEmail = async function (req, res, next){ //Función para el login con Email y password
  try {
    var [query, metadata] = await bd.conectorBD.query('SELECT ID_USUARIO, NOMBRES, APELLIDOS, ADMIN, PASSWORD, EMAIL FROM USUARIO WHERE EMAIL = ' + "'" + req.body.email + "'");
    if(Object.values(query).length === 0){
      return res.sendStatus(404);
    }else if(bcrypt.compareSync(req.body.password, query[0]['PASSWORD']) === false){
      return res.sendStatus(403);
    }else{
      var password = query[0]['PASSWORD'];
      idUsuario = query[0]['ID_USUARIO'];
      emailUsuario = query[0]['EMAIL'];
      res.locals.rol = query[0]['ADMIN'];
      res.locals.password = password;
      next();
    }

  } catch (e) {
    res.sendStatus(500);
  }
};

const userInfoByID = async function (req, res, next){ // Función para retornar el ID_USUARIO con base al EMAIL

  if(!idUsuario){
    return res.sendStatus(430);
  }

  try {
    var [query, metadata] = await bd.conectorBD.query('SELECT * FROM USUARIO WHERE ID_USUARIO = ' + "'" + idUsuario + "'");
    if(!Object.values(query).length){
      return res.sendStatus(404);
    }
    res.locals.userData = query;
    next();
  } catch (e) {
    res.sendStatus(500);
  }
};

const verificarRol = async function (req, res, next){

  if(!idUsuario){
    return res.sendStatus(430);
  }

  try {
    var [query, metadata] = await bd.conectorBD.query('SELECT ADMIN FROM USUARIO WHERE ID_USUARIO = ' + idUsuario);
    if(Object.values(query).length === 0){
      return res.sendStatus(404);
    }else if(query[0]['ADMIN'] === 1){
      res.locals.userData = query[0]['ADMIN'];
      next();
    } else{
      res.sendStatus(403);
    }
  } catch (e) {
    res.sendStatus(500);
  }
}

const validarEmail = async function (req, res, next){

  if(Object.keys(req.body).length === 0){
    res.sendStatus(409);
  }

  if(!('nombres' in req.body) || !('apellidos' in req.body) || !('email' in req.body) || !('direccion_envio' in req.body) || !('telefono' in req.body) || !('password' in req.body) || !('admin' in req.body)){
    return res.sendStatus(415);
  }

  try {
    var [query, metadata] = await bd.conectorBD.query('SELECT EMAIL FROM USUARIO WHERE EMAIL = ' + "'" + req.body.email + "'");
    if(Object.values(query).length === 0){
      next();
    }else {
      res.sendStatus(409);
    }
  } catch (e) {
    res.sendStatus(500);
  }
}

const singInUser = async function (req, res, next){ // Crear usuario

  if(Object.keys(req.body).length === 0){
    return res.sendStatus(406);
  }

  if(!('nombres' in req.body) || !('apellidos' in req.body) || !('email' in req.body) || !('direccion_envio' in req.body) || !('telefono' in req.body) || !('password' in req.body) || !('admin' in req.body)){
    return res.sendStatus(415);
  }

  var stringInsertValues = '(';
  var cadenas = '';
  var hashpassword = bcrypt.hashSync(req.body.password, saltRounds);
  req.body.password = hashpassword;
  var datosRegistro = Object.values(req.body);

  datosRegistro.forEach((item, i) => {

    if(i === datosRegistro.length - 1){
      typeof(item) === 'string' ? stringInsertValues += "'" + item + "')" : stringInsertValues += item + ")";
    }else{
      typeof(item) === 'string' ? stringInsertValues += "'" + item + "', " : stringInsertValues += item + ", ";
    }
  });

  try {
    var [query, metadata] = await bd.conectorBD.query('INSERT INTO USUARIO (NOMBRES, APELLIDOS, EMAIL, DIRECCION_ENVIO, TELEFONO, PASSWORD, ADMIN, TOKEN) VALUES ' + stringInsertValues);
    next();
  } catch (e) {
    res.sendStatus(500);
  }
}

const usersProfile = async function (req, res, next){

  try {
    var [query, metadata] = await bd.conectorBD.query('SELECT * FROM USUARIO WHERE ID_USUARIO = ' + req.params.id_usuario);
    if(Object.values(query).length === 0){
      return res.sendStatus(404);
    }
    res.locals.userData = query[0];
    next();
  } catch (e) {
    res.sendStatus(500);
  }
}

const usersProfileAll = async function (req, res, next){
  try {
    var [query, metadata] = await bd.conectorBD.query('SELECT * FROM USUARIO');
    if(Object.values(query).length === 0){
      return res.sendStatus(404);
    }
    res.status(200).send(query);
  } catch (e) {
    res.sendStatus(500);
  }
}

const eleminarUsuario = async function (req, res, next){

  if(Object.values(req.params).length === 0){
    return res.sendStatus(406);
  }
  try {
    var [query, metadata] = await bd.conectorBD.query('DELETE FROM USUARIO WHERE ID_USUARIO = ' + req.params.id_usuario);
    if(Object.values(query).length === 0){
        return res.sendStatus(404);
    }
    next();
  } catch (e) {
    res.sendStatus(500);
  }
}

const actualizarUsuario = async function (req, res, next){

  if(Object.values(req.params).length === 0){
    return res.sendStatus(406);
  }

  var updatepairs = '';
  var keys = Object.keys(req.body);
  var valores = Object.values(req.body);

  keys.forEach((item, index) => {
    let propiedad = item.toString();
    if(index === keys.length-1){
        updatepairs += item.toString() + ' = ' + (typeof(valores[index]) === 'string' ? "'" + valores[index] + "'" : valores[index]);
    }else{
        updatepairs += item.toString() + ' = ' + (typeof(valores[index]) === 'string' ? "'" + valores[index] + "'" : valores[index]) + ', ';
    }
  });

  try {
    var [query, metadata] = await bd.conectorBD.query('UPDATE USUARIO SET ' + updatepairs + " WHERE ID_USUARIO = " + req.params.id_usuario);
    if(Object.values(query).length === 0){
      return res.sendStatus(404);
    }
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
}

const historialPersonal = async function (req, res, next) {

  try {
    var [query, metadata] = await bd.conectorBD.query('SELECT LISTA_CODIGO_PRODUCTOS.ID_USUARIO, LISTA_CODIGO_PRODUCTOS.NOMBRES, LISTA_CODIGO_PRODUCTOS.ID_PEDIDO, LISTA_CODIGO_PRODUCTOS.ESTADO, LISTA_CODIGO_PRODUCTOS.METODO, LISTA_CODIGO_PRODUCTOS.ID_FOREIGN_PRODUCTO, PRODUCTO.NOMBRE, PRODUCTO.PRECIO FROM (SELECT LISTA_INFO_PEDIDOS.*, HISTORIAL.ID_FOREIGN_PRODUCTO FROM (SELECT LISTA_ESTADO_PEDIDOS.*, FORMA_DE_PAGO.METODO FROM (SELECT LISTA_PEDIDOS.*, ESTADO_PEDIDOS.ESTADO FROM (SELECT USUARIO.ID_USUARIO, USUARIO.NOMBRES, PEDIDOS.ID_PEDIDO, PEDIDOS.ID_FOREIGN_ESTADO_PEDIDOS, PEDIDOS.ID_FOREIGN_FORMA_DE_PAGO FROM USUARIO INNER JOIN PEDIDOS ON USUARIO.ID_USUARIO = PEDIDOS.ID_FOREIGN_USUARIO) LISTA_PEDIDOS INNER JOIN ESTADO_PEDIDOS ON LISTA_PEDIDOS.ID_FOREIGN_ESTADO_PEDIDOS = ESTADO_PEDIDOS.ID_ESTADO_PEDIDO) LISTA_ESTADO_PEDIDOS INNER JOIN FORMA_DE_PAGO ON LISTA_ESTADO_PEDIDOS.ID_FOREIGN_FORMA_DE_PAGO = FORMA_DE_PAGO.ID_FORMA_DE_PAGO) LISTA_INFO_PEDIDOS INNER JOIN HISTORIAL ON LISTA_INFO_PEDIDOS.ID_PEDIDO = HISTORIAL.ID_FOREIGN_PEDIDO) LISTA_CODIGO_PRODUCTOS INNER JOIN PRODUCTO ON LISTA_CODIGO_PRODUCTOS.ID_FOREIGN_PRODUCTO = PRODUCTO.ID_PRODUCTO WHERE LISTA_CODIGO_PRODUCTOS.ID_USUARIO = ' + idUsuario);
    if(Object.values(query).length === 0){
      return res.sendStatus(404);
    }
    res.status(200).send(query);
  } catch (e) {
    res.sendStatus(500);
  }
}

const historialUsuario = async function (req, res, next) {

  try {
    var [query, metadata] = await bd.conectorBD.query('SELECT LISTA_CODIGO_PRODUCTOS.ID_USUARIO, LISTA_CODIGO_PRODUCTOS.NOMBRES, LISTA_CODIGO_PRODUCTOS.ID_PEDIDO, LISTA_CODIGO_PRODUCTOS.ESTADO, LISTA_CODIGO_PRODUCTOS.METODO, LISTA_CODIGO_PRODUCTOS.ID_FOREIGN_PRODUCTO, PRODUCTO.NOMBRE, PRODUCTO.PRECIO FROM (SELECT LISTA_INFO_PEDIDOS.*, HISTORIAL.ID_FOREIGN_PRODUCTO FROM (SELECT LISTA_ESTADO_PEDIDOS.*, FORMA_DE_PAGO.METODO FROM (SELECT LISTA_PEDIDOS.*, ESTADO_PEDIDOS.ESTADO FROM (SELECT USUARIO.ID_USUARIO, USUARIO.NOMBRES, PEDIDOS.ID_PEDIDO, PEDIDOS.ID_FOREIGN_ESTADO_PEDIDOS, PEDIDOS.ID_FOREIGN_FORMA_DE_PAGO FROM USUARIO INNER JOIN PEDIDOS ON USUARIO.ID_USUARIO = PEDIDOS.ID_FOREIGN_USUARIO) LISTA_PEDIDOS INNER JOIN ESTADO_PEDIDOS ON LISTA_PEDIDOS.ID_FOREIGN_ESTADO_PEDIDOS = ESTADO_PEDIDOS.ID_ESTADO_PEDIDO) LISTA_ESTADO_PEDIDOS INNER JOIN FORMA_DE_PAGO ON LISTA_ESTADO_PEDIDOS.ID_FOREIGN_FORMA_DE_PAGO = FORMA_DE_PAGO.ID_FORMA_DE_PAGO) LISTA_INFO_PEDIDOS INNER JOIN HISTORIAL ON LISTA_INFO_PEDIDOS.ID_PEDIDO = HISTORIAL.ID_FOREIGN_PEDIDO) LISTA_CODIGO_PRODUCTOS INNER JOIN PRODUCTO ON LISTA_CODIGO_PRODUCTOS.ID_FOREIGN_PRODUCTO = PRODUCTO.ID_PRODUCTO WHERE LISTA_CODIGO_PRODUCTOS.ID_USUARIO = ' + req.params.id_usuario);
    if(Object.values(query).length === 0){
      return res.sendStatus(404);
    }
    res.status(200).send(query);
  } catch (e) {
    res.sendStatus(500);
  }
}

const historiaAllUsers = async function (req, res, next) {

  try {
    var [query, metadata] = await bd.conectorBD.query('SELECT LISTA_CODIGO_PRODUCTOS.ID_USUARIO, LISTA_CODIGO_PRODUCTOS.NOMBRES, LISTA_CODIGO_PRODUCTOS.ID_PEDIDO, LISTA_CODIGO_PRODUCTOS.ESTADO, LISTA_CODIGO_PRODUCTOS.METODO, LISTA_CODIGO_PRODUCTOS.ID_FOREIGN_PRODUCTO, PRODUCTO.NOMBRE, PRODUCTO.PRECIO FROM (SELECT LISTA_INFO_PEDIDOS.*, HISTORIAL.ID_FOREIGN_PRODUCTO FROM (SELECT LISTA_ESTADO_PEDIDOS.*, FORMA_DE_PAGO.METODO FROM (SELECT LISTA_PEDIDOS.*, ESTADO_PEDIDOS.ESTADO FROM (SELECT USUARIO.ID_USUARIO, USUARIO.NOMBRES, PEDIDOS.ID_PEDIDO, PEDIDOS.ID_FOREIGN_ESTADO_PEDIDOS, PEDIDOS.ID_FOREIGN_FORMA_DE_PAGO FROM USUARIO INNER JOIN PEDIDOS ON USUARIO.ID_USUARIO = PEDIDOS.ID_FOREIGN_USUARIO) LISTA_PEDIDOS INNER JOIN ESTADO_PEDIDOS ON LISTA_PEDIDOS.ID_FOREIGN_ESTADO_PEDIDOS = ESTADO_PEDIDOS.ID_ESTADO_PEDIDO) LISTA_ESTADO_PEDIDOS INNER JOIN FORMA_DE_PAGO ON LISTA_ESTADO_PEDIDOS.ID_FOREIGN_FORMA_DE_PAGO = FORMA_DE_PAGO.ID_FORMA_DE_PAGO) LISTA_INFO_PEDIDOS INNER JOIN HISTORIAL ON LISTA_INFO_PEDIDOS.ID_PEDIDO = HISTORIAL.ID_FOREIGN_PEDIDO) LISTA_CODIGO_PRODUCTOS INNER JOIN PRODUCTO ON LISTA_CODIGO_PRODUCTOS.ID_FOREIGN_PRODUCTO = PRODUCTO.ID_PRODUCTO');
    if(Object.values(query).length === 0){
      return res.sendStatus(404);
    }
    res.status(200).send(query);
  } catch (e) {
    res.sendStatus(500);
  }
}

const pedidoUsuario = async function (req, res, next) {

  try {
    var [query, metadata] = await bd.conectorBD.query('SELECT LISTA_CODIGO_PRODUCTOS.*, PRODUCTO.NOMBRE, PRODUCTO.PRECIO FROM (SELECT LISTA_INFO_PEDIDOS.*, HISTORIAL.ID_FOREIGN_PRODUCTO FROM (SELECT LISTA_ESTADO_PEDIDOS.*, FORMA_DE_PAGO.METODO FROM (SELECT LISTA_PEDIDOS.*, ESTADO_PEDIDOS.ESTADO FROM (SELECT USUARIO.ID_USUARIO, USUARIO.NOMBRES, PEDIDOS.ID_PEDIDO, PEDIDOS.ID_FOREIGN_ESTADO_PEDIDOS, PEDIDOS.ID_FOREIGN_FORMA_DE_PAGO FROM USUARIO INNER JOIN PEDIDOS ON USUARIO.ID_USUARIO = PEDIDOS.ID_FOREIGN_USUARIO) LISTA_PEDIDOS INNER JOIN ESTADO_PEDIDOS ON LISTA_PEDIDOS.ID_FOREIGN_ESTADO_PEDIDOS = ESTADO_PEDIDOS.ID_ESTADO_PEDIDO) LISTA_ESTADO_PEDIDOS INNER JOIN FORMA_DE_PAGO ON LISTA_ESTADO_PEDIDOS.ID_FOREIGN_FORMA_DE_PAGO = FORMA_DE_PAGO.ID_FORMA_DE_PAGO) LISTA_INFO_PEDIDOS INNER JOIN HISTORIAL ON LISTA_INFO_PEDIDOS.ID_PEDIDO = HISTORIAL.ID_FOREIGN_PEDIDO) LISTA_CODIGO_PRODUCTOS INNER JOIN PRODUCTO ON LISTA_CODIGO_PRODUCTOS.ID_FOREIGN_PRODUCTO = PRODUCTO.ID_PRODUCTO WHERE LISTA_CODIGO_PRODUCTOS.ID_PEDIDO = ' + req.params.id_pedido + ' AND LISTA_CODIGO_PRODUCTOS.ID_USUARIO = ' + idUsuario);

    if(Object.values(query).length === 0){
      return res.sendStatus(404);
    }
    res.status(200).send(query);
  } catch (e) {
    res.sendStatus(500);
  }
}

const pedidoUser = async function (req, res, next) {
  console.log("historiaAllUsers")

  try {
    var [query, metadata] = await bd.conectorBD.query('SELECT LISTA_CODIGO_PRODUCTOS.*, PRODUCTO.NOMBRE, PRODUCTO.PRECIO FROM (SELECT LISTA_INFO_PEDIDOS.*, HISTORIAL.ID_FOREIGN_PRODUCTO FROM (SELECT LISTA_ESTADO_PEDIDOS.*, FORMA_DE_PAGO.METODO FROM (SELECT LISTA_PEDIDOS.*, ESTADO_PEDIDOS.ESTADO FROM (SELECT USUARIO.ID_USUARIO, USUARIO.NOMBRES, PEDIDOS.ID_PEDIDO, PEDIDOS.ID_FOREIGN_ESTADO_PEDIDOS, PEDIDOS.ID_FOREIGN_FORMA_DE_PAGO FROM USUARIO INNER JOIN PEDIDOS ON USUARIO.ID_USUARIO = PEDIDOS.ID_FOREIGN_USUARIO) LISTA_PEDIDOS INNER JOIN ESTADO_PEDIDOS ON LISTA_PEDIDOS.ID_FOREIGN_ESTADO_PEDIDOS = ESTADO_PEDIDOS.ID_ESTADO_PEDIDO) LISTA_ESTADO_PEDIDOS INNER JOIN FORMA_DE_PAGO ON LISTA_ESTADO_PEDIDOS.ID_FOREIGN_FORMA_DE_PAGO = FORMA_DE_PAGO.ID_FORMA_DE_PAGO) LISTA_INFO_PEDIDOS INNER JOIN HISTORIAL ON LISTA_INFO_PEDIDOS.ID_PEDIDO = HISTORIAL.ID_FOREIGN_PEDIDO) LISTA_CODIGO_PRODUCTOS INNER JOIN PRODUCTO ON LISTA_CODIGO_PRODUCTOS.ID_FOREIGN_PRODUCTO = PRODUCTO.ID_PRODUCTO WHERE LISTA_CODIGO_PRODUCTOS.ID_PEDIDO = ' + req.params.id_pedido + ' AND LISTA_CODIGO_PRODUCTOS.ID_USUARIO = ' + req.params.id_usuario);
    if(Object.values(query).length === 0){
      return res.sendStatus(404);
    }
    res.status(200).send(query);
  } catch (e) {
    res.sendStatus(500);
  }
}

const actualizarEstadoPedido = async function (req, res, next){

  if(Object.values(req.params).length === 0){
    return res.sendStatus(406);
  }

  if(typeof(req.body.id_foreign_estado_pedidos) !== 'number' || typeof(req.body.id_foreign_forma_de_pago) !== 'number'){
    return res.sendStatus(406);
  }

  var updatepairs = '';
  var keys = Object.keys(req.body);
  var valores = Object.values(req.body);

  keys.forEach((item, index) => {
    let propiedad = item.toString();
    if(index === keys.length-1){
        updatepairs += item.toString() + ' = ' + (typeof(valores[index]) === 'string' ? "'" + valores[index] + "'" : valores[index]);
    }else{
        updatepairs += item.toString() + ' = ' + (typeof(valores[index]) === 'string' ? "'" + valores[index] + "'" : valores[index]) + ', ';
    }
  });

  try {
    var [query, metadata] = await bd.conectorBD.query('UPDATE PEDIDOS SET ' + updatepairs + " WHERE ID_FOREIGN_USUARIO = " + req.params.id_usuario + " AND ID_PEDIDO = " + req.params.id_pedido);
    res.status(200).send(metadata);
  } catch (e) {
    res.sendStatus(500);
  }
}

const eliminarPedido = async function (req, res, next){

  if(Object.values(req.params).length === 0){
    return res.sendStatus(406);
  }
  try {
    var [query, metadata] = await bd.conectorBD.query('DELETE FROM PEDIDOS WHERE ID_PEDIDO = ' + req.params.id_pedido);
    if(metadata['affectedRows'] === 0){
      return res.sendStatus(404);
    }
    res.status(200).send(metadata);
  } catch (e) {
    return res.sendStatus(500);
  }
}

const crearPedido = async function (req, res, next){
  if(Object.keys(req.body).length === 0){
    return res.sendStatus(406);
  }

  if(!('id_foreign_estado_pedidos' in req.body) || !('id_foreign_forma_de_pago' in req.body) || !('id_foreign_user' in req.body) || !('lista_productos_pedido' in req.body)){
    return res.sendStatus(406);
  }

  var stringInsertValuesPedido = '(';
  var stringInsertValuesHistorial = '';
  var datosPedido = Object.values(req.body);
  var listaProductos = datosPedido[datosPedido.length-1];

  datosPedido.forEach((item, i) => {
    if(i >= datosPedido.length -1){
      ;
    }else if(i === datosPedido.length - 2){
      typeof(item) === 'string' ? stringInsertValuesPedido += "'" + item + "')" : stringInsertValuesPedido += item + ")";
    }else{
      typeof(item) === 'string' ? stringInsertValuesPedido += "'" + item + "', " : stringInsertValuesPedido += item + ", ";
    }
  });

  try {
    var [query, metadata] = await bd.conectorBD.query('INSERT INTO PEDIDOS (ID_FOREIGN_ESTADO_PEDIDOS, ID_FOREIGN_FORMA_DE_PAGO, ID_FOREIGN_USUARIO) VALUES ' + stringInsertValuesPedido);
  } catch (e) {
    return res.sendStatus(500);
  }

  try {
    var [query, metadata] = await bd.conectorBD.query('SELECT ID_PEDIDO FROM PEDIDOS ORDER BY ID_PEDIDO DESC LIMIT 1');
    var id_pedido = query[0]['ID_PEDIDO'];

    listaProductos.forEach((item, i) => {
      stringInsertValuesHistorial += "(" + id_pedido + ", ";
      if(i === listaProductos.length - 1){
        typeof(item) === 'string' ? stringInsertValuesHistorial += "'" + item + "')" : stringInsertValuesHistorial += item + ")";
      }else{
        typeof(item) === 'string' ? stringInsertValuesHistorial += "'" + item + "'), " : stringInsertValuesHistorial += item + "), ";
      }
    });
  } catch (e) {
    return res.sendStatus(500);
  }

  try {
    var [query, metadata] = await bd.conectorBD.query('INSERT INTO HISTORIAL (ID_FOREIGN_PEDIDO, ID_FOREIGN_PRODUCTO) VALUES ' + stringInsertValuesHistorial);
  } catch (e) {
    res.sendStatus(500);
  }
  res.sendStatus(200);
}

const menu = async function (req, res, next) {
  try {
    var [query, metadata] = await bd.conectorBD.query('SELECT * FROM PRODUCTO');
    if(!Object.values(query).length === 0){
      return res.sendStatus(404);
    }
    res.status(200).send(query);
  } catch (e) {
    res.sendStatus(500);
  }
}

const actualizarProducto = async function (req, res, next){

  if(Object.values(req.params).length === 0){
    return res.sendStatus(406);
  }

  var updatepairs = '';
  var keys = Object.keys(req.body);
  var valores = Object.values(req.body);

  keys.forEach((item, index) => {
    let propiedad = item.toString();
    if(index === keys.length-1){
        updatepairs += item.toString() + ' = ' + (typeof(valores[index]) === 'string' ? "'" + valores[index] + "'" : valores[index]);
    }else{
        updatepairs += item.toString() + ' = ' + (typeof(valores[index]) === 'string' ? "'" + valores[index] + "'" : valores[index]) + ', ';
    }
  });

  try {
    var [query, metadata] = await bd.conectorBD.query('UPDATE PRODUCTO SET ' + updatepairs + " WHERE ID_PRODUCTO = " + req.params.id_producto);
    if(Object.values(query).length === 0){
      return res.sendStatus(404);
    }
    res.status(200).send(metadata);
  } catch (e) {
    res.sendStatus(500);
  }
}

const eliminarProducto = async function (req, res, next){

  if(Object.values(req.params).length === 0){
    return res.sendStatus(406);
  }
  try {
    var [query, metadata] = await bd.conectorBD.query('DELETE FROM PRODUCTO WHERE ID_PRODUCTO = ' + req.params.id_producto);
    if(Object.values(query).length === 0){
      return res.sendStatus(404);
    }
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
}

const crearProducto = async function (req, res, next){

  if(Object.keys(req.body).length === 0){
    return res.sendStatus(406);
  }

  if(!('nombre' in req.body) || !('precio' in req.body)){
     return res.sendStatus(406);
  }

  var stringInsertValues = '(';
  var cadenas = '';
  var datosProducto = Object.values(req.body);

  datosProducto.forEach((item, i) => {

    if(i === datosProducto.length - 1){
      typeof(item) === 'string' ? stringInsertValues += "'" + item + "')" : stringInsertValues += item + ")";
    }else{
      typeof(item) === 'string' ? stringInsertValues += "'" + item + "', " : stringInsertValues += item + ", ";
    }
  });

  try {
    var [query, metadata] = await bd.conectorBD.query('INSERT INTO PRODUCTO (NOMBRE, PRECIO) VALUES ' + stringInsertValues);
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
  }
}

exports.userInfoByEmail = userInfoByEmail;
exports.userInfoByID = userInfoByID;
exports.verificarRol = verificarRol;
exports.validarEmail = validarEmail;
exports.singInUser = singInUser;
exports.usersProfile = usersProfile;
exports.eleminarUsuario = eleminarUsuario;
exports.actualizarUsuario = actualizarUsuario;
exports.usersProfileAll = usersProfileAll;
exports.historialPersonal = historialPersonal;
exports.historialUsuario = historialUsuario;
exports.historiaAllUsers = historiaAllUsers;
exports.pedidoUsuario = pedidoUsuario;
exports.pedidoUser = pedidoUser;
exports.actualizarEstadoPedido = actualizarEstadoPedido;
exports.eliminarPedido = eliminarPedido;
exports.crearPedido = crearPedido;
exports.menu = menu;
exports.actualizarProducto = actualizarProducto;
exports.eliminarProducto = eliminarProducto;
exports.crearProducto = crearProducto;
exports.extender = extender;
