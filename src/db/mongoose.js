const mongoose = require('mongoose')

mongoose.connect('mongodb+srv://root:12345@cluster0.9oqkhso.mongodb.net/test', {
    dbName: 'chat-app'

})
.then( () => console.log("connected to Mongo"))
.catch((err) => console.log('DB connection err: '+ err))



