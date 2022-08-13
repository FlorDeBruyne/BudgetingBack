const categoryRepository = require("../repository/category");

const getAll = async (limit = 100, offset = 1) => {
	const data = await categoryRepository.findAll({ limit, offset });
	const count = await categoryRepository.findCount();
	return {
		data,
		count,
		limit,
		offset,
	};
};

const getById = (id) => {
	return categoryRepository.findById(id);
};

const create = (name) => {
	return categoryRepository.create(name);
};

const updateById = (id, name) => {
	const updateCategory = { name };
	return categoryRepository.updateById(id, updateCategory);
};

const deleteById = async (id) => {
	await categoryRepository.deleteById(id);
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
