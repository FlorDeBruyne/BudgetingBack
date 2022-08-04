const uuid = require("uuid");
const getConsoleLogger = require("get-logger/lib/getConsoleLogger");
const { loggers } = require("winston");
let { EXPENSE, PLACE } = require("../data/mock_data");

const getAll = () => {
	return { data: EXPENSE, count: EXPENSE.length };
};

const getById = (id) => {
	existing(id);
	return { data: EXPENSE.filter((x) => x.id == id) };
};

const create = (id, { amount, name, categoryId, date, placeId }) => {
	existing(placeId);

	if (typeof name === "string") {
		name = { id: uuid.v4(), name: name };
	}

	newExpense = {
		id: uuid.v4(),
		amount: amount,
		name: name,
		categoryId: categoryId,
		date: date.toISOString(),
		placeId: placeId,
	};
	EXPENSE = [...EXPENSE, newExpense];
	return newExpense;
};

const updateById = (id, { amount, name, categoryId, date, placeId }) => {
	EXPENSE.filter((expense) => expense.id === id).forEach(
		(expense) => (expense = { amount, name, categoryId, date, placeId })
	);
};

const deleteById = (id) => {
	EXPENSE.filter((x) => x.id == id).remove();
};

const existing = (id, kind) => {
	let existing;
	if (id) {
		existing = kind.filter((x) => x.id === id);

		if (!existing) {
			getConsoleLogger.error(`there is no ${kind.lowercase()} with id: ${id}`, {
				id,
			});
		}
	}
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
