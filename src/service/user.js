const userRepository = require("../repository/user");

const getAll = async (limit = 100, offset = 1) => {
	const data = await userRepository.findAll({ limit, offset });
	const count = await userRepository.findCount();
	return {
		data,
		count,
		limit,
		offset,
	};
};

const getById = (id) => {
	return userRepository.findById(id);
};

const create = ({ surname, name, email, password, phonenumber }) => {
	return userRepository.create({ surname, name, email, password, phonenumber });
};

const updateById = (id, { surname, name, email, password, phonenumber }) => {
	const updatePlace = { surname, name, email, password, phonenumber };
	return userRepository.updateById(id, updatePlace);
};

const deleteById = async (id) => {
	await userRepository.deleteById(id);
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
