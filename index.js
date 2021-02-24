const Discord = require('discord.js');
const handlers = require('./handlers');
const { errors } = require('./handlers/lib');

const client = new Discord.Client();
const { TOKEN, adminRoles, serverId, commandChannelId } = require('./config');
const Command = require('./command');

const commands = {
	allocate: new Command('allocate', 1, handlers.createKey, {
		argName: 'KEY_TYPE',
		requiredArgs: ['lifetime', 'renewal', 'beta'],
		authorizedUsers: adminRoles,
	}),
	bind: new Command('bind', 1, handlers.bindKey, {
		argName: 'KEY',
	}),
	unbind: new Command('unbind', 1, handlers.unbindKey, {
		argName: 'KEY',
	}),
	help: new Command('help', 0, handlers.help),
	info: new Command('info', 0, handlers.info),
};

function checkArgLength(command, args) {
	if (args.length < command.length) {
		return {
			color: 0xd51827,
			title: 'Missing Arguments',
			description: errors.missingArg
				.replaceAll('{argName}', command.argName)
				.replace('{command}', command.commandName),
		};
	} else if (args.length > command.length) {
		return {
			color: 0xd51827,
			title: 'Too Many Arguments',
			description: errors.tooManyArgs
				.replaceAll('{argName}', command.argName)
				.replace('{command}', command.commandName),
		};
	} else {
		return false;
	}
}

async function parseMessage(message) {
	let content = message.content.split(' ');

	// Only allows in staff-commands channel and messages
	if (message.channel.id != commandChannelId && message.guild !== null) {
		return;
	}

	if (!content[0].startsWith('?')) return;

	if (commands[content[0].split('?')[1]]) {
		const command = commands[content[0].split('?')[1]];
		content = content.splice(1);

		const err = checkArgLength(command, content);

		if (err) {
			message.channel.send({ embed: err });
			return;
		}

		if (command.authorizedUsers) {
			const discordServer = await client.guilds.fetch(serverId);
			const user = await discordServer.members.fetch(message.author.id);

			if (
				!user.roles.cache.some((role) => {
					let authorized = false;
					for (const id of command.authorizedUsers) {
						if (id === role.id) {
							authorized = true;
							break;
						}
					}
					return authorized;
				})
			) {
				return;
			}
		}

		const status = await command.handler({
			content: content,
			command: command,
			message: message,
			client: client,
		});

		if (!status.success) {
			console.log(status.err);
			message.channel.send({ embed: status.message });
			return;
		}

		message.channel.send({ embed: status.message });
	}
}

client.once('ready', () => {
	console.log('Signed in.');
});

client.on('message', async (message) => {
	await parseMessage(message);
});

client.login(TOKEN);
