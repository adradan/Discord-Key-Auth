// eslint-disable-next-line
async function help(context) {
	return {
		success: true,
		err: null,
		message: {
			color: 0x0061f5,
			title: 'Auth Help <:notepad_spiral:807258289837441094>',
			fields: [
				{
					name: '!bind KEY',
					value: 'Binds your key to your Discord account',
					inline: false,
				},
				{
					name: '!unbind KEY',
					value: 'Unbinds your key from your Discord account',
					inline: false,
				},
				{
					name: '!info',
					value: 'Displays basic information about your subscription',
					inline: false,
				},
				{
					name: '!help',
					value: 'Displays this help menu',
					inline: true,
				},
			],
			footer: {
				text: 'Get more info in your dashboard',
			},
		},
	};
}

module.exports = help;