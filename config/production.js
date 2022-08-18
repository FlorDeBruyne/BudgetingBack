module.exports = {
	log: {
		level: "info",
		disabled: false,
	},

	cors: {
		origins: ["http://localhost:3000"],
		maxAge: 3 * 60 * 60,
	},
	database: {
		client: "mysql2",
		host: "localhost",
		port: 3306,
		name: "budget",
		username: "root",
	},
	pagination: {
		limit: 100,
		offset: 0,
	},
	auth: {
		bcryptjs: {
			saltLength: 16,
			hashLenght: 32,
			timeCost: 6,
			memoryCost: 2 ** 17,
		},
		jwt: {
			// secret comes via env
			expirationInterval: 3 * 24 * 60 * 60 * 1000, // ms (3 days)
			issuer: "budget.hogent.be",
			audience: "budget.hogent.be",
		},
	},
};
