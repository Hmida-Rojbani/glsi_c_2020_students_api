const mongoose = require('mongoose');
const mongo_debug = require('debug')('app:mongo');

module.exports = async function connect(url){
    try{
        await mongoose.connect(url,{ useNewUrlParser : true, useUnifiedTopology :true , useFindAndModify : true});
        mongo_debug('Mongo is Up.');
    }catch(err){
        mongo_debug(`Mongo is down, raison : ${err.message}`);
    }
}