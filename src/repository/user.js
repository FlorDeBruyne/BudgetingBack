const { tables, getKnex } = require("../data/index");
const { getChildLogger } = require("../core/logger");
const uuid = require("uuid");

const findAll = ({ limit, offset }) => {
	return getKnex()(tables.user)
		.select()
		.limit(limit)
		.offset(offset)
		.orderBy("name", "ASC");
};

const findById = async (id) => {
	return await getKnex()(tables.user).where("id", id);
};

const findByEmail = async (email) => {
	return await getKnex()(tables.user).where("email", email).first();
};

const create = async ({
	surname,
	name,
	email,
	passwordHash,
	phonenumber,
	roles,
}) => {
	try {
		const id = uuid.v4();
		await getKnex()(tables.user).insert({
			id,
			surname,
			name,
			email,
			password_hash: passwordHash,
			phonenumber,
			roles: JSON.stringify(roles),
		});
		return findById(id);
	} catch (error) {
		const logger = getChildLogger("users-repo");
		logger.error("Error in create", { error });
		throw error;
	}
};

const updateById = async (id, { surname, name, email, phonenumber }) => {
	try {
		await getKnex()(tables.user)
			.update({
				surname,
				name,
				email,
				phonenumber,
			})
			.where("id", id);

		return await findById(id);
	} catch (error) {
		const logger = getChildLogger("users-repo");
		logger.error("Error in updateByid", { error });
		throw error;
	}
};

const findCount = async () => {
	const [count] = await getKnex()(tables.user).count();
	return count["count(*)"];
};

const deleteById = async (id) => {
	try {
		const rowAffected = await getKnex()(tables.user).delete().where("id", id);

		return rowAffected > 0;
	} catch (error) {
		const logger = getChildLogger("users-repo");
		logger.error("Error in deleteById", { error });
		throw error;
	}
};

module.exports = {
	findAll,
	findById,
	findByEmail,
	findCount,
	create,
	updateById,
	deleteById,
};
