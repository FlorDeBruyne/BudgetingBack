const { tables, getKnex } = require("../data/index");
const { getChildLogger } = require("../core/logger");
const uuid = require("uuid");

const findAll = ({ limit, offset }) => {
	return getKnex()(tables.place)
		.select()
		.limit(limit)
		.offset(offset)
		.orderBy("name", "ASC");
};

const findById = async (id) => {
	return await getKnex()(tables.place).where("id", id);
};

const findByName = async (name) => {
	return await getKnex()(tables.place).where("name", name).first();
};

const create = async ({ name }) => {
	try {
		const id = uuid.v4();
		await getKnex()(tables.place).insert({
			id,
			name,
		});
		return findById(id);
	} catch (error) {
		const logger = getChildLogger("places-repo");
		logger.error("Error in create"  , { error });//
		throw error;
	}
};

const updateById = async (id, {name}) => {
	try {
		await getKnex()(tables.place)
			.update({
				name,
			})
			.where("id", id);

		return await findById(id);
	} catch (error) {
		const logger = getChildLogger("places-repo");
		logger.error("Error in updateByid"  , { error });//
		throw error;
	}
};

const findCount = async () => {
	const [count] = await getKnex()(tables.place).count();
	return count["count(*)"];
};

const deleteById = async (id) => {
	try {
		const rowAffected = await getKnex()(tables.place).delete().where("id", id);

		return rowAffected > 0;
	} catch (error) {
		const logger = getChildLogger("places-repo");
		logger.error("Error in deleteById"  , { error });//
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
