const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
    {
        text: {
            type: String,
            required: [true, 'A message must have text'],
            trim: true,
        },
        isPalindrom: Boolean,
        status: { type: String, default: 'New' },
        dateDeleted: Date,
        messageHistory: [{ text: String, isPalindrom: Boolean, updatedAt: Date }],
    },
    { timestamps: true, versionKey: false }
);

const Message = mongoose.model('message', messageSchema);

module.exports = Message;
