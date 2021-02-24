class Command {
	constructor(commandName, length, handler, options = {}) {
		const { argName, requiredArgs, authorizedUsers } = options;
		this.commandName = commandName;
		this.length = length;
		this.handler = handler;
		this.argName = argName || null;
		this.requiredArgs = requiredArgs || null;
		this.authorizedUsers = authorizedUsers || null;
	}
}

module.exports = Command;