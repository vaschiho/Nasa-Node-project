const request = require('supertest')
const app = require('../../app')
const { mongoConnect, mongoDisConnect } = require('../../services/mongo');


describe('Launches API ', () => {
    beforeAll(async () => {
        await mongoConnect()
    });
    afterAll(async () => {
        await mongoDisConnect()
    })
    describe('Test GET/launches', () => {
        test('it should respond with 200 success', async () => {
            const response = await request(app)
                .get('/v1/launches')
                .expect('Content-Type', /json/)
                .expect(200)
            // expect(response.statusCode).toBe(200)
        });
    });

    describe('Test POST /launch', () => {

        const compleleLunchData = {
            mission: "USS Enterprise",
            rocket: "NCC 1701-D",
            target: "Kepler-62 f",
            launchDate: "January 4, 2028",
        }

        const lunchDataWithoutData = {
            mission: "USS Enterprise",
            rocket: "NCC 1701-D",
            target: "Kepler-62 f",

        }

        const lunchDataWithInvalidData = {
            mission: "USS Enterprise",
            rocket: "NCC 1701-D",
            target: "Kepler-62 f",
            launchDate: "zoot",
        }

        test('it should respond with 201 created', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(compleleLunchData)
                .expect('Content-Type', /json/)
                .expect(201)

            const requestDate = new Date(compleleLunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toEqual(requestDate);
            expect(response.body).toMatchObject(lunchDataWithoutData);
        });



        test('it shoud catch missing required properties', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(lunchDataWithoutData)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(response.body).toStrictEqual({
                error: "Missing required launch property"
            })

        });
        test('it should catch invaid dates', async () => {
            const response = await request(app)
                .post('/v1/launches')
                .send(lunchDataWithInvalidData)
                .expect('Content-Type', /json/)
                .expect(400)

            expect(response.body).toStrictEqual({
                error: "Invalid lunch date"
            })
        });
    });
})

