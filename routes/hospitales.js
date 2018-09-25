var express = require('express');
var app = express();
var Hospital = require('../models/hospital'); //importamos el modelo de la bd
var jwt = require('jsonwebtoken'); //para generar un token
var middleware = require('../moddlewares/autenticacion'); //lo impotamos para usar la funcion

// ==========================================
// Obtener todos los hospitales
// ==========================================
app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0; //guardamos en una varible la catidad de registros si no viene
    //la igualamos a 0
    desde = Number(desde); //seimpre la convertimos a tipo numerica
    Hospital.find({})
        .skip(desde) //para ir solicitado de 5 en 5
        .limit(10)
        .populate('usuario', 'nombre email') //para buscar la informacion de otra tabla
        .exec(
            (err, hospitales) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando hospital',
                        errors: err
                    });
                }

                Hospital.count({}, (err, conteo) => {
                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        hospitales: hospitales
                    });

                });


            });
});


// ==========================================
// Actualizar Hospital
// ==========================================
app.put('/:id', middleware.verificatoken, (req, res) => {

    var id = req.params.id;
    var body = req.body;

    Hospital.findById(id, (err, hospital) => {


        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar hospital',
                errors: err
            });
        }

        if (!hospital) {
            return res.status(400).json({
                ok: false,
                mensaje: 'El hospital con el id ' + id + ' no existe',
                errors: { message: 'No existe un hospital con ese ID' }
            });
        }


        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save((err, hospitalGuardado) => {

            if (err) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });

    });

});



// ==========================================
// Crear un nuevo hospital
// ==========================================
app.post('/', middleware.verificatoken, (req, res) => {

    var body = req.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save((err, hospitalGuardado) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al crear hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });


    });

});


// ============================================
//   Borrar un hospital por el id
// ============================================
app.delete('/:id', middleware.verificatoken, (req, res) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove(id, (err, hospitalBorrado) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error borrar hospital',
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return res.status(400).json({
                ok: false,
                mensaje: 'No existe un hospital con ese id',
                errors: { message: 'No existe un hospital con ese id' }
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });

});


module.exports = app;
//para poder esxport