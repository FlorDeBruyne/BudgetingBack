const { tables, getKnex } = require("../data/index");
const { getChildLogger } = require("../core/logger");
const uuid = require("uuid");


// const formatExpense = ({
// 	placeId,
// 	placeName,
// 	categoryId,
// 	categoryName,
// 	...rest
// }) => ({
// 	...rest,
// 	place: {
// 		id: placeId,
// 		name: placeName,
// 	},
// 	category: {
// 		id: categoryId,
// 		name: categoryName,
// 	},
// });

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
	return await getKnex()(tables.expense)
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
};

const findByName = async (name) => {
	return await getKnex()(tables.expense).where("name", name).firt();
};

const findCount = async () => {
	const [count] = await getKnex()(tables.expense).count();
	return count["count(*)"];
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
		const logger = getChildLogger("expense-repo");
		logger.error("Error in create", { error });
		throw error;
	}
};

const updateById = async (id, { amount, name, categoryId, date, placeId }) => {
	try {
		await getKnex()(tables.expense)
			.update({
				amount,
				name,
				categoryId,
				date,
				placeId,
			})
			.where("id", id);
	} catch (error) {
		const logger = getChildLogger("expense-repo");
		logger.error("Error in updateById", { error });
		throw error;
	}
};

const deleteById = async (id) => {
	try {
		const rowAffected = await getKnex()(tables.expense)
			.delete()
			.where("id", id);

		return rowAffected > 0;
	} catch (error) {
		const logger = getChildLogger("expense-repo");
		logger.error("Error in deleteById", { error });
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
