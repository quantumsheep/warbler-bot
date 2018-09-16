const db = require('../db');

const schema = new db.Schema({
    discordid: { type: String, required: true },
    server: { type: String, required: true },
    posts: { type: Number, required: true, default: 1 }
});

const model = db.model('Member', schema);

module.exports = model;