//requires   son importaciones de 3 o personalidas es para que funcione algo
var express = require('express')
var moongose = require('mongoose')

//inicializar variables aki es donde usamos esa librea

var app = express();

//conexion a la base de datos
moongose.connection.openUri('mongodb://localhost:27017/hospitaDB', (err, res) => {
    //cons esta instrucion validamos que si no conecta a la base de datos o algo sale mal pare todo
    if (err) throw err;
    console.log('Conexion a MongoDB exitosa')
})

//rutas

app.get('/', (req, res, next) => {
    //en la respuesta mandamos un estatus del servidor esto es muy importante para un bacenk server
    res.status(200).json({ //mandamos la respuesta de tipo json
        ok: true,
        mensaje: 'Peticion realizada correctamente'

    })
})

//eschuchar peticiones

app.listen(3000, () => { //usamos la varibale y con listen lo ponemos a la eschucha en el puerto 3000
        console.log('Servidor express arrba online')
    })
    //creamos una fucnion de flecha para  que nos mande un mensaje por consola