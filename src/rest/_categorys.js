const Router = require("@koa/router");
const categoryService = require("../service/category");
const Joi = require("joi");
const validate = require("./_validation");
const { requireAuthentication } = require("../core/auth");
/**
 * @swagger
 * tags:
 * name: Categorys
 * description: Represents a category type of a user's expense
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - name
 *           properties:
 *             name:
 *               type: "string"
 *           example:
 *             $ref: "#/components/examples/Category"
 *     CategorysList:
 *       allOf:
 *         - $ref: "#/components/schemas/ListResponse"
 *         - type: object
 *           required:
 *             - data
 *           properties:
 *             data:
 *               type: array
 *               items:
 *                 $ref: "#/components/schemas/Category"
 *   examples:
 *     Category:
 *       id: "7b25d1fc-a15c-49bd-8d3f-6365bfa1ca04"
 *       name: "Utilities"
 *   requestBodies:
 *     Category:
 *      description: The category info to save.
 *      required: true
 *      content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "utilities"
 */

/**
 * @swagger
 * /api/categorys:
 * get:
 * summary: Get all categorys (paginated)
 * tags:
 *  - Categorys
 * parameters:
 *  - $ref: "#/components/parameters/limitParam"
 *  - $ref: "#/components/parameters/offsetParam"
 * responses:
 *  200:
 *   description: List of categorys
 *   content:
 *    application/json:
 *     schema:
 *      $ref: "#/components/schemas/CategorysList"
 */

const getAllCategorys = async (ctx) => {
	ctx.body = await categoryService.getAll();
};
getAllCategorys.validationScheme = {
	query: Joi.object({
		limit: Joi.number().integer().positive().max(1000).optional(),
		offset: Joi.number().min(0).optional(),
	}).and("limit", "offset"),
};

/**
 * @swagger
 * /api/categorys:
 *   post:
 *     summary: Create a new category
 *     description: Creates a new category for the signed in user.
 *     tags:
 *      - Categorys
 
 *     responses:
 *       200:
 *         description: The created category
 *         content:
 *           application/json:
 *             schema:
 *               $ref: "#/components/schemas/Category"
 */


const createCategory = async (ctx) => {
	const newcategory = await categoryService.create(ctx.request.body);
	ctx.body = newcategory;
	ctx.status = 201;
};
createCategory.validationScheme = {
	body: {
		name: Joi.string().max(255),
	},
};

const getCategoryById = async (ctx) => {
	ctx.body = await categoryService.getcategoryById(ctx.params.id);
};
getCategoryById.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

const updateCategory = async (ctx) => {
	ctx.body = await categoryService.updateById(ctx.params.id, ctx.request.body);
};
updateCategory.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
	body: {
		name: Joi.string().max(255),
	},
};

const deleteCategory = async (ctx) => {
	await categoryService.deleteById(ctx.params.id);

	ctx.status = 204;
};
deleteCategory.validationScheme = {
	params: {
		id: Joi.string().uuid(),
	},
};

module.exports = (app) => {
	const router = new Router({
		prefix: "/categorys",
	});

	router.get(
		"/",
		// requireAuthentication,
		// validate(getAllCategorys.validationScheme),
		getAllCategorys
	);
	router.post(
		"/",
		requireAuthentication,
		validate(createCategory.validationScheme),
		createCategory
	);
	router.get(
		"/:id",
		requireAuthentication,
		validate(getCategoryById.validationScheme),
		getCategoryById
	);
	router.put(
		"/:id",
		requireAuthentication,
		validate(updateCategory.validationScheme),
		updateCategory
	);
	router.delete(
		"/:id",
		requireAuthentication,
		validate(deleteCategory.validationScheme),
		deleteCategory
	);

	app.use(router.routes()).use(router.allowedMethods());
};
