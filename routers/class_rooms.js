const router = require('express').Router();
const { ClassRoom, class_room_not_valide } = require('../models/class_room');
const _ = require('lodash');

router.get('',async (req,res)=>{
    const class_rooms = await ClassRoom.find();
    if(class_rooms.length ===0 )
        return res.status(204).end();
    res.send(class_rooms);
});

router.post('',async (req,res)=>{
    let errors;
    if(errors=class_room_not_valide(req.body))
        return res.status(400).send(errors.details[0].message)
    let class_room = new ClassRoom(_.pick(req.body,['name','nb_student','modules']));
    try{
        class_room = await class_room.save();
        return res.status(201).send(class_room);
    }catch(err){
        return res.status(400).send(`DB error : ${err.message}`)
    }
    
});

module.exports = router;