const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/warbler', { useNewUrlParser: true }).then(() => {
    console.log(`Worker ${process.pid}`, "MongoDB server successfully connected");
}).catch(reason => {
    throw reason;
});

module.exports = mongoose;