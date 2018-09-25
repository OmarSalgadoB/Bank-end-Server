var moongose = require('mongoose');
var Schema = moongose.Schema; //guardamos en una variable el esquema y usamos la varible de monoose para llamar el esquema
//creamos el esquema para la colleccion de usuario y definmos los campos


var hospitalSchema = new Schema({
    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    img: { type: String, required: false },
    usuario: { type: Schema.Types.ObjectId, ref: 'Usuario' }
}, { collection: 'hospitales' });
module.exports = moongose.model('Hospital', hospitalSchema);