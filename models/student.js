const mongoose = require('mongoose');
const Joi = require('joi');

const student_schema = new mongoose.Schema({
    name: {type : String, required : true},
    email: {type : String, required : true, unique : true},
    age: Number
});

const student_validation_schema = {
    name : Joi.string().min(5).required(),
    email : Joi.string().email().required(),
    age : Joi.number().positive()
}
const student_update_validation_schema = {
    name : Joi.string().min(5),
    email : Joi.string().email(),
    age : Joi.number().positive()
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
