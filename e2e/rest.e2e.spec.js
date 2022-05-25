const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/../config/config.env` });
const assert = require('assert');
const axios = require('axios').default;
const Message = require('../service/models/message');
const mongoose = require('mongoose');

const HOST_URL = process.env.HOST_URL.replace('<PORT>', process.env.PORT) || 'http://localhost:3000';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/local';

describe('Qlik Messages - e2e Tests', function () {
    this.beforeEach(async function () {
        try {
            await mongoose.connect(MONGO_URI);
            await Message.deleteMany({});
        } catch (err) {
            console.log(`Failed to connect to database with error: ${err.toString()} .Exiting`);
        }
    });
    this.afterAll(async function () {
        await Message.deleteMany({});
    });

    describe('REST api interface', function () {
        describe('List messages', function () {
            it('Should return an empty array of results', async function () {
                try {
                    const res = await axios.get(`${HOST_URL}/messages`);
                    assert.equal(res.data.results, 0);
                } catch (err) {
                    throw err;
                }
            });
        });

        describe('Create a new message', function () {
            describe('Positive e2e', function () {
                it('Should create a new message successfully', async function () {
                    try {
                        const res = await axios.post(`${HOST_URL}/messages`, {
                            text: 'lorem ipsum',
                        });
                        assert.equal(res.data.status, 'success');
                        assert.equal(res.status, 201);
                    } catch (err) {
                        throw err;
                    }
                });
            });
            describe('Negative e2e', function () {
                it('Should fail in case of passing a wrong input field', function () {
                    return axios
                        .post(`${HOST_URL}/messages`, {
                            wrongtext: 'lorem ipsum',
                        })
                        .then(
                            () => {
                                throw new Error('should have failed');
                            },
                            (err) => {
                                assert.equal(err.response.status, 400);
                            }
                        );
                });
            });
        });

        describe('Create and retrieve one', function () {
            it('Create one messages and retrieve it', async function () {
                try {
                    let res = await axios.post(`${HOST_URL}/messages`, {
                        text: 'message',
                    });
                    const messageId = res.data.data.message._id;
                    res = await axios.get(`${HOST_URL}/messages/${messageId}`);
                    assert.equal(res.status, 200);
                } catch (err) {
                    throw err;
                }
            });
        });

        describe('Create and retrieve all', function () {
            it('Create 2 messages and retrieve them', async function () {
                try {
                    await axios.post(`${HOST_URL}/messages`, {
                        text: 'first message',
                    });

                    await axios.post(`${HOST_URL}/messages`, {
                        text: 'escond message',
                    });

                    const res = await axios.get(`${HOST_URL}/messages`);
                    assert.equal(res.data.results, 2);
                } catch (err) {
                    throw err;
                }
            });
        });

        describe('Update a message', function () {
            describe('Positive e2e', function () {
                it('Should create a new message and update it successfully', async function () {
                    try {
                        const message = await axios.post(`${HOST_URL}/messages`, {
                            text: 'original text',
                        });

                        const messageId = message.data.data.message._id;
                        const newText = 'new text';
                        await axios.patch(`${HOST_URL}/messages/${messageId}`, {
                            text: newText,
                        });

                        const res = await axios.get(`${HOST_URL}/messages/${messageId}`);

                        assert.equal(res.data.data.message.text, newText);
                    } catch (err) {
                        throw err;
                    }
                });
            });

            describe('Negative e2e', function () {
                it('Should fail in case the message does not exist', function () {
                    return axios
                        .patch(`${HOST_URL}/messages/123`, {
                            text: 'new text',
                        })
                        .then(
                            () => {
                                throw new Error('should have failed');
                            },
                            (err) => {
                                assert.equal(err.response.data.message, 'Message not found');
                                assert.equal(err.response.status, 400);
                            }
                        );
                });
            });
        });

        describe('Delete a message', function () {
            describe('Positive e2e', function () {
                it('Should create a new message and delete it successfully', async function () {
                    let messageId = 0;
                    try {
                        const message = await axios.post(`${HOST_URL}/messages`, {
                            text: 'text to be deleted',
                        });

                        messageId = message.data.data.message._id;
                        await axios.delete(`${HOST_URL}/messages/${messageId}`);
                    } catch (err) {
                        throw err;
                    }

                    axios.get(`${HOST_URL}/messages/${messageId}`).then(() => {
                        throw new Error('Should have failed');
                    });
                });
            });

            describe('Negative e2e', function () {
                it('Should fail in case the message does not exist', function () {
                    return axios.delete(`${HOST_URL}/messages/123`).then(
                        () => {
                            throw new Error('should have failed');
                        },
                        (err) => {
                            assert.equal(err.response.data.message, 'Message not found');
                            assert.equal(err.response.status, 400);
                        }
                    );
                });
            });
        });
    });

    describe('REST functionality', function () {
        describe('Check isPalindrom', function () {
            describe('Positive e2e', function () {
                it('Should create a palindrom message and mark it as palindrom', async function () {
                    const message = await axios.post(`${HOST_URL}/messages`, {
                        text: 'abba',
                    });

                    assert.equal(message.data.data.message.isPalindrom, true);
                });
            });

            describe('Negative e2e', function () {
                it('Should create a non palindrom message and not mark it as palindrom', async function () {
                    const message = await axios.post(`${HOST_URL}/messages`, {
                        text: 'text',
                    });

                    assert.equal(message.data.data.message.isPalindrom, false);
                });
            });
        });

        describe('Message history', function () {
            it('Should return correct history of message', async function () {
                try {
                    const message = await axios.post(`${HOST_URL}/messages`, {
                        text: 'original text',
                    });

                    const messageId = message.data.data.message._id;

                    await axios.patch(`${HOST_URL}/messages/${messageId}`, {
                        text: 'new text',
                    });

                    const res = await axios.get(`${HOST_URL}/messages/${messageId}`);

                    assert.equal(res.data.data.message.text, 'new text');
                    assert.equal(res.data.data.message.messageHistory.at(-1).text, 'original text');
                } catch (err) {
                    throw err;
                }
            });
        });
    });
});
