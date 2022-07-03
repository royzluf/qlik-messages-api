module.exports = {
    isPalindrom: (message = '') => {
        message = message.trim();
        const reverseMessage = message.split('').reverse().join('');
        return message === reverseMessage || false;
    },

    isPalindromAsync: async (message = '', callback = null) => {
        const isPalindrom = module.exports.isPalindrom;
        if (callback) {
            return setTimeout(() => callback(isPalindrom(message)), 2000);
        }

        return isPalindrom(message);
    },

    isPalindromAsync2: (message = '', callback = null) => {
        const isPalindrom = module.exports.isPalindrom;
        if (callback) {
            return setTimeout(() => callback(isPalindrom(message)), 2000);
        }

        return new Promise((reslove, reject) => {
            resolve(isPalindrom(message));
        });
    },
};
