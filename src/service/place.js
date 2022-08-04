const placesRepository = require('../repository/place');

const getAll = async (
  limit = 100, 
  offset= 1,
) => {
  const data = await placesRepository.findAll({limit, offset})
  return {
    data, 
    limit,
    offset
  }
}