const mongoose = require('mongoose')
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URL, {
    dbName: 'chat-app'

})
.then( () => console.log("connected to Mongo"))
.catch((err) => console.log('DB connection err: '+ err))



