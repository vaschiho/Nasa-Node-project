
const { getAllLaunches, scheduleNewLaunch, existsLaunchWithID, abortLaunchById } = require('../../models/launches.model');

const { getPagination} = require('../../services/query')

async function httpGetAllLaunches(req, res) {
    console.log(req.query)
    const { skip, limit } = getPagination(req.query)

    const launches = await getAllLaunches(skip, limit)
    return res.status(200).json(launches);

}
async function httpAddNewLaunch(req, res) {
    const launch = req.body;

    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: "Missing required launch property"
        })
    }

    launch.launchDate = new Date(launch.launchDate)

    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: "Invalid lunch date"
        })
    }
    // if (launch.launchDate.toString() === 'Invalid Date') {
    //     return res.status(400).json({
    //         error: "Invalid lunch date"
    //     })
    // }
    await scheduleNewLaunch(launch)
    // console.log(launch)
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id)

    //if lauch doesnit exist
    const existsLaunch = await existsLaunchWithID(launchId)
    if (!existsLaunch) {
        return res.status(404).json({ error: "launch not found" })
    }

    const aborted = await abortLaunchById(launchId)

    if (!aborted) {
        return res.status(400).json({
            error: "Launch not aborted",
        })
    }
    return res.status(200).json({
        ok: true
    })

}
module.exports = { httpGetAllLaunches, httpAddNewLaunch, httpAbortLaunch };
