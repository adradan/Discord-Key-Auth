const genKey = function genKey() {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
	let result;

	const format = ['XXXX', 'XXXX', 'XXXX', 'XXXX'];
	// eslint-disable-next-line
	result = format.map(() => {
		let section = '';
		while (section.length !== 4) {
			section += characters.charAt(Math.floor(Math.random() * characters.length));
		}
		return section;
	}).join('-');

	return result;
};

module.exports = genKey;