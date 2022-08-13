const placeRepository = require("../repository/place");

const getAll = async (limit = 100, offset = 1) => {
	const data = await placeRepository.findAll({ limit, offset });
	const count = await placeRepository.findCount();
	return {
		data,
		count,
		limit,
		offset,
	};
};

const getById = (id) => {
	return placeRepository.findById(id);
};

const create = (name) => {
	return placeRepository.create(name);
};

const updateById = (id, name) => {
	const updatePlace = { name };
	return placeRepository.updateById(id, updatePlace);
};

const deleteById = async (id) => {
	await placeRepository.deleteById(id);
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
