const { shutdownData, getKnex, tables } = require("../src/data");
module.exports = async () => {
	await getKnex()(tables.category).delete();
	await getKnex()(tables.user).delete();
	await getKnex()(tables.place).delete();
	await getKnex()(tables.expense).delete();

	await shutdownData();
};
