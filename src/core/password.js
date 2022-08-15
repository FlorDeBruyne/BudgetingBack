const config = require("config");
const bcrypt = require("bcryptjs");

const BCRYPT_SALT_LENGTH = 16; //config.get('auth.bcrypt.saltLength'); still problem with config
const BCRYPT_TIME_COST = 2 ** 17; //config.get('auth.bcrypt.timeCost'); still problem with config

module.exports.hashPassword = async (password) => {
	return await bcrypt.hash(password, BCRYPT_SALT_LENGTH);
};

module.exports.verifyPassword = async (password, passwordHash) => {
	return await bcrypt.compare(password, passwordHash);
};
