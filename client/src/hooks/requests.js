const API_URL = "http://localhost:8001/v1"

async function httpGetPlanets() {
  const response = await fetch(`${API_URL}/planets`)

  return await response.json()

  // TODO: Once API is ready.
  // Load planets and return as JSON.
}

async function httpGetLaunches() {
  const response = await fetch(`${API_URL}/launches`)
  const fetchedLaunches = await response.json()
  return fetchedLaunches.sort((a, b) => {
    return a.flightNumber - b.flightNumber
  });
  // TODO: Once API is ready.
  // Load launches, sort by flight number, and return as JSON.
}

async function httpSubmitLaunch(launch) {
  try {
    const response = await fetch(`${API_URL}/launches`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(launch),
    });

    if (!response.ok) {
      throw new Error("Failed to submit launch");
    }
    return {
      ok: true,
    };
  } catch (err) {
    return {
      ok: false,
    };
  }
}
// async function httpSubmitLaunch(launch) {
//   try {
//     await fetch(`${API_URL}/launches`, {
//       method: "post",
//       headers: {
//         "Content-Type": "appliction/json"
//       },
//       body: JSON.stringify(launch)
//     })
//   } catch (err) {
//     return {
//       ok: false,
//     }
//   }

// TODO: Once API is ready.
// Submit given launch data to launch system.
// }

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
  try {
    return await fetch(`${API_URL}/launches/${id}`, {
      method: "delete",
    })
  } catch (err) {
    console.log(err)
    return {
      ok: false,
    }
  }



}

export {
  httpGetPlanets,
  httpGetLaunches,
  httpSubmitLaunch,
  httpAbortLaunch,
};