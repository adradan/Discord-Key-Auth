const keyModel = require('../mongo');
const utils = require('./lib/utils');
const { memberRoleId, serverId } = require('../config');

async function unbindKey(context) {
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
					'Key Unbinding Failed <:octagonal_sign:807456341593423902>',
				description:
					'Key not found. If you believe this is an error, please contact our support team.',
			},
		};
	}

	if (foundKey.discordId !== +message.author.id) {
		return {
			success: false,
			err: `Key does not belong to ${message.author.id}`,
			message: {
				color: 0xd51827,
				title:
					'Key Unbinding Failed <:octagonal_sign:807456341593423902>',
				description:
					'Invalid Key. If you believe this is an error, please contact our support team.',
			},
		};
	}
	if (foundKey.status === 'INACTIVE') {
		return {
			success: false,
			err: 'Key is not binded',
			message: {
				color: 0xd51827,
				title:
					'Key Unbinding Failed <:octagonal_sign:807456341593423902>',
				description:
					'Key is not binded. If you believe this is an error, please contact our support team.',
			},
		};
	}

	const options = {
		$unset: { discordId: 1 },
		status: 'INACTIVE',
	};

	const updatedKey = await keyModel.updateOne({ key: foundKey.key }, options);

	if (updatedKey.n !== 1) {
		return {
			success: false,
			err: 'Corresponding Key was not found.',
			message: {
				color: 0xd51827,
				title:
					'Key Unbinding Failed <:octagonal_sign:807456341593423902>',
				description:
					'An unexpected error occurred, please contact our support team.',
			},
		};
	} else {
		const server = await client.guilds.fetch(serverId);
		const user = await server.members.fetch(message.author.id);

		await user.roles.remove(memberRoleId, 'Unbinded Key');

		return {
			success: true,
			err: null,
			message: {
				color: 0x62df3b,
				title: 'Key Successfully Unbinded <:tada:807461040601563186>',
				description:
					'Key successfully unbinded from your Discord account.',
			},
		};
	}
}

module.exports = unbindKey;
