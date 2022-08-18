const factsGentRepository = require("../repository/factsGent");

const getAll = async (limit = 100, offset = 1) => {
	const data = await factsGentRepository.findAll({ limit, offset });
	const count = await factsGentRepository.findCount();
	return {
		data,
		count,
		limit,
		offset,
	};
};

const getById = (id) => {
	return factsGentRepository.findById(id);
};

const create = (title, factText) => {
	return factsGentRepository.create(title, factText);
};

const updateById = (id, title, factText) => {
	const updatefactsGent = { title, factText };
	return factsGentRepository.updateById(id, updatefactsGent);
};

const deleteById = async (id) => {
	await factsGentRepository.deleteById(id);
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
