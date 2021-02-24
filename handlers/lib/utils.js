const keyModel = require('../../mongo');

async function findKey(key) {
	const options = { key: key };
	return await keyModel.findOne(options).exec();
}

async function checkFormat(key) {
	const format = /([a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4})/g;
	const keyMatch = key.match(format);
	return (keyMatch.length === 1);
}

async function findUser(id) {
	const options = { discordId: id };
	return await keyModel.findOne(options).exec();
}

module.exports = {
	findKey: findKey,
	checkFormat: checkFormat,
	findUser: findUser,
};