const jwt = require('jsonwebtoken');
var tokenUser;

const autenticarIngresoJWT = function (req, res, next){
  if(!req.body.email || !req.body.password){

    return res.sendStatus(418);
  }
  let payload = {username: req.body.email, password: res.locals.password, admin: res.locals.rol};
  var accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    algorithm: "HS256",
    expiresIn: "1 day"
  });
  tokenUser = accessToken;
  res.locals.accessToken = accessToken;
  next();
};

const verificarToken = function(req, res, next){
  try{
    console.log(tokenUser);
    let token = jwt.verify(tokenUser, process.env.ACCESS_TOKEN_SECRET);
    console.log(token);
    console.log("Token valido");
    next();
  } catch(e){
    return res.sendStatus(401);
  }
}

exports.autenticarIngresoJWT = autenticarIngresoJWT;
exports.verificarToken = verificarToken;
