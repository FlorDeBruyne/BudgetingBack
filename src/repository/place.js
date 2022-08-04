const { tables, getKnex } = require("../data/index");
const getConsoleLogger = require("get-logger/lib/getConsoleLogger");
const uuid = require("uuid");

const formatPlace = ({ placeId, placeName }) => ({
	place: { id: placeId, name: placeName },
});

const findAll = ({ limit, offset }) => {
	return getKnex()(tables.place)
		.select()
		.limit(limit)
		.offset(offset)
		.orderBy("name", "ASC");
};

const findById = async (id) => {
	const place = await getKnex()(tables.place).where("id", id);

	return place && formatPlace(place);
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
