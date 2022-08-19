const { verifyPassword, hashPassword } = require("../core/password");
const { generateJWT, verifyJWT } = require("../core/jwt");
const { getChildLogger } = require("../core/logger");
const Role = require("../core/roles");
const ServiceError = require("../core/serviceError.js")

const userRepository = require("../repository/user");

/**
 * Only return the public information about the given user.
 */

 const debugLog = (message = {}) => {
  if (!this.logger) this.logger = getChildLogger('user-service');
  this.logger.debug(message);
};

const makeExposedUser = ({ id, name, email, phonenumber, roles }) => ({
	id,
	name,
	email,
	phonenumber,
	roles,
});

/**
 * Create the returned information after login.
 */

const makeLoginData = async (user) => {
	const token = await generateJWT(user);

	return {
		user: makeExposedUser(user),
		token,
	};
};

/**
 * Try to login a user with the given username and password.
 *
 * @param {string} email - The email to try.
 * @param {string} password - The password to try.
 *
 * @returns {Promise<object>} - Promise whichs resolves in an object containing the token and signed in user.
 */

const login = async (email, password) => {
	const user = await userRepository.findByEmail(email);

	if (!user) {
		// DO NOT expose we don't know the user
		throw ServiceError.unauthorized(
			"The given email and password do not match"
		);
	}

	const passwordValid = await verifyPassword(password, user.password_hash);

	if (!passwordValid) {
		// DO NOT expose we know the user but an invalid password was given
		throw ServiceError.unauthorized(
			"The given email and password do not match"
		);
	}

	return await makeLoginData(user);
};

/**
 * Register a new user
 *
 * @param {object} user - The user's data.
 * @param {string} user.name - The user's name.
 */

const register = async ({ name, surname, email, phonenumber, password }) => {
	debugLog("Creating a new user", name );
	const passwordHash = await hashPassword(password);

	const user = await userRepository.create({
		name,
		surname,
		email,
		phonenumber,
		passwordHash,
		roles: [Role.USER],
	});

	return await makeLoginData(user);
};

const getAll = async (limit = 100, offset = 1) => {
	const data = await userRepository.findAll({ limit, offset });
	const count = await userRepository.findCount();
	return {
		data,
		count,
		limit,
		offset,
	};
};

const getById = (id) => {
	return userRepository.findById(id);
};

const create = ({ surname, name, email, password_hash, phonenumber }) => {
	return userRepository.create({
		surname,
		name,
		email,
		password_hash,
		phonenumber,
	});
};

const updateById = (
	id,
	{ surname, name, email, password_hash, phonenumber }
) => {
	const updatePlace = { surname, name, email, password_hash, phonenumber };
	return userRepository.updateById(id, updatePlace);
};

const deleteById = async (id) => {
	await userRepository.deleteById(id);
};

const checkAndParseSession = async (authHeader) => {
	if (!authHeader) {
		throw ServiceError.unauthorized("You need to be signed in");
	}

	if (!authHeader.startsWith("Bearer ")) {
		throw ServiceError.unauthorized("Invalid authentication token");
	}

	const authToken = authHeader.substr(7);
	try {
		const { roles, userId } = await verifyJWT(authToken);

		return {
			userId,
			roles,
			authToken,
		};
	} catch (error) {
		const logger = getChildLogger("user-service");
		logger.error(error.message, { error }); //
		throw error.message;
	}
};

/**
 * Check if the given roles include the given required role.
 *
 * @param {string} role - Role to require.
 * @param {string[]} roles - Roles of the user.
 *
 * @returns {void} Only throws if role not included.
 *
 * @throws {ServiceError} One of:
 * - UNAUTHORIZED: Role not included in the array.
 */

const checkRole = (role, roles) => {
	const hasPermission = roles.includes(role);

	if (!hasPermission) {
		throw ServiceError.forbidden(
			"You are not allowed to view this part of the application"
		);
	}
};

module.exports = {
	login,
	register,
	getAll,
	getById,
	create,
	updateById,
	deleteById,
	checkAndParseSession,
	checkRole,
};
