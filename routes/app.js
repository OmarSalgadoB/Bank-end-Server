//requires   son importaciones de 3 o personalidas es para que funcione algo
var express = require('express');
var moongose = require('mongoose');



//inicializar variables aki es donde usamos esa librea
var app = express();



app.get('/', (req, res, next) => {
    //en la respuesta mandamos un estatus del servidor esto es muy importante para un bacenk server
    res.status(200).json({ //mandamos la respuesta de tipo json
        ok: true,
        mensaje: 'Peticion realizada correctamente'

    })
})

module.exports = app;
//para poder esxport