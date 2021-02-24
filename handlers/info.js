const utils = require('./lib/utils');
const { dashboardLink } = require('../config');

async function keyInfo(context) {
	const message = context.message;
	const user = await utils.findUser(message.author.id);

	if (!user) {
		return {
			success: false,
			err: `${message.author.id} was not found in DB`,
			message: {
				color: 0xd51827,
				title: 'No Key Info Found <:octagonal_sign:807456341593423902>',
				description: `There is no key bound to your Discord account.\n\nKeys can be binded through the **[dashboard](${dashboardLink})** or with **!bind KEY**`,
			},
		};
	}
	const nextRenewal = user.nextRenewal
		? (user.nextRenewal + '').split('T')[0]
		: user.type.toUpperCase();

	const embed = {
		color: 0x0061f5,
		title: 'Key Info <:notepad_spiral:807258289837441094>',
		fields: [
			{
				name: 'Key',
				value: `\`${user.key}\``,
				inline: true,
			},
			{
				name: 'Renewal Date',
				value: `\`${nextRenewal}\``,
				inline: true,
			},
		],
		footer: {
			text: 'Get more info in your dashboard',
		},
	};
	return { success: true, err: null, message: embed };
}

module.exports = keyInfo;
