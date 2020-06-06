const url = 'mongodb+srv://user:1234@mongoformation-xc16w.mongodb.net/glsiC?retryWrites=true&w=majority';
require('./db/connection')(url);

const express = require('express');
const morgan = require('morgan');
const port = process.env.PORT || 3000;
const app_debug = require('debug')('app:debug');
const student_router=require('./routers/students');
const class_room_router=require('./routers/class_rooms');
const app = express();

app.use(express.json());
if(app.get('env') === 'development')
    app.use(morgan('dev'));
app.use('/api/students',student_router);
app.use('/api/classrooms',class_room_router);

app.listen(port, () => app_debug(`Server running on ${port}...`));
