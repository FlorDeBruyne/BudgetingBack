const Router = require("@koa/router");
const userService = require("../service/user");

const getAllUsers = async (ctx) => {
	ctx.body = await userService.getAll();
};

const createUser = async (ctx) => {
	const newUser = await userService.create(ctx.request.body);
	ctx.body = newUser;
	ctx.status = 201;
};

const getUserById = async (ctx) => {
	ctx.body = await userService.getUserById(ctx.params.id);
};

const updateUser = async (ctx) => {
	ctx.body = await userService.updateById(ctx.params.id, ctx.request.body);
};

const deleteUser = async (ctx) => {
	await userService.deleteById(ctx.params.id);

	ctx.status = 204;
};

module.exports = (app) => {
	const router = new Router({
		prefix: "/users",
	});

	router.get("/", getAllUsers);
	router.post("/", createUser);
	router.get("/:id", getUserById);
	router.put("/:id", updateUser);
	router.delete("/:id", deleteUser);

	app.use(router.routes()).use(router.allowedMethods());
};
