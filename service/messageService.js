const mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
const Message = require('./models/message');
const { isPalindrom } = require('../helpers/helpers');

mongoose.connect(process.env.MONGO_URI).then(
    () => {
        console.log('DB connected successfully!');
    },
    (err) => {
        console.log(`Failed to connect to database with error: ${err.toString()}. Exiting...`);
        process.exit(1);
    }
);

exports.getAllMessages = async (query) => {
    const page = +query.page || 1;
    const limit = +query.limit || 100;
    const skip = limit * (page - 1);
    const messages = await Message.find({ status: { $ne: 'Deleted' } })
        .skip(skip)
        .limit(limit);

    return messages;
};

exports.getMessageById = async (id) => {
    if (!ObjectId.isValid(id)) {
        throw new Error('Message not found');
    }
    const message = await Message.findOne({ _id: id, status: { $ne: 'Deleted' } });
    if (!message) {
        throw new Error('Message not found');
    }

    return message;
};

exports.createMessage = async (messageBody) => {
    try {
        messageBody.isPalindrom = isPalindrom(messageBody.text);
        const newMessage = await Message.create(messageBody);

        return newMessage;
    } catch (error) {
        throw error;
    }
};

exports.updateMessageById = async (id, messageBody) => {
    try {
        if (!ObjectId.isValid(id)) {
            throw new Error('Message not found');
        }

        const message = await Message.findOne({
            _id: id,
            status: { $ne: 'Deleted' },
        }).select({
            text: 1,
            isPalindrom: 1,
            updatedAt: 1,
            messageHistory: 1,
        });

        if (!message) {
            throw new Error('Message not found');
        }

        if (messageBody.text != message.text) {
            messageBody.status = 'Updated';
            messageBody.isPalindrom = isPalindrom(messageBody.text);
            message.messageHistory.push({
                text: message.text,
                isPalindrom: message.isPalindrom,
                updatedAt: message.updatedAt,
            });
            messageBody.messageHistory = message.messageHistory;
        }

        const updatedMessage = await Message.findByIdAndUpdate(id, messageBody, {
            new: true,
            runValidators: true,
        });

        if (!updatedMessage) {
            throw new Error("Couldn't update the message");
        }

        return updatedMessage;
    } catch (error) {
        throw error;
    }
};

exports.deleteMessageById = async (id) => {
    try {
        if (!ObjectId.isValid(id)) {
            throw new Error('Message not found');
        }

        const message = await Message.findOneAndUpdate(
            { _id: id, status: { $ne: 'Deleted' } },
            { status: 'Deleted', dateDeleted: new Date().toISOString() },
            { new: true, runValidators: true }
        );
        if (!message) {
            throw new Error('Message not found');
        }
    } catch (error) {
        throw error;
    }
};
