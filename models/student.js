const mongoose = require('mongoose');
const Joi = require('joi');
Joi.objectid = require('joi-objectid')(Joi);

const student_schema = new mongoose.Schema({
    name: {type : String, required : true},
    email: {type : String, required : true, unique : true},
    age: Number,
    extra_price : {type : Number ,required : function () { return this.age > 25}, min : 100, max : 500},
    class_room : {
        _id : {type : mongoose.Schema.ObjectId, ref : 'ClassRoom'},
        name : {type : String, required : true, enum : ['DMWM','GLSI','SSIR','DSEN']}
    }
});

const student_validation_schema = {
    name : Joi.string().min(5).required(),
    email : Joi.string().email().required(),
    age : Joi.number().positive(),
    extra_price : Joi.number().positive(),
    class_room : {
        _id : Joi.objectid().required()
    }
}
const student_update_validation_schema = {
    name : Joi.string().min(5),
    email : Joi.string().email(),
    age : Joi.number().positive(),
    extra_price : Joi.number().positive(),
    min_age : Joi.number().positive(),
    max_age : Joi.number().positive(),
    part_name : Joi.string(),
    class_room : {
        _id : Joi.objectid()
    }
}

function student_valid_data(student) {
    let results = Joi.validate(student, student_validation_schema);
    return results.error;
}

student_schema.statics.student_valid_data = student_valid_data;

student_schema.statics.student_valid_data_update = function (student) {
    let results = Joi.validate(student, student_update_validation_schema);
    return results.error;
}

const Student = mongoose.model('Student', student_schema);

module.exports = Student;
