var express = require('express');
var moongose = require('mongoose');

var app = express();
var Hospital = require('../models/hospital'); //importamos el modelo de la bd
var Medico = require('../models/medico');
var Usuario = require('../models/usuario');

//================================================================
//   BUSQUEDA POR COLLECTION
//=============================================================
app.get('/collection/:tabla/:busqueda', (req, res) => {

    var tabla = req.params.tabla; //recibimos esos parametros de la url
    var busqueda = req.params.busqueda;
    //creamos una expresion regular para que realize la busqueda en todo ya se a mayuscula o minusculo
    var regex = new RegExp(busqueda, 'i');
    var promesa;
    switch (tabla) {
        case 'usuarios':
            promesa = busquedaUsuario(busqueda, regex);
            break;
        case 'medicos':
            promesa = busquedaMedico(busqueda, regex);
            break;
        case 'hospitales':
            promesa = busquedaHospital(busqueda, regex);
            break;
        default:
            return res.status(400).json({

                ok: false,
                mensaje: 'Los tipos de busqueda solo son por usuario medicos y hospitales'
            });

    }

    promesa.then(data => {
        res.status(200).json({
            ok: true,
            [tabla]: data
        });
    });
});




//================================================================
//   BUSQUEDA GENERAL
//=============================================================
app.get('/todo/:busqueda', (req, res, next) => {
    //recibimos parametros a travez de la url
    //guardamos lo que venga por la url en una varibale
    var busqueda = req.params.busqueda;
    //creamos una expresion regular para que realize la busqueda en todo ya se a mayuscula o minusculo
    var regex = new RegExp(busqueda, 'i');
    //permite crear un arreglo de promesas  y que ejecuta una atras de otra apor asi decirlo
    //si todas las proimesas funcionan manda un then y si una falla un catch
    Promise.all([
            busquedaHospital(busqueda, regex),
            busquedaMedico(busqueda, regex),
            busquedaUsuario(busqueda, regex)
        ])
        .then(respuestas => { //recibes las respuesta de todas la promesas perotienes que seguir el mismo orden
            res.status(200).json({
                ok: true,
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuario: respuestas[2],
                mensaje: 'Estas realizando una busqueda general en la collecciones'

            });
        });
});

function busquedaHospital(busqueda, regex) {
    //retornamos una promesa como lo sabemos tiene un resolve y un reject
    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email') //para saber que usuario creo cada hospital y no muestre solo esos campos
            .exec((err, hospital) => {
                if (err) { //si hay un error  manda el reject
                    reject('Error al buscar hospital', err);
                } else { //si no hay errores entonses envia la data de los hospitales
                    resolve(hospital);
                }
            });
    });
}

function busquedaMedico(busqueda, regex) {
    //retornamos una promesa como lo sabemos tiene un resolve y un reject
    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital') //para saber a que hospital esta asignado
            .exec((err, medico) => {
                if (err) { //si hay un error  manda el reject
                    reject('Error al buscar medico', err);
                } else { //si no hay errores entonses envia la data de los hospitales
                    resolve(medico);
                }
            });
    });
}

function busquedaUsuario(busqueda, regex) {
    return new Promise((resolve, reject) => {

        Usuario.find({}, 'nombre email role') //para que solo nos muestre estos campos y no enseñe el password
            .or([{ 'nombre': regex }, { 'email': regex }])
            //usamos el metodo or para indicar sobre que campos se va a buscar y le pasamos la expresion regular
            .exec((err, usuario) => {
                if (err) {
                    reject('Errorar al buscar usuario', err);
                } else {
                    resolve(usuario);
                }
            });
    });
}
module.exports = app;
//para poder esxport