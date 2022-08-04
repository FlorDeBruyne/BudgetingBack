const { tables, getKnex } = require("../data/index");
const getConsoleLogger = require("get-logger/lib/getConsoleLogger");
const uuid = require("uuid");

const formatCategory = ({ categoryId, categoryName }) => ({
	category: { id: categoryId, name: categoryName },
});

const findAll = ({ limit, offset }) => {
	return getKnex()(tables.category)
		.select()
		.limit(limit)
		.offset(offset)
		.orderBy("name", "ASC");
};

const findById = async (id) => {
	const category = await getKnex()(tables.category).where("id", id);

	return category && formatCategory(category);
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
		getConsoleLogger.error("Error in create", { error });
		throw error;
	}
};

// const updateById = {};

// const deleteById = {};

module.exports = {
	findAll,
	findById,
	create,
	// updateById,
	// deleteById,
};
