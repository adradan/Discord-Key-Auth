const keyModel = require('../mongo');
const utils = require('./lib/utils');
const { serverId, memberRoleId } = require('../config');

async function bindKey(context) {
	const key = context.content[0];
	const message = context.message;
	const client = context.client;

	const foundKey = await utils.findKey(key);
	if (!foundKey || !(await utils.checkFormat(key))) {
		return {
			success: false,
			err: 'Key not found',
			message: {
				color: 0xd51827,
				title:
					'Key Binding Failed <:octagonal_sign:807456341593423902>',
				description:
					'Key was not found. If you feel this is an error, please reach out to our support team.',
			},
		};
	}

	if (
		foundKey.status === 'ACTIVE' &&
		foundKey.discordId !== message.author.id
	) {
		return {
			success: false,
			err: 'Key already binded',
			message: {
				color: 0xd51827,
				title:
					'Key Binding Failed <:octagonal_sign:807456341593423902>',
				description:
					'Key is already bound. If you feel this is an error, please reach out to our support team.',
			},
		};
	}

	const modelOptions = {
		key: foundKey.key,
		discordId: message.author.id,
		type: foundKey.type,
		status: 'ACTIVE',
	};
	const date = new Date();

	if (foundKey.type === 'renewal') {
		modelOptions.lastRenewal = date.setDate(date.getDate());
		modelOptions.nextRenewal = date.setDate(date.getDate() + 30);
	}

	const updatedKey = await keyModel.updateOne(
		{ key: foundKey.key },
		modelOptions
	);

	if (updatedKey.n !== 1) {
		return {
			success: false,
			err: 'Corresponding Key was not found.',
			message: {
				color: 0xd51827,
				title:
					'Key Binding Failed <:octagonal_sign:807456341593423902>',
				description:
					'An unexpected error occurred. Please try again, or contact our support team.',
			},
		};
	} else {
		const server = await client.guilds.fetch(serverId);
		const user = await server.members.fetch(message.author.id);
		await user.roles.add(memberRoleId, 'Binded Key');

		return {
			success: true,
			err: null,
			message: {
				color: 0x62df3b,
				title: 'Key Successfully Binded <:tada:807461040601563186>',
				description: 'Key successfully binded to your Discord account!',
			},
		};
	}
}

module.exports = bindKey;
