const express = require('express');
const app = express();
const morgan = require('morgan');
const messageRouter = require('./routes/message');

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

//#endregion

module.exports = app;
