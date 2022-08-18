const quizGentRepository = require("../repository/quizGent");

const getAll = async (limit = 100, offset = 1) => {
	const data = await quizGentRepository.findAll({ limit, offset });
	const count = await quizGentRepository.findCount();
	return {
		data,
		count,
		limit,
		offset,
	};
};

const getById = (id) => {
	return quizGentRepository.findById(id);
};

const create = (vraag, antwoord) => {
	return quizGentRepository.create(vraag, antwoord);
};

const updateById = (id, vraag, antwoord) => {
	const updatequizGent = { vraag, antwoord };
	return quizGentRepository.updateById(id, updatequizGent);
};

const deleteById = async (id) => {
	await quizGentRepository.deleteById(id);
};

module.exports = {
	getAll,
	getById,
	create,
	updateById,
	deleteById,
};
