const service = require('../service/messageService');
const AppError = require('../utils/appError');

const responseFactory = (res, statusCode, statusMessage, params) => {
    return res.status(statusCode).json({ status: statusMessage, ...params });
};

exports.getAllMessages = async (req, res, next) => {
    try {
        const messages = await service.getAllMessages(req.query);
        responseFactory(res, 200, 'Success', { requestedAt: req.requestTime, results: messages.length, data: { messages } });
    } catch (error) {
        next(new AppError(error.message, 404));
    }
};

exports.getMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const message = await service.getMessageById(id);
        responseFactory(res, 200, 'Success', { requestedAt: req.requestTime, data: { message } });
    } catch (error) {
        next(new AppError(error.message, 404));
    }
};

exports.createMessage = async (req, res, next) => {
    try {
        const messageBody = { ...req.body };
        const newMessage = await service.createMessage(messageBody);
        responseFactory(res, 201, 'success', { requestedAt: req.requestTime, data: { message: newMessage } });
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

exports.updateMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        const messageBody = { ...req.body };
        const message = await service.updateMessageById(id, messageBody);
        responseFactory(res, 200, 'success', { requestedAt: req.requestTime, data: { message } });
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};

exports.deleteMessage = async (req, res, next) => {
    try {
        const { id } = req.params;
        await service.deleteMessageById(id);
        responseFactory(res, 204, 'success', { data: null });
    } catch (error) {
        next(new AppError(error.message, 400));
    }
};
