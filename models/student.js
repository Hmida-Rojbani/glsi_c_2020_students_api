const mongoose = require('mongoose');

const student_schema = new mongoose.Schema({
    name: {type : String, required : true},
    email: {type : String, required : true, unique : true},
    age: Number
});

const Student = mongoose.model('Student', student_schema);

module.exports = Student;
