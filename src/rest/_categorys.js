const Router = require("@koa/router");
const categoryService = require("../service/category");

const getAllCategorys = async (ctx) => {
	ctx.body = await categoryService.getAll();
};

const createCategory = async (ctx) => {
	const newcategory = await categoryService.create(ctx.request.body);
	ctx.body = newcategory;
	ctx.status = 201;
};

const getCategoryById = async (ctx) => {
	ctx.body = await categoryService.getcategoryById(ctx.params.id);
};

const updateCategory = async (ctx) => {
	ctx.body = await categoryService.updateById(ctx.params.id, ctx.request.body);
};

const deleteCategory = async (ctx) => {
	await categoryService.deleteById(ctx.params.id);

	ctx.status = 204;
};

module.exports = (app) => {
	const router = new Router({
		prefix: "/categorys",
	});

	router.get("/", getAllCategorys);
	router.post("/", createCategory);
	router.get("/:id", getCategoryById);
	router.put("/:id", updateCategory);
	router.delete("/:id", deleteCategory);

	app.use(router.routes()).use(router.allowedMethods());
};
