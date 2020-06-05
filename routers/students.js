const router = require('express').Router();
const Student = require('../models/student');
const _ = require('lodash');

router.get(['','/'], async (req,res) =>{
    let students = await Student.find();
    if(students.length == 0)
        return res.status(204).send();
    res.send(students);
});

router.post(['','/'], async (req,res) =>{
    let student = new Student(_.pick(req.body,['name','email','age']));
    student = await student.save();
    res.status(201).send(student);
});


module.exports = router;