// chat app
const path = require('path')
const http = require('http')
const mongoose = require('mongoose')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
require('./db/mongoose')
const User = require('./models/user')
require('dotenv').config();

const {generateMessage, generateLocationMessage} = require('./utils/messages')
const  { deleteRoomForUser, joinRoomForUser , getUsersInRoom} = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT
const publicDirectoryPath = path.join(__dirname, '../public')

app.use(express.static(publicDirectoryPath))

io.on('connection', (socket) => {
    console.log('New WebSocket connection')

    socket.on('create', ({username, email, gender, age, password, room}, callback) => {
        console.log("worked")

                User.create({
                    id: socket.id,
                    username: username,   
                    email: email,
                    gender: gender,
                    age: age,
                    password: password,
                    room: room
                }).then((user) => {
                    console.log(user)  //object döner
                    callback() // başarılı olunca geri arama fonksiyonunu çağırın
                }).catch((error) => {
                    console.log(error)
                    if(error instanceof mongoose.Error.ValidationError && error.errors.email){
                        callback(error.errors.email.message)
                    }else if(error instanceof mongoose.Error.ValidationError && error.errors.age){
                        callback(error.errors.age.message)
                    }else if(error instanceof mongoose.Error.ValidationError && error.errors.password){
                        callback(error.errors.password.message)
                    }else if(error.keyPattern.username){
                        callback("username already in use") 
                    }else{
                        callback("email already in use")
                    }
                })
    })
    

    socket.on('join', ({username, room, password}, callback) => { 

        joinRoomForUser(username, room, socket.id)

        User.findOne({username: username, password: password})
        .then((user) => {
            console.log(user.room)
            socket.join(user.room)

            socket.emit('message',generateMessage('Admin', 'welcome!'))
            socket.broadcast.to(user.room).emit('message',generateMessage('Admin',user.username + ' has joined!'))

            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUsersInRoom(user.room)
            })

            callback()
        })
        .catch((error) => {
            callback("kullanıcı kaydı bulunamadı " + error.message)
        })

        // socket.emit -> that sends an event specific client
        // io.emit --> sends every connected client
        // socket.broadcast.emit --> sends every connected clients except socket one (yani kendisine)

    })

    socket.on('sendMessage', ({username, messages}, callback) => {
        const filter = new Filter()
      
        console.log(socket.id)
        User.findOne({ username: username })
          .then((user) => {
        
            if (filter.isProfane(messages)) {
                return callback('profanity is not allowed')
            }
            console.log(messages)
            
            io.to(user.room).emit('message', generateMessage(user.username, messages))
            callback()
            })
      })
      

    socket.on('sendLocation', ({username, latitude, longitude}, callback) => {

        User.findOne({username: username})
        .then((user) => {
            io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,"https://google.com/maps?q=" + latitude +','+ longitude))
            callback()
        })
        .catch((error) => {
            callback(error)
        })

        
    })

    socket.on('disconnect', async () => {
        try {
            console.log(socket.id)
            const user = await deleteRoomForUser(socket.id)
    
            if(user){
                io.to(user.room).emit('message', generateMessage('admin', user.username +' has left!'))
                io.to(user.room).emit('roomData',{
                    room: user.room,
                    users: getUsersInRoom(user.room)
                })
            }
        } catch (error) {
            console.log(error)
        }
    })
    
})

server.listen(port, () => {
    console.log(`Server is up on port ${port}!`)
})