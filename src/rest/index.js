const Router = require("@koa/router");
const installTransactionRouter = require("./_categorys");
const installHealthRouter = require("./_expenses");
const installPlaceRouter = require("./_places");
const installUserRouter = require("./_users");

/**
 * Install all routes in the given Koa application.
 *
 * @param {Koa} app - The Koa application.
 */

/**
 * @swagger
 * components:
 *  parameters:
 *   limitParam:
 *    in: query
 *    name: limit
 *    description: Maximum amount of items to return
 *    required: false
 *    schema:
 *     type: integer
 *     default: 100
 *   offsetParam:
 *    in: query
 *    name: offset
 *    description: Number of items to skip
 *    required: false
 *    schema:
 *     type: integer
 *     default: 0
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Base:
 *       required:
 *         - id
  *       properties:
 *         id:
 *           type: string
 *           format: "uuid"
 *       example:
 *         id: "6d560fca-e7f9-4583-af2d-b05ccd1a0c58"
 *     ListResponse:
 *       required:
 *         - count
 *         - limit
 *         - offset
 *       properties:
 *         count:
 *           type: integer
 *           description: Number of items returned
 *           example: 1
 *         limit:
 *           type: integer
 *           description: Limit actually used
 *           example: 1
 *         offset:
 *           type: integer
 *           description: Offset actually used
 *           example: 1
 *     User:
 *       allOf:
 *         - $ref: "#/components/schemas/Base"
 *         - type: object
 *           required:
 *             - name
 *           properties:
 *             name:
 *               type: "string"
 *             email:
 *               type: "string"
 *               format: email
 *             surname:
 *               type: "string"
 *             phonenumber:
 *               type: "string"
 * 
 *           example:
 *             $ref: "#/components/examples/User"
 *   examples:
 *     User:
 *       id: "8f4153f6-939e-4dcf-9019-724999265f0d"
 *       name: "Flor De Bruyne"
 *       email: "flor.debruyne@hogent.be"
 *       phonenumber: "0393094094"
 */


module.exports = (app) => {
	const router = new Router({
		prefix: "/api",
	});

	installTransactionRouter(router);
	installPlaceRouter(router);
	installHealthRouter(router);
	installUserRouter(router);

	app.use(router.routes()).use(router.allowedMethods());
};
