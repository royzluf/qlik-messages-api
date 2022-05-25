const mongoose = require('mongoose');
const express = require('express');
const app = express();
const morgan = require('morgan');
const messageRouter = require('./routes/message');

//#region Middlewares

// Show requests details in cl - Development mode
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Database not connected error
app.use((_, res, next) => {
    if (!mongoose.connection.readyState) {
        res.status(500).json({ status: 'fail', message: 'Database not connected' });
        return;
    }
    next();
});

// Parse request.body
app.use(express.json());

app.use((req, _, next) => {
    req.requestTime = new Date().toISOString();
    // console.log(req.method);
    // console.log(req.get('User-Agent'));
    next();
});

//#endregion Middlewares

//#region Routers

app.use('/messages/', messageRouter);

//#endregion

module.exports = app;
