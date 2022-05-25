exports.isPalindrom = (message) => {
    message = message.trim();
    const reverseMessage = message.split('').reverse().join('');
    return message === reverseMessage || false;
};
