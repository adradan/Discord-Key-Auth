const mongoose = require('mongoose');

const keySchema = new mongoose.Schema({
	key: {
		type: String,
		validate: [
			function(v) {
				const format = /([a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4})/g;
				const keyMatch = v.match(format);
				return (keyMatch.length === 1);
			},
			'{VALUE} is not in the correct format',
		],
		required: [true, 'Key is required'],
	},
	discordId: Number,
	type: {
		type: String,
		enum: ['renewal', 'lifetime', 'beta'],
		required: [true, 'Key type is required'],
	},
	status: {
		type: String,
		enum: ['ACTIVE', 'INACTIVE'],
		required: [true, 'Key status is required'],
	},
	lastRenewal: Date,
	nextRenewal: Date,
});

module.exports = keySchema;