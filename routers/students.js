const router = require('express').Router();
const Student = require('../models/student');
const { ClassRoom } = require('../models/class_room');
const validateObjectId = require('../middlewares/validateObjectId');
const _ = require('lodash');

router.get(['','/'], async (req,res) =>{
    let students = await Student.find();
    if(students.length == 0)
        return res.status(204).send();
    res.send(students);
});

router.get('/details', async (req,res) =>{
    let students = await Student.find().populate('class_room._id');
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
    let student = new Student(_.pick(req.body,['name','email','age','class_room']));
    //update to use class_room model
    let class_room = await ClassRoom.findById(student.class_room._id);
    if(!class_room)
        return res.status(400).send('ClassRoom with given ID is not found.');
    student.class_room.name = class_room.name;
    try{
        student = await student.save();
        class_room.nb_student +=1;
        class_room.students.push(student._id);
        await class_room.save();
        res.status(201).send(student);
    }catch(err){
        return res.status(400).send(`DB error : ${err.message}`);
    }
    
});



router.delete('/id/:id',validateObjectId, async (req,res) =>{
    let student = await Student.findByIdAndRemove(req.params.id);
    if(!student)
        return res.status(404).send('Student with given ID is not found.');
    let class_room = await ClassRoom.findById(student.class_room._id);
    class_room.nb_student -=1;
    class_room.students=class_room.students.filter(st=> st != student._id.toString());
    await class_room.save();
    res.send(student);
});

router.put('/id/:id',validateObjectId, async (req,res) =>{
    let student = await Student.findById(req.params.id);
    if(!student)
        return res.status(404).send('Student with given ID is not found.');
    let body_errors = Student.student_valid_data_update(req.body);
    if(body_errors)
        return res.status(400).send(body_errors.details[0].message);
    let old_class_room_id = student.class_room._id;
    student = _.merge(student,req.body);
    try{
        
        if(req.body.class_room._id)
            {
                let old_class_room = await ClassRoom.findById(old_class_room_id);
                old_class_room.nb_student -=1;
                old_class_room.students=old_class_room.students.filter(st=> st != student._id.toString());
                await old_class_room.save();
                let class_room = await ClassRoom.findById(student.class_room._id);
                class_room.nb_student += 1;
                class_room.students.push(student._id);
                await class_room.save();
                student.class_room.name = class_room.name;
            }
        student = await student.save();
        res.status(200).send(student);
    }catch(err){
        return res.status(400).send(`DB error : ${err.message}`);
    }
});

// search with student cntain part of the name % like
router.get('/name/like/:part_name', async (req,res) =>{
    let params_errors = Student.student_valid_data_update(req.params);
    if(params_errors)
        return res.status(400).send(params_errors.details[0].message);
    const students = await Student.find({name : {$regex : req.params.part_name, $options:"i"}})
                                    .select('name');
    if(students.length == 0)
        return res.status(204).send();
    res.send(students);
});

// count students with a specific age
router.get('/count/age/:age', async (req,res) =>{
    let params_errors = Student.student_valid_data_update(req.params);
    if(params_errors)
        return res.status(400).send(params_errors.details[0].message);
    const students = await Student.find({age : req.params.age});
                                    
    res.send(`${students.length} is the number of students with the age ${req.params.age}`);
});

// count students in an interval of ages
router.get('/count/age/:min_age/:max_age', async (req,res) =>{
    let params_errors = Student.student_valid_data_update(req.params);
    if(params_errors)
        return res.status(400).send(params_errors.details[0].message);
    if(req.params.min_age > req.params.max_age)
        return res.status(400).send('min_age must be less or equals max_age');
    const students = await Student.find({age :{ $gte :  req.params.min_age, $lte :  req.params.max_age}});
                                    
    res.send(`${students.length} is the number of students with the age  between [${req.params.min_age},${req.params.max_age}]`);
});


module.exports = router;