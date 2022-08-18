const { tables, getKnex } = require("../data/index");
const { getChildLogger } = require("../core/logger");
const uuid = require("uuid");

const findAll = ({ limit, offset }) => {
	return getKnex()(tables.quizGent)
		.select()
		.limit(limit)
		.offset(offset)
		.orderBy("vraag", "ASC");
};

const findById = async (id) => {
	return await getKnex()(tables.quizGent).where("id", id);
};

const findByVraag = async (title) => {
	return await getKnex()(tables.quizGent).where("vraag", title);
};

const findCount = async () => {
	const [count] = await getKnex()(tables.quizGent).count();
	return count["count(*)"];
};

const create = async ({ vraag, antwoord }) => {
	try {
		const id = uuid.v4();
		await getKnex()(tables.quizGent).insert({
			id,
			vraag,
			antwoord,
		});
		return findById(id);
	} catch (error) {
		const logger = getChildLogger("quizGent-repo");
		logger.error("Error in create", { error });
		throw error;
	}
};

const updateById = async (id, vraag, antwoord) => {
	try {
		await getKnex()(tables.quizGent)
			.update({ vraag, antwoord })
			.where("id", id);

		return await findById(id);
	} catch (error) {
		const logger = getChildLogger("quizGent-repo");
		logger.error("Error in updateById", { error });
		throw error;
	}
};

const deleteById = async (id) => {
	try {
		const rowAffected = await getKnex()(tables.quizGent)
			.delete()
			.where("id", id);
		return rowAffected > 0;
	} catch (error) {
		const logger = getChildLogger("quizGent-repo");
		logger.error("Error in deleteById");
		throw error;
	}
};

module.exports = {
	findAll,
	findById,
	findByVraag,
	findCount,
	create,
	updateById,
	deleteById,
};
