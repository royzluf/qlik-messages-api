const service = require('../service/messageService');

const responseFactory = (res, statusCode, statusMessage, params) => {
    return res.status(statusCode).json({ status: statusMessage, ...params });
};

exports.getAllMessages = async (req, res) => {
    try {
        const messages = await service.getAllMessages();
        responseFactory(res, 200, 'Success', { requestedAt: req.requestTime, results: messages.length, data: { messages } });
    } catch (error) {
        responseFactory(res, 404, 'fail', { message: error.message });
    }
};

exports.getMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await service.getMessageById(id);
        responseFactory(res, 200, 'Success', { requestedAt: req.requestTime, data: { message } });
    } catch (error) {
        responseFactory(res, 404, 'fail', { message: error.message });
    }
};

exports.createMessage = async (req, res) => {
    try {
        const messageBody = { ...req.body };
        const newMessage = await service.createMessage(messageBody);
        responseFactory(res, 201, 'success', { requestedAt: req.requestTime, data: { message: newMessage } });
    } catch (error) {
        responseFactory(res, 400, 'fail', { message: error.message });
    }
};

exports.updateMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const messageBody = { ...req.body };
        const message = await service.updateMessageById(id, messageBody);
        responseFactory(res, 200, 'success', { requestedAt: req.requestTime, data: { message } });
    } catch (error) {
        responseFactory(res, 400, 'fail', { message: error.message });
    }
};

exports.deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;
        await service.deleteMessageById(id);
        responseFactory(res, 204, 'success', { data: null });
    } catch (error) {
        responseFactory(res, 400, 'fail', { message: error.message });
    }
};
