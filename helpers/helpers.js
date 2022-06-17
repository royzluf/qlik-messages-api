exports.isPalindrom = (messagee = '') => {
    messagee = messagee.trim();
    const reverseMessage = messagee.split('').reverse().join('');
    return messagee === reverseMessage || false;
};
