var express = require('express');
var fileUpload = require('express-fileupload'); //para la libreria dre subir archivos
var app = express();
var fs = require('fs'); //libreria file system para poder borrar
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');
app.use(fileUpload()); //para pasar por el middleware

app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo; //guardamos lo que venga por el ulr en esas avaribles
    var id = req.params.id;

    //tipos de colleciones

    var tiposValidos = ['hospitales', 'medicos', 'usuarios'];

    if (tiposValidos.indexOf(tipo) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Tipo no valido!!',
            errors: { message: 'debes selecionar tipo valido:  ' + tiposValidos.join(', ') }
        });
    }


    //si en la respuesta no vienen archivos mandamos un error
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono ningun archivo',
            errors: { message: 'debes selecionar una imagen' }
        });
    }
    //obtenemos el nombre del archivo
    var archivo = req.files.imagen; //guardamos en una varoble el nombre del archivo que viene en el request
    var extencion = archivo.name.split('.'); //sacamo la extencion del archivo 
    var extencionfinal = extencion[extencion.length - 1]; //guardamos en una varible la extencion final del arreglo
    //solo estas extenciones aceptamos
    var extencionesValidad = ['png', 'jpg', 'gif', 'jpeg'];
    //si no encuentra la extencion en el arreglo es menor a 0
    if (extencionesValidad.indexOf(extencionfinal) < 0) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extencion no valida!!',
            errors: { message: 'debes selecionar una imagen con extencion::::' + extencionesValidad.join(', ') }
        });
    }

    //nombre de archivo personalizado
    var nombreArchivo = `${id}-${ new Date().getMilliseconds()}.${extencionfinal}`;

    //mover el archivo de un temporal a un path
    var path = `./uploads/${tipo}/${nombreArchivo}`;

    archivo.mv(path, err => {

        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo!!',

            });
        }
    });

    subirporTipo(tipo, id, nombreArchivo, res); //llamara a la funcion
    // res.status(200).json({
    //     ok: true,
    //     mensaje: 'Peticion pasa subir  archivos',
    //     extencion: extencion,
    //     extencionfinal: extencionfinal,
    //     message: 'El archivo fue movido exitosamente'

    // })
})


function subirporTipo(tipo, id, nombreArchivo, res) {

    if (tipo === 'usuarios') {
        //usamos el modelo para pordelo buscar por el id
        Usuario.findById(id, (err, usuario) => {

            if (!usuario) { //si el usuario no existe
                return res.status(400).json({
                    ok: true,
                    mensaje: 'El suario no existe',
                    error: { message: 'El usuario no exoiste' }

                });
            }



            var pathViejo = './uploads/usuarios/' + usuario.img; //usuario.img es la propiedade de la bs

            if (fs.existsSync(pathViejo)) { //si existe el path viejo con esto lo eliminamos
                fs.unlink(pathViejo); //con esto eliminamos de forma asicnrona
            }
            usuario.img = nombreArchivo;
            usuario.save((err, usuarioActualizado) => {
                usuarioActualizado.password = ':)'; //para no mandar el password en este proceso
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario Actualizada',
                    usuario: usuarioActualizado

                });

            });

        });

    }
    if (tipo === 'medicos') {

        Medico.findById(id, (err, medico) => {

            if (!medico) { //si el medico no existe
                return res.status(400).json({
                    ok: true,
                    mensaje: 'El medico no existe',
                    error: { message: 'El medico no exoiste' }

                });
            }
            var pathViejo = './uploads/medicos/' + medico.img; //usuario.img es la propiedade de la bs

            if (fs.existsSync(pathViejo)) { //si existe el path viejo con esto lo eliminamos
                fs.unlink(pathViejo); //con esto eliminamos de forma asicnrona
            }

            medico.img = nombreArchivo;
            medico.save((err, medicoActualizado) => {
                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Medico Actualizada',
                    medico: medicoActualizado

                });
            });

        });

    }
    if (tipo === 'hospitales') {

        Hospital.findById(id, (err, hospital) => {

            if (!hospital) { //si el usuario no existe
                return res.status(400).json({
                    ok: true,
                    mensaje: 'El hospital no existe',
                    error: { message: 'El hospital no existe' }

                });
            }
            var pathViejo = './uploads/hospitales/' + hospital.img; //usuario.img es la propiedade de la bs
            if (fs.existsSync(pathViejo)) { //si existe el path viejo con esto lo eliminamos
                fs.unlink(pathViejo); //con esto eliminamos de forma asicnrona
            }

            hospital.img = nombreArchivo;
            hospital.save((err, hospitalActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de Hospital Actualizada',
                    medico: hospitalActualizado

                });

            });

        });
    }

}
module.exports = app;