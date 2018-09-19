var express = require('express'); //si la importamos porque sera una ruta
var bcrypt = require('bcryptjs'); //validaremos que el password este encritado
var jwt = require('jsonwebtoken'); //para generar un token
var app = express(); //para levantar la variable del express
var Usuario = require('../models/usuario'); //importando el modelo dela base de mongo
var semilla = require('../config/config').semilla; //para usar las varibles globales de configuracion
app.post('/', (req, res) => {
    var body = req.body; //CAPTURAMOS TODO LÑO QUE TRAE EL BODY
    //USAMOS LA VARIABLE DEL ESQUEMA PARA USAR SU METODO
    Usuario.findOne({ email: body.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al  LOGEARSE',
                errors: err
            });
        }
        if (!usuarioBD) { //SI NO EXISTE UN USUARIO CON ESE CORREO EN LABD
            return res.status(400).json({
                ok: false,
                mensaje: 'Credeciales Incorrectas -email',
                errors: err
            });
        }
        //validacion de contraseña  vamos a comprar si lo que escribe el usuario es igual a lo que esta en la BD
        if (!bcrypt.compareSync(body.password, usuarioBD.password)) {

            return res.status(400).json({
                ok: false,
                mensaje: 'Credeciales Incorrectas -password',
                errors: err
            });
        }
        //SI YA PASO TODAS ESAS VALIDACIONES SERIA HORA DE CREAR EL TOKEN
        usuarioBD.password = ':)'; //para no mandar el password en el token
        //guardamos en un avarible el token que recibe el objeto una descripcion la escojemos nosotros y fecha expir
        var token = jwt.sign({ usuario: usuarioBD }, semilla, { expiresIn: 14400 }) //4hrs

        //es la firma por asi decirlo para que sea valido tec-Izt-'

        res.status(200).json({
            ok: true,
            mensaje: 'Credenciales Correctas',
            usuario: usuarioBD,
            token: token,
            id: usuarioBD._id
        });
    });
});
module.exports = app;