const {Router} = require('express')
const {AddCounty,AddTown,WorkOnTown,WorkOnCounty,GetTowns} = require('../Controllers/LocationController.js')
const LocationRouter = Router()

LocationRouter.post("/Add-County",AddCounty)
.post("/Add-Town",AddTown)
.post("/Work-On-Town",WorkOnTown)
.post("/Work-On-County",WorkOnCounty)
.post("/Get-Towns",GetTowns)


module.exports = LocationRouter