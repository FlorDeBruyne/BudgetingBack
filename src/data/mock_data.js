// add user, data

const place = [
	{
		id: 1,
		name: "Carrefour",
	},
	{
		id: 2,
		name: "Marimain",
	},
	{
		id: 3,
		name: "",
	},
];

const category = [
	{
		id: 1,
		name: "Housing",
	},
	{
		id: 2,
		name: "Transportation",
	},
	{
		id: 3,
		name: "Food",
	},
	{
		id: 4,
		name: "Utilities",
	},
	{
		id: 5,
		name: "Insurance",
	},
	{
		id: 6,
		name: "Medical & Healthcare",
	},
	{
		id: 7,
		name: "Saving, Investing & Debt Payments",
	},
	{
		id: 8,
		name: "Personal Spending",
	},
	{
		id: 9,
		name: "Recreation & Entertainment",
	},
	{
		id: 10,
		name: "Miscellaneous",
	},
];

const expense = [
	{
		id: 1,
		amount: 30,
		name: "Breakfast carrefour",
		categoryId: 3,
		date: "",
		placeId: null,
	},
	{
		id: 2,
		amount: 20,
		name: "Drinking pub",
		categoryId: 9,
		date: "",
		placeId: null,
	},
	{
		id: 3,
		amount: 30,
		name: "Groceries Okay",
		categoryId: 3,
		date: "",
		placeId: null,
	},
	{
		id: 4,
		amount: 10,
		name: "Train to Brugges and back",
		categoryId: 2,
		date: "",
		placeId: null,
	},
	{
		id: 5,
		amount: 50,
		name: "Hospital bill",
		categoryId: 6,
		date: "",
		placeId: null,
	},
	{
		id: 6,
		amount: 60,
		name: "Insurance payment",
		categoryId: 5,
		date: "",
		placeId: null,
	},
	{
		id: 7,
		amount: 70,
		name: "Vacation Paris",
		categoryId: 8,
		date: "",
		placeId: null,
	},
	{
		id: 8,
		amount: 80,
		name: "Weekend trip",
		categoryId: 8,
		date: "",
		placeId: null,
	},
	{
		id: 9,
		amount: 90,
		name: "New Phone",
		categoryId: 8,
		date: "",
		placeId: null,
	},
	{
		id: 10,
		amount: 100,
		name: "",
		categoryId: 10,
		date: "",
		placeId: null,
	},
];

const chart_data = [
	{
		title: "Monthly EXPENSEs",
		expense: expense,
		category: category,
		place: place,
	},
];

module.exports = { chart_data, expense, category, place };

// 1: "Housing",
// 2:"Transportation",
// 3:"Food",
// 4:"Utilities",
// 5:"Insurance",
// 6:"Medical & Healthcare",
// 7:"Saving, Investing, & Debt Payments",
// 8:"Personal Spending",
// 9: "Recreation & Entertainment",
// 10: "Miscellaneous",
