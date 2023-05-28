const mongoose = require('mongoose');
const validator = require('validator');

const messageSchema = new mongoose.Schema(
    {
        sender: {
            email: {
                type: String,
                required: true,
                trim: true,
                lowercase: true,
                validate(value) {
                    if (!validator.isEmail(value)) {
                        throw new Error('Email is invalid.');
                    }
                },
            },
            username: {
                type: String,
                required: true,
                trim: true,
                lowecase: true,
            },
        },
        chatroom: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Room',
        },
        text: {
            type: String,
            trim: true,
            required: true,
        },
    },
    {
        timestamps: true,
    }
)

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;