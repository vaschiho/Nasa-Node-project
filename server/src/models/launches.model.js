const axios = require('axios')

const launchesDatabase = require('./launches.mongo')
const planets = require('./planets.mongo')


const DEFAULT_FLIGHT_NUMBER = 100
// const launches = new Map()

// let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,//flight_number
    mission: "Kepler Exploration X", //name
    rocket: 'Explorer IS1', //rocket.name
    launchDate: new Date('December 27, 2039'),  //data_local
    target: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],//payload.customer for eaach customer
    upcoming: true,//upcoming 
    success: true,//success
}
saveLaunch(launch)

const SPACE_API_URL = "https://api.spacexdata.com/v4/launches/query"

async function populateLaunches() {
    console.log('Downloading launch data...')
    const response = await axios.post(SPACE_API_URL, {
        query: {},
        options: {
            //     "page":5,
            // "limit":20,
            pagination: false,
            populate: [
                {
                    path: "rocket",
                    select: {
                        name: 1
                    }
                },
                {
                    path: "payloads",
                    select: {
                        customer: 1
                    }
                }
            ]
        }
    });

    if (response.status !== 200) {
        console.log('Probleming dowing launch data')
        throw new Error('Launch data failed')
    }
    const launchDocs = response.data.docs;
    for (const doc of launchDocs) {
        const payloads = doc['payloads'];
        const customers = payloads.flatMap(() => {
            return payloads['customers'];
        })

        const launch = {
            flightNumber: doc['flight_number'],
            mission: doc['name'],
            rocket: doc['rocket']['name'],
            launchDate: doc['date_local'],
            upcoming: doc['upcoming'],

            success: doc['success'],
            customers: customers
            // ...
        };
        console.log(`${launch.flightNumber} ${launch.mission}`)

        await saveLaunch(launch)
        // TODO: populate launches collection...
    }
}

async function loadLaunchData() {

    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat',
    })
    if (firstLaunch) {
        console.log('Launch data already loaded')
        return
    } else {
        populateLaunches()
    }


}



async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
}

// launches.set(launch.flightNumber, launch)

async function existsLaunchWithID(launchId) {
    return await findLaunch({
        flightNumber: launchId
    })
    // return await launchesDatabase.findOne({
    //     flightNumber: launchId
    // })

}
// function existsLaunchWithID(launchId) {
//     return launches.has(launchId)
// }

async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase
        .findOne()
        .sort('-flightNumber');
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER
    }
    return latestLaunch.flightNumber + 1;
}


async function getAllLaunches(skip, limit) {
    return await launchesDatabase
        .find({}, { '_id': 0, "__v": 0 })
        .sort({ flightNumber: 1 })
        .skip(skip)
        .limit(limit);
}

async function saveLaunch(launch) {


    //did not  use updateOne because of security reason
    await launchesDatabase.findOneAndUpdate({
        flightNumber: launch.flightNumber
    }, launch, {
        upsert: true,
    })
}
async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    })
    if (!planet) {
        throw new Error('No matching planet found ')
    }
    const newFlightNumber = await getLatestFlightNumber()
    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Zero to Mastery', 'NASA'],
        flightNumber: newFlightNumber
    })

    await saveLaunch(newLaunch)
}

// function addNewLaunch(launch) {
//     latestFlightNumber++;
//     return launches.set(
//         latestFlightNumber,
//         Object.assign(launch, {
//             success: true,
//             upcoming: true,
//             customers: ['Zero to Mastery', 'NASA'],
//             flightNumber: latestFlightNumber,
//         })
//     );
// }

async function abortLaunchById(launchId) {
    const aborted = await launchesDatabase.updateOne({
        flightNumber: launchId
    }, {
        upcoming: false,
        success: false,
    })

    return aborted.modifiedCount === 1;
    // return await launchesDatabase.updateOne({
    //     flightNumber: launchId
    // }, {
    //     upcoming: false,
    //     success: false,
    // })


    // const aborted = launches.get(launchId);
    // aborted.upcoming = false;
    // aborted.success = false
    // return aborted
}

module.exports = { loadLaunchData, existsLaunchWithID, getAllLaunches, scheduleNewLaunch, abortLaunchById }

