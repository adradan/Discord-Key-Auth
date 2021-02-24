const mongoose = require('mongoose');
const schemas = require('./handlers/lib').schemas;
const { mongoUri } = require('./config');

// eslint-disable-next-line
mongoose.connect(mongoUri, { useNewUrlParser: true });
const db = mongoose.connection;
db.once('open', () => console.log('Connected to MongoDB.'));
const keyModel = mongoose.model('keys', schemas);

module.exports = keyModel;
