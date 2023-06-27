const { getAllPlanets } = require('../../models/planets.model');

async function httpGetAllPlanets(req, res) {
  try {
    const planets = await getAllPlanets();
    return res.status(200).json(planets);
  } catch (err) {
    console.error(`Could not retrieve planets: ${err}`);
    return res.status(500).json({ error: 'Could not retrieve planets' });
  }
}

module.exports = {
  httpGetAllPlanets,
};

// const { getAllPlanets } = require('../../models/planets.model')

// async function httpGetAllPlanets(req, res) {
//     return res.status(200).json(await getAllPlanets())
// }

// module.exports = { httpGetAllPlanets }