const bcrypt = require('bcryptjs');

module.exports = {
    encryptAsync: (text) => {
        return new Promise((resolve, reject) => {
            bcrypt.genSalt(10, (err, salt) => {
                if (err) return reject(err);
                bcrypt.hash(text, salt, (err, hash) => {
                    if (err) return reject(err);
                    resolve(hash);
                });
            });
        });
    },
    compareEncriptedAsync: (text, encryptedText) => {
        return new Promise((resolve, reject) => {
            bcrypt.compare(text, encryptedText, (err, res) => {
                return err ? reject(err) : resolve(res)
            });
        });
    }
}