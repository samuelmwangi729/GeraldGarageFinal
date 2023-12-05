 const request = require('supertest')
 const app = require('../index')
 const {terminateConnection,connDb} = require('../Utils/DbConnection')
 let server;
 describe('Database Connection',()=>{
    beforeEach(()=>{
        server = require('../index')
    })
    afterEach(()=>{
        server.close()
    })
    test("It should return a database connection",async ()=>{
        await connDb()
    })
    test("It should disconnect from the database",async()=>{
        await terminateConnection()
    })
 })