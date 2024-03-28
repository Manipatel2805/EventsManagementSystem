const express=require("express")
const router = require("./routes/routes")

const app=express()

app.use(express.json())
app.use("/events",router)

app.listen(3002,()=>{
    console.log("success")
})