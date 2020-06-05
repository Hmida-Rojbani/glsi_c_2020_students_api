const router = require('express').Router();
const Student = require('../models/student');
const validateObjectId = require('../middlewares/validateObjectId');
const _ = require('lodash');

router.get(['','/'], async (req,res) =>{
    let students = await Student.find();
    if(students.length == 0)
        return res.status(204).send();
    res.send(students);
});

router.get('/id/:id',validateObjectId, async (req,res) =>{
    let student = await Student.findById(req.params.id);
    if(!student)
        return res.status(404).send('Student with given ID is not found.');
    res.send(student);
});

router.post(['','/'], async (req,res) =>{
    let body_errors = Student.student_valid_data(req.body);
    if(body_errors)
        return res.status(400).send(body_errors.details[0].message);
    let student = new Student(_.pick(req.body,['name','email','age']));
    try{
        student = await student.save();
        res.status(201).send(student);
    }catch(err){
        return res.status(400).send(`DB error : ${err.message}`);
    }
    
});


module.exports = router;