const { tables, getKnex } = require("../data/index");
const getConsoleLogger = require("get-logger/lib/getConsoleLogger");
const uuid = require("uuid");
const { place } = require("../data/mock_data");

const formatExpense = ({
	placeId,
	placeName,
	categoryId,
	categoryName,
	...rest
}) => ({
	...rest,
	place: {
		id: placeId,
		name: placeName,
	},
	category: {
		id: categoryId,
		name: categoryName,
	},
});

const SELECT_COLUMS = [
	`${tables.expense}.id`,
	"amount",
	"date",
	`${tables.place}.id as placeId`,
	`${tables.place}.name as placeName`,
	`${tables.category}.id as categoryId`,
	`${tables.category}.name as categoryName`,
];

const findAll = ({ limit, offset }) => {
	return getKnex()(tables.expense)
		.select()
		.limit(limit)
		.offset(offset)
		.orderBy("name", "ASC")
		.first(SELECT_COLUMS);
};

const findById = async (id) => {
	const expense = await getKnex()(tables.expense)
		.join(
			`${tables.place}`,
			`${tables.place}.id`,
			"=",
			`${tables.expense}.placeId`
		)
		.join(
			`${tables.category}`,
			`${tables.category}.id`,
			"=",
			`${tables.expense}.categoryId`
		)
		.where("id", id)
		.first(SELECT_COLUMS);

	return expense && formatExpense(expense);
};

const create = async ({ amount, name, categoryId, date, placeId }) => {
	try {
		const id = uuid.v4();
		await getKnex()(tables.expense).insert({
			id,
			amount,
			name,
			date,
			categoryId: categoryId,
			placeId: placeId,
		});
		return await findById(id);
	} catch (error) {
		getConsoleLogger.error("Error in create", { error });
		throw error;
	}
};

module.exports = {
	findAll,
	findById,
	create,
	// updateById,
	// deleteById,
};
