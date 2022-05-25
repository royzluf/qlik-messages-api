const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../config/config.env` });
const axios = require('axios').default;
const HOST_URL = process.env.HOST_URL.replace('<PORT>', process.env.PORT) || 'http://localhost:3000';

exports.getAllMessages = async function () {
    try {
        const res = await axios.get(`${HOST_URL}/messages`);
        console.log({ status: res.data.status, results: res.data.results, messages: res.data.data.messages });
    } catch (err) {
        console.log(err.response.data);
    }
};

exports.getMessageById = async function (id) {
    try {
        const res = await axios.get(`${HOST_URL}/messages/${id}`);
        console.log(res.data);
    } catch (err) {
        console.log(err.response.data);
    }
};

exports.createMessage = async function (text) {
    try {
        const res = await axios.post(`${HOST_URL}/messages`, { text });
        console.log(res.data);
    } catch (err) {
        console.log(err.response.data);
    }
};

exports.updateMessage = async function (messageId, text) {
    try {
        const res = await axios.patch(`${HOST_URL}/messages/${messageId}`, { text });
        console.log(res.data);
    } catch (err) {
        console.log(err.response.data);
    }
};

exports.deleteMessage = async function (messageId) {
    try {
        const res = await axios.delete(`${HOST_URL}/messages/${messageId}`);
        console.log({ status: res.status, statusText: res.statusText });
    } catch (err) {
        console.log(err.response.data);
    }
};
