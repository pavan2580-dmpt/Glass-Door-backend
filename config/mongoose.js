const mongoose = require('mongoose');
let _db;

module.exports = {
    connectToServer() {
        return new Promise((resolve, reject) => {
            mongoose.connect(process.env.MONGO_URI);
            const db = mongoose.connection;
            db.on('error', () => {
                console.error.bind(console, "connection error:");
                reject('connection fail');
            });
            db.once('open', () => {
                resolve(db);
            })
        })
    },
    getDb() {
        return _db;
    }
}