const { genKey, errors } = require('./lib');
const keyModel = require('../mongo');

// eslint-disable-next-line
async function createKey(context) {
	const keyType = context.content[0];
	const command = context.command;

	const newKeyType = command.requiredArgs.find((arg) => arg == keyType);

	if (!newKeyType) {
		return {
			success: false,
			err: errors.noMatchingArg.replace('{arg}', keyType).replace('{argNames}', command.requiredArgs.join(', ')),
			message: {
				color: 0xd51827,
				title: 'Given Key Type was not found',
				description: '**Key Types** : `renewal, lifetime, beta`',
			},
		};
	}
	const key = genKey();

	const modelOptions = { key: key, type: keyType };
	modelOptions.status = 'INACTIVE';

	const newKey = new keyModel(modelOptions);

	try {
		await newKey.save();
		return { success: true, err: null, message: {
			color: 0x62df3b,
			title: 'Key Successfully Created',
			description: `**KEY**: \`${newKey.key}\`\n**TYPE**: \`${newKey.type}\``,
		} };
	}
	catch (err) {
		return { success: false, err: err, message: {
			color: 0xd51827,
			title: 'Key Creation Failed',
			description: 'Key could not be saved to database. Check logs.',
		} };
	}
}

module.exports = createKey;