const mongoose = require('mongoose');
const Joi = require('joi');


const class_room_schema = new mongoose.Schema({
    name : {type: String, required : true, enum : ['DMWM','GLSI','SSIR','DSEN']},
    nb_student : {type : Number, default : 0},
    modules : [String],
    students : [{type : mongoose.Schema.ObjectId, ref : 'Student', default : []}]
});

const class_room_validation_schema= {
    name: Joi.string().length(4).required(),
    nb_student: Joi.number().positive(),
    modules: Joi.array().items(Joi.string().min(3))

}

function class_room_not_valide(clas_room) {
    var results = Joi.validate(clas_room, class_room_validation_schema);
    return results.error;
}

const ClassRoom = mongoose.model('ClassRoom', class_room_schema);

module.exports.ClassRoom =ClassRoom;
module.exports.class_room_not_valide =class_room_not_valide;