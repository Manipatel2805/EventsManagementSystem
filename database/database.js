let sql=require("mysql2")

let con=sql.createConnection({
    host:"localhost",
    user:"root",
    password:"mani@2805",
    database:"events"
})

con.connect(()=>{
    console.log("Database Connected")
})

module.exports=con