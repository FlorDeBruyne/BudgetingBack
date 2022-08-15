module.exports = {
	definition: {
		openai: "3.0.0",
		info: {
			title: "Budggeting API with Swagger",
			version: "0.1.0",
			description:
				"This is a simple CRUD API application made with Koa and documented with Swagger",
			license: {
				name: "MIT",
				url: "https://spdx.org/licenses/MIT.html",
			},
			contact: {
				name: "BudgetAPI",
				email: "flor.debruyne@hogent.be",
			},
		},
		servers: [
			{
				url: "http://localhost:9000/",
			},
		],
	},
	apis: ["./src/rest/*.js"],
};
