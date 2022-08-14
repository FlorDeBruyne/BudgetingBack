const expenseRepository = require("../repository/expense");

const getAll = async (limit = 100, offset = 1) => {
	const data = await expenseRepository.findAll({ limit, offset });
	const count = await expenseRepository.findCount();
	return {
		data,
		count,
		limit,
		offset,
	};
};

const getById = (id) => {
	return expenseRepository.findById(id);
};

const create = ({ amount, name, categoryId, date, placeId }) => {
	// const {id: userId} = await userService.register({name: user})
	return expenseRepository.create({ amount, name, categoryId, date, placeId });
};

const updateById = (id, { amount, name, categoryId, date, placeId }) => {
	const updateExpense = { amount, name, categoryId, date, placeId };

	return expenseRepository.updateById(id, updateExpense);
};

const deleteById = async (id) => {
	await expenseRepository.deleteById(id);
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
