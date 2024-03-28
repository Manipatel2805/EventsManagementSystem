const express=require("express")
const { ControlEventsLoad, ControlEventsFind } = require("../controller/controller")
const router=express.Router()

router.post("/add",ControlEventsLoad)
router.get("/find",ControlEventsFind)
module.exports=router
