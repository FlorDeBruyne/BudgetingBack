const { tables, getKnex } = require("../data/index");
const { getChildLogger } = require("../core/logger");
const uuid = require("uuid");

const findAll = ({ limit, offset }) => {
	return getKnex()(tables.category)
		.select()
		.limit(limit)
		.offset(offset)
		.orderBy("name", "ASC");
};

const findById = async (id) => {
	return await getKnex()(tables.category).where("id", id);
};

const findByName = async (name) => {
	return await getKnex()(tables.category).where("name", name);
};

const findCount = async () => {
	const [count] = await getKnex()(tables.category).count();
	return count["count(*)"];
};

const create = async ({ name }) => {
	try {
		const id = uuid.v4();
		await getKnex()(tables.category).insert({
			id,
			name,
		});
		return findById(id);
	} catch (error) {
		const logger = getChildLogger("category-repo");
		logger.error("Error in create", { error });
		throw error;
	}
};

const updateById = async (id, name) => {
	try {
		await getKnex()(tables.category).update({ name }).where("id", id);

		return await findById(id);
	} catch (error) {
		const logger = getChildLogger("category-repo");
		logger.error("Error in updateById", { error });
		throw error;
	}
};

const deleteById = async (id) => {
	try {
		const rowAffected = await getKnex()(tables.category)
			.delete()
			.where("id", id);
		return rowAffected > 0;
	} catch (error) {
		const logger = getChildLogger("category-repo");
		logger.error("Error in deleteById");
		throw error;
	}
};

module.exports = {
	findAll,
	findById,
	findByName,
	findCount,
	create,
	updateById,
	deleteById,
};
