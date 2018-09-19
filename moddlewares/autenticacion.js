var jwt = require('jsonwebtoken'); //para generar un token
var semilla = require('../config/config').semilla; //para usar las varibles globales de configuracion

exports.verificatoken = function(req, res, next) { //para poder usar esta funcion desde afuera

    var token = req.query.token; //guardamos lo de la solicitud en la varible osea el token
    jwt.verify(token, semilla, (err, decode) => {
        if (err) {
            return res.status(401).json({
                mensaje: 'Error  usuario no authorizado',
                errors: err
            });
        }
        req.usuario = decode.usuario; //para que cuando hagamos una peticion envia la informacion del usuario
        //antes de pasar al next
        next(); //si todo sale bien le dice al milddelware que siga con la ejecuicion
        // res.status(200).json({
        //     ok: true,
        //     decode: decode
        // });
    });

}

// ==========================================
// Verificar Token  Moddelware porque las ruta de aki para abajo nesesitan autentificar
// ==========================================
// app.use('/', (req, res, next) => {

//     var token = req.query.token; //guardamos lo de la solicitud en la varible osea el token
//     jwt.verify(token, semilla, (err, decode) => {
//         if (err) {
//             return res.status(401).json({
//                 mensaje: 'Error  usuario no authorizado',
//                 errors: err
//             });
//         }
//         next(); //si todo sale bien le dice al milddelware que siga con la ejecuicion
//     });
// });