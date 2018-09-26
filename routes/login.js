var express = require('express'); //si la importamos porque sera una ruta
var bcrypt = require('bcryptjs'); //validaremos que el password este encritado
var jwt = require('jsonwebtoken'); //para generar un token
var app = express(); //para levantar la variable del express
var Usuario = require('../models/usuario'); //importando el modelo dela base de mongo
var semilla = require('../config/config').semilla; //para usar las varibles globales de configuracion

// GOOGLE
var CLIENT_ID = require('../config/config').CLIENT_ID; //UTILIZAMOS LA VARIBLE GLONAL 
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

//==========================================================================
//Autenticacion por google 
//=========================================================================
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}



app.use('/:google/', async(req, res) => {

    var token = req.body.token;
    var googleUser = await verify(token)
        .catch(e => {
            return res.status(400).json({
                ok: false,
                mensaje: 'Credenciales Incorrectas de gooogleee'
            });
        });
    //ahora com valido que el usuario este en mi Base de datos
    Usuario.findOne({ email: googleUser.email }, (err, usuarioBD) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error el correo no se encuenta en la BD',
                errors: err
            });
        }
        if (usuarioBD) { //SI SI VIENE EL SUARIO DE BASE DE DATOS QUE HACEMOS
            if (usuarioBD.google === false) { //si ya gfue autentificado por google
                return res.status(500).json({
                    ok: false,
                    mensaje: 'Debe de usar su autentificacion normal'

                });
            } else {
                var token = jwt.sign({ usuario: usuarioBD }, semilla, { expiresIn: 14400 }) //4hrs    
                res.status(200).json({
                    ok: true,
                    mensaje: 'Credenciales Correctas',
                    usuario: usuarioBD,
                    token: token,
                    id: usuarioBD._id
                });
            }
        } else {
            //el suario no existe hay que crearlo.....
            var usuario = new Usuario();
            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';
            //para grabarlo en nuestra base de datos
            usuario.save((err, usuarioBD) => {
                var token = jwt.sign({ usuario: usuarioBD }, semilla, { expiresIn: 14400 }) //4hrs    
                res.status(200).json({
                    ok: true,
                    mensaje: 'Credenciales Correctas',
                    usuario: usuarioBD,
                    token: token,
                    id: usuarioBD._id
                });
            });
        }
    });


    // return res.status(200).json({
    //     ok: true,
    //     mensaje: 'Credenciales Correctas de gooogleee',
    //     usurioGoogle: googleUser

    // });
});


//==========================================================================
//Autenticacion Normal
//=========================================================================
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