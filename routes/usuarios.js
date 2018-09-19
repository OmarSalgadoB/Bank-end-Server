var express = require('express'); // var bodyParser = require('body-parser')
var app = express(); //importamos la libreria para encryptar
var bcrypt = require('bcryptjs'); //importando el modelo dela base de mongo
var Usuario = require('../models/usuario');
var jwt = require('jsonwebtoken'); //para generar un token
//var semilla = require('../config/config').semilla; //para usar las varibles globales de configuracion
var middleware = require('../moddlewares/autenticacion'); //lo impotamos para usar la funcion


//obtener todos los usuarios
app.get('/', (req, res, next) => {
    //usamos la variable del modelo y gracias a mooogose podemos hacer consultas find({}
    Usuario.find({}, 'nombre email img role')
        .exec(
            (err, usuario) => {
                //podemor recibir un error o la data si todo sale bien
                if (err) { //si hay un error
                    return res.status(500).json({ //retorna un status 500 de algo salo mal 
                        ok: false,
                        mensaje: 'Error en Base de datos nene',
                        errors: err //manda un objeto de tipo err
                    });
                }
                //si no sucede nada de eso entonses has esto
                res.status(200).json({
                    ok: true,
                    mensaje: 'Petcion de Data de Usuarios :: Ok',
                    Usuarios: usuario //aquiva la data del usuario es redundate poner del tipo usuario
                })
            })
});








//===============================================================
//Actualizar Uusuario
//=============================================================
//en la url  tenemos que enviar forzozamente el id
app.put('/:id', middleware.verificatoken, (req, res) => {
    var body = req.body; //variable para guardar si encuentra al usuario
    var id = req.params.id; //guardamos el id en una variable
    //usamos la varible del esquema de mooongose el cual trae el metodo findbyid recibe el id, error o el 
    //usuario de la bd si lo encuentra 
    Usuario.findById(id, (err, usuario) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar usuario',
                errors: err
            });
        }
        if (!usuario) { //si no viene un usuario
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id' + id + 'no existe',
                errors: err
            });
        }
        //si no entra en ninguno de los 2 if 
        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;
        //se  reasignan los nuevos valores en las variables
        usuario.save((err, usuarioGuardado) => {
            //manejamos el error por si manda algun campo vacio
            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar el usuario',
                    errors: err
                });
            }
            usuarioGuardado.password = ':)';
            //si todo sale bien guarda la  data y manda esto
            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });
    });
});






// ==========================================
// Crear un nuevo usuario
// ==========================================
app.post('/', middleware.verificatoken, (req, res) => {
    //creamos un metodo post para la ruta usuarios
    var body = req.body;
    //cramos una varible y ledecimos que va cager ugiarl a la respuesta que traiga el body
    var usuario = new Usuario({ //usamos el esquema  de mooongose
        nombre: body.nombre, //para insetar los datos
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });
    //usamos la varible de tipo usuario para guradar la data
    usuario.save((err, usuarioGuardado) => {
        //si trae un error por ejem,plo un campo que es requeriso y no lo envio manda esto
        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear usuario',
                errors: err
            });
        }
        //si todo sale bien guarda la  data y manda esto
        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuariotoken: req.usuario
        });


    });

});

// ==========================================
// Borrar un usuario por el id
// ==========================================
app.delete('/:id', middleware.verificatoken, (req, res) => {
    var id = req.params.id; //obtenemos el id a travez de la url
    Usuario.findByIdAndRemove(id, (err, usuarioBorrado) => {
        //usamos la variable del esquema de moongose u usamos su metodo 
        if (err) { //si hay un  errir
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al eliminar el usuario',
                errors: err
            });
        }
        if (!usuarioBorrado) { //si no viene un usuario borrado
            return res.status(400).json({
                ok: false,
                mensaje: 'El usuario con el id  no existe'
            });
        }
        //si todo sale bien guarda la  data y manda esto
        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado //muestra el suaurio borrado

        });

    });
});
module.exports = app;
//para poder esxport