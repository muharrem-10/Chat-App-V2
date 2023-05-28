
const mongoose = require('mongoose');
const CustomError = require('../error/CustomError');

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: true,
    },
})

const Room = mongoose.model('Room', roomSchema);

module.exports = Room;