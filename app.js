const express = require('express');
const app = express();
const morgan = require('morgan');
const messageRouter = require('./routes/message');
const AppError = require('./utils/appError');

//#region Middlewares

// Show requests details in cl - Development mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Parse request.body
app.use(express.json());

//#endregion Middlewares

//#region Routers

app.use('/messages/', messageRouter);

app.all('*', (req, res, next) => {
    const appError = new AppError(`Can't find ${req.originalUrl} on this server`, 404);
    next(appError);
});

//#endregion

//#region Global error handling Middleware

app.use((err, _, res, __) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    res.status(err.statusCode).json({ status: err.status, message: err.message });
});

//#endregion Global error handling Middleware

module.exports = app;
