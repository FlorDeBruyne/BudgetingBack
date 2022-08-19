const { tables, getKnex } = require("../data/index");
const { getChildLogger } = require("../core/logger");
const uuid = require("uuid");

const findAll = ({ limit, offset }) => {
	return getKnex()(tables.factsGent)
		.select()
		.limit(limit)
		.offset(offset)
		.orderBy("title", "ASC");
};

const findById = async (id) => {
	return await getKnex()(tables.factsGent).where("id", id);
};

const findByTitle = async (title) => {
	return await getKnex()(tables.factsGent).where("title", title);
};

const findCount = async () => {
	const [count] = await getKnex()(tables.factsGent).count();
	return count["count(*)"];
};

const create = async ({ title, factText }) => {
	try {
		const id = uuid.v4();
		await getKnex()(tables.factsGent).insert({
			id,
			title,
      factText,
		});
		return findById(id);
	} catch (error) {
		const logger = getChildLogger("factsGent-repo");
		logger.error("Error in create" , { error }); //
		throw error;
	}
};

const updateById = async (id, title, factText) => {
	try {
		await getKnex()(tables.factsGent).update({ title, factText }).where("id", id);

		return await findById(id);
	} catch (error) {
		const logger = getChildLogger("factsGent-repo");
		logger.error("Error in updateById" , { error }); //
		throw error;
	}
};

const deleteById = async (id) => {
	try {
		const rowAffected = await getKnex()(tables.factsGent)
			.delete()
			.where("id", id);
		return rowAffected > 0;
	} catch (error) {
		const logger = getChildLogger("factsGent-repo");
		logger.error("Error in deleteById");
		throw error;
	}
};

module.exports = {
	findAll,
	findById,
	findByTitle,
	findCount,
	create,
	updateById,
	deleteById,
};
