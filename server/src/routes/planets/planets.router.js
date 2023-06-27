const express = require('express');
const { httpGetAllPlanets } = require('./planets.controller');
const planetsRouter = express.Router();

planetsRouter.get('/', httpGetAllPlanets);

module.exports = planetsRouter;

// const express = require('express')

// const { httpGetAllPlanets } = require('./planets.controller')
// const planetsRouter = express.Router()

// planetsRouter.get('/', httpGetAllPlanets)

// module.exports = planetsRouter;


// const express = require('express');
// const cors = require('cors');
// const { httpGetAllPlanets } = require('./planets.controller');

// const planetsRouter = express.Router();

// // CORS configuration
// const corsOptions = {
//   origin: 'http://localhost:3000', // Replace with the actual URL of your frontend application
// };

// // Apply CORS middleware for the '/planets' route
// planetsRouter.get('/planets', cors(corsOptions), httpGetAllPlanets);

// module.exports = planetsRouter;


