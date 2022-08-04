const placeService = require("../service/place")

const getAllPlaces  = async(ctx) => {
  ctx.body = await placeService.getAll();
};

