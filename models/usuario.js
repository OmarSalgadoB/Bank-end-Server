var moongose = require('mongoose'); //importamos la libreria y la guardamos en una variable
var uniqueValidator = require('mongoose-unique-validator'); //importamos la libreria para validaciones de moongose


var Schema = moongose.Schema; //guardamos en una variable el esquema y usamos la varible de monoose para llamar el esquema
//creamos el esquema para la colleccion de usuario y definmos los campos
var rolesValidos = {
        values: ['ADMIN_ROLE', 'USER_ROLE'],
        message: '{VALUE} No es un role Valido'
    }
    //creamos una varible de tipo objeto con los roles permitidos
var usuarioSchema = new Schema({
    //le decimos que va a ser de tipo string que es requerido y si no lo pone que envie mensaje
    nombre: { type: String, required: [true, 'El nombre es Nesesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es Nesesario'] },
    password: { type: String, required: [true, 'La contraseña es requerida'] },
    img: { type: String },
    role: { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }, //enumeramos los roles
    //required si es obligatorio y se queremos que envie mensaje va entre corchetes
    //default le ponemos un valor por defecto
    google: { type: Boolean, default: false }
});
usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser unico' });
//le decimos que este esquema va a usar el pugin le pasamos la varible de la libreria
//PARA QUE AGARE EL VALOR DEL CAMPO {PATH} y mande mensaje
module.exports = moongose.model('Usuario', usuarioSchema)
    //para exportalo es el module.exports = usamos el moonise el modelo y le damos el nombre que queramos
    //y depues le pasamos el objeto de js con el cual queremos que se relacione